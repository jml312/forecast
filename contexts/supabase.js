import { createContext, useContext, useEffect, useState } from "react";
import "core-js/stable/atob";
import { jwtDecode } from "jwt-decode";
import { getUserByEmail, createUser } from "@/queries/users";
import Constants from "expo-constants";

import { supabase } from "@/lib/supabase";

export const SupabaseContext = createContext({
  isAuthenticated: false,
  user: null,
  getOAuthUrl: async () => "",
  setOAuthSession: async () => {},
  signOut: async () => {},
});

export function useSupabase() {
  return useContext(SupabaseContext);
}

export const SupabaseProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  async function getSupabaseUser(token) {
    const decodedToken = jwtDecode(token);
    const { email, name } = decodedToken.user_metadata;

    const data = await getUserByEmail(email);

    if (data) {
      setUser(data);
    } else {
      const { data: newUser } = await createUser({
        email,
        name,
      });

      setUser(newUser);
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        getSupabaseUser(data.session.access_token);
        setIsAuthenticated(true);
      }
    });

    supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("EVENT", event);
      if (event === "SIGNED_IN") {
        getSupabaseUser(session.access_token);
        setIsAuthenticated(true);
      } else if (event === "SIGNED_OUT") {
        // setUser(null);
        // setIsAuthenticated(false);
      }
    });
  }, []);

  async function getOAuthUrl(provider) {
    const result = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${Constants.expoConfig.scheme}://home/`,
      },
    });

    return result.data.url;
  }

  async function setOAuthSession(tokens) {
    const { data } = await supabase.auth.setSession({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    });

    await getSupabaseUser(tokens.access_token);

    setIsAuthenticated(data.session !== null);
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
        user,
        getOAuthUrl,
        setOAuthSession,
        signOut,
      }}
    >
      {children}
    </SupabaseContext.Provider>
  );
};
