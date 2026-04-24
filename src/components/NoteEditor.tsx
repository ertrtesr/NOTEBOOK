import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { githubLight } from "@uiw/codemirror-theme-github";
import { EditorView } from "@codemirror/view";
import { MarkdownPreview } from "./MarkdownPreview";
import { updateNote } from "@/lib/api";
import type { Note } from "@/types/note";

export type NoteEditorProps = {
  note: Note;
  onSaved?: (note: Note) => void;
  onSaveError?: (message: string) => void;
};

const AUTOSAVE_MS = 900;

export function NoteEditor({ note, onSaved, onSaveError }: NoteEditorProps) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [saving, setSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const lastRemote = useRef({ title: note.title, content: note.content });

  const persist = useCallback(
    async (nextTitle: string, nextContent: string) => {
      if (
        nextTitle === lastRemote.current.title &&
        nextContent === lastRemote.current.content
      ) {
        return;
      }
      setSaving(true);
      const res = await updateNote(note.id, {
        title: nextTitle,
        content: nextContent,
      });
      setSaving(false);
      if (res.error) {
        onSaveError?.(res.error.message);
        return;
      }
      lastRemote.current = {
        title: res.data.title,
        content: res.data.content,
      };
      setLastSavedAt(new Date());
      onSaved?.(res.data);
    },
    [note.id, onSaved, onSaveError]
  );

  useEffect(() => {
    const t = window.setTimeout(() => {
      void persist(title, content);
    }, AUTOSAVE_MS);
    return () => window.clearTimeout(t);
  }, [title, content, persist]);

  const extensions = useMemo(
    () => [
      markdown(),
      githubLight,
      EditorView.lineWrapping,
      EditorView.theme({
        "&": { fontSize: "14px", height: "100%" },
        ".cm-scroller": { fontFamily: "Inter, system-ui, sans-serif" },
      }),
    ],
    []
  );

  return (
    <div className="flex h-full min-h-0 flex-col bg-white">
      <header className="flex shrink-0 items-center gap-3 border-b border-gray-200 px-4 py-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="无标题笔记"
          className="min-w-0 flex-1 rounded-md border border-gray-300 px-3 py-2 text-lg font-medium outline-none focus:border-indigo-500"
          aria-label="笔记标题"
        />
        <span className="hidden shrink-0 text-sm text-gray-500 sm:inline">
          {saving ? "保存中…" : lastSavedAt ? `已保存 ${lastSavedAt.toLocaleTimeString()}` : ""}
        </span>
      </header>
      <div className="grid min-h-0 flex-1 grid-cols-1 divide-y divide-gray-200 md:grid-cols-2 md:divide-x md:divide-y-0">
        <div className="min-h-[220px] min-w-0 md:h-full">
          <CodeMirror
            value={content}
            height="100%"
            className="h-full min-h-[220px] md:min-h-0 [&_.cm-editor]:h-full [&_.cm-editor]:min-h-[220px] md:[&_.cm-editor]:min-h-0"
            extensions={extensions}
            onChange={(v) => setContent(v)}
            basicSetup={{
              lineNumbers: true,
              foldGutter: true,
              highlightActiveLine: true,
            }}
          />
        </div>
        <div className="min-h-[220px] min-w-0 overflow-hidden bg-gray-50 md:h-full">
          <p className="border-b border-gray-200 bg-gray-100 px-4 py-2 text-xs font-medium uppercase tracking-wide text-gray-500">
            预览
          </p>
          <div className="h-[calc(100%-2.25rem)] overflow-auto">
            <MarkdownPreview markdown={content} />
          </div>
        </div>
      </div>
    </div>
  );
}
