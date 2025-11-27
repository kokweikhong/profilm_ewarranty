"use client";

import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { msiaStates } from "@/constants/msiaStates";
import { useState } from "react";

export default function Page() {
  const [shopImagePreview, setShopImagePreview] = useState<string | null>(null);

  const handleShopImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setShopImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12 dark:border-white/10">
          <h2 className="text-base/7 font-semibold text-gray-900 dark:text-white">
            Shop Information
          </h2>
          <p className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400">
            Enter accurate shop information for warranty registration.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            {/* Company Name */}
            <div className="col-span-full">
              <label
                htmlFor="companyName"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                Company Name
              </label>
              <div className="mt-2">
                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary/60 sm:text-sm/6 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
            </div>

            {/* Company Registration No. */}
            <div className="col-span-full">
              <label
                htmlFor="companyRegistrationNo"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                Company Registration No.
              </label>
              <div className="mt-2">
                <input
                  id="companyRegistrationNo"
                  name="companyRegistrationNo"
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary/60 sm:text-sm/6 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
            </div>

            {/* Company License Image */}
            <div className="col-span-full">
              <label
                htmlFor="companyLicenseImage"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                Company License Image
              </label>
              <div className="mt-2 flex items-center gap-x-6">
                <div className="relative h-32 w-32 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:border-primary/50 transition-colors overflow-hidden group">
                  <input
                    id="companyLicenseImage"
                    name="companyLicenseImage"
                    type="file"
                    accept="image/*"
                    onChange={handleShopImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  {shopImagePreview ? (
                    <img
                      src={shopImagePreview}
                      alt="Company License preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center p-2">
                      <svg
                        className="h-10 w-10 text-gray-400 group-hover:text-primary/50 transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-xs text-gray-500 mt-1">Upload</span>
                    </div>
                  )}
                  {shopImagePreview && (
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                      <span className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        Change
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Upload a clear image of the company's license document.
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    PNG, JPG, GIF up to 10MB. Click to browse or drag and drop.
                  </p>
                  {shopImagePreview && (
                    <button
                      type="button"
                      onClick={() => setShopImagePreview(null)}
                      className="mt-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400"
                    >
                      Remove image
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Company Contact No. */}
            <div className="col-span-full">
              <label
                htmlFor="companyContactNo"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                Company Contact No.
              </label>
              <div className="mt-2">
                <input
                  id="companyContactNo"
                  name="companyContactNo"
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary/60 sm:text-sm/6 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
            </div>

            {/* Company Email */}
            <div className="col-span-full">
              <label
                htmlFor="companyEmail"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                Company Email
              </label>
              <div className="mt-2">
                <input
                  id="companyEmail"
                  name="companyEmail"
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary/60 sm:text-sm/6 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
            </div>

            {/* Company Website */}
            <div className="col-span-full">
              <label
                htmlFor="companyWebsite"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                Company Website
              </label>
              <div className="mt-2">
                <input
                  id="companyWebsite"
                  name="companyWebsite"
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary/60 sm:text-sm/6 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
            </div>

            {/* Shop Name */}
            <div className="col-span-full">
              <label
                htmlFor="shopName"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                Shop Name
              </label>
              <div className="mt-2">
                <input
                  id="shopName"
                  name="shopName"
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary/60 sm:text-sm/6 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
            </div>

            {/* Shop Address */}
            <div className="col-span-full">
              <label
                htmlFor="shopAddress"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                Shop Address
              </label>
              <div className="mt-2">
                <input
                  id="shopAddress"
                  name="shopAddress"
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary/60 sm:text-sm/6 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
            </div>

            {/* Shop State */}
            <div className="col-span-full">
              <label
                htmlFor="shopState"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                Shop State
              </label>
              <div className="mt-2 grid grid-cols-1">
                <select
                  id="shopState"
                  name="shopState"
                  className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-primary/60 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:*:bg-gray-800 dark:focus:outline-primary/50"
                >
                  {msiaStates.map((state) => (
                    <option key={state.abbreviation} value={state.abbreviation}>
                      {state.name}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon
                  aria-hidden="true"
                  className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4 dark:text-gray-400"
                />
              </div>
            </div>

            {/* Branch Code */}
            <div className="col-span-full">
              <label
                htmlFor="branchCode"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                Branch Code
              </label>
              <div className="mt-2">
                <input
                  id="branchCode"
                  name="branchCode"
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary/60 sm:text-sm/6 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
            </div>

            {/* Shop Image */}
            <div className="col-span-full">
              <label
                htmlFor="shopImage"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                Shop Image
              </label>
              <div className="mt-2 flex items-center gap-x-6">
                <div className="relative h-32 w-32 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:border-primary/50 transition-colors overflow-hidden group">
                  <input
                    id="shopImage"
                    name="shopImage"
                    type="file"
                    accept="image/*"
                    onChange={handleShopImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  {shopImagePreview ? (
                    <img
                      src={shopImagePreview}
                      alt="Shop preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center p-2">
                      <svg
                        className="h-10 w-10 text-gray-400 group-hover:text-primary/50 transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-xs text-gray-500 mt-1">Upload</span>
                    </div>
                  )}
                  {shopImagePreview && (
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                      <span className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        Change
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Upload a shop image
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    PNG, JPG, GIF up to 10MB. Click to browse or drag and drop.
                  </p>
                  {shopImagePreview && (
                    <button
                      type="button"
                      onClick={() => setShopImagePreview(null)}
                      className="mt-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400"
                    >
                      Remove image
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* PIC Name */}
            <div className="col-span-full">
              <label
                htmlFor="picName"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                PIC Name
              </label>
              <div className="mt-2">
                <input
                  id="picName"
                  name="picName"
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary/60 sm:text-sm/6 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
            </div>

            {/* PIC Position */}
            <div className="col-span-full">
              <label
                htmlFor="picPosition"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                PIC Position
              </label>
              <div className="mt-2">
                <input
                  id="picPosition"
                  name="picPosition"
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary/60 sm:text-sm/6 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
            </div>

            {/* PIC Contact */}
            <div className="col-span-full">
              <label
                htmlFor="picContact"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                PIC Contact
              </label>
              <div className="mt-2">
                <input
                  id="picContact"
                  name="picContact"
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary/60 sm:text-sm/6 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
            </div>

            {/* PIC Email */}
            <div className="col-span-full">
              <label
                htmlFor="picEmail"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                PIC Email
              </label>
              <div className="mt-2">
                <input
                  id="picEmail"
                  name="picEmail"
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary/60 sm:text-sm/6 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
            </div>

            {/* Login Username */}
            <div className="col-span-full">
              <label
                htmlFor="loginUsername"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                Login Username
              </label>
              <div className="mt-2">
                <input
                  id="loginUsername"
                  name="loginUsername"
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary/60 sm:text-sm/6 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
            </div>

            {/* Login Password */}
            <div className="col-span-full">
              <label
                htmlFor="loginPassword"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                Login Password
              </label>
              <div className="mt-2">
                <input
                  id="loginPassword"
                  name="loginPassword"
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary/60 sm:text-sm/6 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="submit"
          className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-primary/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/60 cursor-pointer"
        >
          Create Shop
        </button>
      </div>
    </form>
  );
}
