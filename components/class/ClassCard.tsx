import { useRouter } from "expo-router";
import { useTheme } from "@/contexts";
import { Pressable, Text as RnText, View } from "react-native";
import { getWeatherIcon, capitalize, pluralize } from "@/utils";
import { Text } from "../common";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function ClassCard({ data, classNumber }) {
  const router = useRouter();
  const { getThemeColor } = useTheme();

  /* 
  title, ✅
  semester, ✅
  icon, ✅
  grade, 
  is_completed
  num_assignments ✅
  */

  return (
    <Pressable
      className="flex items-center justify-center w-[80%] p-4 mb-2 rounded-md"
      onPress={() => {
        if (data.is_completed) return;
        router.back();
        router.push(`/classes?classNumber=${classNumber}`);
      }}
      style={{ backgroundColor: data.accent_color.toLowerCase() }}
    >
      <View className="flex-row items-center justify-between w-full">
        <Text className="font-semibold text-center">
          {capitalize(data.title)}
        </Text>
        <View className="">
          <Ionicons
            name={getWeatherIcon(data?.grade || false)}
            size={50}
            color={getThemeColor("#000000", "#FFFFFF")}
          />
        </View>
      </View>
      <View className="flex-row items-center justify-between w-full">
        <Text className="text-sm font-normal text-center">
          {data.assignments.length > 0
            ? `${data.assignments.length} ${pluralize(
                "assignment",
                data.assignments.length
              )}`
            : "No assignments"}
        </Text>
      </View>
      <View className="flex-row items-center justify-between w-full mt-0.5">
        <Text className="text-sm font-normal text-center">
          {data.semester || "No semester"}
        </Text>
        <Text className="text-sm font-normal text-center">
          67%
          {/* {data?.grade ? `${data.grade}%` : "-"} */}
        </Text>
      </View>
    </Pressable>
  );
}
