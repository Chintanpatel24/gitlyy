/**
 * GitHub API helpers for fetching user data (no auth required).
 */

const GITHUB_API = "https://api.github.com";

/**
 * Robust fetch wrapper with timeout and better error handling
 */
async function safeFetch(url, options = {}, timeout = 12000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "User-Agent": "gitlyy-app-bot",
        "Accept": options.headers?.Accept || "application/vnd.github.v3+json",
        ...(options.headers || {}),
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`GitHub API warning: ${res.status} for ${url}`);
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
 * Fetch all pull requests by a user across multiple pages.
 */
async function fetchUserPullRequests(username) {
  const encUser = encodeURIComponent(username);
  let allItems = [];
  // Fetch up to 3 pages for better coverage
  for (let page = 1; page <= 3; page++) {
    const url = `${GITHUB_API}/search/issues?q=author:${encUser}+type:pr&per_page=100&page=${page}`;
    const data = await safeFetch(url);
    if (!data || !data.items || data.items.length === 0) break;
    allItems = allItems.concat(data.items);
    if (allItems.length >= data.total_count) break;
  }
  return allItems;
}

async function fetchOpenPullRequests(username) {
  const encUser = encodeURIComponent(username);
  const url = `${GITHUB_API}/search/issues?q=author:${encUser}+type:pr+state:open&per_page=1`;
  const data = await safeFetch(url);
  return data ? (data.total_count || 0) : 0;
}

async function fetchClosedPullRequests(username) {
  const encUser = encodeURIComponent(username);
  const url = `${GITHUB_API}/search/issues?q=author:${encUser}+type:pr+state:closed&per_page=1`;
  const data = await safeFetch(url);
  return data ? (data.total_count || 0) : 0;
}

async function fetchMergedPullRequests(username) {
  const encUser = encodeURIComponent(username);
  const url = `${GITHUB_API}/search/issues?q=author:${encUser}+type:pr+is:merged&per_page=1`;
  const data = await safeFetch(url);
  return data ? (data.total_count || 0) : 0;
}

async function fetchUserIssues(username) {
  const encUser = encodeURIComponent(username);
  const url = `${GITHUB_API}/search/issues?q=author:${encUser}+type:issue&per_page=1`;
  const data = await safeFetch(url);
  return data ? (data.total_count || 0) : 0;
}

async function fetchOpenIssues(username) {
  const encUser = encodeURIComponent(username);
  const url = `${GITHUB_API}/search/issues?q=author:${encUser}+type:issue+state:open&per_page=1`;
  const data = await safeFetch(url);
  return data ? (data.total_count || 0) : 0;
}

async function fetchClosedIssues(username) {
  const encUser = encodeURIComponent(username);
  const url = `${GITHUB_API}/search/issues?q=author:${encUser}+type:issue+state:closed&per_page=1`;
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
  const encUser = encodeURIComponent(username);
  const url = `${GITHUB_API}/users/${encUser}`;
  const data = await safeFetch(url);
  return data || { login: username, public_repos: 0, followers: 0, following: 0 };
}

async function fetchContributionData(username) {
  const encUser = encodeURIComponent(username);
  const url = `https://github.com/users/${encUser}/contributions`;
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

  const dates = [];
  // Match both <td> (old) and <rect> (new) elements with data-date and data-level
  const entryRegex = /<(?:td|rect)\b[^>]*\bdata-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="(\d+)"[^>]*>/g;
  let match;
  while ((match = entryRegex.exec(html)) !== null) {
    const tag = match[0];
    const idMatch = tag.match(/\bid="([^"]+)"/);
    dates.push({
      id: idMatch ? idMatch[1] : null,
      date: match[1],
      level: parseInt(match[2], 10),
      count: 0
    });
  }

  // Exact count extraction from tooltips
  const tipRegex = /<tool-tip[^>]*for="([^"]+)"[^>]*>([\s\S]*?)<\/tool-tip>/g;
  const countMap = new Map();
  while ((match = tipRegex.exec(html)) !== null) {
    const tipId = match[1];
    const tipText = match[2].replace(/\s+/g, " ").trim();
    const countMatch = tipText.match(/(\d+)\s+contribution/i);
    if (countMatch) {
      countMap.set(tipId, parseInt(countMatch[1], 10));
    }
  }

  const days = dates.map(d => ({
    date: d.date,
    level: d.level,
    count: d.id && countMap.has(d.id) ? countMap.get(d.id) : (d.level * 2)
  }));

  days.sort((a, b) => a.date.localeCompare(b.date));
  if (totalContributions === 0) {
    totalContributions = days.reduce((sum, d) => sum + d.count, 0);
  }

  return { totalContributions, days };
}

async function fetchTotalCommitCount(username) {
  const encUser = encodeURIComponent(username);
  const url = `${GITHUB_API}/search/commits?q=author:${encUser}&per_page=1`;
  const data = await safeFetch(url, { headers: { Accept: "application/vnd.github.cloak-preview" } });
  return data ? (data.total_count || 0) : 0;
}

async function fetchUserTotalStars(username) {
  const encUser = encodeURIComponent(username);
  let totalStars = 0;
  // Fetch up to 3 pages of repos
  for (let page = 1; page <= 3; page++) {
    const url = `${GITHUB_API}/users/${encUser}/repos?type=owner&per_page=100&page=${page}`;
    const data = await safeFetch(url);
    if (!Array.isArray(data) || data.length === 0) break;
    totalStars += data.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
    if (data.length < 100) break;
  }
  return totalStars;
}

async function fetchRecentPRLinesChanged(prs, maxPRs = 10) {
  const targetPRs = (prs || []).filter((pr) => pr?.pull_request?.url).slice(0, maxPRs);
  if (targetPRs.length === 0) return 0;

  let totalChanged = 0;
  for (const pr of targetPRs) {
    const data = await safeFetch(pr.pull_request.url, {}, 3000);
    if (data) {
      totalChanged += (data.additions || 0) + (data.deletions || 0);
    }
  }
  return totalChanged;
}

async function fetchUserLanguages(username) {
  const encUser = encodeURIComponent(username);
  const url = `${GITHUB_API}/users/${encUser}/repos?per_page=100&type=owner&sort=updated`;
  const repos = await safeFetch(url);
  if (!Array.isArray(repos)) return { languages: [], totalRepos: 0, totalBytes: 0 };

  const langRepoCount = {};
  let totalRepos = 0;
  for (const repo of repos) {
    if (repo.fork) continue;
    const lang = repo.language;
    if (lang) {
      langRepoCount[lang] = (langRepoCount[lang] || 0) + 1;
      totalRepos++;
    }
  }

  const languages = Object.entries(langRepoCount)
    .map(([name, count]) => ({
      name,
      count,
      percentage: totalRepos > 0 ? (count / totalRepos) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count);

  return { languages, totalRepos, totalBytes: totalRepos * 1024 };
}

async function fetchUserLanguagesByRepos(username) {
  return await fetchUserLanguages(username);
}

async function fetchUserLanguagesByCommits(username) {
  return await fetchUserLanguages(username);
}

async function fetchUserCommitTimestamps(username) {
  const encUser = encodeURIComponent(username);
  const url = `${GITHUB_API}/search/commits?q=author:${encUser}&per_page=100&sort=author-date`;
  const data = await safeFetch(url, { headers: { Accept: "application/vnd.github.cloak-preview" } });
  const allCommits = (data?.items || []).map(c => ({ timestamp: new Date(c.commit?.author?.date).getTime() }));

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
  fetchUserProfile,
  fetchContributionData,
  fetchTotalCommitCount,
  fetchUserTotalStars,
  fetchRecentPRLinesChanged,
  fetchUserLanguages,
  fetchUserLanguagesByRepos,
  fetchUserLanguagesByCommits,
  fetchUserCommitTimestamps,
  groupPRsByRepo
};
