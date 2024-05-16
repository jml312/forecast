import { Text, View, Button, Pressable } from "react-native";
import { useEffect } from "react";
import { Link, useRouter } from "expo-router";
import { useSupabase } from "@/contexts/supabase";
import PagerView from "react-native-pager-view";

export default function HomePage() {
  const router = useRouter();
  const { user, signOut, isAuthenticated } = useSupabase();

  return (
    <View className="flex items-center justify-center h-full ">
      <Text className="">Home Page</Text>
      <Link href="/add-class">Add Class</Link>
      <Pressable
        onPress={() => {
          signOut();
          router.push("/sign-in");
        }}
      >
        <Text>Sign Out</Text>
      </Pressable>
    </View>
  );
}
