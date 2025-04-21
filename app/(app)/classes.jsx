import { View, SafeAreaView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSupabase, useTheme } from "@/contexts";
import Swiper from "react-native-swiper";
import { getClasses } from "@/queries/classes";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Class } from "@/components/class";
import { Loader, Button, Text } from "@/components/common";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { MAX_CLASSES } from "@/constants/maxClass";
import { Ionicons } from "@expo/vector-icons";

export default function ClassPage() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { signOut } = useSupabase();
  const { data, isLoading } = useQuery({
    queryKey: ["classes"],
    queryFn: getClasses,
  });
  const [classes, setClasses] = useState(data ?? []);
  const { getThemeColor } = useTheme();

  useEffect(() => {
    if (data) {
      setClasses(data);
    }
  }, [data]);

  if (isLoading) {
    return (
      <View className="flex items-center justify-center w-full h-full bg-light-bg dark:bg-dark-bg">
        <Loader swapTheme />
      </View>
    );
  }

  return (
    <Swiper
      showsPagination={classes?.length > 0}
      loop={false}
      index={0}
      className="w-full h-full bg-light-bg dark:bg-dark-bg"
      dotColor={getThemeColor("#D0D0D0", "#444444")}
      activeDotColor={getThemeColor("#000000", "#FFFFFF")}
    >
      {[
        ...(classes || [])
          .filter((c) => !c.is_completed)
          .map((c) => <Class key={`class-${c.id}`} data={c} />),
        ,
        <AddClassSlide key="add-class-slide" numClasses={classes?.length} />,
      ]}
    </Swiper>
  );
}

function AddClassSlide({ numClasses }) {
  const router = useRouter();
  const { getThemeColor } = useTheme();

  return (
    <SafeAreaView className="flex items-center justify-center w-full h-full">
      {numClasses < MAX_CLASSES ? (
        <View className="flex items-center justify-between w-full h-4/5">
          <View></View>
          <View>
            <Text
              className={"text-3xl font-semibold text-center -translate-y-12"}
            >
              No Classes
            </Text>
            <Ionicons
              name="cloud-outline"
              size={200}
              className="text-center"
              color={getThemeColor("#D0D0D0", "#444444")}
            />
            <Text className={"text-xl font-light -mt-3 text-center"}>
              Tap the button below to add a class
            </Text>
            <Button
              withLoading={false}
              classNames="flex-row items-center justify-center gap-2 py-3 px-4 rounded-md bg-dark-bg dark:bg-light-bg self-center"
              width="w-8/12"
              marginTop="mt-6"
              textClassName={"text-lg font-bold"}
              text={"Add Class"}
              Icon={
                <FontAwesome6
                  name="add"
                  size={20}
                  color={getThemeColor("#FFFFFF", "#000000")}
                />
              }
              onPress={() => {
                router.push("/add-class");
              }}
            />
          </View>
          <View></View>
        </View>
      ) : (
        <View className="flex items-center justify-center w-full h-full gap-2">
          <Text className="text-2xl font-bold">Max classes reached</Text>
          <Text className="font-medium text-md">
            You can only have {MAX_CLASSES} active classes
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}
