/**
 * SVG generation for Issues Stats card.
 * Compact "lite small" layout showing Total Issues, Open, and Closed.
 */

function generateIssuesSVG(options) {
  const { totalIssues = 0, openIssues = 0, closedIssues = 0, colors, hideBorder, cardWidth = 380, cardHeight = 120 } = options;
  const P = 16;
  const hba = hideBorder ? `rx="8"` : `rx="8" stroke="#30363d" stroke-width="1"`;
  const sw = (cardWidth - P * 2 - 16) / 3;

  // Use red/pink color for issues
  const issueColor = "f85149";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}">
  <style>.t{font:600 12px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}.n{font:700 28px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}.l{font:400 10px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}</style>
  <rect width="${cardWidth}" height="${cardHeight}" fill="#0d1117" ${hba}/>
  <rect width="${cardWidth}" height="2" fill="#${issueColor}" rx="8"/>
  <circle cx="${P + 6}" cy="18" r="4" fill="#${issueColor}" opacity=".2"/><circle cx="${P + 6}" cy="18" r="2" fill="#${issueColor}"/>
  <text x="${P + 14}" y="22" class="t" fill="#${colors.title_color}">Issues</text>
  <line x1="${P}" y1="32" x2="${cardWidth - P}" y2="32" stroke="#30363d" stroke-width=".5"/>
  <g transform="translate(${P}, 42)"><rect width="${sw}" height="62" rx="6" fill="#${issueColor}" opacity=".04"/><text x="${sw / 2}" y="32" text-anchor="middle" class="n" fill="#${issueColor}">${openIssues}</text><text x="${sw / 2}" y="48" text-anchor="middle" class="l" fill="#8b949e">Open</text></g>
  <g transform="translate(${P + sw + 8}, 42)"><rect width="${sw}" height="62" rx="6" fill="#${issueColor}" opacity=".06"/><text x="${sw / 2}" y="32" text-anchor="middle" class="n" fill="#${issueColor}">${totalIssues}</text><text x="${sw / 2}" y="48" text-anchor="middle" class="l" fill="#8b949e">Total</text></g>
  <g transform="translate(${P + (sw + 8) * 2}, 42)"><rect width="${sw}" height="62" rx="6" fill="#e6edf3" opacity=".04"/><text x="${sw / 2}" y="32" text-anchor="middle" class="n" fill="#e6edf3">${closedIssues}</text><text x="${sw / 2}" y="48" text-anchor="middle" class="l" fill="#8b949e">Closed</text></g>
</svg>`;
}

module.exports = { generateIssuesSVG };
