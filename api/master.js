/**
 * Mastercard (Dashboard) Card
 * GET /api/master?username=xxx&hide_border=true
 *
 * Aggregates all user stats into a single full-width dashboard card.
 */

const {
  fetchUserPullRequests,
  fetchContributionData,
  fetchUserProfile,
  fetchUserLanguages,
  fetchTotalCommitCount,
  fetchUserIssues,
  fetchOpenIssues,
  fetchClosedIssues,
  fetchMergedPullRequests,
  fetchUserTotalStars,
  fetchRecentPRLinesChanged,
  fetchOpenPullRequests
} = require("../src/github");
const { getTheme, applyColorOverrides } = require("../src/themes");
const { generateMasterCardSVG } = require("../src/svg-master");
const { getCache, setCache, clearCache } = require("../src/cache");

const CACHE_TTL = 30 * 60 * 1000;

// Safe wrapper to return default on failure
const safe = async (promise, fallback) => {
  try {
    const result = await promise;
    return result ?? fallback;
  } catch (e) {
    return fallback;
  }
};

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
    const cacheKey = `master_ultimate_v2:${username.toLowerCase()}`;
    if (refresh === "true") clearCache(cacheKey);

    let data = getCache(cacheKey);

    if (!data) {
      // Parallel fetch with individual error handling to prevent total failure
      const [
        prs, profile, contributionData, langData,
        totalCommits, totalIssues, openIssues, closedIssues,
        mergedPRCount, totalStars, openPRCount
      ] = await Promise.all([
        safe(fetchUserPullRequests(username), []),
        safe(fetchUserProfile(username), { login: username, public_repos: 0 }),
        safe(fetchContributionData(username), { totalContributions: 0, days: [] }),
        safe(fetchUserLanguages(username), { languages: [], totalRepos: 0 }),
        safe(fetchTotalCommitCount(username), 0),
        safe(fetchUserIssues(username), 0),
        safe(fetchOpenIssues(username), 0),
        safe(fetchClosedIssues(username), 0),
        safe(fetchMergedPullRequests(username), 0),
        safe(fetchUserTotalStars(username), 0),
        safe(fetchOpenPullRequests(username), 0)
      ]);

      const linesChanged = await safe(fetchRecentPRLinesChanged(prs, 10), 0);

      const days = contributionData?.days || [];
      const sortedDays = [...days].sort((a, b) => a.date.localeCompare(b.date));

      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;

      // Corrected streak logic: find last day with activity and check if it's today/yesterday
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

      let lastActiveIndex = -1;
      for (let i = sortedDays.length - 1; i >= 0; i--) {
        if (sortedDays[i].count > 0) {
          if (sortedDays[i].date === today || sortedDays[i].date === yesterday) {
            lastActiveIndex = i;
          }
          break;
        }
      }

      if (lastActiveIndex !== -1) {
        for (let i = lastActiveIndex; i >= 0; i--) {
          if (sortedDays[i].count > 0) currentStreak++;
          else break;
        }
      }

      for (const day of sortedDays) {
        if (day.count > 0) { tempStreak++; longestStreak = Math.max(longestStreak, tempStreak); }
        else tempStreak = 0;
      }

      const weekMap = { 0:0, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0 };
      days.forEach(d => {
         const dayOfWeek = new Date(d.date).getDay();
         weekMap[dayOfWeek] += d.count;
      });

      const repoMap = {};
      (prs || []).forEach(pr => {
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
        name: profile.name || profile.login || username,
        avatarUrl: profile.avatar_url || "",
        bio: profile.bio || "",
        location: profile.location || "",
        company: profile.company || "",
        followers: profile.followers || 0,
        following: profile.following || 0,
        totalPRs: prs.length || 0,
        openPRs: openPRCount || 0,
        mergedPRs: mergedPRCount || 0,
        repoCount: profile.public_repos || 0,
        languages: langData.languages || [],
        contributions: contributionData.totalContributions || 0,
        repoList,
        contributionDays: days,
        currentStreak,
        longestStreak,
        totalCommits,
        totalIssues: totalIssues || 0,
        openIssues: openIssues || 0,
        closedIssues: closedIssues || 0,
        totalStars: totalStars || 0,
        linesChanged: linesChanged || 0,
        weekMap
      };

      setCache(cacheKey, data, CACHE_TTL);
    }

    let colors = getTheme(theme);
    colors = applyColorOverrides(colors, { bg_color, title_color, text_color, border_color });

    const svg = generateMasterCardSVG({
      ...data,
      colors,
      hideBorder: hide_border === "true",
    });

    res.status(200).send(svg);
  } catch (error) {
    console.error("Mastercard API Error:", error.message);
    res.status(200).send(errorSVG("Failed to load dashboard data"));
  }
};

function errorSVG(msg) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="830" height="120" viewBox="0 0 830 120">
    <rect width="830" height="120" fill="#0d1117" rx="8"/>
    <text x="415" y="65" text-anchor="middle" font-family="-apple-system,sans-serif" font-size="13" fill="#f85149">${msg}</text>
  </svg>`;
}
