import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchNoteById } from "@/lib/api";
import { NoteEditor } from "@/components/NoteEditor";
import { useNotesStore } from "@/stores/notesStore";
import type { Note } from "@/types/note";

export function NoteEditorPage() {
  const { noteId } = useParams<{ noteId: string }>();
  const navigate = useNavigate();
  const upsertNote = useNotesStore((s) => s.upsertNote);
  const [note, setNote] = useState<Note | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    const res = await fetchNoteById(id);
    setLoading(false);
    if (res.error) {
      setError(res.error.message);
      setNote(null);
      return;
    }
    setNote(res.data);
  }, []);

  useEffect(() => {
    if (!noteId) {
      setError("缺少笔记 ID");
      setLoading(false);
      return;
    }
    void load(noteId);
  }, [noteId, load]);

  const handleSaved = useCallback(
    (n: Note) => {
      upsertNote(n);
      setNote(n);
    },
    [upsertNote]
  );

  if (!noteId) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-gray-500">
        加载笔记…
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-6">
        <p className="text-gray-700">{error ?? "无法加载笔记"}</p>
        <Link
          to="/"
          className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
        >
          返回列表
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-center gap-2 border-b border-gray-200 bg-white px-3 py-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-md px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 md:hidden"
        >
          返回
        </button>
        <Link
          to="/"
          className="hidden rounded-md px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 md:inline"
        >
          ← 笔记列表
        </Link>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden">
        <NoteEditor
          key={note.id}
          note={note}
          onSaved={handleSaved}
          onSaveError={(msg) => window.alert(msg)}
        />
      </div>
    </div>
  );
}
