import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { initAuthListener } from "@/stores/authStore";
import { useAuthStore } from "@/stores/authStore";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppLayout } from "@/components/AppLayout";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { NotesListPage } from "@/pages/NotesListPage";
import { NoteEditorPage } from "@/pages/NoteEditorPage";

function HomeRedirect() {
  const { user, initialized } = useAuthStore();
  if (!initialized) {
    return (
      <div className="flex h-full items-center justify-center text-gray-500">
        加载中…
      </div>
    );
  }
  if (user) return <Navigate to="/" replace />;
  return <Navigate to="/login" replace />;
}

export default function App() {
  useEffect(() => initAuthListener(), []);

  return (
    <div className="h-full min-h-screen">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<NotesListPage />} />
            <Route path="/notes/:noteId" element={<NoteEditorPage />} />
          </Route>
        </Route>
        <Route path="*" element={<HomeRedirect />} />
      </Routes>
    </div>
  );
}
