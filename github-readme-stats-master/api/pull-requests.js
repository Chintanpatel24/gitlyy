// @ts-check

import { renderPRCard } from "../src/cards/pull-requests.js";
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
import { fetchPullRequests } from "../src/fetchers/pull-requests.js";

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
    const prData = await fetchPullRequests(username);

    const cacheSeconds = resolveCacheSeconds({
      requested: parseInt(cache_seconds, 10),
      def: CACHE_TTL.PULL_REQUESTS_CARD?.DEFAULT || 21600, // 6 hours
      min: CACHE_TTL.PULL_REQUESTS_CARD?.MIN || 21600,
      max: CACHE_TTL.PULL_REQUESTS_CARD?.MAX || 86400 * 30, // 30 days
    });

    setCacheHeaders(res, cacheSeconds);

    const card = renderPRCard(prData, {
      title_color,
      text_color,
      bg_color,
      border_color,
      theme,
      hide_border: parseBoolean(hide_border),
      card_width: parseInt(card_width, 10) || 400,
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
      "Failed to fetch pull requests";

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
