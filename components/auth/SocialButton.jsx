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
  const { theme, getThemeColor } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={clsx(
        "flex-row items-center justify-center w-full py-4 border-2 rounded-md border-dark dark:border-light mb-2",
        marginTop,
        marginBottom
      )}
    >
      <View className="flex-row items-center justify-center gap-2">
        <Icon
          name={iconName}
          size={24}
          color={getThemeColor("black", "white")}
        />
        <Text className="font-semibold text-black dark:text-white text-md">
          {text}
        </Text>
      </View>
    </Pressable>
  );
}
