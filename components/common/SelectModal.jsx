import { View, Text, Pressable } from "react-native";
import { useTheme } from "@/contexts";
import Modal from "react-native-modal";
import { Picker } from "react-native-wheel-pick";
import { clsx } from "clsx";

export default function SelectModal({
  isSelectVisible,
  setIsSelectVisible,
  label,
  value,
  setValue,
  items,
  AddMoreComponent,
  children,
  missingItemsText,
  onClose,
  RightIcon,
}) {
  const { getThemeColor } = useTheme();

  return (
    <Modal
      isVisible={isSelectVisible}
      className="flex !justify-end w-full mx-0 rounded-md ml-0 mr-0 mb-0"
      animationInTiming={300}
      animationOutTiming={300}
      backdropTransitionInTiming={0}
      backdropTransitionOutTiming={0}
      backdropColor="rgba(0, 0, 0, 1)"
    >
      <View
        className={clsx(
          "rounded-md bg-light-bg dark:bg-dark-bg max-h-[40%]  w-full flex justify-center items-center pb-8"
        )}
      >
        <View>
          <View className="flex-row items-center justify-between w-full mt-4 border-b border-gray-400 dark:border-gray-700">
            <Text className="mb-3 ml-4 text-2xl font-semibold text-black dark:text-white">
              {label}
            </Text>
            <View className="flex-row items-start justify-center gap-3">
              {RightIcon && <View className="mr-2">{RightIcon}</View>}
              <Pressable
                onPress={() => {
                  onClose && onClose();
                  setIsSelectVisible(false);
                }}
                className="mb-3 mr-4"
              >
                <Text className="text-black dark:text-white">Done</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View className="flex items-center justify-center w-full h-fit max-h-[20rem] pt-2">
          <View className="flex items-center justify-center w-full h-fit min-h-[12.5rem] max-h-[12.5rem]">
            {items ? (
              items?.length > 0 ? (
                <Picker
                  selectedValue={value}
                  onValueChange={setValue}
                  pickerData={items}
                  textColor={getThemeColor("black", "white")}
                  style={{
                    width: "100%",
                    backgroundColor: "transparent",
                  }}
                />
              ) : (
                <Text className="mt-6 font-light text-center text-black dark:text-white">
                  {missingItemsText}
                </Text>
              )
            ) : (
              children
            )}
          </View>
          {AddMoreComponent && <AddMoreComponent />}
        </View>
      </View>
    </Modal>
  );
}
