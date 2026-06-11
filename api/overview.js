/**
 * Overview Card
 * GET /api/overview?username=xxx&hide_border=true
 *
 * Shows total stats: Stars, Commits, PRs, Issues, Contributed to, Lines Changed.
 * Auto-refreshes every 30 minutes.
 */

const {
  fetchUserPullRequests,
  fetchContributionData,
  fetchUserProfile,
  fetchUserIssues,
  fetchUserTotalStars,
  fetchRecentPRLinesChanged
} = require("../src/github");
const { getTheme, applyColorOverrides } = require("../src/themes");
const { generateOverviewSVG } = require("../src/svg-overview");
const { getCache, setCache, clearCache } = require("../src/cache");
const { sendResponse } = require("../src/response");

const CACHE_TTL = 30 * 60 * 1000;

function normalizeLinesScope(value) {
  return value === "all" ? "all" : "recent";
}

function parseMaxPRs(value, defaultValue = 20, hardLimit = 50) {
  const parsed = parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return defaultValue;
  }
  return Math.min(parsed, hardLimit);
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Cache-Control", "public, max-age=1800, s-maxage=1800, stale-while-revalidate=600");

  const { username, theme, hide_border, bg_color, title_color, text_color, border_color, refresh, lines_scope, max_prs } = req.query;

  if (!username) {
    sendResponse(req, res, errorSVG("Missing username"), 400);
    return;
  }

  try {
    const scope = normalizeLinesScope(lines_scope);
    const maxPRs = scope === "all" ? 50 : parseMaxPRs(max_prs, 20, 50);
    const cacheKey = scope === "all"
      ? `overview:${username.toLowerCase()}:lines_scope=all`
      : `overview:${username.toLowerCase()}:lines_scope=recent:max_prs=${maxPRs}`;

    if (refresh === "true") {
      clearCache(cacheKey);
    }

    let data = getCache(cacheKey);

    if (!data) {
      try {
        const [prs, profile, contributionData, totalIssues, totalStars] = await Promise.all([
          fetchUserPullRequests(username),
          fetchUserProfile(username),
          fetchContributionData(username),
          fetchUserIssues(username),
          fetchUserTotalStars(username),
        ]);

        const linesChanged = await fetchRecentPRLinesChanged(prs, maxPRs);

        const reposContributed = new Set();
        (prs || []).forEach(pr => {
          if (pr.repository_url) {
            reposContributed.add(pr.repository_url.split("/repos/")[1]);
          }
        });

        data = {
          totalStars: totalStars || 0,
          totalCommits: contributionData?.totalContributions || 0,
          totalPRs: prs?.length || 0,
          totalIssues: totalIssues || 0,
          contributedTo: reposContributed.size || profile?.public_repos || 0,
          linesChanged,
        };

        setCache(cacheKey, data, CACHE_TTL);
      } catch (fetchErr) {
        console.error("Overview fetch error:", fetchErr.message);
        data = {
          totalStars: 0,
          totalCommits: 0,
          totalPRs: 0,
          totalIssues: 0,
          contributedTo: 0,
          linesChanged: 0,
        };
      }
    }

    let colors = getTheme(theme);
    colors = applyColorOverrides(colors, { bg_color, title_color, text_color, border_color });

    const svg = generateOverviewSVG({
      totalStars: data.totalStars,
      totalCommits: data.totalCommits,
      totalPRs: data.totalPRs,
      totalIssues: data.totalIssues,
      contributedTo: data.contributedTo,
      linesChanged: data.linesChanged,
      colors,
      hideBorder: hide_border === "true",
    });

    sendResponse(req, res, svg);
  } catch (error) {
    console.error("Overview Error:", error.message);
    sendResponse(req, res, errorSVG("Failed to load overview data"), 200);
  }
};

function errorSVG(msg) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="460" height="90" viewBox="0 0 460 90">
    <rect width="460" height="90" fill="#0d1117" rx="8"/>
    <text x="230" y="48" text-anchor="middle" font-family="-apple-system,sans-serif" font-size="13" fill="#f85149">${msg}</text>
  </svg>`;
}
