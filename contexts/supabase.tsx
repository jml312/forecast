import { createContext, useContext, useState } from "react";
import "core-js/stable/atob";
import { jwtDecode } from "jwt-decode";
import { getUserByEmail } from "@/queries/users";
import Constants from "expo-constants";
import { supabase } from "@/lib/supabase";

export const SupabaseContext = createContext({
  isAuthenticated: false,
  isAuthLoading: false,
  user: null,
  getOAuthUrl: async (provider) => "",
  setSession: async (tokens) => {},
  setIsAuthLoading: () => {},
  setIsAuthenticated: () => {},
  setSupabaseUser: async (accessToken) => {},
  signOut: async () => {},
});

export function useSupabase() {
  return useContext(SupabaseContext);
}

export const SupabaseProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [user, setUser] = useState(null);

  async function setSupabaseUser(accessToken) {
    const decodedToken = jwtDecode(accessToken);
    const { email } = decodedToken.user_metadata;

    const data = await getUserByEmail(email);

    if (data) {
      setUser(data);
    }
  }

  async function getOAuthUrl(provider) {
    const result = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${Constants.expoConfig.scheme}://`,
      },
    });

    return result.data.url;
  }

  async function setSession({ access_token, refresh_token }) {
    await supabase.auth.setSession({
      access_token,
      refresh_token,
    });
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
  }

  return (
    <SupabaseContext.Provider
      value={{
        isAuthenticated,
        isAuthLoading,
        setIsAuthLoading,
        user,
        getOAuthUrl,
        setSession,
        setIsAuthenticated,
        setSupabaseUser,
        signOut,
      }}
    >
      {children}
    </SupabaseContext.Provider>
  );
};
