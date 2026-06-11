/**
 * Utility to send SVG response or an HTML wrapper based on the Accept header.
 */

function sendResponse(req, res, svg, status = 200) {
  const accept = req.headers.accept || "";

  if (accept.includes("text/html")) {
    res.setHeader("Content-Type", "text/html");
    res.setHeader("Vary", "Accept");
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
    res.setHeader("Vary", "Accept");
    res.status(status).send(svg);
  }
}

module.exports = { sendResponse };
