import { supabase } from "@/lib/supabase";

export async function getUserByEmail(email) {
  const { data } = await supabase
    .from("users")
    .select("id, email, name, created_at")
    .eq("email", email)
    .single();

  return data;
}

export async function createUser({ email, name }) {
  const { data } = await supabase
    .from("users")
    .insert({
      email,
      name,
    })
    .select("id, email, name, created_at");

  return data;
}
