/**
 * Streak Card SVG generation
 * Redesigned layout: Left = Total Commits, Center = Current Streak, Right = Total Contributions
 * Bottom shows Longest Streak for reference
 */

function generateStreakSVG(options) {
  const { currentStreak = 0, longestStreak = 0, totalContributions = 0, totalCommits = 0, colors, hideBorder } = options;

  const W = 460, H = 180, P = 24;
  const hba = hideBorder ? `rx="8"` : `rx="8" stroke="#30363d" stroke-width="1"`;

  const accentColor = (colors && colors.accent_color) || "58a6ff";
  const sw = (W - P * 2 - 24) / 3;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <style>.t{font:600 14px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}.n{font:700 42px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}.l{font:400 11px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}.m{font:700 20px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}.s{font:600 10px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}</style>
  <rect width="${W}" height="${H}" fill="#0d1117" ${hba}/>
  <rect width="${W}" height="3" fill="#${accentColor}" rx="8"/>
  <circle cx="${P + 6}" cy="22" r="5" fill="#${accentColor}" opacity=".2"/><circle cx="${P + 6}" cy="22" r="2.5" fill="#${accentColor}"/>
  <text x="${P + 16}" y="26" class="t" fill="#e6edf3">Streak & Contributions</text>
  <line x1="${P}" y1="40" x2="${W - P}" y2="40" stroke="#30363d" stroke-width=".5"/>
  <g transform="translate(${P},50)"><rect width="${sw}" height="78" rx="8" fill="#${accentColor}" opacity=".06"/><text x="${sw / 2}" y="42" text-anchor="middle" class="n" fill="#${accentColor}">${totalCommits.toLocaleString()}</text><text x="${sw / 2}" y="62" text-anchor="middle" class="l" fill="#8b949e">Total Commits</text></g>
  <g transform="translate(${P + sw + 12},50)"><rect width="${sw}" height="78" rx="8" fill="#39d353" opacity=".06"/><text x="${sw / 2}" y="42" text-anchor="middle" class="n" fill="#39d353">${currentStreak}</text><text x="${sw / 2}" y="62" text-anchor="middle" class="l" fill="#8b949e">Current Streak</text></g>
  <g transform="translate(${P + (sw + 12) * 2},50)"><rect width="${sw}" height="78" rx="8" fill="#e6edf3" opacity=".04"/><text x="${sw / 2}" y="42" text-anchor="middle" class="n" fill="#e6edf3">${totalContributions.toLocaleString()}</text><text x="${sw / 2}" y="62" text-anchor="middle" class="l" fill="#8b949e">Total Contributions</text></g>
  <line x1="${P}" y1="136" x2="${W - P}" y2="136" stroke="#30363d" stroke-width=".5"/>
  <g transform="translate(${P},144)">
    <text x="0" y="0" class="s" fill="#8b949e">🔥 Longest Streak: </text><text x="130" y="0" class="m" fill="#${accentColor}">${longestStreak}</text>
  </g>
</svg>`;
}

module.exports = { generateStreakSVG };
