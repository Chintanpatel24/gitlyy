/**
 * Overview Card
 * GET /api/overview?username=xxx&hide_border=true
 *
 * Shows total stats: Stars, Commits, PRs, Issues, Contributed to, Lines Changed.
 * Auto-refreshes every 30 minutes.
 */

const { fetchUserPullRequests, fetchContributionData, fetchUserProfile } = require("../src/github");
const { getTheme, applyColorOverrides } = require("../src/themes");
const { generateOverviewSVG } = require("../src/svg-overview");
const { getCache, setCache, clearCache } = require("../src/cache");

const CACHE_TTL = 30 * 60 * 1000;

async function fetchUserIssuesCount(username) {
  const url = `https://api.github.com/search/issues?q=author:${encodeURIComponent(username)}+type:issue&per_page=1`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "gitly-app",
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!res.ok) {
    throw new Error(`GitHub issues API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data.total_count || 0;
}

async function fetchUserTotalStars(username) {
  let page = 1;
  let totalStars = 0;

  while (true) {
    const url = `https://api.github.com/users/${encodeURIComponent(username)}/repos?type=owner&per_page=100&page=${page}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "gitly-app",
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!res.ok) {
      throw new Error(`GitHub repos API error: ${res.status} ${res.statusText}`);
    }

    const repos = await res.json();
    if (!Array.isArray(repos) || repos.length === 0) {
      break;
    }

    for (const repo of repos) {
      if (!repo.fork) {
        totalStars += repo.stargazers_count || 0;
      }
    }

    if (repos.length < 100) {
      break;
    }

    page++;
  }

  return totalStars;
}

async function fetchRecentPRLinesChanged(prs, maxPRs = 30) {
  const targetPRs = prs
    .filter((pr) => pr && pr.pull_request && pr.pull_request.url)
    .slice(0, maxPRs);

  if (targetPRs.length === 0) {
    return 0;
  }

  const headers = {
    "User-Agent": "gitly-app",
    Accept: "application/vnd.github.v3+json",
  };

  const concurrency = 6;
  let totalChanged = 0;

  for (let i = 0; i < targetPRs.length; i += concurrency) {
    const batch = targetPRs.slice(i, i + concurrency);
    const results = await Promise.all(
      batch.map(async (pr) => {
        try {
          const res = await fetch(pr.pull_request.url, { headers });
          if (!res.ok) return 0;
          const data = await res.json();
          return (data.additions || 0) + (data.deletions || 0);
        } catch {
          return 0;
        }
      })
    );

    totalChanged += results.reduce((sum, v) => sum + v, 0);
  }

  return totalChanged;
}

function normalizeLinesScope(value) {
  return value === "all" ? "all" : "recent";
}

function parseMaxPRs(value, defaultValue = 30, hardLimit = 200) {
  const parsed = parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return defaultValue;
  }
  return Math.min(parsed, hardLimit);
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "public, max-age=1800, s-maxage=1800, stale-while-revalidate=600");

  const { username, theme, hide_border, bg_color, title_color, text_color, border_color, refresh, lines_scope, max_prs } = req.query;

  if (!username) {
    res.status(400).send(errorSVG("Missing username"));
    return;
  }

  try {
    const scope = normalizeLinesScope(lines_scope);
    const maxPRs = scope === "all" ? 0 : parseMaxPRs(max_prs, 30, 200);
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
          fetchUserProfile(username).catch(() => ({ public_repos: 0, public_gists: 0 })),
          fetchContributionData(username),
          fetchUserIssuesCount(username),
          fetchUserTotalStars(username),
        ]);

        const linesChanged = await fetchRecentPRLinesChanged(prs, scope === "all" ? prs.length : maxPRs);

        // Count repos contributed to from PR data
        const reposContributed = new Set();
        prs.forEach(pr => {
          if (pr.repository_url) {
            reposContributed.add(pr.repository_url.split("/repos/")[1]);
          }
        });

        data = {
          totalStars,
          totalCommits: contributionData.totalContributions || 0,
          totalPRs: prs.length,
          totalIssues,
          contributedTo: reposContributed.size || profile.public_repos || 0,
          linesChanged,
        };

        setCache(cacheKey, data, CACHE_TTL);
      } catch (fetchErr) {
        console.error("Overview fetch error:", fetchErr.message);
        res.status(200).send(errorSVG(`Could not fetch data for ${username}`));
        return;
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

    res.status(200).send(svg);
  } catch (error) {
    console.error("Overview Error:", error.message);
    res.status(200).send(errorSVG("Failed to load overview data"));
  }
};

function errorSVG(msg) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="460" height="90" viewBox="0 0 460 90">
    <rect width="460" height="90" fill="#0d1117" rx="8"/>
    <text x="230" y="48" text-anchor="middle" font-family="-apple-system,sans-serif" font-size="13" fill="#f85149">${msg}</text>
  </svg>`;
}
