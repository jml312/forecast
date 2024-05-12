import * as WebBrowser from "expo-web-browser";
import Constants from "expo-constants";

export function extractParamsFromUrl(url) {
  const params = new URLSearchParams(url.split("#")[1]);
  const data = {
    access_token: params.get("access_token"),
    expires_in: parseInt(params.get("expires_in") || "0"),
    refresh_token: params.get("refresh_token"),
    token_type: params.get("token_type"),
    provider_token: params.get("provider_token"),
  };
  return data;
}

export async function onSignInWithOauth({
  provider,
  getOAuthUrl,
  setLoading,
  setOAuthSession,
  router,
}) {
  setLoading(true);

  const url = await getOAuthUrl(provider);
  const redirectUrl = `${Constants.expoConfig.scheme}:///`;
  const result = await WebBrowser.openAuthSessionAsync(url, redirectUrl, {
    showInRecents: true,
  });

  if (result.type === "success") {
    const data = extractParamsFromUrl(result.url);
    setOAuthSession({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    });
    router.push("/");
  }

  setLoading(false);
}
