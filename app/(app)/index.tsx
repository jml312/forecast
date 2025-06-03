import { View, SafeAreaView, ScrollView } from "react-native";
import { Text, Loader, Switch } from "@/components/common";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { getClasses } from "@/queries/classes";
import { useRouter } from "expo-router";
import { Assignment } from "@/components/class";
import { pluralize } from "@/utils";

export default function Assignments() {
  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ["classes"],
    queryFn: getClasses,
  });
  const [assignments, setAssignments] = useState([]);
  const [showAllAssignments, setShowAllAssignments] = useState(false);

  const filteredAssignments =
    assignments?.filter((a) => showAllAssignments || !a.is_completed) || [];

  useEffect(() => {
    if (!isLoading) {
      if (!data.length) {
        router.push("/classes");
      } else {
        const assignmentsWithColors = data?.map((c) => {
          return c.assignments.map((a) => {
            return {
              ...a,
              accentColor: c.accent_color,
            };
          });
        });
        setAssignments(assignmentsWithColors.flat());
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
    <SafeAreaView className="flex items-center justify-between w-full h-full bg-light-bg dark:bg-dark-bg">
      <View className="flex-row items-center justify-between w-[85%] mt-6">
        <Text className={"text-left font-bold text-2xl"}>Assignments</Text>
        <Switch
          scale={0.75}
          showValue
          value={showAllAssignments}
          onValueChange={setShowAllAssignments}
          onText={"All"}
          offText={"Upcoming"}
        />
      </View>
      {filteredAssignments?.length > 0 && (
        <View className="mt-2 mb-1 w-[85%]">
          <Text className="font-light text-md">
            {filteredAssignments.length}{" "}
            {pluralize("assignment", filteredAssignments.length)}
          </Text>
        </View>
      )}
      <View className="flex-1 w-[85%] mt-3">
        {filteredAssignments?.length > 0 ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="flex-1 mb-3"
            contentContainerStyle={{ gap: 6 }}
          >
            {filteredAssignments
              ?.sort((a, b) => {
                if (a.is_completed !== b.is_completed) {
                  return a.is_completed ? 1 : -1;
                }
              })
              ?.map((assignment) => (
                <Assignment
                  key={`assignment-${assignment.id}`}
                  data={assignment}
                  accentColor={assignment.accentColor.toLowerCase()}
                />
              ))}
          </ScrollView>
        ) : (
          <View className="flex items-center justify-center w-full h-full">
            <Text className={"text-lg font-bold text-center"}>
              No assignments
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
