import {
  PageModalHeader,
  Input,
  ButtonInput,
  SelectModal,
  InputDatePicker,
  TextArea,
  GradeSelect,
  Switch,
} from "@/components/common";
import { View, Pressable, Text as RnText } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useInputField } from "@/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { updateAssignment, deleteAssignment } from "@/queries/classes";
import { assignmentTypes } from "@/constants/assignmentTypes";
import { capitalize } from "@/utils";
import { add } from "date-fns";
import Toast from "react-native-toast-message";
import {
  toastConfig,
  baseSuccessToast,
  baseErrorToast,
} from "@/constants/toastConfig";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useTheme } from "@/contexts";
import clsx from "clsx";
import { toDate } from "date-fns-tz";
import { formatInTimeZone } from "date-fns-tz";

export default function EditAssignment() {
  const { getThemeColor } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const queryClient = useQueryClient();
  const classTitles = useMemo(
    () =>
      queryClient.getQueryData(["classes"])?.map((item) => ({
        id: item.id,
        label: capitalize(item.title.toLowerCase()),
        value: capitalize(item.title.toLowerCase()),
      })) || [],
    [queryClient]
  );
  const { classId, classTitle } = useLocalSearchParams();
  const foundClass = useMemo(
    () => classTitles.find((item) => item.id == classId)?.label,
    [classId, classTitle, classTitles]
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
  } = useInputField(capitalize(params?.title) || "");
  const {
    value: type,
    setValue: setType,
    error: typeError,
    setError: setTypeError,
  } = useInputField(capitalize(params?.type) || "");
  const [selectedType, setSelectedType] = useState("");
  const [isTypeVisible, setIsTypeVisible] = useState(false);
  const {
    value: dueDate,
    setValue: setDueDate,
    error: dueDateError,
    setError: setDueDateError,
  } = useInputField(
    params?.dueDate ? toDate(params.dueDate.split(" ")[0]) : now
  );

  const {
    value: notes,
    setValue: setNotes,
    error: notesError,
    setError: setNotesError,
  } = useInputField(params?.notes ? params?.notes : "");
  const { value: grade, setValue: setGrade } = useInputField();
  const [isClassCompleted, setIsClassCompleted] = useState(
    !!params?.isCompleted ? params?.isCompleted : false
  );

  const now = useMemo(() => new Date(), []);

  const isClassChanged = useMemo(
    () =>
      // new
      JSON.stringify({
        id: Number(params?.id),
        title: title.trim().toLowerCase(),
        type: type.toUpperCase(),
        notes: notes.trim(),
        grade: grade ? Number(grade) : null,
        class_id: Number(classId),
        is_completed: isClassCompleted.toString(),
      }) !==
        // original
        JSON.stringify({
          id: Number(params?.id),
          title: params?.title.toLocaleLowerCase() || "",
          type: capitalize(params?.type) || "",
          notes: params?.notes || "",
          grade: params?.grade ? Number(params?.grade) : null,
          class_id: Number(classId),
          is_completed: !!params?.isCompleted ? params?.isCompleted : false,
        }) ||
      formatInTimeZone(dueDate, "UTC", "yyyy-MM-dd'T'HH:mm:ssXXX") !==
        formatInTimeZone(
          params?.dueDate
            ? toDate(params.dueDate.split(" ")[0])
            : add(now, { days: 1 }),
          "UTC",
          "yyyy-MM-dd'T'HH:mm:ssXXX"
        ),
    [params, title, type, dueDate, notes, grade, classId, isClassCompleted]
  );

  const handleUpdate = async () => {
    if (!isClassChanged) return;

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
      const data = {
        id: Number(params?.id),
        title: title.trim().toLowerCase(),
        type: type.toUpperCase(),
        due_date: dueDate,
        notes: notes.trim(),
        grade: grade ? Number(grade) : null,
        class_id: Number(classId),
        is_completed: isClassCompleted,
      };

      await updateAssignment(data);
      Toast.show({
        ...baseSuccessToast,
        text2: "Your assignment has been added",
      });
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
      setTimeout(() => {
        router.back();
      }, 1500);
    } catch (error) {
      const message =
        error?.message === "Assignment already exists"
          ? "Assignment already exists"
          : "Failed to add class";
      Toast.show({ ...baseErrorToast, text2: message });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteAssignment(Number(params?.id));
      Toast.show({
        ...baseSuccessToast,
        text2: "Your assignment has been deleted",
      });
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
      setTimeout(() => {
        router.back();
      }, 1500);
    } catch {
      Toast.show({ ...baseErrorToast, text2: "Failed to delete assignment" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="relative flex items-center w-full h-full bg-light-bg dark:bg-dark-bg">
      <PageModalHeader
        title="Your Assignment"
        description={"Edit or delete your assignment"}
        closeText="Close"
      />

      <View className="w-[80%] flex justify-center gap-5 mt-6">
        <Switch
          label={"Completed"}
          flip
          switchContainerClassName="-ml-1"
          containerClassName={"self-start -mb-1"}
          scale={0.75}
          showValue
          value={
            typeof isClassCompleted === "string"
              ? isClassCompleted === "true"
              : isClassCompleted
          }
          onValueChange={setIsClassCompleted}
          onText={"Yes"}
          offText={"No"}
        />
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
          value={capitalize(title.toLowerCase())}
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
          value={capitalize(type.toLowerCase())}
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
          // showReset
          initialValue={params?.dueDate}
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
          minDate={now}
          maxDate={add(now, { months: 6 })}
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

        <Pressable
          className={clsx(
            "flex-row items-center justify-center w-full py-4 rounded-md gap-0.5 -mt-1 bg-dark-bg dark:bg-light-bg",
            isClassChanged ? "opacity-100" : "opacity-50"
          )}
          onPress={handleUpdate}
        >
          <FontAwesome
            name="save"
            size={16}
            color={getThemeColor("#FFFFFF", "#000000")}
            style={{ marginRight: 4 }}
          />
          <RnText className="font-medium text-center text-white text-md dark:text-black">
            Save
          </RnText>
        </Pressable>

        <Pressable
          className="flex-row items-center justify-center w-full py-4 bg-red-500 rounded-md gap-0.5 -mt-2"
          onPress={handleDelete}
        >
          <FontAwesome
            name="trash"
            size={16}
            color={getThemeColor("#FFFFFF", "#000000")}
            style={{ marginRight: 4 }}
          />
          <RnText className="font-medium text-center text-white text-md dark:text-black">
            Delete
          </RnText>
        </Pressable>
      </View>

      <Toast config={toastConfig} />
    </View>
  );
}
