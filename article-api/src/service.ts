import { supabase } from "./supabaseClient";
import {
  QueryResult,
  QueryData,
  QueryError,
  PostgrestError,
} from "@supabase/supabase-js";
import { TaskDb } from "./model";
export async function findAll(): Promise<TaskDb[]> {
  const { data, error } = await supabase.from("public_todos").select("*");
  if (error) throw error;
  return data;
}

export async function findById(id: string) {
  const { data, error } = await supabase
    .from("public_todos")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function create(task: any) {
  const { data, error } = await supabase
    .from("public_todos")
    .insert([task])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function update(id: string, task: any): Promise<any> {
  console.log("Service.update id: ", id);
  console.log("PATCH newTaskData: ", JSON.stringify(task, null, 2));
  const { data, error } = await supabase
    .from("public_todos")
    .update(task)
    .eq("id", id)
    .select();

  if (error) throw error;
  return data;
}

export async function upsert(id: string, task: any) {
  const {
    data: existing,
    //  error: existingError
  } = await supabase.from("public_todos").select().eq("id", id).single();
  /*
    if (existingError && existingError.message !== "Item not found") {
      throw new Error(existingError.message);
    }
  */
  const operationType = existing ? "update" : "insert";

  const { data, error } = await supabase
    .from("public_todos")
    .upsert({ ...task, id })
    .select();

  if (error) throw error;

  return { data, operationType };
}

export async function deleteTask(id: string) {
  const { error } = await supabase.from("public_todos").delete().eq("id", id);

  if (error) throw error;
  return;
}
