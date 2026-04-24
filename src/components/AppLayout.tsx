import { Fragment } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";
import { signOut } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";

function cn(...xs: (string | boolean | undefined)[]) {
  return xs.filter(Boolean).join(" ");
}

export function AppLayout() {
  const navigate = useNavigate();
  const email = useAuthStore((s) => s.user?.email ?? "");

  async function handleSignOut() {
    const r = await signOut();
    if (r.error) {
      window.alert(r.error.message);
      return;
    }
    navigate("/login", { replace: true });
  }

  return (
    <div className="flex h-full min-h-0 flex-col md:flex-row">
      <aside className="flex shrink-0 flex-col border-b border-gray-200 bg-white md:w-56 md:border-b-0 md:border-r">
        <div className="flex items-center justify-between gap-2 px-4 py-3">
          <Link
            to="/"
            className="text-lg font-semibold text-gray-900 hover:text-gray-600"
          >
            在线笔记
          </Link>
          <Menu as="div" className="relative">
            <Menu.Button
              type="button"
              className="rounded-md px-2 py-1 text-sm text-gray-700 hover:bg-gray-100"
              aria-label="账户菜单"
            >
              账户
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-20 mt-1 w-48 origin-top-right rounded-md border border-gray-200 bg-white py-1 shadow-lg focus:outline-none">
                <div className="truncate px-3 py-2 text-xs text-gray-500">
                  {email}
                </div>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      type="button"
                      onClick={() => void handleSignOut()}
                      className={cn(
                        "block w-full px-4 py-2 text-left text-sm text-gray-700",
                        active && "bg-gray-50"
                      )}
                    >
                      退出登录
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
        <nav className="hidden border-t border-gray-100 px-2 py-2 md:block">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              cn(
                "block rounded-md px-3 py-2 text-sm font-medium",
                isActive
                  ? "bg-indigo-50 text-gray-800"
                  : "text-gray-800 hover:bg-gray-500"
              )
            }
          >
            全部笔记
          </NavLink>
        </nav>
      </aside>
      <main className="min-h-0 min-w-0 flex-1 overflow-hidden bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
