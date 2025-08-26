import { supabase } from "@/lib/supabase";

const twitchClientId = import.meta.env.TWITCH_CLIENT_ID as string;
const twitchClientSecret = import.meta.env.TWITCH_CLIENT_SECRET as string;
const broadcasterId = import.meta.env.TWITCH_BROADCASTER_ID as string;

type CheckResult = {
  isSubscribed: boolean;
  subscription: any | null;
  status: number;
  raw?: any;
  error?: string;
};

export async function checkUserSubscriptionByTwitchId(
  request: Request
): Promise<CheckResult> {
  const queryToken = request.url.split("?")[1]?.split("=")[1];
  const authHeader = request.headers.get("Authorization");
  if (!authHeader && !queryToken) {
    return {
      isSubscribed: false,
      subscription: null,
      status: 401,
      error: "Unauthorized",
    };
  }

  const token = authHeader?.split(" ")[1] || queryToken;
  const { data: userData, error: userError } = await supabase.auth.getUser(
    token
  );

  if (userError || !userData.user) {
    return {
      isSubscribed: false,
      subscription: null,
      status: 401,
      error: "Invalid token or user not found",
    };
  }

  const twitchUserId = userData.user.user_metadata?.provider_id;
  if (!twitchUserId) {
    return {
      isSubscribed: false,
      subscription: null,
      status: 400,
      error: "Twitch user ID not found in user metadata",
    };
  }

  const appAccessToken = await getTwitchAppAccessToken();
  if (!appAccessToken) {
    return {
      isSubscribed: false,
      subscription: null,
      status: 500,
      error: "Could not retrieve Twitch API token",
    };
  }

  const subscriptionCheckUrl = `https://api.twitch.tv/helix/subscriptions/user?broadcaster_id=${broadcasterId}&user_id=${twitchUserId}`;

  try {
    const twitchResponse = await fetch(subscriptionCheckUrl, {
      headers: {
        "Client-ID": twitchClientId,
        Authorization: `Bearer ${appAccessToken}`,
      },
    });

    if (twitchResponse.status === 200) {
      const subscriptionData = await twitchResponse.json();
      return {
        isSubscribed: true,
        subscription: subscriptionData.data[0],
        status: 200,
      };
    }

    if (twitchResponse.status === 404) {
      return {
        isSubscribed: false,
        subscription: null,
        status: 200,
      };
    }

    const errorBody = await twitchResponse.text();
    return {
      isSubscribed: false,
      subscription: null,
      status: twitchResponse.status,
      error: errorBody,
    };
  } catch (error) {
    return {
      isSubscribed: false,
      subscription: null,
      status: 500,
      error: "An unexpected error occurred",
    };
  }
}

export async function getTwitchAppAccessToken() {
  const tokenUrl = `https://id.twitch.tv/oauth2/token?client_id=${twitchClientId}&client_secret=${twitchClientSecret}&grant_type=client_credentials`;

  try {
    const response = await fetch(tokenUrl, { method: "POST" });
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Failed to get Twitch App Access Token:", error);
    return null;
  }
}
