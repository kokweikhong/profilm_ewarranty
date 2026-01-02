"use client";

import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-primary  shadow-md">
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between gap-x-6 p-6 lg:px-8"
      >
        <div className="flex lg:flex-1">
          <a href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">ProFilm eWarranty</span>
            <Image
              src={"/profilm_logo.png"}
              alt="ProFilm eWarranty"
              width={150}
              height={50}
              className="h-8 w-auto"
            />
          </a>
        </div>
        <div className="flex flex-1 items-center justify-end gap-x-6">
          <a
            href="/admin"
            className="ml-auto rounded-md bg-white border border-primary px-3 py-2 text-sm font-semibold text-primary shadow-xs hover:bg-gray-50 hover:border-primary/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Admin Panel
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
      </nav>
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center gap-x-6">
            <a href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">ProFilm eWarranty</span>
              <Image
                src={"/profilm_logo.png"}
                alt="ProFilm eWarranty"
                width={150}
                height={50}
                className="h-8 w-auto"
              />
            </a>
            <a
              href="/admin"
              className="ml-auto rounded-md bg-white border border-primary px-3 py-2 text-sm font-semibold text-primary shadow-xs hover:bg-gray-50 hover:border-primary/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Admin Panel
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
