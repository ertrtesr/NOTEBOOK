import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "@/lib/api";
import { isSupabaseConfigured } from "@/lib/supabase";
import { useAuthStore } from "@/stores/authStore";

export function RegisterPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const initialized = useAuthStore((s) => s.initialized);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!initialized) return;
    if (user) navigate("/", { replace: true });
  }, [initialized, user, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!isSupabaseConfigured) {
      setError("请先配置 Supabase 环境变量，参见 .env.example");
      return;
    }
    if (password.length < 6) {
      setError("密码至少 6 位");
      return;
    }
    setLoading(true);
    const res = await signUp(email.trim(), password);
    setLoading(false);
    if (res.error) {
      setError(res.error.message);
      return;
    }
    navigate("/login", {
      replace: true,
      state: { registered: true },
    });
  }

  return (
    <div className="flex min-h-full flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm rounded-md border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-center text-2xl font-semibold text-gray-900">
          注册
        </h1>
        <p className="mt-2 text-center text-sm text-gray-500">
          已有账号？{" "}
          <Link to="/login" className="font-medium text-brand hover:text-brand-dark">
            登录
          </Link>
        </p>
        <form className="mt-8 space-y-4" onSubmit={(e) => void onSubmit(e)}>
          {error ? (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}
          <div>
            <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700">
              邮箱
            </label>
            <input
              id="reg-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700">
              密码
            </label>
            <input
              id="reg-password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-brand px-4 py-2 font-medium text-white hover:bg-brand-dark disabled:opacity-60"
          >
            {loading ? "提交中…" : "注册"}
          </button>
        </form>
      </div>
    </div>
  );
}
