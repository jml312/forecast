import * as WebBrowser from "expo-web-browser";
import Constants from "expo-constants";

export function extractParamsFromUrl(url) {
  const params = new URLSearchParams(url.split("#")[1]);
  const data = {
    access_token: params.get("access_token"),
    refresh_token: params.get("refresh_token"),
  };
  return data;
}

export async function onSignInWithOauth({
  provider,
  getOAuthUrl,
  setLoading,
  setIsAuthLoading,
  setIsAuthenticated,
  setSupabaseUser,
  setSession,
  router,
}) {
  setLoading(true);
  setIsAuthLoading(true);

  const url = await getOAuthUrl(provider);
  const redirectUrl = `${Constants.expoConfig.scheme}:///`;
  const result = await WebBrowser.openAuthSessionAsync(url, redirectUrl, {
    showInRecents: true,
  });

  if (result.type === "success") {
    const { access_token, refresh_token } = extractParamsFromUrl(result.url);
    await setSession({
      access_token,
      refresh_token,
    });
    setIsAuthenticated(true);
    setSupabaseUser(access_token);
    router.push("/");
  }
  setLoading(false);
  setIsAuthLoading(false);
}
