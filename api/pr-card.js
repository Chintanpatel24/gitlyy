const { generatePRCard } = require("../lib/pr-card");
const { fetchUserPRs } = require("../lib/github");

module.exports = async (req, res) => {
  const username = (req.query.username || "").trim();

  if (!username) {
    res.setHeader("Content-Type", "image/svg+xml");
    return res.end(errorSVG("?username= is required"));
  }

  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "public, max-age=300, s-maxage=300");
  res.setHeader("Access-Control-Allow-Origin", "*");

  try {
    const prs = await fetchUserPRs(username);
    const svg = generatePRCard({ username, pullRequests: prs });
    res.end(svg);
  } catch (err) {
    const svg = generatePRCard({ username, pullRequests: [] });
    res.end(svg);
  }
};

function errorSVG(msg) {
  return `<svg width="495" height="80" xmlns="http://www.w3.org/2000/svg">
    <rect width="495" height="80" rx="8" fill="#0d1117" stroke="#f85149" stroke-width="1"/>
    <text x="16" y="34" font-family="system-ui" font-size="14" fill="#f85149">Error</text>
    <text x="16" y="56" font-family="system-ui" font-size="12" fill="#8b949e">${msg}</text>
  </svg>`;
}
