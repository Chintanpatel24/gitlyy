/**
 * Vercel serverless function: Language Usage Card
 * GET /api/languages?username=xxx&hide_border=true&layout=compact
 *
 * GitHub data cached for 40 minutes.
 */

const { fetchUserLanguages } = require("../src/github");
const { getTheme, applyColorOverrides } = require("../src/themes");
const { generateLanguageSVG, generateLanguageCompactSVG } = require("../src/svg-language");
const { getCache, setCache } = require("../src/cache");

const CACHE_TTL = 40 * 60 * 1000;

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "public, max-age=2400, s-maxage=2400, stale-while-revalidate=600");

  const { username, theme, hide_border, layout, max_langs, bg_color, title_color, text_color, border_color } = req.query;

  if (!username) {
    res.status(400).send(generateErrorSVG("Missing 'username' parameter"));
    return;
  }

  try {
    const cacheKey = `langs:${username}`;
    let langData = getCache(cacheKey);

    if (!langData) {
      langData = await fetchUserLanguages(username);
      setCache(cacheKey, langData, CACHE_TTL);
    }

    let colors = getTheme(theme);
    colors = applyColorOverrides(colors, { bg_color, title_color, text_color, border_color });

    const options = {
      username,
      languages: langData.languages,
      totalBytes: langData.totalBytes,
      colors,
      hideBorder: hide_border === "true",
      maxLangs: parseInt(max_langs) || 12,
    };

    let svg;
    if (layout === "compact") {
      svg = generateLanguageCompactSVG(options);
    } else {
      svg = generateLanguageSVG(options);
    }

    res.status(200).send(svg);
  } catch (error) {
    console.error("Language Error:", error.message);
    res.status(500).send(generateErrorSVG("Failed to fetch language data"));
  }
};

function generateErrorSVG(message) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="380" height="100" viewBox="0 0 380 100">
    <rect x="0" y="0" width="380" height="100" fill="#0d1117" rx="8" stroke="#30363d" stroke-width="1"/>
    <text x="190" y="55" text-anchor="middle" font-family="'Segoe UI', Ubuntu, sans-serif" font-size="14" fill="#f85149">${message}</text>
  </svg>`;
}
