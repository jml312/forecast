import "../global.css";
import { SupabaseProvider, ThemeProvider } from "@/contexts";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/constants/toastConfig";
import { Stack } from "expo-router";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <SupabaseProvider>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <ThemeProvider>
            <Stack>
              {/* Tabbed app */}
              <Stack.Screen name="(app)" options={{ headerShown: false }} />

              {/* Modals */}
              <Stack.Screen
                name="add-class"
                options={{ presentation: "modal", headerShown: false }}
              />
              <Stack.Screen
                name="add-assignment"
                options={{ presentation: "modal", headerShown: false }}
              />
              <Stack.Screen
                name="all-classes"
                options={{ presentation: "modal", headerShown: false }}
              />
              <Stack.Screen
                name="class-settings"
                options={{ presentation: "modal", headerShown: false }}
              />

              {/* Auth screen */}
              <Stack.Screen name="sign-in" options={{ headerShown: false }} />
            </Stack>
            <Toast config={toastConfig} />
          </ThemeProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </SupabaseProvider>
  );
}
