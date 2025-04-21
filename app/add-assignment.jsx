import { View } from "react-native";
import {
  PageModalHeader,
  Input,
  GradeSelect,
  ButtonInput,
  SelectModal,
  InputDatePicker,
  Button,
  TextArea,
} from "@/components/common";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import {
  toastConfig,
  baseSuccessToast,
  baseErrorToast,
} from "@/constants/toastConfig";
import { useInputField } from "@/hooks";
import { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTheme } from "@/contexts";
import { assignmentTypes } from "@/constants/assignmentTypes";
import { useLocalSearchParams } from "expo-router";
import { capitalize } from "@/utils";
import { addAssignment } from "@/queries/classes";
import { add } from "date-fns";

export default function AddAssignmentPage() {
  const { getThemeColor } = useTheme();
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const classTitles = useMemo(
    () =>
      queryClient.getQueryData(["classes"])?.map((item) => ({
        id: item.id,
        label: capitalize(item.title),
        value: item.title,
      })) || [],
    [queryClient]
  );
  const { class_title } = useLocalSearchParams();
  const foundClass = useMemo(
    () =>
      classTitles.find(
        (item) => item.label.toLowerCase() === class_title.toLowerCase()
      )?.label || "",
    [class_title, classTitles]
  );
  const [loading, setLoading] = useState(false);
  const {
    value: userClass,
    setValue: setUserClass,
    error: userClassError,
    setError: setUserClassError,
  } = useInputField(foundClass);
  const [selectedClass, setSelectedClass] = useState(foundClass);
  const [isUserClassVisible, setIsUserClassVisible] = useState(false);
  const {
    value: title,
    setValue: setTitle,
    error: titleError,
    setError: setTitleError,
    ref: titleRef,
  } = useInputField();
  const {
    value: type,
    setValue: setType,
    error: typeError,
    setError: setTypeError,
  } = useInputField();
  const [selectedType, setSelectedType] = useState("");
  const [isTypeVisible, setIsTypeVisible] = useState(false);
  const {
    value: dueDate,
    setValue: setDueDate,
    error: dueDateError,
    setError: setDueDateError,
  } = useInputField(new Date());
  const {
    value: notes,
    setValue: setNotes,
    error: notesError,
    setError: setNotesError,
  } = useInputField();
  const { value: grade, setValue: setGrade } = useInputField();

  const handleSubmit = async () => {
    setLoading(true);

    if (!userClass) {
      setUserClassError("Please select your class");
      setLoading(false);
      return;
    }

    if (!title) {
      titleRef?.current?.focus();
      setTitleError("Please enter your assignment title");
      setLoading(false);
      return;
    }

    if (!type) {
      setTypeError("Please select your assignment type");
      setLoading(false);
      return;
    }

    if (!dueDate) {
      setDueDateError("Please select your assignment due date");
      setLoading(false);
      return;
    }

    try {
      const classId = classTitles.find(
        (item) => item.label.toLowerCase() === userClass.toLowerCase()
      )?.id;

      const data = {
        title: title.trim().toLowerCase(),
        type: type.toUpperCase(),
        due_date: dueDate,
        notes: notes.trim(),
        grade: grade ? Number(grade) : null,
        class_id: classId,
      };

      await addAssignment(data);

      Toast.show({
        ...baseSuccessToast,
        text2: "Your assignment has been added",
      });
      queryClient.invalidateQueries({ queryKey: ["classes", "assignments"] });
      setTimeout(() => {
        navigation.navigate("classes");
      }, 1500);
    } catch (error) {
      const message =
        error?.message === "Class already exists"
          ? "Class already exists"
          : "Failed to add class";
      Toast.show({ ...baseErrorToast, text2: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex items-center w-full h-full bg-light-bg dark:bg-dark-bg">
      <PageModalHeader
        title="Add Assignment"
        description="Enter your assignment information"
      />
      <View className="w-[80%] flex justify-center gap-5 mt-6">
        <ButtonInput
          label={"Class"}
          placeholder={"Select your class"}
          required
          onPress={() => {
            if (loading) return;
            setIsUserClassVisible(true);
          }}
          error={userClassError}
          setError={setUserClassError}
          value={capitalize(userClass)}
          setValue={setUserClass}
          disabled={loading}
        />
        <SelectModal
          value={selectedClass}
          setValue={setSelectedClass}
          isSelectVisible={isUserClassVisible}
          label={"Class"}
          setIsSelectVisible={setIsUserClassVisible}
          items={classTitles}
          onClose={() => {
            setUserClass(selectedClass);
            setIsUserClassVisible(false);
          }}
        />

        <Input
          label="Title"
          placeholder="Enter your assignment title"
          error={titleError}
          value={title}
          setValue={setTitle}
          setError={setTitleError}
          disabled={loading}
          inputRef={titleRef}
          inputMode={"text"}
          required
          maxLength={50}
        />

        <ButtonInput
          label={"Type"}
          placeholder={"Select your assignment type"}
          required
          onPress={() => {
            if (loading) return;
            setIsTypeVisible(true);
          }}
          error={typeError}
          setError={setTypeError}
          value={type}
          setValue={setType}
          disabled={loading}
        />
        <SelectModal
          value={selectedType}
          setValue={setSelectedType}
          isSelectVisible={isTypeVisible}
          label={"Assignment Type"}
          setIsSelectVisible={setIsTypeVisible}
          items={assignmentTypes.map((item) => ({
            label: item,
            value: item,
          }))}
          onClose={() => {
            setType(selectedType || "Homework");
            setIsTypeVisible(false);
          }}
        />

        <InputDatePicker
          title={"Due Date"}
          placeholder={"Select your assignment due date"}
          required={true}
          error={dueDateError}
          setError={setDueDateError}
          value={dueDate}
          setValue={setDueDate}
          disabled={loading}
          date={dueDate}
          setDate={setDueDate}
          minDate={new Date()}
          maxDate={add(new Date(), { months: 6 })}
        />
        <GradeSelect
          grade={grade}
          setGrade={setGrade}
          getThemeColor={getThemeColor}
          disabled={loading}
        />
        <TextArea
          label="Notes"
          placeholder="Enter any additional notes"
          error={notesError}
          value={notes}
          setValue={setNotes}
          setError={setNotesError}
          disabled={loading}
          autoFocus={false}
          maxLength={1000}
        />

        <Button
          text="Add Assignment"
          disabled={loading}
          marginTop="-mt-0.5"
          onPress={handleSubmit}
          loading={loading}
        />
      </View>

      <Toast config={toastConfig} />
    </View>
  );
}
