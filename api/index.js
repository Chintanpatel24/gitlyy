module.exports = (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.end(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>GitHub Cards</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:system-ui,-apple-system,sans-serif;background:#0d1117;color:#e6edf3;padding:48px 24px;max-width:760px;margin:0 auto}
  h1{font-size:22px;font-weight:700;margin-bottom:6px}
  .sub{color:#8b949e;font-size:13px;margin-bottom:36px}
  h2{font-size:15px;font-weight:600;color:#e6edf3;margin:32px 0 10px;border-bottom:1px solid #21262d;padding-bottom:6px}
  .box{background:#161b22;border:1px solid #30363d;border-radius:8px;padding:14px 18px;margin-bottom:10px;font-family:monospace;font-size:12px;color:#58a6ff;word-break:break-all;line-height:1.9}
  p{color:#8b949e;font-size:13px;line-height:1.6;margin-bottom:8px}
</style>
</head>
<body>
<h1>GitHub Cards API</h1>
<p class="sub">Drop-in SVG cards for any GitHub README — just change the username.</p>

<h2>Pull Request Card</h2>
<div class="box">/api/pr-card?username=YOUR_USERNAME</div>

<h2>Commit Heatmap Card</h2>
<div class="box">/api/contrib-card?username=YOUR_USERNAME</div>

<h2>Paste in your README.md</h2>
<div class="box">
&lt;img src="https://gitly-iota.vercel.app/api/pr-card?username=YOUR_USERNAME" /&gt;<br>
&lt;img src="https://gitly-iota.vercel.app/api/contrib-card?username=YOUR_USERNAME" /&gt;
</div>
</body>
</html>`);
};
