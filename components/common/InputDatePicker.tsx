import { useState, useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import { useTheme } from "@/contexts";
import { DatePicker } from "react-native-wheel-pick";
import SelectModal from "./SelectModal";
import { add, sub, format } from "date-fns";

export default function InputDatePicker({
  title,
  initialValue,
  date,
  setDate,
  width,
  disabled,
  required,
  withResetButton,
  minDate,
  maxDate,
  placeholder,
  formatString = "EEEE MMMM dd, yyyy",
}) {
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(initialValue || date);
  const { getThemeColor } = useTheme();

  const showReset = true;
  // const showReset = useMemo(
  //   () =>
  //     format(date, "yyyy-MM-dd") !== format(selectedDate, "yyyy-MM-dd") ||
  //     (initialValue &&
  //       format(date, "yyyy-MM-dd") !== format(initialValue, "yyyy-MM-dd")),
  //   [date, selectedDate]
  // );

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
            {date ? format(date, formatString) : placeholder}
          </Text>
        </Pressable>

        <SelectModal
          value={date}
          setValue={setDate}
          isSelectVisible={isDatePickerVisible}
          label={title}
          setIsSelectVisible={setIsDatePickerVisible}
          onClose={() => setDate(selectedDate)}
          RightIcon={
            withResetButton &&
            showReset && (
              <Text
                className="text-black dark:text-white"
                onPress={() => {
                  setSelectedDate(initialValue);
                  setDate(initialValue);
                  // setSelectedDate(new Date(initialValue));
                  // setDate(new Date(initialValue));
                }}
              >
                Reset
              </Text>
            )
          }
        >
          <DatePicker
            minimumDate={minDate || new Date(sub(date, { years: 1 }))}
            maximumDate={maxDate || new Date(add(date, { years: 1 }))}
            date={date}
            onDateChange={setSelectedDate}
            textColor={getThemeColor("black", "white")}
            style={{ width: "100%" }}
          />
        </SelectModal>
      </View>
    </View>
  );
}
