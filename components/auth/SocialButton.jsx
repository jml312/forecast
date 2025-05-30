import { Pressable, Text, View } from "react-native";
import { clsx } from "clsx";
import { useTheme } from "@/contexts";

export default function SocialButton({
  onPress,
  disabled,
  Icon,
  iconName,
  text,
  marginTop = "mt-4",
  marginBottom,
}) {
  const { getThemeColor } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={clsx(
        "flex-row items-center justify-center w-full py-4 border-[0.9px] rounded-md bg-dark-bg dark:bg-light-bg mb-2",
        marginTop,
        marginBottom
      )}
    >
      <View className="flex-row items-center justify-center gap-2">
        <Icon
          name={iconName}
          size={24}
          color={getThemeColor("white", "black")}
        />
        <Text className="font-semibold text-white dark:text-black text-md">
          {text}
        </Text>
      </View>
    </Pressable>
  );
}
