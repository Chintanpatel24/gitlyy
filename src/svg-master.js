/**
 * Master Card SVG generation - Vertical Structured Dashboard.
 * Clean, classic, and fited for GitHub Readme.
 */

function getContributionColorByLevel(level) {
  const levelColors = ["161b22", "0e4429", "006d32", "26a641", "39d353"];
  return levelColors[Math.max(0, Math.min(4, Number(level) || 0))];
}

function escapeXml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

function generateMasterCardSVG(options) {
  const {
    username,
    totalPRs = 0,
    openPRs = 0,
    mergedPRs = 0,
    repoCount = 0,
    languages = [],
    contributions = 0,
    totalCommits = 0,
    repoList = [],
    contributionDays = [],
    currentStreak = 0,
    longestStreak = 0,
    totalIssues = 0,
    openIssues = 0,
    closedIssues = 0,
    colors,
    hideBorder,
    cardWidth = 495,
  } = options;

  const pad = 24;
  const innerW = cardWidth - pad * 2;
  const hba = hideBorder ? `rx="10"` : `rx="10" stroke="#30363d" stroke-width="1"`;

  const accentColor = (colors && colors.accent_color) || "58a6ff";
  const titleColor = (colors && colors.title_color) || "58a6ff";
  const textColor = (colors && colors.text_color) || "c9d1d9";

  let y = 0;
  let sections = "";

  // --- HEADER ---
  sections += `
  <g transform="translate(${pad}, 20)">
    <text x="0" y="20" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="22" font-weight="700" fill="#${titleColor}">${escapeXml(username)}'s GitHub Stats</text>
    <rect x="0" y="32" width="40" height="3" fill="#${accentColor}" rx="2"/>
  </g>`;
  y = 70;

  // --- KEY STATS ROW ---
  const statW = Math.floor(innerW / 3);
  const keyStats = [
    { label: "Commits", value: totalCommits.toLocaleString(), color: accentColor },
    { label: "Contributions", value: contributions.toLocaleString(), color: "39d353" },
    { label: "Repositories", value: repoCount, color: "1f6feb" },
  ];

  sections += `<g transform="translate(${pad}, ${y})">`;
  keyStats.forEach((s, i) => {
    sections += `
    <g transform="translate(${i * statW}, 0)">
      <text x="${statW / 2}" y="18" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="18" font-weight="700" fill="#${s.color}">${s.value}</text>
      <text x="${statW / 2}" y="34" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="10" font-weight="600" fill="#8b949e" style="text-transform:uppercase;letter-spacing:0.5px">${s.label}</text>
    </g>`;
  });
  sections += `</g>`;
  y += 50;

  sections += `<line x1="${pad}" y1="${y}" x2="${cardWidth - pad}" y2="${y}" stroke="#30363d" stroke-width="1" opacity="0.5"/>`;
  y += 20;

  // --- CONTRIBUTIONS HEATMAP ---
  sections += `<text x="${pad}" y="${y}" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="12" font-weight="600" fill="#${titleColor}">Recent Contributions</text>`;
  y += 10;

  const sortedDays = [...contributionDays].sort((a, b) => String(a.date).localeCompare(String(b.date)));
  const recent = sortedDays.slice(-105); // 15 weeks
  const cell = 8, gap = 3;
  const step = cell + gap;

  sections += `<g transform="translate(${pad}, ${y})">`;
  recent.forEach((d, i) => {
    const col = Math.floor(i / 7);
    const row = i % 7;
    sections += `<rect x="${col * step}" y="${row * step}" width="${cell}" height="${cell}" rx="2" fill="#${getContributionColorByLevel(d.level)}"/>`;
  });

  // Streak badges next to heatmap
  const streakX = 15 * step + 20;
  sections += `
  <g transform="translate(${streakX}, 5)">
    <text x="0" y="12" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="10" fill="#8b949e">Current Streak</text>
    <text x="0" y="30" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="18" font-weight="700" fill="#39d353">${currentStreak} Days</text>
    <text x="0" y="50" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="10" fill="#8b949e">Longest Streak</text>
    <text x="0" y="68" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="18" font-weight="700" fill="#f97316">${longestStreak} Days</text>
  </g>`;
  sections += `</g>`;
  y += 90;

  // --- TOP LANGUAGES ---
  sections += `<text x="${pad}" y="${y}" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="12" font-weight="600" fill="#${titleColor}">Top Languages</text>`;
  y += 12;

  const { getLanguageColor } = require("./languages");
  const topLangs = languages.slice(0, 5);

  // Horizontal stacked bar
  sections += `<g transform="translate(${pad}, ${y})">`;
  let barX = 0;
  topLangs.forEach(lang => {
    const w = (lang.percentage / 100) * innerW;
    if (w > 1) {
       sections += `<rect x="${barX}" y="0" width="${w}" height="10" fill="#${getLanguageColor(lang.name)}" ${barX === 0 ? 'rx="5"' : ''} ${barX + w >= innerW - 1 ? 'rx="5"' : ''}/>`;
       barX += w;
    }
  });
  sections += `</g>`;
  y += 22;

  // Language legend
  sections += `<g transform="translate(${pad}, ${y})">`;
  topLangs.forEach((lang, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const lx = col * (innerW / 3);
    const ly = row * 20;
    sections += `
    <g transform="translate(${lx}, ${ly})">
      <circle cx="5" cy="5" r="4" fill="#${getLanguageColor(lang.name)}"/>
      <text x="14" y="9" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="11" fill="#${textColor}">${escapeXml(lang.name)} <tspan fill="#8b949e" font-weight="400">${lang.percentage.toFixed(1)}%</tspan></text>
    </g>`;
  });
  sections += `</g>`;
  y += topLangs.length > 3 ? 45 : 25;

  sections += `<line x1="${pad}" y1="${y}" x2="${cardWidth - pad}" y2="${y}" stroke="#30363d" stroke-width="1" opacity="0.5"/>`;
  y += 20;

  // --- PR & ISSUES SUMMARY ---
  sections += `<text x="${pad}" y="${y}" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="12" font-weight="600" fill="#${titleColor}">Pull Requests &amp; Issues</text>`;
  y += 15;

  const summaryStats = [
    { label: "Merged PRs", value: mergedPRs, color: "8b5cf6" },
    { label: "Open PRs", value: openPRs, color: "3fb950" },
    { label: "Open Issues", value: openIssues, color: "f85149" },
    { label: "Closed Issues", value: closedIssues, color: "8b949e" },
  ];

  sections += `<g transform="translate(${pad}, ${y})">`;
  summaryStats.forEach((s, i) => {
    const lx = (i % 2) * (innerW / 2);
    const ly = Math.floor(i / 2) * 35;
    sections += `
    <g transform="translate(${lx}, ${ly})">
       <rect width="${innerW / 2 - 10}" height="28" rx="6" fill="#${s.color}" opacity="0.08"/>
       <text x="10" y="19" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="11" fill="#8b949e">${s.label}</text>
       <text x="${innerW / 2 - 20}" y="19" text-anchor="end" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="14" font-weight="700" fill="#${s.color}">${s.value}</text>
    </g>`;
  });
  sections += `</g>`;
  y += 75;

  // --- TOP REPOS ---
  sections += `<text x="${pad}" y="${y}" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="12" font-weight="600" fill="#${titleColor}">Top Repositories</text>`;
  y += 10;

  const topRepos = repoList.slice(0, 4);
  sections += `<g transform="translate(${pad}, ${y})">`;
  topRepos.forEach((repo, i) => {
    const ly = i * 28;
    const barMaxWidth = innerW - 140;
    const barW = Math.min(barMaxWidth, (repo.count / (topRepos[0].count || 1)) * barMaxWidth);
    const repoName = repo.name.length > 25 ? repo.name.substring(0, 22) + "..." : repo.name;
    sections += `
    <g transform="translate(0, ${ly})">
      <text x="0" y="18" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="11" fill="#${textColor}">${escapeXml(repoName)}</text>
      <rect x="120" y="8" width="${barMaxWidth}" height="8" rx="4" fill="#30363d" opacity="0.3"/>
      <rect x="120" y="8" width="${barW}" height="8" rx="4" fill="#${accentColor}" opacity="0.6"/>
      <text x="${innerW}" y="18" text-anchor="end" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="12" font-weight="700" fill="#${accentColor}">${repo.count}</text>
    </g>`;
  });
  sections += `</g>`;
  y += topRepos.length * 28 + 10;

  const cardHeight = y + 20;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}">
  <rect width="${cardWidth}" height="${cardHeight}" fill="#0d1117" ${hba}/>
  <rect width="${cardWidth}" height="3" fill="#${accentColor}" rx="10"/>
  ${sections}
  <text x="${cardWidth - pad}" y="${cardHeight - 12}" text-anchor="end" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="9" fill="#8b949e" opacity="0.5">Generated by Gitly</text>
</svg>`;
}

module.exports = { generateMasterCardSVG, escapeXml };
