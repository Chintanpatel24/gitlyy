/**
 * Working Hours Card SVG generation
 * Calculates estimated working hours based on GitHub activity
 */

function generateWorkingHoursSVG(options) {
  const {
    username,
    totalHours = 0,
    joinedDate = new Date(),
    activeContributions = 0,
    activeDays = 0,
    colors,
    hideBorder,
    cardWidth = 400,
  } = options;

  const cardHeight = 140;
  const hba = hideBorder ? `rx="8"` : `rx="8" stroke="#30363d" stroke-width="1"`;
  const P = 24;
  const accentColor = (colors && colors.accent_color) || "58a6ff";
  const titleColor = (colors && colors.title_color) || "58a6ff";

  // Format the number with proper separators
  const formattedHours = Math.round(totalHours).toLocaleString();
  
  // Convert hours to days and years for context
  const totalDays = Math.round(totalHours / 8); // Assuming 8 hour workday
  const totalYears = (totalHours / (8 * 365)).toFixed(1);

  // Get years since joining
  const joinedTime = new Date(joinedDate);
  const now = new Date();
  const yearsSinceJoined = ((now - joinedTime) / (1000 * 60 * 60 * 24 * 365)).toFixed(1);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}">
  <style>
    .header{font:600 14px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
    .hours{font:700 56px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
    .label{font:400 11px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
    .stat{font:500 10px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
  </style>
  
  <defs>
    <linearGradient id="hoursGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#${accentColor};stop-opacity:0.1" />
      <stop offset="100%" style="stop-color:#${accentColor};stop-opacity:0" />
    </linearGradient>
  </defs>

  <!-- Main card -->
  <rect width="${cardWidth}" height="${cardHeight}" fill="#0d1117" ${hba}/>
  <rect width="${cardWidth}" height="3" fill="#${accentColor}" rx="8"/>
  
  <!-- Header gradient -->
  <rect y="3" width="${cardWidth}" height="40" fill="url(#hoursGrad)"/>
  
  <!-- Timeline icon + Header -->
  <g transform="translate(${P},12)">
    <line x1="3" y1="2" x2="3" y2="12" stroke="#${accentColor}" stroke-width="1.5" stroke-linecap="round"/>
    <circle cx="3" cy="2" r="2.5" fill="#${accentColor}"/>
    <circle cx="3" cy="12" r="2.5" fill="#${accentColor}" opacity=".5"/>
    <line x1="8" y1="7" x2="13" y2="7" stroke="#${accentColor}" stroke-width="1.5" stroke-linecap="round"/>
    <text x="20" y="16" class="header" fill="#${titleColor}">Coding Hours</text>
  </g>
  
  <!-- Hours count -->
  <text x="${cardWidth / 2}" y="95" text-anchor="middle" class="hours" fill="#${accentColor}">${formattedHours}</text>
  
  <!-- Divider -->
  <line x1="${P}" y1="${cardHeight - 32}" x2="${cardWidth - P}" y2="${cardHeight - 32}" stroke="#30363d" stroke-width=".5"/>
  
  <!-- Stats row -->
  <text x="${P}" y="${cardHeight - 15}" class="stat" fill="#${accentColor}">≈ ${totalDays} days</text>
  <text x="${cardWidth / 2}" y="${cardHeight - 15}" text-anchor="middle" class="stat" fill="#${accentColor}">≈ ${totalYears}y work</text>
  <text x="${cardWidth - P}" y="${cardHeight - 15}" text-anchor="end" class="stat" fill="#8b949e">Since ${yearsSinceJoined}y ago</text>
</svg>`;
}

function escapeXml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

module.exports = { generateWorkingHoursSVG, escapeXml };
