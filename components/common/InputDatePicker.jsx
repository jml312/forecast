import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useTheme } from "@/contexts";
import { DatePicker } from "react-native-wheel-pick";
import { SelectModal } from "@/components/common";
import { add, sub } from "date-fns";

export default function InputDatePicker({
  title,
  date,
  setDate,
  width,
  disabled,
  required,
}) {
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(date);
  const { getThemeColor } = useTheme();

  return (
    <View
      className="flex items-start justify-center gap-1"
      style={{ width: width }}
    >
      <Text className="text-black dark:text-white text-md">
        {title + (required ? " *" : "")}
      </Text>
      <View className="flex flex-row items-center justify-center p-2 bg-white border-2 border-gray-400 rounded-md dark:bg-black dark:border-gray-700">
        <Pressable
          onPress={() => {
            if (disabled) return;
            setIsDatePickerVisible(true);
          }}
          className="py-[5px] ml-2 mr-1 text-gray-500 grow dark:text-gray-400"
        >
          <Text className="text-gray-500 dark:text-gray-400">
            {date.toDateString()}
          </Text>
        </Pressable>

        <SelectModal
          isSelectVisible={isDatePickerVisible}
          label={title}
          setIsSelectVisible={setIsDatePickerVisible}
          onClose={() => setDate(selectedDate)}
        >
          <DatePicker
            minimumDate={new Date(sub(date, { years: 1 }))}
            maximumDate={new Date(add(date, { years: 1 }))}
            date={date}
            onDateChange={setSelectedDate}
            textColor={getThemeColor("black", "white")}
            style={{
              width: "100%",
            }}
          />
        </SelectModal>
      </View>
    </View>
  );
}
