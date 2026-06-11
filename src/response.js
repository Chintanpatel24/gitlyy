/**
 * Utility to send SVG response or an HTML wrapper based on the request context.
 */

function sendResponse(req, res, svg, status = 200) {
  const accept = req.headers.accept || "";
  const userAgent = req.headers["user-agent"] || "";
  const secFetchDest = req.headers["sec-fetch-dest"] || "";
  const { format } = req.query || {};

  // Force SVG if format=svg is requested
  if (format === "svg") {
    res.setHeader("Content-Type", "image/svg+xml");
    res.status(status).send(svg);
    return;
  }

  // Detect if the request is from GitHub's proxy (Camo)
  // GitHub Camo uses "github-camo" in the user agent.
  const isGithubCamo = userAgent.toLowerCase().includes("github-camo");

  // Modern browsers send sec-fetch-dest: image when loading <img> tags
  // and sec-fetch-dest: document when opening in a new tab.
  const isImageRequest = secFetchDest === "image" || (accept.includes("image/svg+xml") && !accept.includes("text/html"));

  // We serve HTML only if:
  // 1. It's NOT from GitHub Camo
  // 2. It's NOT an explicit image request from a browser
  // 3. The client explicitly accepts text/html (browser navigation)
  let serveHtml = !isGithubCamo && !isImageRequest && accept.includes("text/html");

  // Extra safety: if sec-fetch-dest is "document", it's definitely a browser navigation
  if (secFetchDest === "document") {
    serveHtml = true;
  }

  if (serveHtml) {
    res.setHeader("Content-Type", "text/html");
    res.setHeader("Vary", "Accept, Sec-Fetch-Dest");
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gitlyy Card</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: #0d1117;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            color: #c9d1d9;
        }
        .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
        }
        .footer {
            position: fixed;
            bottom: 24px;
            left: 24px;
            color: #8b949e;
            font-size: 14px;
        }
        .footer a {
            color: #58a6ff;
            text-decoration: none;
            font-weight: 600;
        }
        .footer a:hover {
            text-decoration: underline;
        }
        img {
            max-width: 100%;
            height: auto;
            filter: drop-shadow(0 10px 30px rgba(0,0,0,0.5));
        }
    </style>
</head>
<body>
    <div class="container">
        <img src="data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}" alt="Gitlyy card" />
    </div>
    <div class="footer">
        This is a <a href="https://github.com/Chintanpatel24/gitlyy" target="_blank">gitlyy</a> a readme stats generator.
    </div>
</body>
</html>`;
    res.status(status).send(html);
  } else {
    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Vary", "Accept, Sec-Fetch-Dest");
    res.status(status).send(svg);
  }
}

module.exports = { sendResponse };
