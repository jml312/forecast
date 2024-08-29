import { View, Text, Pressable } from "react-native";
import { useNavigation } from "expo-router";

export default function ModalHeader({ title, description }) {
  const navigation = useNavigation();
  return (
    <View>
      <View className="flex-row items-start justify-between w-full">
        <View />
        <View />
        <Pressable onPress={navigation.goBack}>
          <Text className="mt-4 mr-[1.15rem] text-black dark:text-white text-md">
            Cancel
          </Text>
        </Pressable>
      </View>

      <View className="flex items-center justify-center gap-[.45rem] mt-1.5">
        <Text className="text-2xl font-extrabold text-black dark:text-white">
          {title}
        </Text>
        <Text className="text-black dark:text-white text-md">
          {description}
        </Text>
      </View>
    </View>
  );
}
