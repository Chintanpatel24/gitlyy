/**
 * Streak Card
 * GET /api/streak?username=xxx&hide_border=true
 *
 * Shows current and longest contribution streaks.
 * Auto-refreshes every 30 minutes.
 */

const { fetchContributionData, fetchTotalCommitCount } = require("../src/github");
const { getTheme, applyColorOverrides } = require("../src/themes");
const { generateStreakSVG } = require("../src/svg-streak");
const { getCache, setCache, clearCache } = require("../src/cache");
const { sendResponse } = require("../src/response");

const CACHE_TTL = 30 * 60 * 1000;

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Cache-Control", "public, max-age=1800, s-maxage=1800, stale-while-revalidate=600");

  const { username, theme, hide_border, bg_color, title_color, text_color, border_color, refresh } = req.query;

  if (!username) {
    sendResponse(req, res, errorSVG("Missing username"), 400);
    return;
  }

  try {
    const cacheKey = `streak:${username.toLowerCase()}`;

    if (refresh === "true") {
      clearCache(cacheKey);
    }

    let data = getCache(cacheKey);

    if (!data) {
      try {
        const [contributionData, totalCommits] = await Promise.all([
          fetchContributionData(username),
          fetchTotalCommitCount(username),
        ]);

        const { days = [], totalContributions = 0 } = contributionData || {};

        const sortedDays = [...days].sort((a, b) => a.date.localeCompare(b.date));
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

        data = { currentStreak, longestStreak, totalContributions, totalCommits };
        setCache(cacheKey, data, CACHE_TTL);
      } catch (fetchErr) {
        console.error("Streak fetch error:", fetchErr.message);
        data = { currentStreak: 0, longestStreak: 0, totalContributions: 0, totalCommits: 0 };
      }
    }

    let colors = getTheme(theme);
    colors = applyColorOverrides(colors, { bg_color, title_color, text_color, border_color });

    const svg = generateStreakSVG({
      username,
      currentStreak: data.currentStreak,
      longestStreak: data.longestStreak,
      totalContributions: data.totalContributions,
      totalCommits: data.totalCommits,
      colors,
      hideBorder: hide_border === "true",
    });

    sendResponse(req, res, svg);
  } catch (error) {
    console.error("Streak Error:", error.message);
    sendResponse(req, res, errorSVG("Failed to load streak data"), 200);
  }
};

function errorSVG(msg) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="460" height="90" viewBox="0 0 460 90">
    <rect width="460" height="90" fill="#0d1117" rx="8"/>
    <text x="230" y="48" text-anchor="middle" font-family="-apple-system,sans-serif" font-size="13" fill="#f85149">${msg}</text>
  </svg>`;
}
