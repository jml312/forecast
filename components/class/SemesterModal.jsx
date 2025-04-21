import { BaseModal, ButtonInput, SelectModal } from "@/components/common";
import { View } from "react-native";
import { useState, useMemo } from "react";
import { semesters } from "@/constants/semesters";

export default function SemesterModal({
  isVisible,
  setIsVisible,
  semester,
  setSemester,
  semesterError,
  setSemesterError,
}) {
  const [selectedSemester, setSelectedSemester] = useState({
    season: semester?.season,
    year: semester?.year,
  });
  const [isSemesterOpen, setIsSemesterOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);
  const currentYear = new Date().getFullYear();
  const yearRange = [
    currentYear - 1,
    currentYear,
    currentYear + 1,
    currentYear + 2,
  ];

  return (
    <BaseModal
      isVisible={isVisible}
      setIsVisible={setIsVisible}
      actionText={"Done"}
      title="Semester"
      onPress={() => {
        if (!semester?.season) {
          setSemesterError("Please select your class semester");
          return;
        }
        setIsVisible(false);
      }}
    >
      <View className="flex flex-col w-full gap-4">
        <>
          <ButtonInput
            label={"Semester"}
            width="100%"
            value={semester?.season || "Select your class semester"}
            onPress={() => {
              setSemesterError("");
              setIsSemesterOpen(true);
            }}
            error={semesterError}
          />
          <SelectModal
            value={selectedSemester?.season}
            setValue={(value) => {
              setSelectedSemester((prev) => ({
                ...prev,
                season: value,
              }));
            }}
            isSelectVisible={isSemesterOpen}
            setIsSelectVisible={() => setIsSemesterOpen(!isSemesterOpen)}
            label={"Semester"}
            items={semesters}
            onClose={() => {
              setSemester({
                ...semester,
                season: selectedSemester?.season || "Fall",
              });
              setIsSemesterOpen(false);
            }}
          />
        </>

        <>
          <ButtonInput
            label={"Year"}
            width="100%"
            value={semester?.year || "Select your class year"}
            onPress={() => setIsYearOpen(true)}
          />
          <SelectModal
            value={selectedSemester?.year}
            setValue={(value) => {
              setSelectedSemester((prev) => ({
                ...prev,
                year: value,
              }));
            }}
            isSelectVisible={isYearOpen}
            setIsSelectVisible={() => setIsYearOpen(!isYearOpen)}
            label={"Year"}
            items={yearRange}
            onClose={() => {
              setSemester({
                ...semester,
                year: selectedSemester?.year,
              });
              setIsYearOpen(false);
            }}
          />
        </>
      </View>
    </BaseModal>
  );
}
