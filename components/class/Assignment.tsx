import { useRouter } from "expo-router";
import { View, Pressable, Text as RnText } from "react-native";
import { Text } from "../common";
import { capitalize } from "@/utils";
import { useMemo } from "react";
import { assignmentTypeColors } from "@/constants/assignmentTypes";
import clsx from "clsx";
import { formatInTimeZone, toDate } from "date-fns-tz";
import { isAfter } from "date-fns";

export default function Assignment({ data, accentColor }) {
  const isOverdue = useMemo(() => {
    if (data.is_completed) return false;

    const now = toDate(new Date());
    const dueDate = toDate(data.due_date);

    return isAfter(now, dueDate);
  }, [data.due_date, data.is_completed]);
  const router = useRouter();

  return (
    <Pressable
      className={clsx(
        "flex p-4 mb-2 border-2 border-gray-300 rounded-md dark:border-gray-700 border-l-4",
        // data.is_completed
        //   ? "bg-[#E5E7EB] dark:bg-[#3A3A3A]"
        //   : "bg-light-bg dark:bg-dark-bg"
      )}
      style={{
        borderLeftColor: accentColor,
      }}
      onPress={() =>
        router.push(
          `/edit-assignment?id=${data.id}&classId=${data.class_id}&type=${data.type}&title=${data.title}&notes=${data.notes}&dueDate=${data.due_date}&isCompleted=${data.is_completed}`
        )
      }
    >
      <View className="flex-row items-center justify-between">
        <Text className={"text-lg font-medium"}>{capitalize(data.title)}</Text>
        <View className="rounded-md">
          <Text
            className="px-2 py-1 text-sm"
            style={{
              backgroundColor: assignmentTypeColors[data.type.toLowerCase()],
              borderRadius: 6,
              overflow: "hidden",
            }}
          >
            {capitalize(data.type.toLowerCase())}
          </Text>
        </View>
      </View>

      <View className="mt-1">
        <View className="self-start">
          <RnText
            className={clsx(
              "text-md font-normal",
              isOverdue
                ? "text-red-600 dark:text-red-400"
                : "text-gray-700 dark:text-gray-300"
            )}
          >
            {formatInTimeZone(data.due_date, "UTC", "EEEE, MMMM dd")}
          </RnText>
        </View>
      </View>

      {data?.notes && (
        <View className="mt-1">
          <Text className="font-light text-md">{data.notes}</Text>
        </View>
      )}

      <Text className={"p-2 bg-red-500 w- rounded-md"}>
        {data.is_completed ? "Completed" : "Upcoming"}
      </Text>
    </Pressable>
  );
}
