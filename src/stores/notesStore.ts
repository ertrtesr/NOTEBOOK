import { create } from "zustand";
import type { Note } from "@/types/note";

type NotesState = {
  notes: Note[];
  setNotes: (notes: Note[]) => void;
  upsertNote: (note: Note) => void;
  removeNote: (id: string) => void;
};

export const useNotesStore = create<NotesState>((set) => ({
  notes: [],
  setNotes: (notes) => set({ notes }),
  upsertNote: (note) =>
    set((s) => {
      const i = s.notes.findIndex((n) => n.id === note.id);
      if (i === -1) return { notes: [note, ...s.notes] };
      const next = [...s.notes];
      next[i] = note;
      return { notes: next };
    }),
  removeNote: (id) =>
    set((s) => ({ notes: s.notes.filter((n) => n.id !== id) })),
}));
