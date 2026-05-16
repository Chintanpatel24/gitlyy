/**
 * Master Card SVG generation - Ultimate Profile Dashboard (830px).
 * Designed to cover the full width of a GitHub README with a high-end profile look.
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
    username, name, totalPRs = 0, openPRs = 0, mergedPRs = 0, repoCount = 0,
    languages = [], contributions = 0, totalCommits = 0, repoList = [],
    contributionDays = [], currentStreak = 0, longestStreak = 0,
    totalIssues = 0, openIssues = 0, closedIssues = 0, totalStars = 0,
    linesChanged = 0, weekMap = {}, colors, hideBorder, cardWidth = 830
  } = options;

  const pad = 32;
  const innerW = cardWidth - pad * 2;
  const hba = hideBorder ? `rx="16"` : `rx="16" stroke="#30363d" stroke-width="2"`;

  const accentColor = (colors && colors.accent_color) || "58a6ff";
  const titleColor = (colors && colors.title_color) || "58a6ff";
  const textColor = (colors && colors.text_color) || "c9d1d9";

  let y = 0;
  let content = "";

  // --- HEADER SECTION ---
  content += `
  <g transform="translate(${pad}, 45)">
    <text x="0" y="24" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="34" font-weight="900" fill="#${titleColor}">${escapeXml(name || username)}</text>
    <text x="0" y="50" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="14" font-weight="600" fill="#8b949e">GitHub Profile @${escapeXml(username.toLowerCase())}</text>
    <rect x="0" y="62" width="100" height="6" fill="#${accentColor}" rx="3"/>
  </g>`;
  y = 135;

  // --- MAIN STATS ROW ---
  const statW = Math.floor(innerW / 5);
  const heroStats = [
    { label: "Commits", value: totalCommits.toLocaleString(), color: accentColor },
    { label: "Stars", value: totalStars.toLocaleString(), color: "eab308" },
    { label: "PRs", value: totalPRs, color: "8b5cf6" },
    { label: "Issues", value: totalIssues, color: "f85149" },
    { label: "Contributions", value: contributions.toLocaleString(), color: "39d353" },
  ];

  heroStats.forEach((s, i) => {
    content += `
    <g transform="translate(${pad + i * statW}, ${y})">
      <text x="${statW / 2}" y="20" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="26" font-weight="800" fill="#${s.color}">${s.value}</text>
      <text x="${statW / 2}" y="42" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="11" font-weight="600" fill="#8b949e" style="text-transform:uppercase;letter-spacing:1px">${s.label}</text>
    </g>`;
  });
  y += 90;

  content += `<line x1="${pad}" y1="${y}" x2="${cardWidth - pad}" y2="${y}" stroke="#30363d" stroke-width="1.5" opacity="0.3"/>`;
  y += 45;

  // --- MIDDLE GRID: Languages (Left) & Weekly Activity (Right) ---
  const gridW = (innerW - 40) / 2;

  // Top Languages with bars
  content += `<g transform="translate(${pad}, ${y})">
    <text x="0" y="0" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="18" font-weight="800" fill="#${titleColor}">Language Usage</text>
    <g transform="translate(0, 25)">`;
  const { getLanguageColor } = require("./languages");
  const topLangs = languages.slice(0, 7);
  topLangs.forEach((lang, i) => {
    const ly = i * 28;
    const barMax = gridW - 130;
    const barW = (lang.percentage / 100) * barMax;
    content += `
    <g transform="translate(0, ${ly})">
      <circle cx="6" cy="10" r="5" fill="#${getLanguageColor(lang.name)}"/>
      <text x="20" y="14" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="13" fill="#${textColor}">${escapeXml(lang.name)}</text>
      <rect x="110" y="7" width="${barMax}" height="8" rx="4" fill="#30363d" opacity="0.4"/>
      <rect x="110" y="7" width="${barW}" height="8" rx="4" fill="#${getLanguageColor(lang.name)}"/>
      <text x="${gridW}" y="14" text-anchor="end" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="11" font-weight="600" fill="#8b949e">${lang.percentage.toFixed(1)}%</text>
    </g>`;
  });
  content += `</g></g>`;

  // Weekly Activity Chart
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const maxWeekly = Math.max(...Object.values(weekMap), 1);
  content += `<g transform="translate(${pad + gridW + 40}, ${y})">
    <text x="0" y="0" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="18" font-weight="800" fill="#${titleColor}">Weekly Activity</text>
    <g transform="translate(0, 25)">`;
  daysOfWeek.forEach((day, i) => {
    const ly = i * 28;
    const count = weekMap[i] || 0;
    const barW = (count / maxWeekly) * (gridW - 100);
    content += `
    <g transform="translate(0, ${ly})">
      <text x="0" y="14" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="13" fill="#8b949e">${day}</text>
      <rect x="50" y="7" width="${gridW - 100}" height="8" rx="4" fill="#30363d" opacity="0.4"/>
      <rect x="50" y="7" width="${barW}" height="8" rx="4" fill="#39d353" opacity="0.8"/>
      <text x="${gridW}" y="14" text-anchor="end" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="12" font-weight="700" fill="#39d353">${count.toLocaleString()}</text>
    </g>`;
  });
  content += `</g></g>`;

  y += 240;
  content += `<line x1="${pad}" y1="${y}" x2="${cardWidth - pad}" y2="${y}" stroke="#30363d" stroke-width="1.5" opacity="0.3"/>`;
  y += 45;

  // --- LOWER GRID: PR Projects & Streaks ---
  content += `<g transform="translate(${pad}, ${y})">
    <g>
      <text x="0" y="0" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="18" font-weight="800" fill="#${titleColor}">Top Active Repositories</text>
      <g transform="translate(0, 20)">`;
  repoList.slice(0, 4).forEach((repo, i) => {
    content += `<text x="0" y="${i * 24 + 14}" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="13" fill="#c9d1d9">&bull; ${escapeXml(repo.name.length > 35 ? repo.name.substring(0, 32) + '...' : repo.name)} <tspan fill="#${accentColor}" font-weight="800">(${repo.count} PRs)</tspan></text>`;
  });
  content += `</g></g>
    <g transform="translate(${gridW + 40}, 0)">
      <text x="0" y="0" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="18" font-weight="800" fill="#${titleColor}">Performance &amp; Streaks</text>
      <g transform="translate(0, 20)">
        <rect width="${gridW}" height="50" rx="12" fill="#39d353" opacity="0.1"/>
        <text x="16" y="30" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="15" font-weight="700" fill="#39d353">🔥 Current Streak: ${currentStreak} Days</text>
        <g transform="translate(0, 62)">
           <rect width="${gridW}" height="50" rx="12" fill="#f97316" opacity="0.1"/>
           <text x="16" y="30" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="15" font-weight="700" fill="#f97316">🏆 All-time Best: ${longestStreak} Days</text>
        </g>
      </g>
    </g>
  </g>`;
  y += 135;

  content += `<line x1="${pad}" y1="${y}" x2="${cardWidth - pad}" y2="${y}" stroke="#30363d" stroke-width="1.5" opacity="0.3"/>`;
  y += 45;

  // --- FOOTER: CONTRIBUTION HEATMAP ---
  content += `<g transform="translate(${pad}, ${y})">
    <text x="0" y="0" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="18" font-weight="800" fill="#${titleColor}">Full Contribution History (Last 12 Months)</text>
    <g transform="translate(0, 20)">`;
  const sortedDays = [...contributionDays].sort((a, b) => String(a.date).localeCompare(String(b.date)));
  const recent = sortedDays.slice(-371);
  const cell = 11.5, gap = 3, step = cell + gap;
  recent.forEach((d, i) => {
    const col = Math.floor(i / 7);
    const row = i % 7;
    content += `<rect x="${col * step}" y="${row * step}" width="${cell}" height="${cell}" rx="3" fill="#${getContributionColorByLevel(d.level)}"/>`;
  });
  content += `</g></g>`;
  y += 150;

  const cardHeight = y + 45;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#${accentColor};stop-opacity:0.08"/>
      <stop offset="100%" style="stop-color:#0d1117;stop-opacity:0"/>
    </linearGradient>
  </defs>
  <rect width="${cardWidth}" height="${cardHeight}" fill="#0d1117" ${hba}/>
  <rect width="${cardWidth}" height="${cardHeight}" fill="url(#bgGrad)" ${hba}/>
  <rect width="${cardWidth}" height="8" fill="#${accentColor}" rx="16"/>
  ${content}
  <text x="${cardWidth - pad}" y="${cardHeight - 20}" text-anchor="end" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="11" fill="#8b949e" opacity="0.4">gitlyy full dashboard &bull; updated every 30m</text>
</svg>`;
}

module.exports = { generateMasterCardSVG, escapeXml };
