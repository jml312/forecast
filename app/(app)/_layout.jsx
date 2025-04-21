import { Redirect, useRouter, Tabs } from "expo-router";
import { useSupabase } from "@/contexts";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/theme";

export default function ProtectedLayout() {
  const { getThemeColor } = useTheme();
  const router = useRouter();
  const { isAuthenticated, isAuthLoading } = useSupabase();

  // if (!isAuthLoading && !isAuthenticated) {
  //   return <Redirect href="/sign-in" />;
  // }

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: getThemeColor("#FFFFFF", "#000000"),
          borderTopWidth: 0.25,
          borderTopColor: getThemeColor("#000000", "#FFFFFF"),
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        tabBarActiveTintColor: getThemeColor("#3B82F6", "#60A5FA"),
        tabBarInactiveTintColor: getThemeColor("#000000", "#FFFFFF"),
        tabBarIcon: ({ color, size }) => {
          const icons = {
            index: "list-outline",
            classes: "cloud-outline",
            settings: "settings-outline",
          };
          return (
            <Ionicons name={icons[route.name]} size={size} color={color} />
          );
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Assignments" }} />
      <Tabs.Screen name="classes" options={{ title: "Classes" }} />
      <Tabs.Screen name="settings" options={{ title: "Settings" }} />
    </Tabs>
  );
}
