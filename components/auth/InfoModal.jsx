import { Text, View } from "react-native";
import Button from "./Button";
import Modal from "react-native-modal";

export default function InfoModal({
  isVisible,
  title,
  bodyText,
  actionText,
  onPress,
}) {
  return (
    <Modal isVisible={isVisible}>
      <View className="flex items-center justify-center p-4 rounded-md dark:bg-light-bg bg-dark-bg">
        <View>
          <Text className="text-2xl font-semibold text-white dark:text-black">
            {title}
          </Text>
        </View>
        <View>
          <Text className="mt-4 mb-1 text-white dark:text-black">
            {bodyText}
          </Text>
        </View>
        <Button text={actionText} invertColor onPress={onPress} />
      </View>
    </Modal>
  );
}
