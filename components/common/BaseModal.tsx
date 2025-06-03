import { Text, View } from "react-native";
import Modal from "react-native-modal";
import Button from "./Button";

export default function BaseModal({
  isVisible,
  title,
  bodyText,
  actionText,
  onPress,
  children,
  isInfo,
  buttonMarginTop = "mt-5",
  RightIcon,
  bottomError,
}) {
  return (
    <Modal
      isVisible={isVisible}
      animationInTiming={300}
      animationOutTiming={300}
      backdropTransitionInTiming={0}
      backdropTransitionOutTiming={0}
    >
      <View className="flex items-center justify-center p-4 border border-gray-400 rounded-md dark:bg-dark-bg bg-light-bg dark:border-gray-500">
        <View className="flex flex-row items-center justify-center w-full">
          <Text className="mb-2 text-2xl font-semibold text-black dark:text-white">
            {title}
          </Text>

          <View className="absolute top-0 right-0">
            {RightIcon && RightIcon}
          </View>
        </View>
        {isInfo ? (
          <>
            <View>
              <Text className="mt-4 mb-1 text-black dark:text-white">
                {bodyText}
              </Text>
            </View>
          </>
        ) : (
          children
        )}
        {bottomError && (
          <Text className="self-start mt-4 -mb-1 text-base text-red-500">
            {bottomError}
          </Text>
        )}
        <Button
          text={actionText}
          onPress={onPress}
          marginTop={buttonMarginTop}
        />
      </View>
    </Modal>
  );
}
