/**
 * GitHub API helpers for fetching user data (no auth required).
 */

const GITHUB_API = "https://api.github.com";

/**
 * Robust fetch wrapper with timeout and better error handling
 */
async function safeFetch(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "User-Agent": "gitly-app-bot",
        "Accept": options.headers?.Accept || "application/vnd.github.v3+json",
        ...(options.headers || {}),
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      if (res.status === 403 || res.status === 429) {
        console.warn(`GitHub API Rate Limit hit for ${url}`);
      } else {
        console.warn(`GitHub API warning: ${res.status} for ${url}`);
      }
      return null;
    }
    return await res.json();
  } catch (err) {
    clearTimeout(timeoutId);
    console.error(`Fetch error for ${url}:`, err.message);
    return null;
  }
}

/**
 * Fetch all pull requests by a user.
 */
async function fetchUserPullRequests(username) {
  const perPage = 100;
  let page = 1;
  let allPRs = [];
  try {
    while (page <= 2) { // Limited to 2 pages to save rate limit
      const url = `${GITHUB_API}/search/issues?q=author:${encodeURIComponent(username)}+type:pr&per_page=${perPage}&page=${page}`;
      const data = await safeFetch(url);
      if (!data || !data.items || data.items.length === 0) break;
      allPRs = allPRs.concat(data.items);
      if (allPRs.length >= data.total_count || data.items.length < perPage) break;
      page++;
    }
  } catch (e) {}
  return allPRs; // Returns empty array if fails
}

async function fetchOpenPullRequests(username) {
  const url = `${GITHUB_API}/search/issues?q=author:${encodeURIComponent(username)}+type:pr+state:open&per_page=1`;
  const data = await safeFetch(url);
  return data ? (data.total_count || 0) : 0;
}

async function fetchClosedPullRequests(username) {
  const url = `${GITHUB_API}/search/issues?q=author:${encodeURIComponent(username)}+type:pr+state:closed&per_page=1`;
  const data = await safeFetch(url);
  return data ? (data.total_count || 0) : 0;
}

async function fetchMergedPullRequests(username) {
  const url = `${GITHUB_API}/search/issues?q=author:${encodeURIComponent(username)}+type:pr+is:merged&per_page=1`;
  const data = await safeFetch(url);
  return data ? (data.total_count || 0) : 0;
}

async function fetchUserIssues(username) {
  const url = `${GITHUB_API}/search/issues?q=author:${encodeURIComponent(username)}+type:issue&per_page=1`;
  const data = await safeFetch(url);
  return data ? (data.total_count || 0) : 0;
}

async function fetchOpenIssues(username) {
  const url = `${GITHUB_API}/search/issues?q=author:${encodeURIComponent(username)}+type:issue+state:open&per_page=1`;
  const data = await safeFetch(url);
  return data ? (data.total_count || 0) : 0;
}

async function fetchClosedIssues(username) {
  const url = `${GITHUB_API}/search/issues?q=author:${encodeURIComponent(username)}+type:issue+state:closed&per_page=1`;
  const data = await safeFetch(url);
  return data ? (data.total_count || 0) : 0;
}

function groupPRsByRepo(prs) {
  const repoMap = {};
  if (!Array.isArray(prs)) return repoMap;
  for (const pr of prs) {
    const repoUrl = pr.repository_url || "";
    const repoName = repoUrl.split("/repos/")[1] || "unknown";
    repoMap[repoName] = (repoMap[repoName] || 0) + 1;
  }
  return repoMap;
}

async function fetchUserProfile(username) {
  const url = `${GITHUB_API}/users/${encodeURIComponent(username)}`;
  const data = await safeFetch(url);
  if (!data) return { login: username, name: username, public_repos: 0, followers: 0, following: 0 };
  return data;
}

async function fetchContributionData(username) {
  const url = `https://github.com/users/${encodeURIComponent(username)}/contributions`;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html",
      },
    });
    if (!res.ok) return { totalContributions: 0, days: [] };
    const html = await res.text();
    return parseContributionHTML(html);
  } catch (err) {
    console.error("Contribution scrape error:", err.message);
    return { totalContributions: 0, days: [] };
  }
}

function parseContributionHTML(html) {
  let totalContributions = 0;
  const totalMatch = html.match(/(\d[\d,]*)\s+contributions?\s+in\s+the\s+last\s+year/i);
  if (totalMatch) {
    totalContributions = parseInt(totalMatch[1].replace(/,/g, ""), 10);
  }

  const entryRegex = /<(?:td|rect)\b[^>]*\bdata-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="(\d+)"[^>]*>/g;
  const dates = [];
  let match;
  while ((match = entryRegex.exec(html)) !== null) {
    const date = match[1];
    const level = parseInt(match[2], 10);
    const tag = match[0];
    const idMatch = tag.match(/\bid="([^"]+)"/);

    dates.push({
      id: idMatch ? idMatch[1] : `day-${dates.length}`,
      date,
      level,
    });
  }

  const tipRegex = /<tool-tip[^>]*for="([^"]+)"[^>]*>([\s\S]*?)<\/tool-tip>/g;
  const countById = new Map();
  while ((match = tipRegex.exec(html)) !== null) {
    const targetId = match[1];
    const tipText = match[2].replace(/\s+/g, " ").trim();
    const countMatch = tipText.match(/(\d+)\s+contribution/i);
    const count = countMatch ? parseInt(countMatch[1], 10) : 0;
    countById.set(targetId, count);
  }

  const days = [];
  for (let i = 0; i < dates.length; i++) {
    const count = countById.has(dates[i].id) ? countById.get(dates[i].id) : (dates[i].level * 2);
    days.push({
      date: dates[i].date,
      count: count,
      level: dates[i].level,
    });
  }

  days.sort((a, b) => a.date.localeCompare(b.date));
  if (totalContributions === 0) {
    totalContributions = days.reduce((sum, d) => sum + d.count, 0);
  }

  return { totalContributions, days };
}

async function fetchTotalCommitCount(username) {
  const url = `${GITHUB_API}/search/commits?q=author:${encodeURIComponent(username)}&per_page=1`;
  const data = await safeFetch(url, { headers: { Accept: "application/vnd.github.cloak-preview" } });
  return data ? (data.total_count || 0) : 0;
}

async function fetchUserTotalStars(username) {
  let page = 1;
  let totalStars = 0;
  try {
    while (page <= 2) {
      const url = `${GITHUB_API}/users/${encodeURIComponent(username)}/repos?type=owner&per_page=100&page=${page}`;
      const data = await safeFetch(url);
      if (!data || !Array.isArray(data) || data.length === 0) break;
      for (const repo of data) {
        if (!repo.fork) totalStars += repo.stargazers_count || 0;
      }
      if (data.length < 100) break;
      page++;
    }
  } catch (e) {}
  return totalStars;
}

async function fetchRecentPRLinesChanged(prs, maxPRs = 10) {
  const targetPRs = (prs || []).filter((pr) => pr && pr.pull_request && pr.pull_request.url).slice(0, maxPRs);
  if (targetPRs.length === 0) return 0;
  const concurrency = 2;
  let totalChanged = 0;
  for (let i = 0; i < targetPRs.length; i += concurrency) {
    const batch = targetPRs.slice(i, i + concurrency);
    const results = await Promise.all(batch.map(async (pr) => {
      const data = await safeFetch(pr.pull_request.url);
      return data ? (data.additions || 0) + (data.deletions || 0) : 0;
    }));
    totalChanged += results.reduce((sum, v) => sum + v, 0);
  }
  return totalChanged;
}

async function fetchUserLanguages(username) {
  return await fetchUserLanguagesByRepos(username);
}

async function fetchUserLanguagesByRepos(username) {
  let page = 1;
  const langRepoCount = {};
  let totalRepos = 0;
  try {
    while (page <= 2) {
      const url = `${GITHUB_API}/users/${encodeURIComponent(username)}/repos?per_page=100&page=${page}&type=owner&sort=updated`;
      const repos = await safeFetch(url);
      if (!repos || !repos.length) break;
      for (const repo of repos) {
        if (repo.fork) continue;
        const lang = repo.language;
        if (lang) {
          langRepoCount[lang] = (langRepoCount[lang] || 0) + 1;
          totalRepos++;
        }
      }
      if (repos.length < 100) break;
      page++;
    }
  } catch (e) {}

  const languages = Object.entries(langRepoCount)
    .map(([name, count]) => ({
      name,
      count,
      percentage: totalRepos > 0 ? Math.round((count / totalRepos) * 10000) / 100 : 0,
    }))
    .sort((a, b) => b.count - a.count);

  return { languages, totalRepos, totalBytes: totalRepos * 1024 };
}

async function fetchUserLanguagesByCommits(username) {
  let page = 1;
  const langActivity = {};
  let totalActivity = 0;
  try {
    while (page <= 2) {
      const url = `${GITHUB_API}/users/${encodeURIComponent(username)}/repos?per_page=100&page=${page}&type=owner&sort=updated`;
      const repos = await safeFetch(url);
      if (!repos || !repos.length) break;
      for (const repo of repos) {
        if (repo.fork) continue;
        const lang = repo.language;
        if (lang) {
          const weight = 1 + (repo.stargazers_count || 0);
          langActivity[lang] = (langActivity[lang] || 0) + weight;
          totalActivity += weight;
        }
      }
      if (repos.length < 100) break;
      page++;
    }
  } catch (e) {}

  const languages = Object.entries(langActivity)
    .map(([name, weight]) => ({
      name,
      activity: weight,
      percentage: totalActivity > 0 ? Math.round((weight / totalActivity) * 10000) / 100 : 0,
    }))
    .sort((a, b) => b.activity - a.activity);

  return { languages, totalActivity };
}

async function fetchUserCommitTimestamps(username) {
  const perPage = 100;
  let page = 1;
  let allCommits = [];
  try {
    while (page <= 2) { // Heavily limited
      const url = `${GITHUB_API}/search/commits?q=author:${encodeURIComponent(username)}&per_page=${perPage}&page=${page}&sort=author-date`;
      const data = await safeFetch(url, { headers: { Accept: "application/vnd.github.cloak-preview" } });
      if (!data || !data.items || data.items.length === 0) break;
      for (const commit of data.items) {
        if (commit.commit?.author?.date) {
          allCommits.push({ timestamp: new Date(commit.commit.author.date).getTime() });
        }
      }
      if (data.items.length < perPage) break;
      page++;
    }
  } catch (e) {}

  if (allCommits.length === 0) return { totalWorkingHours: 0, commitCount: 0 };
  allCommits.sort((a, b) => a.timestamp - b.timestamp);
  const MAX_GAP = 5 * 60 * 60 * 1000;
  let totalWorkingMs = 0;
  for (let i = 0; i < allCommits.length - 1; i++) {
    const gap = allCommits[i + 1].timestamp - allCommits[i].timestamp;
    if (gap > 0 && gap < MAX_GAP) totalWorkingMs += gap;
  }
  return { totalWorkingHours: Math.round((totalWorkingMs / (1000 * 60 * 60)) * 100) / 100, commitCount: allCommits.length };
}

module.exports = {
  fetchUserPullRequests,
  fetchOpenPullRequests,
  fetchClosedPullRequests,
  fetchMergedPullRequests,
  fetchUserIssues,
  fetchOpenIssues,
  fetchClosedIssues,
  fetchTotalCommitCount,
  fetchUserTotalStars,
  fetchRecentPRLinesChanged,
  groupPRsByRepo,
  fetchUserProfile,
  fetchContributionData,
  fetchUserLanguages,
  fetchUserLanguagesByRepos,
  fetchUserLanguagesByCommits,
  fetchUserCommitTimestamps,
};
