import { ChevronDownIcon } from "@heroicons/react/16/solid";

export default function Page() {
  return (
    <form>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12 dark:border-white/10">
          <h2 className="text-base/7 font-semibold text-gray-900 dark:text-white">
            Product Allocations
          </h2>
          <p className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400">
            Enter accurate product information for warranty registration.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            {/* Film Serial No. */}
            <div className="col-span-full">
              <label
                htmlFor="filmSerialNo"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                Film Serial No.
              </label>
              <div className="mt-2 grid grid-cols-1">
                <select
                  id="filmSerialNo"
                  name="filmSerialNo"
                  className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-primary/60 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:*:bg-gray-800 dark:focus:outline-primary/50"
                >
                  <option>United States</option>
                  <option>Canada</option>
                  <option>Mexico</option>
                </select>
                <ChevronDownIcon
                  aria-hidden="true"
                  className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4 dark:text-gray-400"
                />
              </div>
            </div>

            {/* Film Quantity */}
            <div className="col-span-full">
              <label
                htmlFor="filmQuantity"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                Film Quantity
              </label>
              <div className="mt-2">
                <input
                  id="filmQuantity"
                  name="filmQuantity"
                  type="number"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary/60 sm:text-sm/6 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
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
              <div className="mt-2 grid grid-cols-1">
                <select
                  id="branchCode"
                  name="branchCode"
                  className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-primary/60 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:*:bg-gray-800 dark:focus:outline-primary/50"
                >
                  <option>United States</option>
                  <option>Canada</option>
                  <option>Mexico</option>
                </select>
                <ChevronDownIcon
                  aria-hidden="true"
                  className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4 dark:text-gray-400"
                />
              </div>
            </div>

            {/* Allocation Date */}
            <div className="col-span-full">
              <label
                htmlFor="allocationDate"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                Allocation Date
              </label>
              <div className="mt-2">
                <input
                  id="allocationDate"
                  name="allocationDate"
                  type="date"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary/60 sm:text-sm/6 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
            </div>

            {/* Warranty */}
            <div className="col-span-full">
              <label
                htmlFor="warranty"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                Warranty
              </label>
              <div className="mt-2 grid grid-cols-1">
                <select
                  id="warranty"
                  name="warranty"
                  className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-primary/60 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:*:bg-gray-800 dark:focus:outline-primary/50"
                >
                  <option>United States</option>
                  <option>Canada</option>
                  <option>Mexico</option>
                </select>
                <ChevronDownIcon
                  aria-hidden="true"
                  className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4 dark:text-gray-400"
                />
              </div>
            </div>

            {/* Film Serial No */}
            <div className="col-span-full">
              <label
                htmlFor="filmSerialNo"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                Film Serial No.
              </label>
              <div className="mt-2 grid grid-cols-1">
                <select
                  id="filmSerialNo"
                  name="filmSerialNo"
                  className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-primary/60 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:*:bg-gray-800 dark:focus:outline-primary/50"
                >
                  <option>United States</option>
                  <option>Canada</option>
                  <option>Mexico</option>
                </select>
                <ChevronDownIcon
                  aria-hidden="true"
                  className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4 dark:text-gray-400"
                />
              </div>
            </div>

            {/* Film Quantity */}
            <div className="col-span-full">
              <label
                htmlFor="filmQuantity"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                Film Quantity
              </label>
              <div className="mt-2">
                <input
                  id="filmQuantity"
                  name="filmQuantity"
                  type="number"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary/60 sm:text-sm/6 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
            </div>

            {/* Shipment No. */}
            <div className="col-span-full">
              <label
                htmlFor="shipmentNo"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                Shipment No.
              </label>
              <div className="mt-2">
                <input
                  id="shipmentNo"
                  name="shipmentNo"
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
          Create Product
        </button>
      </div>
    </form>
  );
}
