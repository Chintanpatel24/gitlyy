/**
 * Mastercard (Dashboard) Card
 * GET /api/master?username=xxx&hide_border=true
 *
 * Aggregates all user stats into a single dashboard card.
 * Auto-refreshes every 30 minutes.
 */

const {
  fetchUserPullRequests,
  fetchOpenPullRequests,
  fetchContributionData,
  fetchUserProfile,
  fetchUserLanguages,
  fetchTotalCommitCount
} = require("../src/github");
const { getTheme, applyColorOverrides } = require("../src/themes");
const { generateMasterCardSVG } = require("../src/svg-master");
const { getCache, setCache, clearCache } = require("../src/cache");

const CACHE_TTL = 30 * 60 * 1000;

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "public, max-age=1800, s-maxage=1800, stale-while-revalidate=600");

  const { username, theme, hide_border, bg_color, title_color, text_color, border_color, refresh } = req.query;

  if (!username) {
    res.status(400).send(errorSVG("Missing username"));
    return;
  }

  try {
    const cacheKey = `master:${username.toLowerCase()}`;

    if (refresh === "true") {
      clearCache(cacheKey);
    }

    let data = getCache(cacheKey);

    if (!data) {
      try {
        const [prs, profile, contributionData, langData, totalCommits] = await Promise.all([
          fetchUserPullRequests(username),
          fetchUserProfile(username).catch(() => ({ public_repos: 0 })),
          fetchContributionData(username),
          fetchUserLanguages(username),
          fetchTotalCommitCount(username)
        ]);

        // Calculate streaks
        const sortedDays = [...contributionData.days].sort((a, b) => a.date.localeCompare(b.date));
        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;

        for (let i = sortedDays.length - 1; i >= 0; i--) {
          if (sortedDays[i].count > 0) currentStreak++;
          else break;
        }
        for (const day of sortedDays) {
          if (day.count > 0) { tempStreak++; longestStreak = Math.max(longestStreak, tempStreak); }
          else tempStreak = 0;
        }

        // Top repos by PR count
        const repoMap = {};
        prs.forEach(pr => {
          if (pr.repository_url) {
            const name = pr.repository_url.split("/repos/")[1];
            repoMap[name] = (repoMap[name] || 0) + 1;
          }
        });
        const repoList = Object.entries(repoMap)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count);

        data = {
          username: profile.login || username,
          totalPRs: prs.length,
          openPRs: prs.filter(pr => pr.state === "open").length,
          repoCount: profile.public_repos || 0,
          languages: langData.languages,
          contributions: contributionData.totalContributions,
          repoList,
          contributionDays: contributionData.days,
          currentStreak,
          longestStreak,
          totalCommits
        };

        setCache(cacheKey, data, CACHE_TTL);
      } catch (fetchErr) {
        console.error("Mastercard fetch error:", fetchErr.message);
        res.status(200).send(errorSVG(`Could not fetch data for ${username}`));
        return;
      }
    }

    let colors = getTheme(theme);
    colors = applyColorOverrides(colors, { bg_color, title_color, text_color, border_color });

    const svg = generateMasterCardSVG({
      username: data.username,
      totalPRs: data.totalPRs,
      openPRs: data.openPRs,
      repoCount: data.repoCount,
      languages: data.languages,
      contributions: data.contributions,
      repoList: data.repoList,
      contributionDays: data.contributionDays,
      currentStreak: data.currentStreak,
      longestStreak: data.longestStreak,
      colors,
      hideBorder: hide_border === "true",
    });

    res.status(200).send(svg);
  } catch (error) {
    console.error("Mastercard Error:", error.message);
    res.status(200).send(errorSVG("Failed to load dashboard data"));
  }
};

function errorSVG(msg) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="120" viewBox="0 0 600 120">
    <rect width="600" height="120" fill="#0d1117" rx="8"/>
    <text x="300" y="65" text-anchor="middle" font-family="-apple-system,sans-serif" font-size="13" fill="#f85149">${msg}</text>
  </svg>`;
}
