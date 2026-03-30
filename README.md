# Gitly - Custom GitHub Stats Cards

Embeddable SVG cards for your GitHub README. Real contribution data. No auth required.

**Live:** `https://gitlyy.vercel.app`

---

## Copy & Paste - Just Change `username`

### Pull Request Stats (Compact)

```
<img src="https://gitlyy.vercel.app/api/pr-stats?username=YOUR_USERNAME&layout=compact&hide_border=true"/>
```

<img src="https://gitlyy.vercel.app/api/pr-stats?username=torvalds&layout=compact&hide_border=true"/>

### Pull Request Stats (Full)

```
<img src="https://gitlyy.vercel.app/api/pr-stats?username=YOUR_USERNAME&hide_border=true"/>
```

<img src="https://gitlyy.vercel.app/api/pr-stats?username=torvalds&hide_border=true"/>

### Contribution Numbers (Grid)

```
<img src="https://gitlyy.vercel.app/api/contribution?username=YOUR_USERNAME&hide_border=true"/>
```

<img src="https://gitlyy.vercel.app/api/contribution?username=torvalds&hide_border=true"/>

### Contribution Numbers (Compact)

```
<img src="https://gitlyy.vercel.app/api/contribution?username=YOUR_USERNAME&layout=compact&hide_border=true"/>
```

<img src="https://gitlyy.vercel.app/api/contribution?username=torvalds&layout=compact&hide_border=true"/>

---

## Example - Paste This in Your README

```markdown
## My GitHub Stats

<img src="https://gitlyy.vercel.app/api/pr-stats?username=YOUR_USERNAME&layout=compact&hide_border=true"/>

<img src="https://gitlyy.vercel.app/api/contribution?username=YOUR_USERNAME&hide_border=true"/>
```

**Just replace `YOUR_USERNAME` with your GitHub username.** That's it.

---

## Themes

Add `&theme=THEME_NAME` to any card URL.

`dark` `synthwave` `radical` `tokyonight` `dracula` `gruvbox` `monokai` `nord` `solarized_dark` `catppuccin` `github_dark` `highcontrast`

```
<img src="https://gitlyy.vercel.app/api/pr-stats?username=YOUR_USERNAME&layout=compact&theme=synthwave&hide_border=true"/>
```

---

## Custom Colors

Override any color with hex (without `#`):

```
<img src="https://gitlyy.vercel.app/api/pr-stats?username=YOUR_USERNAME&layout=compact&bg_color=010409&title_color=58a6ff&text_color=e6edf3&hide_border=true"/>
```

---

## Parameters

| Param | Description | Example |
|-------|-------------|---------|
| `username` | GitHub username (required) | `torvalds` |
| `theme` | Color theme | `dark` |
| `hide_border` | Hide border | `true` |
| `layout` | `compact` for summary | `compact` |
| `bg_color` | Background color | `010409` |
| `title_color` | Title color | `58a6ff` |
| `text_color` | Text color | `e6edf3` |
| `border_color` | Border color | `30363d` |

---

## How It Works

- Anyone can use `https://gitlyy.vercel.app` - no setup needed
- Each user's data is cached separately for 40 minutes
- No authentication required for readers or embedders
- Works with unlimited users simultaneously

---

## Self-Host (Optional)

1. Fork this repo
2. Import at [vercel.com](https://vercel.com) (free)
3. Click Deploy
4. Use your own URL instead of `gitlyy.vercel.app`

---

## License

MIT
