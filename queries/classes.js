import { supabase } from "@/lib/supabase";

export async function getClasses() {
  const { data } = await supabase.from("classes").select("*");

  return data;
}
