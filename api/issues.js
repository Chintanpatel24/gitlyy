/**
 * Issues Stats Card
 * GET /api/issues?username=xxx&hide_border=true
 *
 * Auto-refreshes every 30 minutes.
 */

const { fetchUserIssues, fetchOpenIssues, fetchClosedIssues, fetchUserProfile } = require("../src/github");
const { getTheme, applyColorOverrides } = require("../src/themes");
const { generateIssuesSVG } = require("../src/svg-issues");
const { parseCardWidth } = require("../src/width");
const { getCache, setCache, clearCache } = require("../src/cache");
const { sendResponse } = require("../src/response");

const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Cache-Control", "public, max-age=1800, s-maxage=1800, stale-while-revalidate=600");

  const { username, theme, hide_border, bg_color, title_color, text_color, border_color, width, refresh } = req.query;

  if (!username) {
    sendResponse(req, res, errorSVG("Missing username"), 400);
    return;
  }

  try {
    const cacheKey = `issues:${username.toLowerCase()}`;

    // Force refresh if requested
    if (refresh === "true") {
      clearCache(cacheKey);
    }

    let data = getCache(cacheKey);

    if (!data) {
      try {
        const [totalIssuesCount, openIssuesCount, closedIssuesCount, profile] = await Promise.all([
          fetchUserIssues(username),
          fetchOpenIssues(username),
          fetchClosedIssues(username),
          fetchUserProfile(username)
        ]);

        data = {
          totalIssues: totalIssuesCount || 0,
          openIssues: openIssuesCount || 0,
          closedIssues: closedIssuesCount || 0,
          profileName: profile?.name || profile?.login || username,
        };

        setCache(cacheKey, data, CACHE_TTL);
      } catch (fetchErr) {
        console.error("Issues fetch error:", fetchErr.message);
        data = {
          totalIssues: 0,
          openIssues: 0,
          closedIssues: 0,
          profileName: username,
        };
      }
    }
    
    let colors = getTheme(theme);
    colors = applyColorOverrides(colors, { bg_color, title_color, text_color, border_color });

    const svg = generateIssuesSVG({
      totalIssues: data.totalIssues,
      openIssues: data.openIssues,
      closedIssues: data.closedIssues,
      colors,
      hideBorder: hide_border === "true",
      cardWidth: parseCardWidth(width, 460, 400, 1200),
    });

    sendResponse(req, res, svg);
  } catch (error) {
    console.error("Issues Stats Error:", error.message);
    sendResponse(req, res, errorSVG("Failed to load issues data"), 200);
  }
};

function errorSVG(msg) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="380" height="90" viewBox="0 0 380 90">
    <rect width="380" height="90" fill="#0d1117" rx="8"/>
    <text x="190" y="48" text-anchor="middle" font-family="-apple-system,sans-serif" font-size="13" fill="#f85149">${msg}</text>
  </svg>`;
}
