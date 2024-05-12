import { Slot } from "expo-router";
import "../global.css";
import { SupabaseProvider } from "@/contexts/supabase";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SupabaseProvider>
      <SafeAreaProvider>
        <Slot />
      </SafeAreaProvider>
    </SupabaseProvider>
  );
}
