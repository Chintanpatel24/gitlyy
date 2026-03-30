/**
 * SVG generation for Contribution Numbers Card.
 * Horizontal left-to-right layout like a timeline.
 * Days go left to right, wrapping to next row when full.
 * Uses theme colors. Always dark background.
 */

const { escapeXml } = require("./svg-pr");

/**
 * Green colors matching GitHub dark contribution graph.
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
 * Generate contribution grid SVG.
 * Layout: days flow left to right, wrapping to next row.
 * Like a calendar row-by-row instead of column-by-column.
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

  // How many cells per row (like GitHub shows ~53 weeks across)
  const cellsPerRow = 52;
  const cellSize = 11;
  const cellGap = 3;
  const cellStep = cellSize + cellGap;
  const padX = 28;
  const padY = 20;
  const headerHeight = 50;
  const numRows = Math.ceil(days.length / cellsPerRow);
  const gridWidth = cellsPerRow * cellStep;
  const gridHeight = numRows * cellStep;
  const cardWidth = Math.max(gridWidth + padX * 2, 600);
  const cardHeight = headerHeight + gridHeight + padY + 40;

  const hideBorderAttr = hideBorder
    ? `rx="8"`
    : `rx="8" stroke="#30363d" stroke-width="1"`;

  const displayTitle = title || `${username}'s Contributions`;

  let cells = "";

  // Place days left to right, wrapping to next row
  days.forEach((day, index) => {
    const col = index % cellsPerRow;
    const row = Math.floor(index / cellsPerRow);
    const x = padX + col * cellStep;
    const y = headerHeight + padY + row * cellStep;
    const color = getContributionColor(day.count, maxCount);

    cells += `
    <rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="2" fill="#${color}">
      <title>${day.date}: ${day.count} contribution${day.count !== 1 ? "s" : ""}</title>
    </rect>`;

    // Show number inside cell if count > 0
    if (day.count > 0) {
      const fontSize = day.count > 99 ? 5.5 : day.count > 9 ? 6.5 : 7.5;
      const textColor = day.count / maxCount > 0.5 ? "0d1117" : "e6edf3";
      cells += `
    <text x="${x + cellSize / 2}" y="${y + cellSize / 2 + 2}" text-anchor="middle" font-family="monospace" font-size="${fontSize}" font-weight="700" fill="#${textColor}" pointer-events="none">${day.count}</text>`;
    }
  });

  // Week/day markers on left
  let rowLabels = "";
  for (let r = 0; r < numRows; r++) {
    const startIdx = r * cellsPerRow;
    if (startIdx < days.length) {
      const d = new Date(days[startIdx].date + "T00:00:00");
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const label = `${monthNames[d.getMonth()]} ${d.getDate()}`;
      const y = headerHeight + padY + r * cellStep + cellSize / 2 + 3;
      rowLabels += `<text x="${padX - 4}" y="${y}" text-anchor="end" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="8" fill="#8b949e">${label}</text>`;
    }
  }

  // Legend
  const legendX = padX;
  const legendY = headerHeight + padY + gridHeight + 20;
  const legendColors = ["161b22", "0e4429", "006d32", "26a641", "39d353"];
  let legend = `<text x="${legendX}" y="${legendY}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="9" fill="#8b949e">Less</text>`;
  legendColors.forEach((color, idx) => {
    const lx = legendX + 28 + idx * (cellSize + 2);
    legend += `<rect x="${lx}" y="${legendY - 8}" width="${cellSize - 1}" height="${cellSize - 1}" rx="2" fill="#${color}"/>`;
  });
  legend += `<text x="${legendX + 28 + 5 * (cellSize + 2) + 4}" y="${legendY}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="9" fill="#8b949e">More</text>`;

  // Stats on right side of legend
  const statX = cardWidth - padX - 200;
  legend += `<text x="${statX}" y="${legendY}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="9" fill="#8b949e">${days.length} days tracked</text>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}">
  <style>
    .title { font: 600 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    .badge { font: 500 11px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
  </style>
  <!-- Dark background -->
  <rect x="0" y="0" width="${cardWidth}" height="${cardHeight}" fill="#0d1117" ${hideBorderAttr}/>
  <!-- Top accent line -->
  <rect x="0" y="0" width="${cardWidth}" height="3" fill="#39d353" rx="8"/>
  <!-- Header -->
  <g transform="translate(${padX}, 0)">
    <!-- Green contribution circle icon -->
    <circle cx="10" cy="26" r="8" fill="#39d353" opacity="0.15"/>
    <circle cx="10" cy="26" r="4" fill="#39d353"/>
    <text x="26" y="30" class="title" fill="#${colors.title_color || 'e6edf3'}">${escapeXml(displayTitle)}</text>
  </g>
  <!-- Total badge -->
  <rect x="${cardWidth - padX - 180}" y="14" width="180" height="24" rx="12" fill="#39d353" opacity="0.12"/>
  <text x="${cardWidth - padX - 90}" y="30" text-anchor="middle" class="badge" fill="#39d353">${totalContributions} contributions in the last year</text>
  <!-- Separator -->
  <line x1="${padX}" y1="${headerHeight}" x2="${cardWidth - padX}" y2="${headerHeight}" stroke="#30363d" stroke-width="0.5"/>
  <!-- Row labels -->
  ${rowLabels}
  <!-- Contribution cells -->
  ${cells}
  <!-- Legend -->
  ${legend}
</svg>`;
}

/**
 * Compact contribution summary card.
 */
function generateContributionSummarySVG(options) {
  const { username, totalContributions, currentStreak, longestStreak, colors, hideBorder } = options;

  const cardWidth = 420;
  const cardHeight = 170;
  const pad = 24;

  const hideBorderAttr = hideBorder
    ? `rx="8"`
    : `rx="8" stroke="#30363d" stroke-width="1"`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}">
  <style>
    .title { font: 600 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    .big-num { font: 700 30px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    .label { font: 400 11px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
  </style>
  <!-- Dark background -->
  <rect x="0" y="0" width="${cardWidth}" height="${cardHeight}" fill="#0d1117" ${hideBorderAttr}/>
  <!-- Top accent -->
  <rect x="0" y="0" width="${cardWidth}" height="3" fill="#39d353" rx="8"/>
  <!-- Header -->
  <g transform="translate(${pad}, 8)">
    <circle cx="10" cy="22" r="8" fill="#39d353" opacity="0.15"/>
    <circle cx="10" cy="22" r="4" fill="#39d353"/>
    <text x="26" y="26" class="title" fill="#${colors.title_color || 'e6edf3'}">${escapeXml(username)}'s Contributions</text>
  </g>
  <line x1="${pad}" y1="46" x2="${cardWidth - pad}" y2="46" stroke="#30363d" stroke-width="0.5"/>

  <!-- Three stat boxes -->
  <g transform="translate(${pad}, 56)">
    <!-- Total -->
    <rect x="0" y="0" width="115" height="80" rx="8" fill="#39d353" opacity="0.06"/>
    <text x="57" y="38" text-anchor="middle" class="big-num" fill="#39d353">${totalContributions}</text>
    <text x="57" y="56" text-anchor="middle" class="label" fill="#8b949e">Total</text>

    <!-- Current Streak -->
    <rect x="127" y="0" width="115" height="80" rx="8" fill="#58a6ff" opacity="0.06"/>
    <text x="184" y="38" text-anchor="middle" class="big-num" fill="#58a6ff">${currentStreak}</text>
    <text x="184" y="56" text-anchor="middle" class="label" fill="#8b949e">Current Streak</text>

    <!-- Longest Streak -->
    <rect x="254" y="0" width="115" height="80" rx="8" fill="#e6edf3" opacity="0.04"/>
    <text x="311" y="38" text-anchor="middle" class="big-num" fill="#e6edf3">${longestStreak}</text>
    <text x="311" y="56" text-anchor="middle" class="label" fill="#8b949e">Longest Streak</text>
  </g>
</svg>`;
}

/**
 * No data SVG.
 */
function generateNoDataSVG(username, colors, hideBorder) {
  const cardWidth = 400;
  const cardHeight = 120;
  const hideBorderAttr = hideBorder
    ? `rx="8"`
    : `rx="8" stroke="#30363d" stroke-width="1"`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}">
  <rect x="0" y="0" width="${cardWidth}" height="${cardHeight}" fill="#0d1117" ${hideBorderAttr}/>
  <text x="${cardWidth / 2}" y="50" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="14" fill="#e6edf3">${escapeXml(username)}'s Contributions</text>
  <text x="${cardWidth / 2}" y="75" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="12" fill="#8b949e">No contribution data found</text>
</svg>`;
}

module.exports = {
  generateContributionSVG,
  generateContributionSummarySVG,
  getContributionColor,
};
