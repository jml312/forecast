import { Text, View, Button, Pressable } from "react-native";
import { Link } from "expo-router";
import { useSupabase } from "@/contexts/supabase";
import PagerView from "react-native-pager-view";

export default function HomePage() {
  const { signOut } = useSupabase();

  return (
    <View className="flex items-center justify-center h-full ">
      <Text className="">Home Page</Text>
      <Link href="/add-class">Add Class</Link>
      <Pressable onPress={signOut}>
        <Text>Sign Out</Text>
      </Pressable>
    </View>
  );
}
