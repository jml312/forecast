import { View, SafeAreaView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTheme } from "@/contexts";
import Swiper from "react-native-swiper";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Class } from "@/components/class";
import { Button, Text } from "@/components/common";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Ionicons } from "@expo/vector-icons";

export default function ClassPage() {
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData(["classes"]) || [];
  const [classes, setClasses] = useState(data ?? []);
  const { getThemeColor } = useTheme();
  const { classNumber } = useLocalSearchParams();
  const slideIndex = parseInt(classNumber) || 0;

  useEffect(() => {
    if (data) {
      setClasses(data);
    }
  }, [data]);

  return (
    <Swiper
      showsPagination={classes?.length > 0}
      loop={false}
      index={slideIndex}
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

function AddClassSlide() {
  const router = useRouter();
  const { getThemeColor } = useTheme();

  return (
    <SafeAreaView className="flex items-center justify-center w-full h-full">
      <View className="flex items-center justify-center w-full h-full">
        <View>
          <Ionicons
            name="cloud-outline"
            size={200}
            className="text-center"
            color={getThemeColor("#D0D0D0", "#444444")}
          />
          <Text className={"text-xl font-light -mt-2.5 text-center"}>
            Tap the button below to add a class
          </Text>
          <Button
            withLoading={false}
            classNames="flex-row items-center justify-center gap-2 py-3 px-4 rounded-md bg-dark-bg dark:bg-light-bg self-center"
            width="w-8/12"
            marginTop="mt-4"
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
      </View>
    </SafeAreaView>
  );
}
