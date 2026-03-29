// @ts-check

export default async (req, res) => {
  // Base API info endpoint
  res.setHeader("Content-Type", "application/json");

  const info = {
    name: "GitHub Readme Cards",
    version: "1.0.0",
    description: "Generate dynamic GitHub stats cards for your README",
    endpoints: {
      pull_requests: {
        url: "/api/pull-requests",
        description: "Display pull requests grouped by repository",
        parameters: {
          username: "GitHub username (required)",
          theme: "Card theme (default, synthwave, dracula, nord, etc.)",
          title_color: "Title color in hex format",
          text_color: "Text color in hex format",
          bg_color: "Background color in hex format",
          border_color: "Border color in hex format",
          card_width: "Card width in pixels (default: 400)",
          hide_border: "Hide card border (true/false)",
          border_radius: "Border radius in pixels",
          custom_title: "Custom card title",
          cache_seconds: "Cache duration in seconds",
        },
        example: "https://your-deployment.vercel.app/api/pull-requests?username=octocat&theme=synthwave&hide_border=true",
      },
      contributions: {
        url: "/api/contributions",
        description: "Display GitHub contribution statistics with daily counts",
        parameters: {
          username: "GitHub username (required)",
          theme: "Card theme (default, synthwave, dracula, nord, etc.)",
          title_color: "Title color in hex format",
          text_color: "Text color in hex format",
          bg_color: "Background color in hex format",
          border_color: "Border color in hex format",
          card_width: "Card width in pixels (default: 850)",
          hide_border: "Hide card border (true/false)",
          border_radius: "Border radius in pixels",
          custom_title: "Custom card title",
          cache_seconds: "Cache duration in seconds",
        },
        example: "https://your-deployment.vercel.app/api/contributions?username=octocat&theme=synthwave&hide_border=true",
      },
    },
  };

  res.send(info);
};
