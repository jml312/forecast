import { View, Pressable, SafeAreaView, ScrollView } from "react-native";
import { Text, Switch } from "../common";
import { getWeatherIcon, capitalize, pluralize } from "@/utils";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@/contexts";
import { useRouter } from "expo-router";
import Assignment from "./Assignment";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Class({ data }) {
  const router = useRouter();
  const { getThemeColor } = useTheme();
  const [showAllAssignments, setShowAllAssignments] = useState(false);
  const insets = useSafeAreaInsets();

  const filteredAssignments =
    data?.assignments
      ?.filter((a) => (showAllAssignments ? true : !a.is_completed))
      ?.sort((a, b) => {
        // sort by is_completed with false first
        if (a.is_completed !== b.is_completed) {
          return a.is_completed ? 1 : -1;
        }
      }) || [];

  return (
    <View className={"flex h-full"}>
      <Pressable
        className="absolute z-10 items-center justify-center rounded-full w-14 h-14 bg-dark-bg bottom-2 right-2 dark:bg-light-bg"
        onPress={() =>
          router.push(
            `/add-assignment/?classId=${data.id}&classTitle=${capitalize(
              data.title
            )}`
          )
        }
      >
        <FontAwesome6
          name="plus"
          size={24}
          color={getThemeColor("#FFFFFF", "#000000")}
        />
      </Pressable>

      <View className="flex-1">
        <View
          // className="w-full h-[30%] items-center justify-center"
          // style={{ backgroundColor: data.accent_color.toLowerCase() }}
          style={{
            backgroundColor: data.accent_color.toLowerCase(),
            height: "30%",
            paddingTop: insets.top, // respect safe area
            position: "relative",
          }}
          className="w-full"
        >
          <Pressable
            className="absolute right-8"
            style={{ top: insets.top + 10 }} // 10px below the notch
            onPress={() => router.push("/all-classes")}
          >
            <FontAwesome6
              name="list"
              size={20}
              color={getThemeColor("#000000", "#FFFFFF")}
            />
          </Pressable>

          <View
            className="items-center justify-center flex-1 bg-re -z-10"
            style={{ marginTop: -insets.top + 10 }}
          >
            <Ionicons
              name={getWeatherIcon(data?.grade || false)}
              size={85}
              color={getThemeColor("#000000", "#FFFFFF")}
            />
          </View>

          {/* </SafeAreaView> */}
        </View>

        <View className="flex w-full gap-6 p-8 -mt-6 bg-light-bg dark:bg-dark-bg rounded-t-3xl">
          {/* Header */}
          <View className="flex gap-3">
            <View className="flex-row items-start justify-between w-full">
              <Text className="text-3xl font-bold">
                {capitalize(data.title)}
              </Text>
              <Pressable
                className="flex-row items-center justify-center gap-2"
                onPress={() =>
                  router.push(
                    `/edit-class?id=${data.id}&title=${data.title}&semester=${data.semester}&satisfactionRanges=${data.satisfaction_ranges}&grade=${data.grade}&accentColor=${data.accent_color}&isCompleted=${data.is_completed}`
                  )
                }
              >
                <FontAwesome6
                  name="edit"
                  // name="gear"
                  size={20}
                  color={getThemeColor("#000000", "#FFFFFF")}
                />
              </Pressable>
            </View>
            <Text className="text-[1.75rem] font-normal">
              {data?.grade ? `${data.grade}%` : "-"}
            </Text>
          </View>

          {/* Assignments */}
          <View className="-mt-0.5">
            <View className="flex-row items-center justify-between -mt-2">
              <Text className={"font-medium text-xl"}>Assignments</Text>
              <Switch
                className={""}
                scale={0.75}
                showValue
                value={showAllAssignments}
                onValueChange={() => setShowAllAssignments(!showAllAssignments)}
                onText={"All"}
                offText={"Upcoming"}
              />
            </View>
            {filteredAssignments.length > 0 && (
              <View className="mt-0.5 mb-1">
                <Text className="font-light text-md">
                  {filteredAssignments.length}{" "}
                  {pluralize("assignment", filteredAssignments.length)}
                </Text>
              </View>
            )}
            {filteredAssignments.length > 0 ? (
              <ScrollView
                className="mt-3 min-h-[70%] max-h-[70%]"
                contentContainerStyle={{
                  gap: 6,
                  paddingBottom: 14,
                }}
                showsVerticalScrollIndicator={false}
              >
                {filteredAssignments.map((assignment) => (
                  <Assignment
                    key={assignment.id}
                    data={assignment}
                    accentColor={data.accent_color.toLowerCase()}
                  />
                ))}
              </ScrollView>
            ) : (
              <View className="flex items-center justify-center w-full h-1/2">
                <Text className="text-lg font-light text-center">
                  No assignments
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}
