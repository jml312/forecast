import { useState, useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import SelectModal from "./SelectModal";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function GradeSelect({
  title = "Grade",
  grade,
  setGrade,
  width,
  disabled,
  required,
  getThemeColor,
}) {
  const [isGradeSelectVisible, setIsGradeSelectVisible] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState(100);
  const gradeRange = useMemo(() => {
    return Array.from({ length: 101 }, (_, i) => {
      return i.toString();
    }).reverse();
  }, []);

  return (
    <View
      className="flex items-start justify-center gap-1"
      style={{ width: width }}
    >
      <Text className="text-black dark:text-white text-md">
        {title + (required ? " *" : "")}
      </Text>
      <View className="flex flex-row items-center justify-center p-2 bg-white border-2 border-gray-400 rounded-md dark:bg-black dark:border-gray-700">
        <Pressable
          disabled={disabled}
          onPress={() => {
            if (disabled) return;
            setIsGradeSelectVisible(true);
          }}
          className="py-[5px] ml-2 mr-1 text-gray-500 grow dark:text-gray-400 flex-row items-center justify-between"
        >
          <Text className="text-gray-500 dark:text-gray-400">
            {grade || "Enter your numeric grade"}
          </Text>
          {grade && (
            <CancelButton
              setGrade={setGrade}
              setSelectedGrade={setSelectedGrade}
              getThemeColor={getThemeColor}
            />
          )}
        </Pressable>

        <SelectModal
          isSelectVisible={isGradeSelectVisible}
          label={title}
          setIsSelectVisible={setIsGradeSelectVisible}
          onClose={() => {
            setGrade(selectedGrade);
            setIsGradeSelectVisible(false);
          }}
          items={gradeRange}
          value={selectedGrade}
          setValue={setSelectedGrade}
        />
      </View>
    </View>
  );
}

const CancelButton = ({ setGrade, setSelectedGrade, getThemeColor }) => {
  return (
    <MaterialIcons
      name="cancel"
      size={24}
      color={getThemeColor("black", "white")}
      onPress={() => {
        setGrade(null);
        setSelectedGrade(100);
      }}
    />
  );
};
