/**
 * SVG generation for Contribution Numbers Card.
 * Displays commit counts per day in a GitHub-style grid,
 * but with actual numbers instead of colored dots.
 * Dark theme by default with classic polished styling.
 */

const { escapeXml, darken } = require("./svg-pr");

/**
 * Get the green color based on contribution count (GitHub dark theme style).
 */
function getContributionColor(count, maxCount) {
  if (count === 0) return "161b22";
  const ratio = count / maxCount;
  if (ratio <= 0.25) return "0e4429";
  if (ratio <= 0.5) return "006d32";
  if (ratio <= 0.75) return "26a641";
  return "39d353";
}

/**
 * Generate the contribution numbers grid SVG.
 */
function generateContributionSVG(options) {
  const {
    username,
    days,
    totalContributions,
    colors,
    hideBorder,
    title,
  } = options;

  if (!days || days.length === 0) {
    return generateNoDataSVG(username, colors, hideBorder);
  }

  const maxCount = Math.max(...days.map((d) => d.count), 1);

  // Group days by week for the grid layout
  const weeks = [];
  let currentWeek = [];

  // Pad the beginning so the first day aligns to its weekday
  if (days.length > 0) {
    const firstDay = new Date(days[0].date + "T00:00:00");
    const dayOfWeek = firstDay.getDay(); // 0=Sun
    for (let i = 0; i < dayOfWeek; i++) {
      currentWeek.push(null);
    }
  }

  for (const day of days) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  const cellSize = 13;
  const cellGap = 3;
  const cellStep = cellSize + cellGap;
  const pad = 28;
  const headerHeight = 52;
  const labelWidth = 32;
  const gridWidth = weeks.length * cellStep;
  const gridHeight = 7 * cellStep;
  const cardWidth = Math.max(gridWidth + pad * 2 + labelWidth, 620);
  const cardHeight = headerHeight + gridHeight + pad * 2 + 28;

  const border = hideBorder
    ? ""
    : `rx="6" stroke="#${colors.border_color}" stroke-width="1"`;

  const displayTitle = title || `${username}'s Contributions`;

  let cells = "";

  weeks.forEach((week, weekIdx) => {
    week.forEach((day, dayIdx) => {
      if (!day) return;
      const x = pad + labelWidth + weekIdx * cellStep;
      const y = headerHeight + pad + dayIdx * cellStep;
      const color = getContributionColor(day.count, maxCount);

      cells += `
      <rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="2.5" fill="#${color}" stroke="#${darken(color, 15)}" stroke-width="0.5">
        <title>${day.date}: ${day.count} contribution${day.count !== 1 ? "s" : ""}</title>
      </rect>`;

      // Show number inside cell if count > 0
      if (day.count > 0) {
        const fontSize = day.count > 99 ? 6 : day.count > 9 ? 7.5 : 8.5;
        const textColor = day.count / maxCount > 0.5 ? "0d1117" : "e6edf3";
        cells += `
      <text x="${x + cellSize / 2}" y="${y + cellSize / 2 + 2.5}" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', monospace" font-size="${fontSize}" font-weight="700" fill="#${textColor}" pointer-events="none">${day.count}</text>`;
      }
    });
  });

  // Day labels
  const dayLabels = ["", "Mon", "", "Wed", "", "Fri", ""];
  let labels = "";
  dayLabels.forEach((label, idx) => {
    if (!label) return;
    const y = headerHeight + pad + idx * cellStep + cellSize / 2 + 3;
    labels += `<text x="${pad}" y="${y}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="9.5" fill="#${colors.text_color}" opacity="0.6">${label}</text>`;
  });

  // Month labels at the top of the grid
  let monthLabels = "";
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let lastMonth = -1;
  weeks.forEach((week, weekIdx) => {
    const firstDay = week.find((d) => d !== null);
    if (firstDay) {
      const month = new Date(firstDay.date + "T00:00:00").getMonth();
      if (month !== lastMonth) {
        const x = pad + labelWidth + weekIdx * cellStep;
        monthLabels += `<text x="${x}" y="${headerHeight + pad - 8}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="9.5" fill="#${colors.text_color}" opacity="0.6">${monthNames[month]}</text>`;
        lastMonth = month;
      }
    }
  });

  // Legend
  const legendX = pad + labelWidth;
  const legendY = headerHeight + pad + gridHeight + 14;
  const legendColors = ["161b22", "0e4429", "006d32", "26a641", "39d353"];
  let legend = `<text x="${legendX}" y="${legendY}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="10" fill="#${colors.text_color}" opacity="0.6">Less</text>`;
  legendColors.forEach((color, idx) => {
    const lx = legendX + 32 + idx * (cellSize + 3);
    legend += `<rect x="${lx}" y="${legendY - 10}" width="${cellSize - 1}" height="${cellSize - 1}" rx="2" fill="#${color}"/>`;
  });
  legend += `<text x="${legendX + 32 + 5 * (cellSize + 3) + 5}" y="${legendY}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="10" fill="#${colors.text_color}" opacity="0.6">More</text>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}">
  <defs>
    <linearGradient id="bg-grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#${colors.bg_color};stop-opacity:1"/>
      <stop offset="100%" style="stop-color:#${darken(colors.bg_color, 8)};stop-opacity:1"/>
    </linearGradient>
  </defs>
  <style>
    .title { font: 600 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; }
    .total-text { font: 500 11px -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; }
  </style>
  <rect x="0.5" y="0.5" width="${cardWidth - 1}" height="${cardHeight - 1}" fill="url(#bg-grad)" ${border}/>
  <!-- Header bar -->
  <rect x="1" y="1" width="${cardWidth - 2}" height="${headerHeight - 1}" fill="#${colors.accent_color}" opacity="0.04" rx="6"/>
  <!-- Title -->
  <text x="${pad}" y="30" class="title" fill="#${colors.title_color}">${escapeXml(displayTitle)}</text>
  <!-- Total badge -->
  <rect x="${cardWidth - pad - 170}" y="16" width="170" height="22" rx="11" fill="#${colors.accent_color}" opacity="0.12"/>
  <text x="${cardWidth - pad - 85}" y="30" text-anchor="middle" class="total-text" fill="#${colors.accent_color}">${totalContributions} contributions in the last year</text>
  <!-- Separator -->
  <line x1="${pad}" y1="${headerHeight}" x2="${cardWidth - pad}" y2="${headerHeight}" stroke="#${colors.border_color}" stroke-width="0.5" opacity="0.4"/>
  <!-- Day labels -->
  ${labels}
  <!-- Month labels -->
  ${monthLabels}
  <!-- Contribution cells -->
  ${cells}
  <!-- Legend -->
  ${legend}
</svg>`;
}

/**
 * Generate a compact contribution summary card.
 */
function generateContributionSummarySVG(options) {
  const { username, totalContributions, currentStreak, longestStreak, colors, hideBorder } = options;

  const cardWidth = 420;
  const cardHeight = 165;
  const pad = 28;

  const border = hideBorder
    ? ""
    : `rx="6" stroke="#${colors.border_color}" stroke-width="1"`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}">
  <defs>
    <linearGradient id="bg-grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#${colors.bg_color};stop-opacity:1"/>
      <stop offset="100%" style="stop-color:#${darken(colors.bg_color, 10)};stop-opacity:1"/>
    </linearGradient>
  </defs>
  <style>
    .title { font: 600 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; }
    .stat-num { font: 700 28px -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; }
    .stat-label { font: 400 11px -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; }
  </style>
  <rect x="0.5" y="0.5" width="${cardWidth - 1}" height="${cardHeight - 1}" fill="url(#bg-grad)" ${border}/>
  <!-- Header -->
  <rect x="1" y="1" width="${cardWidth - 2}" height="48" fill="#${colors.accent_color}" opacity="0.04" rx="6"/>
  <!-- Green dot icon -->
  <circle cx="${pad + 6}" cy="26" r="6" fill="#39d353"/>
  <text x="${pad + 20}" y="30" class="title" fill="#${colors.title_color}">${escapeXml(username)}'s Contributions</text>
  <line x1="${pad}" y1="48" x2="${cardWidth - pad}" y2="48" stroke="#${colors.border_color}" stroke-width="0.5" opacity="0.4"/>

  <!-- Total -->
  <g transform="translate(${pad}, 60)">
    <rect x="0" y="0" width="100" height="72" rx="8" fill="#39d353" opacity="0.08"/>
    <text x="50" y="36" text-anchor="middle" class="stat-num" fill="#39d353">${totalContributions}</text>
    <text x="50" y="54" text-anchor="middle" class="stat-label" fill="#${colors.text_color}">Total</text>
  </g>

  <!-- Current Streak -->
  <g transform="translate(${pad + 115}, 60)">
    <rect x="0" y="0" width="100" height="72" rx="8" fill="#${colors.accent_color}" opacity="0.08"/>
    <text x="50" y="36" text-anchor="middle" class="stat-num" fill="#${colors.accent_color}">${currentStreak}</text>
    <text x="50" y="54" text-anchor="middle" class="stat-label" fill="#${colors.text_color}">Current Streak</text>
  </g>

  <!-- Longest Streak -->
  <g transform="translate(${pad + 230}, 60)">
    <rect x="0" y="0" width="100" height="72" rx="8" fill="#${colors.text_color}" opacity="0.05"/>
    <text x="50" y="36" text-anchor="middle" class="stat-num" fill="#${colors.text_color}">${longestStreak}</text>
    <text x="50" y="54" text-anchor="middle" class="stat-label" fill="#${colors.text_color}">Longest Streak</text>
  </g>

  <text x="${cardWidth / 2}" y="${cardHeight - 8}" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="9" fill="#${colors.text_color}" opacity="0.3">via gitly</text>
</svg>`;
}

/**
 * Generate a "no data" SVG when contribution data is unavailable.
 */
function generateNoDataSVG(username, colors, hideBorder) {
  const cardWidth = 400;
  const cardHeight = 120;
  const border = hideBorder
    ? ""
    : `rx="6" stroke="#${colors.border_color}" stroke-width="1"`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}">
  <rect x="0.5" y="0.5" width="${cardWidth - 1}" height="${cardHeight - 1}" fill="#${colors.bg_color}" ${border}/>
  <text x="${cardWidth / 2}" y="50" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="14" fill="#${colors.title_color}">${escapeXml(username)}'s Contributions</text>
  <text x="${cardWidth / 2}" y="75" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="12" fill="#${colors.text_color}" opacity="0.6">No contribution data found</text>
</svg>`;
}

module.exports = {
  generateContributionSVG,
  generateContributionSummarySVG,
  getContributionColor,
};
