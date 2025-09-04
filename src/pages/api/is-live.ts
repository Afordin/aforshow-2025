// src/pages/api/is-live.ts
import type { APIRoute } from "astro";

const CLIENT_ID = import.meta.env.TWITCH_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.TWITCH_CLIENT_SECRET;
const BROADCASTER_ID = import.meta.env.TWITCH_BROADCASTER_ID;

async function getAppAccessToken() {
  const response = await fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`,
  });

  if (!response.ok) {
    throw new Error("Failed to get Twitch access token");
  }

  const data = await response.json();
  return data.access_token;
}

export const GET: APIRoute = async () => {
  if (!CLIENT_ID || !CLIENT_SECRET || !BROADCASTER_ID) {
    return new Response(
      JSON.stringify({
        error: "Twitch API credentials or Broadcaster ID are not configured.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const accessToken = await getAppAccessToken();

    const response = await fetch(
      `https://api.twitch.tv/helix/streams?user_id=${BROADCASTER_ID}`,
      {
        headers: {
          "Client-ID": CLIENT_ID,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Twitch API responded with status ${response.status}`);
    }

    const data = await response.json();

    const isLive = data.data && data.data.length > 0;
    console.log({ isLive, data: data.data });

    const streamData = isLive
      ? {
          title: data.data[0].title,
          game_name: data.data[0].game_name,
          viewer_count: data.data[0].viewer_count,
          started_at: data.data[0].started_at,
          user_name: data.data[0].user_name,
        }
      : null;

    return new Response(
      JSON.stringify({
        isLive: isLive,
        channelId: BROADCASTER_ID,
        streamData: streamData,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control":
            "public, max-age=60, s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch stream status." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
