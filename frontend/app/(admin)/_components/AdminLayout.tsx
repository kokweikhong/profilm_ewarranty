"use client";

import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { filterNavigationByRole, userNavigation } from "@/constants/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  // Filter navigation based on user role
  const allowedNavigation = filterNavigationByRole(user?.role);

  // Update current navigation item based on pathname
  // also highlight sub-paths
  // eg if /admin then will ignore other paths like /admin/products
  // if /admin/products, will highlight /admin/products
  // if /admin/products/create, will highlight /admin/products
  allowedNavigation.forEach((item) => {
    if (pathname === item.href) {
      item.current = true;
    } else if (item.href !== "/admin" && pathname.startsWith(item.href + "/")) {
      item.current = true;
    } else {
      item.current = false;
    }
  });

  return (
    <div>
      <Dialog
        open={sidebarOpen}
        onClose={setSidebarOpen}
        className="relative z-50 lg:hidden"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-closed:opacity-0"
        />

        <div className="fixed inset-0 flex">
          <DialogPanel
            transition
            className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full"
          >
            <TransitionChild>
              <div className="absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="-m-2.5 p-2.5"
                >
                  <span className="sr-only">Close sidebar</span>
                  <XMarkIcon aria-hidden="true" className="size-6 text-white" />
                </button>
              </div>
            </TransitionChild>

            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="relative flex grow flex-col gap-y-5 overflow-y-auto bg-primary px-6 pb-4 ring-1 ring-white/10">
              <a className="relative flex h-16 shrink-0 items-center" href="/">
                <Image
                  src={"/profilm_logo.png"}
                  alt="ProFilm eWarranty"
                  width={150}
                  height={50}
                  className="h-8 w-auto"
                />
              </a>
              <nav className="relative flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      {allowedNavigation.map((item) => (
                        <li key={item.name}>
                          <a
                            href={item.href}
                            className={cn(
                              item.current
                                ? "bg-white/5 text-white"
                                : "text-gray-800 hover:bg-white/5 hover:text-white",
                              "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                            )}
                          >
                            <Image
                              src={item.icon}
                              alt={item.name}
                              width={24}
                              height={24}
                              className={cn(
                                "size-6 shrink-0 transition-all duration-200",
                                item.current
                                  ? "brightness-0 invert"
                                  : "group-hover:brightness-0 group-hover:invert"
                              )}
                            />
                            {item.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                </ul>
              </nav>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Static sidebar for desktop */}
      <div className="hidden bg-primary ring-1 ring-white/10 lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-primary px-6 pb-4">
          <a className="flex h-16 shrink-0 items-center" href="/">
            <Image
              src={"/profilm_logo.png"}
              alt="ProFilm eWarranty"
              width={150}
              height={50}
              className="h-8 w-auto"
            />
          </a>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {allowedNavigation.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className={cn(
                          item.current
                            ? "bg-white/5 text-white"
                            : "text-gray-800 hover:bg-white/5 hover:text-white",
                          "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                        )}
                      >
                        <Image
                          src={item.icon}
                          alt={item.name}
                          width={24}
                          height={24}
                          className={cn(
                            "size-6 shrink-0 transition-all duration-200",
                            item.current
                              ? "brightness-0 invert"
                              : "group-hover:brightness-0 group-hover:invert"
                          )}
                        />
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>{" "}
            </ul>
          </nav>
        </div>
      </div>

      <div className="lg:pl-72">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-xs sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="-m-2.5 p-2.5 text-gray-700 hover:text-gray-900 lg:hidden"
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>

          {/* Separator */}
          <div
            aria-hidden="true"
            className="h-6 w-px bg-gray-900/10 lg:hidden"
          />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex items-center gap-x-4 lg:gap-x-6 ml-auto">
              {/* Separator */}
              <div
                aria-hidden="true"
                className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
              />

              {/* Profile dropdown */}
              <Menu as="div" className="relative">
                <MenuButton
                  className="relative flex items-center gap-x-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors duration-200 focus:outline-none"
                  suppressHydrationWarning
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="flex items-center gap-x-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-sm font-semibold">
                      {user?.username?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <span className="hidden sm:block text-sm font-semibold text-gray-900 dark:text-white">
                      {user?.username || "User"}
                    </span>
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="h-5 w-5 text-gray-500 dark:text-gray-400"
                    />
                  </div>
                </MenuButton>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-lg bg-white py-1 shadow-lg focus:outline-none transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                >
                  {userNavigation.map((item) => (
                    <MenuItem key={item.name}>
                      {item.name === "Sign out" ? (
                        <button
                          onClick={logout}
                          className="flex w-full items-center gap-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors data-focus:bg-gray-50"
                        >
                          <svg
                            className="h-5 w-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          {item.name}
                        </button>
                      ) : (
                        <a
                          href={item.href}
                          className="flex items-center gap-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors data-focus:bg-gray-50"
                        >
                          {item.name === "Update password" ? (
                            <svg
                              className="h-5 w-5 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="h-5 w-5 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          )}
                          {item.name}
                        </a>
                      )}
                    </MenuItem>
                  ))}
                </MenuItems>
              </Menu>
            </div>
          </div>
        </div>

        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="border-t border-gray-200 py-4 text-center text-sm/6 text-gray-500">
          &copy; {new Date().getFullYear()} ProFilm eWarranty. All rights
          reserved.
        </div>
      </div>
    </div>
  );
}
