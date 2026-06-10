/**
 * Music Player Card
 * GET /api/music?username=xxx&track_id=xxx&title=xxx&artist=xxx&player=90s
 */

const { getTheme, applyColorOverrides } = require("../src/themes");
const { generateMusicSVG } = require("../src/svg-music");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600, stale-while-revalidate=1800");

  const {
    username,
    theme,
    hide_border,
    bg_color,
    title_color,
    text_color,
    border_color,
    track_id,
    title,
    artist,
    player,
    gif_url
  } = req.query;

  // username is not strictly required for this card as it's purely decorative/user-defined music,
  // but we keep it for consistency with other endpoints if needed.

  try {
    let colors = getTheme(theme);
    colors = applyColorOverrides(colors, { bg_color, title_color, text_color, border_color });

    const svg = generateMusicSVG({
      player: player || "90s",
      title: title || "Not Playing",
      artist: artist || "Unknown Artist",
      track_id: track_id || "",
      gif_url: gif_url || "",
      colors,
      hideBorder: hide_border === "true",
    });

    res.status(200).send(svg);
  } catch (error) {
    console.error("Music Card Error:", error.message);
    res.status(200).send(errorSVG("Failed to load music card"));
  }
};

function errorSVG(msg) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="120" viewBox="0 0 400 120">
    <rect width="400" height="120" fill="#0d1117" rx="8"/>
    <text x="200" y="65" text-anchor="middle" font-family="-apple-system,sans-serif" font-size="13" fill="#f85149">${msg}</text>
  </svg>`;
}
