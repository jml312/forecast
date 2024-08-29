import { Text, View, Pressable } from "react-native";
import { Link, useRouter } from "expo-router";
import { useSupabase } from "@/contexts";
import Swiper from "react-native-swiper";
import { getClasses } from "@/queries/classes";
import { useQuery } from "@tanstack/react-query";

export default function HomePage() {
  const router = useRouter();
  const { user, signOut } = useSupabase();
  // const { data: classes, isLoading } = useQuery({
  //   queryKey: ["classes"],
  //   queryFn: getClasses,
  // });

  return (
    <Swiper
      // showsPagination={classes?.length > 0}
      loop={false}
      index={0}
      className="w-full h-full"
    >
      {/* {classes?.length > 0 &&
        classes.map((c) => (
          <View className="flex items-center justify-center w-full h-full bg-yellow-500">
            <Text>{JSON.stringify(c, null, 2)}</Text>
          </View>
        ))} */}
      <View className="flex items-center justify-center w-full h-full bg-green-500">
        <Link href="/add-class">
          <Text className="font-bold text-red-500">Add Class</Text>
        </Link>
        <Pressable
          onPress={() => {
            signOut();
            router.push("/sign-in");
          }}
          className="absolute w-auto bottom-8 right-8"
        >
          <Text className="font-bold text-red-500">Sign Out</Text>
        </Pressable>
      </View>
    </Swiper>
  );
}
