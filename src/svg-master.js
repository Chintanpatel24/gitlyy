/**
 * Master Card SVG generation - Ultimate Profile Dashboard (1000px).
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
    username, name, avatarUrl, bio, location, company, followers = 0, following = 0,
    totalPRs = 0, openPRs = 0, mergedPRs = 0, repoCount = 0,
    languages = [], contributions = 0, totalCommits = 0, repoList = [],
    contributionDays = [], currentStreak = 0, longestStreak = 0,
    totalIssues = 0, openIssues = 0, closedIssues = 0, totalStars = 0,
    linesChanged = 0, weekMap = {}, colors, hideBorder, cardWidth = 1000
  } = options;

  const pad = 40;
  const innerW = cardWidth - pad * 2;
  const hba = hideBorder ? `rx="20"` : `rx="20" stroke="#30363d" stroke-width="2"`;

  const accentColor = (colors && colors.accent_color) || "58a6ff";
  const titleColor = (colors && colors.title_color) || "58a6ff";
  const textColor = (colors && colors.text_color) || "c9d1d9";
  const bgColor = (colors && colors.bg_color) || "0d1117";

  let y = 0;
  let content = "";

  // --- HEADER SECTION WITH AVATAR ---
  content += `
  <g transform="translate(${pad}, 50)">
    ${avatarUrl ? `
    <defs>
      <clipPath id="avatarClip">
        <circle cx="50" cy="50" r="50"/>
      </clipPath>
    </defs>
    <image href="${avatarUrl}" x="0" y="0" width="100" height="100" clip-path="url(#avatarClip)"/>
    ` : `<circle cx="50" cy="50" r="50" fill="#30363d"/>`}

    <g transform="translate(${avatarUrl ? 130 : 0}, 15)">
      <text x="0" y="24" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="42" font-weight="900" fill="#${titleColor}">${escapeXml(name || username)}</text>
      <text x="0" y="55" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="18" font-weight="600" fill="#8b949e">@${escapeXml(username.toLowerCase())} • ${repoCount} Repositories</text>
      ${bio ? `<text x="0" y="80" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="14" fill="#${textColor}" opacity="0.8">${escapeXml(bio.length > 80 ? bio.substring(0, 77) + '...' : bio)}</text>` : ""}
    </g>

    <g transform="translate(${innerW - 200}, 25)">
       <text x="100" y="20" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="24" font-weight="800" fill="#${textColor}">${followers.toLocaleString()}</text>
       <text x="100" y="40" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="12" font-weight="600" fill="#8b949e" style="text-transform:uppercase">Followers</text>

       <text x="180" y="20" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="24" font-weight="800" fill="#${textColor}">${following.toLocaleString()}</text>
       <text x="180" y="40" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="12" font-weight="600" fill="#8b949e" style="text-transform:uppercase">Following</text>
    </g>
  </g>`;
  y = 180;

  content += `<line x1="${pad}" y1="${y}" x2="${cardWidth - pad}" y2="${y}" stroke="#30363d" stroke-width="1" opacity="0.3"/>`;
  y += 60;

  // --- MAIN STATS ROW ---
  const statW = Math.floor(innerW / 5);
  const heroStats = [
    { label: "Total Commits", value: totalCommits.toLocaleString(), color: accentColor },
    { label: "Total Stars", value: totalStars.toLocaleString(), color: "eab308" },
    { label: "Pull Requests", value: totalPRs, color: "8b5cf6" },
    { label: "Issues Fixed", value: totalIssues, color: "f85149" },
    { label: "Contributions", value: contributions.toLocaleString(), color: "39d353" },
  ];

  heroStats.forEach((s, i) => {
    content += `
    <g transform="translate(${pad + i * statW}, ${y})">
      <text x="${statW / 2}" y="25" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="32" font-weight="900" fill="#${s.color}">${s.value}</text>
      <text x="${statW / 2}" y="52" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="13" font-weight="600" fill="#8b949e" style="text-transform:uppercase;letter-spacing:1.5px">${s.label}</text>
    </g>`;
  });
  y += 100;

  content += `<line x1="${pad}" y1="${y}" x2="${cardWidth - pad}" y2="${y}" stroke="#30363d" stroke-width="1" opacity="0.3"/>`;
  y += 60;

  // --- MIDDLE GRID ---
  const gridW = (innerW - 60) / 2;

  // Top Languages
  content += `<g transform="translate(${pad}, ${y})">
    <text x="0" y="0" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="22" font-weight="800" fill="#${titleColor}">Language Dominance</text>
    <g transform="translate(0, 35)">`;
  const { getLanguageColor } = require("./languages");
  const topLangs = languages.slice(0, 8);
  topLangs.forEach((lang, i) => {
    const ly = i * 35;
    const barMax = 240;
    const barW = (lang.percentage / 100) * barMax;
    const maxLabelLen = 15;
    const displayName = lang.name.length > maxLabelLen ? lang.name.substring(0, maxLabelLen - 3) + "..." : lang.name;
    content += `
    <g transform="translate(0, ${ly})">
      <circle cx="8" cy="12" r="6" fill="#${getLanguageColor(lang.name)}"/>
      <text x="25" y="17" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="15" font-weight="600" fill="#${textColor}">${escapeXml(displayName)}</text>
      <rect x="160" y="8" width="${barMax}" height="10" rx="5" fill="#30363d" opacity="0.4"/>
      <rect x="160" y="8" width="${barW}" height="10" rx="5" fill="#${getLanguageColor(lang.name)}"/>
      <text x="${gridW}" y="17" text-anchor="end" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="13" font-weight="700" fill="#8b949e">${lang.percentage.toFixed(1)}%</text>
    </g>`;
  });
  content += `</g></g>`;

  // Weekly Activity Chart
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const maxWeekly = Math.max(...Object.values(weekMap), 1);
  content += `<g transform="translate(${pad + gridW + 60}, ${y})">
    <text x="0" y="0" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="22" font-weight="800" fill="#${titleColor}">Weekly Productivity</text>
    <g transform="translate(0, 35)">`;
  daysOfWeek.forEach((day, i) => {
    const ly = i * 35;
    const count = weekMap[i] || 0;
    const barW = (count / maxWeekly) * 300;
    content += `
    <g transform="translate(0, ${ly})">
      <text x="0" y="17" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="14" font-weight="600" fill="#8b949e">${day}</text>
      <rect x="100" y="8" width="300" height="10" rx="5" fill="#30363d" opacity="0.4"/>
      <rect x="100" y="8" width="${barW}" height="10" rx="5" fill="#39d353" opacity="0.8"/>
      <text x="${gridW}" y="17" text-anchor="end" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="14" font-weight="800" fill="#39d353">${count.toLocaleString()}</text>
    </g>`;
  });
  content += `</g></g>`;

  y += 330;
  content += `<line x1="${pad}" y1="${y}" x2="${cardWidth - pad}" y2="${y}" stroke="#30363d" stroke-width="1" opacity="0.3"/>`;
  y += 60;

  // --- LOWER GRID: Repos & Streaks ---
  content += `<g transform="translate(${pad}, ${y})">
    <g>
      <text x="0" y="0" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="22" font-weight="800" fill="#${titleColor}">Top Contributions by Repository</text>
      <g transform="translate(0, 30)">`;
  repoList.slice(0, 6).forEach((repo, i) => {
    content += `<text x="0" y="${i * 30 + 15}" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="15" fill="#c9d1d9">&bull; ${escapeXml(repo.name.length > 50 ? repo.name.substring(0, 47) + '...' : repo.name)} <tspan fill="#${accentColor}" font-weight="900">(${repo.count} PRs)</tspan></text>`;
  });
  content += `</g></g>
    <g transform="translate(${gridW + 60}, 0)">
      <text x="0" y="0" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="22" font-weight="800" fill="#${titleColor}">Consistency &amp; Momentum</text>
      <g transform="translate(0, 30)">
        <rect width="${gridW}" height="70" rx="15" fill="#39d353" opacity="0.1"/>
        <text x="25" y="42" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="20" font-weight="800" fill="#39d353">🔥 Current Streak: ${currentStreak} Days</text>
        <g transform="translate(0, 85)">
           <rect width="${gridW}" height="70" rx="15" fill="#f97316" opacity="0.1"/>
           <text x="25" y="42" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="20" font-weight="800" fill="#f97316">🏆 All-time Best: ${longestStreak} Days</text>
        </g>
      </g>
    </g>
  </g>`;
  y += 240;

  content += `<line x1="${pad}" y1="${y}" x2="${cardWidth - pad}" y2="${y}" stroke="#30363d" stroke-width="1" opacity="0.3"/>`;
  y += 60;

  // --- FOOTER: CONTRIBUTION HEATMAP ---
  content += `<g transform="translate(${pad}, ${y})">
    <text x="0" y="0" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="22" font-weight="800" fill="#${titleColor}">Annual Contribution Heatmap</text>
    <g transform="translate(0, 35)">`;
  const sortedDays = [...contributionDays].sort((a, b) => String(a.date).localeCompare(String(b.date)));

  // On 1000px width, we can fit more weeks.
  // Standard GitHub heatmap is ~53 weeks.
  // cell 14, gap 4 = 18 per week. 53 * 18 = 954.
  const cell = 14, gap = 4, step = cell + gap;
  const maxWeeks = Math.floor(innerW / step);
  const recent = sortedDays.slice(-(maxWeeks * 7));

  recent.forEach((d, i) => {
    const col = Math.floor(i / 7);
    const row = i % 7;
    content += `<rect x="${col * step}" y="${row * step}" width="${cell}" height="${cell}" rx="3" fill="#${getContributionColorByLevel(d.level)}">
      <title>${d.date}: ${d.count} contributions</title>
    </rect>`;
  });
  content += `</g></g>`;
  y += 180;

  const cardHeight = y + 80;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#${accentColor};stop-opacity:0.12"/>
      <stop offset="100%" style="stop-color:#${bgColor};stop-opacity:0"/>
    </linearGradient>
  </defs>
  <rect width="${cardWidth}" height="${cardHeight}" fill="#${bgColor}" ${hba}/>
  <rect width="${cardWidth}" height="${cardHeight}" fill="url(#bgGrad)" ${hba}/>
  <rect width="${cardWidth}" height="10" fill="#${accentColor}" rx="20"/>
  ${content}
  <text x="${cardWidth - pad}" y="${cardHeight - 30}" text-anchor="end" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="13" font-weight="600" fill="#8b949e" opacity="0.5">GITLYY ULTIMATE DASHBOARD &bull; UPDATED EVERY 30M</text>
</svg>`;
}

module.exports = { generateMasterCardSVG, escapeXml };
