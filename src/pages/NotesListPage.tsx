import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchNotes, createNote, deleteNote } from "@/lib/api";
import { useNotesStore } from "@/stores/notesStore";
import type { Note } from "@/types/note";

function formatUpdated(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export function NotesListPage() {
  const navigate = useNavigate();
  const { notes, setNotes, removeNote } = useNotesStore();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await fetchNotes();
    setLoading(false);
    if (res.error) {
      setError(res.error.message);
      return;
    }
    setNotes(res.data);
  }, [setNotes]);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter((n) => {
      const t = n.title.toLowerCase();
      const c = n.content.toLowerCase();
      return t.includes(q) || c.includes(q);
    });
  }, [notes, query]);

  async function handleNew() {
    setCreating(true);
    const res = await createNote({ title: "", content: "" });
    setCreating(false);
    if (res.error) {
      window.alert(res.error.message);
      return;
    }
    const prev = useNotesStore.getState().notes;
    setNotes([res.data, ...prev.filter((n) => n.id !== res.data.id)]);
    navigate(`/notes/${res.data.id}`);
  }

  async function handleDelete(e: React.MouseEvent, note: Note) {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("确定删除这条笔记？")) return;
    const r = await deleteNote(note.id);
    if (r.error) {
      window.alert(r.error.message);
      return;
    }
    removeNote(note.id);
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex shrink-0 flex-wrap items-center gap-3 border-b border-gray-200 bg-white px-4 py-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索标题或正文…"
          className="min-w-[12rem] flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
          aria-label="搜索笔记"
        />
        <button
          type="button"
          onClick={() => void handleNew()}
          disabled={creating}
          className="shrink-0 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-500 disabled:opacity-60"
        >
          {creating ? "创建中…" : "新建笔记"}
        </button>
      </header>
      <div className="min-h-0 flex-1 overflow-auto p-4">
        {loading ? (
          <p className="text-center text-gray-500">加载中…</p>
        ) : error ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <p>{error}</p>
            <button
              type="button"
              onClick={() => void load()}
              className="mt-2 text-gray-700 hover:underline"
            >
              重试
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-500">
            {query.trim() ? "没有匹配的笔记" : "暂无笔记，点击「新建笔记」开始"}
          </p>
        ) : (
          <ul className="mx-auto max-w-3xl space-y-2">
            {filtered.map((note) => (
              <li key={note.id}>
                <Link
                  to={`/notes/${note.id}`}
                  className="group flex items-start justify-between gap-3 rounded-md border border-gray-200 bg-white p-4 shadow-sm hover:border-indigo-200 hover:shadow"
                >
                  <div className="min-w-0">
                    <h2 className="truncate font-medium text-gray-900">
                      {note.title.trim() || "无标题"}
                    </h2>
                    <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                      {note.content.trim() || "（空）"}
                    </p>
                    <p className="mt-2 text-xs text-gray-400">
                      更新于 {formatUpdated(note.updated_at)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => void handleDelete(e, note)}
                    className="shrink-0 rounded-md px-2 py-1 text-sm text-red-600 opacity-0 hover:bg-red-50 group-hover:opacity-100"
                    aria-label="删除笔记"
                  >
                    删除
                  </button>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
