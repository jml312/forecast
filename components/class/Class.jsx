import { View, Pressable, SafeAreaView } from "react-native";
import { Text, Button } from "../common";
import { getWeatherIcon, capitalize, pluralize } from "@/utils";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@/contexts";
import { useRouter } from "expo-router";
import { format } from "date-fns";
import { assignmentTypeColors } from "@/constants/assignmentTypes";

export default function Class({ data }) {
  const router = useRouter();
  const { getThemeColor } = useTheme();

  return (
    <View className={"flex h-full"}>
      <View className="flex-1">
        <View className="w-full h-[30%] bg-[#fff4bc] items-center justify-center">
          <SafeAreaView className="items-center justify-center w-full h-auto">
            <Ionicons
              name={getWeatherIcon(data?.grade || false)}
              size={85}
              color={getThemeColor("#000000", "#FFFFFF")}
            />

            <Pressable
              className="absolute top-0 p-2 right-6"
              onPress={() => router.push("/all-classes")}
            >
              <FontAwesome6
                name="list"
                size={20}
                color={getThemeColor("#000000", "#FFFFFF")}
              />
            </Pressable>
          </SafeAreaView>
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
                onPress={() => router.push("/class-settings")}
              >
                <FontAwesome6
                  name="gear"
                  size={20}
                  color={getThemeColor("#000000", "#FFFFFF")}
                />
              </Pressable>
            </View>
            <Text className="text-[1.75rem] font-semibold">
              {data?.grade ? `${data.grade}%` : "-"}
            </Text>
            <Text className="mt-1 text-xl font-light">
              {data?.assignments?.length > 0
                ? `${data.assignments.length} ${pluralize(
                    "assignment",
                    data.assignments.length
                  )}`
                : "No assignments"}
            </Text>
          </View>

          <View className="border-b-[0.7px] border-b-gray-400 dark:border-b-gray-700" />

          {/* Actions */}
          <View className="flex-row items-center justify-start">
            <Button
              classNames={"flex-row gap-2 justify-center items-center"}
              marginTop="mt-0"
              text={"Add Assignment"}
              Icon={
                <FontAwesome6
                  name="plus"
                  size={24}
                  color={getThemeColor("#FFFFFF", "#000000")}
                />
              }
              onPress={() =>
                router.push(
                  `/add-assignment/?classId=${data.id}&classTitle=${data.title}`
                )
              }
            />
          </View>

          <View className="border-b-[0.7px] border-b-gray-400 dark:border-b-gray-700" />

          {data?.assignments?.length > 0 && (
            <View className="flex-col">
              <Text className={"font-medium text-xl"}>Assignments</Text>
              <View className="flex gap-1 mt-3">
                {data?.assignments
                  ?.filter((a) => !a.is_completed)
                  ?.map((assignment) => (
                    <Assignment key={assignment.id} data={assignment} />
                  ))}
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

function Assignment({ data }) {
  return (
    <View className="flex p-4 mb-2 border-2 border-gray-300 rounded-md bg-light-bg dark:bg-dark-bg dark:border-gray-700">
      <View className="flex-row items-center justify-between">
        <Text className={"text-lg font-medium"}>{capitalize(data.title)}</Text>
        <View className="rounded-md">
          <Text
            className="px-2 py-1 text-sm"
            style={{
              backgroundColor: assignmentTypeColors[data.type.toLowerCase()],
              borderRadius: "6px",
              overflow: "hidden",
            }}
          >
            {capitalize(data.type.toLowerCase())}
          </Text>
        </View>
      </View>

      <View className="mt-1">
        <View className="self-start">
          <Text className={"text-md font-normal"}>
            {format(new Date(data.due_date), "MMMM dd")}
          </Text>
        </View>
      </View>
    </View>
  );
}
