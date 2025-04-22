import { supabase } from "@/lib/supabase";
import { semesters } from "@/constants/semesters";

export async function getClasses() {
  const { data } = await supabase.from("classes").select("*, assignments(*)");

  if (!data) {
    return [];
  }

  // Sort assignments in each class
  const classesWithSortedAssignments = data.map((c) => ({
    ...c,
    assignments:
      c.assignments?.sort((a, b) => {
        const dateA = new Date(a.due_date);
        const dateB = new Date(b.due_date);
        if (dateA.getTime() !== dateB.getTime()) {
          return dateA - dateB;
        }
        return new Date(a.created_at) - new Date(b.created_at);
      }) ?? [],
  }));

  // Sort the classes themselves
  return classesWithSortedAssignments.sort((a, b) => {
    const [termA, yearA] = a.semester.split(" ");
    const [termB, yearB] = b.semester.split(" ");

    if (yearA !== yearB) return parseInt(yearB) - parseInt(yearA);

    const termDiff = semesters.indexOf(termA) - semesters.indexOf(termB);
    if (termDiff !== 0) return termDiff;

    return new Date(b.created_at) - new Date(a.created_at);
  });
}

export async function getAssignments() {
  const { data } = await supabase
    .from("assignments")
    .select("*, classes(*)")
    .eq("is_completed", false);

  if (!data) {
    return [];
  }

  return data.sort((a, b) => {
    const dateA = new Date(a.due_date);
    const dateB = new Date(b.due_date);
    if (dateA.getTime() !== dateB.getTime()) {
      return dateA - dateB;
    }
    return new Date(a.created_at) - new Date(b.created_at);
  });
}

export async function addClass(data) {
  const { error } = await supabase.from("classes").insert([data]);

  if (error?.message.includes("duplicate key")) {
    throw new Error("Class already exists");
  }
}

export async function addAssignment(data) {
  const { error } = await supabase.from("assignments").insert([data]);

  if (error?.message.includes("duplicate key")) {
    throw new Error("Class already exists");
  }
}

export async function updateAssignment(data) {
  const { error } = await supabase
    .from("assignments")
    .update(data)
    .eq("id", data.id);

  if (error?.message.includes("duplicate key")) {
    throw new Error("Assignment already exists");
  }
}

export async function deleteAssignment(id) {
  await supabase.from("assignments").delete().eq("id", id);
}

export async function updateClass(data) {
  const { error } = await supabase
    .from("classes")
    .update(data)
    .eq("id", data.id);

  if (error?.message.includes("duplicate key")) {
    throw new Error("Class already exists");
  }
}

export async function deleteClass(id) {
  await supabase.from("classes").delete().eq("id", id);
}
