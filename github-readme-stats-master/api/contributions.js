// @ts-check

import { renderContributionsCard } from "../src/cards/contributions.js";
import { guardAccess } from "../src/common/access.js";
import {
  CACHE_TTL,
  resolveCacheSeconds,
  setCacheHeaders,
  setErrorCacheHeaders,
} from "../src/common/cache.js";
import {
  retrieveSecondaryMessage,
} from "../src/common/error.js";
import { parseBoolean } from "../src/common/ops.js";
import { renderError } from "../src/common/render.js";
import { fetchContributions } from "../src/fetchers/contributions.js";

// @ts-ignore
export default async (req, res) => {
  const {
    username,
    hide_border,
    title_color,
    text_color,
    bg_color,
    border_color,
    theme,
    cache_seconds,
    border_radius,
    card_width,
    custom_title,
    disable_animations,
  } = req.query;

  res.setHeader("Content-Type", "image/svg+xml");

  const access = guardAccess({
    res,
    id: username,
    type: "username",
    colors: {
      title_color,
      text_color,
      bg_color,
      border_color,
      theme,
    },
  });

  if (!access.isPassed) {
    return access.result;
  }

  try {
    const contribData = await fetchContributions(username);

    const cacheSeconds = resolveCacheSeconds({
      requested: parseInt(cache_seconds, 10),
      def: CACHE_TTL.CONTRIBUTIONS_CARD?.DEFAULT || 21600, // 6 hours
      min: CACHE_TTL.CONTRIBUTIONS_CARD?.MIN || 21600,
      max: CACHE_TTL.CONTRIBUTIONS_CARD?.MAX || 86400 * 30, // 30 days
    });

    setCacheHeaders(res, cacheSeconds);

    const card = renderContributionsCard(contribData, {
      title_color,
      text_color,
      bg_color,
      border_color,
      theme,
      hide_border: parseBoolean(hide_border),
      card_width: parseInt(card_width, 10) || 850,
      border_radius: parseInt(border_radius, 10),
      disable_animations: parseBoolean(disable_animations),
      custom_title,
    });

    return res.send(card);
  } catch (err) {
    setErrorCacheHeaders(res);
    const errorMessage = err instanceof Error ? err.message : null;
    const secondary = err instanceof Error ? retrieveSecondaryMessage(err) : null;
    const message =
      errorMessage ||
      secondary ||
      "Failed to fetch contributions";

    return res.send(
      renderError({
        message: "Something went wrong",
        secondaryMessage: message,
        renderOptions: {
          title_color,
          text_color,
          bg_color,
          border_color,
          theme,
        },
      }),
    );
  }
};
