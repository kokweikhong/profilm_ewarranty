import { ClaimView } from "@/types/claimsType";

type Props = {
  claimData: ClaimView;
  onCancel: () => void;
};

export default function WarrantyInformation({ claimData, onCancel }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      {/* Warranty Information Header */}
      <div className="p-2 sm:p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            Warranty Information
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white self-start sm:self-auto"
          >
            ← Change Warranty
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-4">
        <div>
          <span className="font-medium text-gray-700 dark:text-gray-300">
            Warranty No:
          </span>
          <span className="ml-2 text-gray-900 dark:text-white">
            {claimData.warrantyNo}
          </span>
        </div>
        <div>
          <span className="font-medium text-gray-700 dark:text-gray-300">
            Car Plate:
          </span>
          <span className="ml-2 text-gray-900 dark:text-white">
            {claimData.carPlateNo}
          </span>
        </div>
        <div>
          <span className="font-medium text-gray-700 dark:text-gray-300">
            Client Name:
          </span>
          <span className="ml-2 text-gray-900 dark:text-white">
            {claimData.clientName}
          </span>
        </div>
        <div>
          <span className="font-medium text-gray-700 dark:text-gray-300">
            Contact:
          </span>
          <span className="ml-2 text-gray-900 dark:text-white">
            {claimData.clientContact}
          </span>
        </div>
        <div>
          <span className="font-medium text-gray-700 dark:text-gray-300">
            Email:
          </span>
          <span className="ml-2 text-gray-900 dark:text-white">
            {claimData.clientEmail}
          </span>
        </div>
        <div>
          <span className="font-medium text-gray-700 dark:text-gray-300">
            Vehicle:
          </span>
          <span className="ml-2 text-gray-900 dark:text-white">
            {claimData.carBrand} {claimData.carModel}
          </span>
        </div>
        <div>
          <span className="font-medium text-gray-700 dark:text-gray-300">
            Colour:
          </span>
          <span className="ml-2 text-gray-900 dark:text-white">
            {claimData.carColour}
          </span>
        </div>
        <div>
          <span className="font-medium text-gray-700 dark:text-gray-300">
            Chassis No:
          </span>
          <span className="ml-2 text-gray-900 dark:text-white">
            {claimData.carChassisNo}
          </span>
        </div>
        <div>
          <span className="font-medium text-gray-700 dark:text-gray-300">
            Installation Date:
          </span>
          <span className="ml-2 text-gray-900 dark:text-white">
            {new Date(claimData.installationDate).toLocaleDateString()}
          </span>
        </div>
        {claimData.referenceNo && (
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Reference No:
            </span>
            <span className="ml-2 text-gray-900 dark:text-white">
              {claimData.referenceNo}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
