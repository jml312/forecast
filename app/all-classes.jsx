import { View, Text } from "react-native";
import { PageModalHeader } from "@/components/common";
import { useQueryClient } from "@tanstack/react-query";

export default function AllClasses() {
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData(["classes"]) || [];
  const classes = data ?? [];
  return (
    <View className="flex items-center w-full h-full bg-light-bg dark:bg-dark-bg">
      <PageModalHeader title="Your Classes" closeText="Close" />

      <View className="flex items-center justify-center w-full h-ful">
        {classes?.length > 0 ? (
          classes.map((c) => (
            <View key={`class-${c.id}`} className="w-full">
              <Text className="text-center">{c.title}</Text>
            </View>
          ))
        ) : (
          <Text className="text-center">No classes found</Text>
        )}
      </View>
    </View>
  );
}
