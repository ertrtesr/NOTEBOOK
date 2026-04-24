import { supabase, isSupabaseConfigured } from "./supabase";
import type { Note, NoteInsert, NoteUpdate } from "@/types/note";

function ensureClient() {
  if (!isSupabaseConfigured || !supabase) {
    return {
      error: new Error(
        "Supabase 未配置：请在 .env 中设置 VITE_SUPABASE_URL 与 VITE_SUPABASE_ANON_KEY"
      ),
    };
  }
  return { client: supabase, error: null as null };
}

export type ApiResult<T> =
  | { data: T; error: null }
  | { data: null; error: Error };

export async function signUp(
  email: string,
  password: string
): Promise<ApiResult<{ userId: string }>> {
  const r = ensureClient();
  if (r.error) return { data: null, error: r.error };
  const { data, error } = await r.client.auth.signUp({ email, password });
  if (error) return { data: null, error: new Error(error.message) };
  if (!data.user?.id) {
    return { data: null, error: new Error("注册未返回用户信息") };
  }
  return { data: { userId: data.user.id }, error: null };
}

export async function signIn(
  email: string,
  password: string
): Promise<ApiResult<{ session: boolean }>> {
  const r = ensureClient();
  if (r.error) return { data: null, error: r.error };
  const { error } = await r.client.auth.signInWithPassword({
    email,
    password,
  });
  if (error) return { data: null, error: new Error(error.message) };
  return { data: { session: true }, error: null };
}

export type ApiVoidResult = { error: null } | { error: Error };

export async function signOut(): Promise<ApiVoidResult> {
  const r = ensureClient();
  if (r.error) return { error: r.error };
  const { error } = await r.client.auth.signOut();
  if (error) return { error: new Error(error.message) };
  return { error: null };
}

export async function fetchNotes(): Promise<ApiResult<Note[]>> {
  const r = ensureClient();
  if (r.error) return { data: null, error: r.error };
  const { data, error } = await r.client
    .from("notes")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) return { data: null, error: new Error(error.message) };
  return { data: (data ?? []) as Note[], error: null };
}

export async function fetchNoteById(id: string): Promise<ApiResult<Note>> {
  const r = ensureClient();
  if (r.error) return { data: null, error: r.error };
  const { data, error } = await r.client
    .from("notes")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) return { data: null, error: new Error(error.message) };
  if (!data) return { data: null, error: new Error("笔记不存在") };
  return { data: data as Note, error: null };
}

export async function createNote(
  payload: NoteInsert
): Promise<ApiResult<Note>> {
  const r = ensureClient();
  if (r.error) return { data: null, error: r.error };
  const { data: userData, error: userErr } = await r.client.auth.getUser();
  if (userErr || !userData.user) {
    return { data: null, error: new Error("未登录") };
  }
  const { data, error } = await r.client
    .from("notes")
    .insert({
      title: payload.title,
      content: payload.content,
      user_id: userData.user.id,
    })
    .select("*")
    .single();
  if (error) return { data: null, error: new Error(error.message) };
  return { data: data as Note, error: null };
}

export async function updateNote(
  id: string,
  payload: NoteUpdate
): Promise<ApiResult<Note>> {
  const r = ensureClient();
  if (r.error) return { data: null, error: r.error };
  const { data, error } = await r.client
    .from("notes")
    .update({
      ...payload,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*")
    .single();
  if (error) return { data: null, error: new Error(error.message) };
  return { data: data as Note, error: null };
}

export async function deleteNote(id: string): Promise<ApiVoidResult> {
  const r = ensureClient();
  if (r.error) return { error: r.error };
  const { error } = await r.client.from("notes").delete().eq("id", id);
  if (error) return { error: new Error(error.message) };
  return { error: null };
}
