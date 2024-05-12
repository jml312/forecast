import { supabase } from "@/lib/supabase";

export async function getUserByEmail(email) {
  const { data } = await supabase
    .from("users")
    .select("id, email, name, created_at")
    .eq("email", email.toLowerCase())
    .single();

  return data;
}
