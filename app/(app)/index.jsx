import { View } from "react-native";
import { Text, Loader } from "@/components/common";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { getAssignments } from "@/queries/classes";
import { useRouter } from "expo-router";

export default function Assignments() {
  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ["assignments"],
    queryFn: getAssignments,
  });
  const [assignments, setAssignments] = useState(data ?? []);

  useEffect(() => {
    if (!isLoading) {
      if (!data.length) {
        router.push("/classes");
      } else {
        setAssignments(data);
      }
    }
  }, [data, isLoading]);

  if (isLoading) {
    return (
      <View className="flex items-center justify-center w-full h-full bg-light-bg dark:bg-dark-bg">
        <Loader swapTheme />
      </View>
    );
  }

  return (
    <View className="flex items-center justify-center w-full h-full bg-light-bg dark:bg-dark-bg">
      <Text>Assignments</Text>
    </View>
  );
}
