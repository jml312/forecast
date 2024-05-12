import { Pressable, Text, View } from "react-native";
import { clsx } from "clsx";

export default function SocialButton({
  onPress,
  disabled,
  Icon,
  iconName,
  text,
  colorScheme,
  marginTop = "mt-4",
  marginBottom ,
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={clsx(
        "flex-row items-center justify-center w-full py-4 border-2 rounded-md border-dark-bg dark:border-light-bg mb-2",
        marginTop,
        marginBottom
      )}
    >
      <View className="flex-row items-center justify-center gap-2">
        <Icon
          name={iconName}
          size={24}
          color={colorScheme === "dark" ? "white" : "black"}
        />
        <Text className="font-semibold text-black dark:text-white text-md">
          {text}
        </Text>
      </View>
    </Pressable>
  );
}
