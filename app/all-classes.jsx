import { View } from "react-native";
import { PageModalHeader } from "@/components/common";

export default function AllClasses() {
  return (
    <View className="flex items-center w-full h-full bg-light-bg dark:bg-dark-bg">
      <PageModalHeader title="Classes" closeText="Close" />
    </View>
  );
}
