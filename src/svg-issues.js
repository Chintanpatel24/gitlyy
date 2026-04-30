/**
 * SVG generation for Issues Stats card.
 * Compact layout showing Total Issues, Open, and Closed.
 */

function generateIssuesSVG(options) {
  const { totalIssues = 0, openIssues = 0, closedIssues = 0, colors, hideBorder, cardWidth = 460, cardHeight = 165 } = options;
  const P = 24;
  const hba = hideBorder ? `rx="8"` : `rx="8" stroke="#30363d" stroke-width="1"`;
  const sw = (cardWidth - P * 2 - 24) / 3;

  // Use red/pink color for issues instead of blue
  const issueColor = "f85149";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}">
  <style>.t{font:600 14px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}.n{font:700 42px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}.l{font:400 11px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}</style>
  <rect width="${cardWidth}" height="${cardHeight}" fill="#0d1117" ${hba}/>
  <rect width="${cardWidth}" height="3" fill="#${issueColor}" rx="8"/>
  <circle cx="${P + 8}" cy="22" r="5" fill="#${issueColor}" opacity=".2"/><circle cx="${P + 8}" cy="22" r="2.5" fill="#${issueColor}"/>
  <text x="${P + 18}" y="26" class="t" fill="#${colors.title_color}">Issues</text>
  <line x1="${P}" y1="42" x2="${cardWidth - P}" y2="42" stroke="#30363d" stroke-width=".5"/>
  <g transform="translate(${P},52)"><rect width="${sw}" height="78" rx="8" fill="#${issueColor}" opacity=".06"/><text x="${sw / 2}" y="40" text-anchor="middle" class="n" fill="#${issueColor}">${totalIssues}</text><text x="${sw / 2}" y="58" text-anchor="middle" class="l" fill="#8b949e">Total Issues</text></g>
  <g transform="translate(${P + sw + 12},52)"><rect width="${sw}" height="78" rx="8" fill="#${issueColor}" opacity=".04"/><text x="${sw / 2}" y="40" text-anchor="middle" class="n" fill="#${issueColor}">${openIssues}</text><text x="${sw / 2}" y="58" text-anchor="middle" class="l" fill="#8b949e">Open</text></g>
  <g transform="translate(${P + (sw + 12) * 2},52)"><rect width="${sw}" height="78" rx="8" fill="#e6edf3" opacity=".04"/><text x="${sw / 2}" y="40" text-anchor="middle" class="n" fill="#e6edf3">${closedIssues}</text><text x="${sw / 2}" y="58" text-anchor="middle" class="l" fill="#8b949e">Closed</text></g>
</svg>`;
}

module.exports = { generateIssuesSVG };
