import { View, Pressable, Text } from "react-native";
import { clsx } from "clsx";
import { accentColors } from "@/constants/accentColors";

export default function ColorPicker({ value, setValue }) {
  return (
    <>
      <Text className="-mb-[1.4rem] text-black text-md dark:text-white">
        Accent Color
      </Text>
      <View className="flex-row flex-wrap items-center justify-around w-full gap-x-12 gap-y-9">
        {accentColors.map((color) => (
          <View key={color}>
            <Pressable
              onPress={() => setValue(color)}
              className={clsx(
                "w-8 h-8  border-black dark:border-white rounded-full",
                value === color ? "scale-125 border-2" : "scale-[.85] border-0"
              )}
              style={{ backgroundColor: color }}
            />
          </View>
        ))}
      </View>
    </>
  );
}
