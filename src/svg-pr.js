/**
 * SVG generation for Pull Request Stats card.
 */

function escapeXml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

function generatePRCardSVG(options) {
  const { repoMap, totalPRs, mergedPRs = 0, closedPRs = 0, openPRs = 0, colors, hideBorder, cardWidth = 460 } = options;
  const repos = Object.entries(repoMap).sort((a, b) => b[1] - a[1]);
  const maxShow = Math.min(repos.length, 12);
  const rowH = 30, pad = 24, hdr = 80;
  const cardHeight = hdr + maxShow * rowH + 8;
  const hba = hideBorder ? `rx="8"` : `rx="8" stroke="#30363d" stroke-width="1"`;

  const accentColor = colors.accent_color || "58a6ff";
  const titleColor = colors.title_color || "58a6ff";

  let rows = "";
  repos.slice(0, maxShow).forEach(([repo, count], i) => {
    const y = hdr + i * rowH;

    const countLabel = String(count);
    const valueW = Math.max(26, countLabel.length * 8 + 8);
    const barW = 60;
    const barToValueGap = 10;
    const barX = cardWidth - pad - valueW - barToValueGap - barW;
    const valueX = cardWidth - pad;

    // Dynamically calculate max name length to prevent overlap with bar
    const maxChars = Math.floor((barX - pad - 10) / 7);
    const name = repo.length > maxChars ? repo.substring(0, maxChars - 3) + "..." : repo;

    rows += `<g transform="translate(0,${y})">
      <rect width="${cardWidth}" height="${rowH}" fill="#e6edf3" opacity="${i % 2 === 0 ? '.02' : '0'}"/>
      <text x="${pad}" y="20" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="12" fill="#c9d1d9">${escapeXml(name)}</text>
      <rect x="${barX}" y="9" width="${barW}" height="12" rx="6" fill="#30363d"/>
      <rect x="${barX}" y="9" width="${Math.min(barW, (count / (repos[0][1] || 1)) * barW)}" height="12" rx="6" fill="#${accentColor}" opacity=".5"/>
      <text x="${valueX}" y="20" text-anchor="end" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="14" font-weight="700" fill="#${accentColor}">${countLabel}</text>
    </g>`;
  });

  if (repos.length > maxShow) {
    rows += `<text x="${cardWidth / 2}" y="${hdr + maxShow * rowH + 6}" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="10" fill="#8b949e" opacity=".5">+${repos.length - maxShow} more</text>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}">
  <style>.t{font:600 14px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}.n{font:700 18px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}.s{font:700 12px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}.l{font:400 10px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}</style>
  <rect width="${cardWidth}" height="${cardHeight}" fill="#0d1117" ${hba}/>
  <rect width="${cardWidth}" height="3" fill="#${accentColor}" rx="8"/>
  <g transform="translate(${pad},10)">
    <circle cx="8" cy="18" r="5" fill="none" stroke="#${accentColor}" stroke-width="1.5"/>
    <circle cx="8" cy="18" r="2" fill="#${accentColor}"/>
    <line x1="14" y1="18" x2="18" y2="18" stroke="#${accentColor}" stroke-width="1.5"/>
    <line x1="8" y1="24" x2="8" y2="30" stroke="#${accentColor}" stroke-width="1.5"/>
    <text x="26" y="24" class="t" fill="#${titleColor}">Pull Requests</text>
  </g>
  <g transform="translate(${pad},38)">
    <text x="0" y="0" class="s" fill="#${accentColor}">Merged: ${mergedPRs}</text>
    <text x="130" y="0" class="s" fill="#${accentColor}">Closed: ${closedPRs}</text>
    <text x="260" y="0" class="s" fill="#3fb950">Open: ${openPRs}</text>
  </g>
  <line x1="${pad}" y1="${hdr - 4}" x2="${cardWidth - pad}" y2="${hdr - 4}" stroke="#30363d" stroke-width=".5"/>
  ${rows}
</svg>`;
}

function generatePRSummarySVG(options) {
  const { totalPRs, mergedPRs = 0, closedPRs = 0, openPRs = 0, colors, hideBorder, cardWidth = 380, cardHeight = 120 } = options;
  const P = 16;
  const hba = hideBorder ? `rx="8"` : `rx="8" stroke="#30363d" stroke-width="1"`;
  const sw = (cardWidth - P * 2 - 16) / 3;

  const accentColor = colors.accent_color || "58a6ff";
  const titleColor = colors.title_color || "58a6ff";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}">
  <style>.t{font:600 12px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}.n{font:700 28px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}.l{font:400 10px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}</style>
  <rect width="${cardWidth}" height="${cardHeight}" fill="#0d1117" ${hba}/>
  <rect width="${cardWidth}" height="2" fill="#${accentColor}" rx="8"/>
  <circle cx="${P + 6}" cy="18" r="4" fill="#${accentColor}" opacity=".2"/><circle cx="${P + 6}" cy="18" r="2" fill="#${accentColor}"/>
  <text x="${P + 14}" y="22" class="t" fill="#${titleColor}">Pull Requests</text>
  <line x1="${P}" y1="32" x2="${cardWidth - P}" y2="32" stroke="#30363d" stroke-width=".5"/>
  <g transform="translate(${P}, 42)"><rect width="${sw}" height="62" rx="6" fill="#${accentColor}" opacity=".06"/><text x="${sw / 2}" y="32" text-anchor="middle" class="n" fill="#${accentColor}">${mergedPRs}</text><text x="${sw / 2}" y="48" text-anchor="middle" class="l" fill="#8b949e">Merged</text></g>
  <g transform="translate(${P + sw + 8}, 42)"><rect width="${sw}" height="62" rx="6" fill="#${accentColor}" opacity=".04"/><text x="${sw / 2}" y="32" text-anchor="middle" class="n" fill="#${accentColor}">${totalPRs}</text><text x="${sw / 2}" y="48" text-anchor="middle" class="l" fill="#8b949e">Total</text></g>
  <g transform="translate(${P + (sw + 8) * 2}, 42)"><rect width="${sw}" height="62" rx="6" fill="#3fb950" opacity=".04"/><text x="${sw / 2}" y="32" text-anchor="middle" class="n" fill="#3fb950">${openPRs}</text><text x="${sw / 2}" y="48" text-anchor="middle" class="l" fill="#8b949e">Open</text></g>
</svg>`;
}

module.exports = { generatePRCardSVG, generatePRSummarySVG, escapeXml };
