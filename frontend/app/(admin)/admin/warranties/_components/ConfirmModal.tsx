import { ProductsFromAllocationByShopIdResponse } from "@/types/productAllocationsType";
import {
  CreateWarrantyWithPartsRequest,
  UpdateWarrantyWithPartsRequest,
  WarrantyWithPartsResponse,
} from "@/types/warrantiesType";

type ConfirmModalProps = {
  showConfirmModal: boolean;
  formData:
    | CreateWarrantyWithPartsRequest
    | UpdateWarrantyWithPartsRequest
    | null;
  isEditMode: boolean;
  warrantyParts: any[]; // Replace 'any' with the actual type of your warranty parts
  carParts: any[]; // Replace 'any' with the actual type of your car parts
  productsFromAllocation: ProductsFromAllocationByShopIdResponse[] | undefined;
  invoiceFile: File | null;
  invoicePreview: string | null;
  imagePreview: Map<number, string>; // Map of carPartId to image preview URL
  isUploading: boolean;
  handleConfirm: () => void;
  handleCancel: () => void;
};

const ConfirmModal = ({
  showConfirmModal,
  formData,
  isEditMode,
  warrantyParts,
  carParts,
  productsFromAllocation,
  invoiceFile,
  invoicePreview,
  imagePreview,
  isUploading,
  handleConfirm,
  handleCancel,
}: ConfirmModalProps) => {
  if (!showConfirmModal || !formData) return null;

  const warranty = formData.warranty;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="bg-white  rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold text-gray-900  mb-4">
          {isEditMode ? "Confirm Warranty Update" : "Confirm Warranty Details"}
        </h3>

        <div className="space-y-6 text-sm">
          {/* Warranty Information */}
          <div className="border-b pb-4">
            <h4 className="font-semibold text-gray-900  mb-3">
              Warranty Information
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="font-medium text-gray-700">
                  Warranty Number:
                </span>
                <span className="ml-2 text-gray-900">
                  {warranty.warrantyNo}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">
                  Installation Date:
                </span>
                <span className="ml-2 text-gray-900">
                  {warranty.installationDate}
                </span>
              </div>
              {warranty.referenceNo && (
                <div>
                  <span className="font-medium text-gray-700">
                    Reference No:
                  </span>
                  <span className="ml-2 text-gray-900">
                    {warranty.referenceNo}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Client Information */}
          <div className="border-b pb-4">
            <h4 className="font-semibold text-gray-900  mb-3">
              Client Information
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="font-medium text-gray-700">Name:</span>
                <span className="ml-2 text-gray-900">
                  {warranty.clientName}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Contact:</span>
                <span className="ml-2 text-gray-900">
                  {warranty.clientContact}
                </span>
              </div>
              <div className="col-span-2">
                <span className="font-medium text-gray-700">Email:</span>
                <span className="ml-2 text-gray-900">
                  {warranty.clientEmail}
                </span>
              </div>
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="border-b pb-4">
            <h4 className="font-semibold text-gray-900  mb-3">
              Vehicle Information
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="font-medium text-gray-700">Brand:</span>
                <span className="ml-2 text-gray-900">{warranty.carBrand}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Model:</span>
                <span className="ml-2 text-gray-900">{warranty.carModel}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Colour:</span>
                <span className="ml-2 text-gray-900">{warranty.carColour}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">
                  Car Plate Number:
                </span>
                <span className="ml-2 text-gray-900">
                  {warranty.carPlateNo}
                </span>
              </div>
              <div className="col-span-2">
                <span className="font-medium text-gray-700">
                  Chassis Number:
                </span>
                <span className="ml-2 text-gray-900">
                  {warranty.carChassisNo}
                </span>
              </div>
            </div>
          </div>

          {/* Invoice Attachment */}
          {(invoiceFile || invoicePreview) && (
            <div className="border-b pb-4">
              <h4 className="font-semibold text-gray-900  mb-3">
                Invoice Attachment
              </h4>
              {invoicePreview ? (
                <img
                  src={invoicePreview}
                  alt="Invoice preview"
                  className="max-h-48 rounded border border-gray-300"
                />
              ) : invoiceFile ? (
                <div className="flex items-center gap-2 text-gray-700">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                  <span>{invoiceFile.name}</span>
                </div>
              ) : null}
            </div>
          )}

          {/* Car Parts with Installation Images */}
          <div>
            <h4 className="font-semibold text-gray-900  mb-3">
              Selected Car Parts ({warrantyParts.length})
            </h4>
            {warrantyParts.length > 0 ? (
              <div className="space-y-4">
                {warrantyParts.map((part, index) => {
                  const carPart = carParts.find(
                    (cp) => cp.id === part.carPartId,
                  );
                  const product = productsFromAllocation?.find(
                    (p) => p.productAllocationId === part.productAllocationId,
                  );
                  const imageUrl =
                    imagePreview.get(index) || part.installationImageUrl;

                  return (
                    <div key={index} className="bg-gray-50  p-4 rounded-md">
                      <div className="flex gap-4">
                        {/* Installation Image Preview */}
                        {imageUrl && (
                          <div className="shrink-0">
                            <img
                              src={imageUrl}
                              alt={`${carPart?.name} installation`}
                              className="h-24 w-24 object-contain rounded border border-gray-300"
                            />
                          </div>
                        )}

                        {/* Part Details */}
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {carPart?.name || `Car Part ${part.carPartId}`}
                          </p>
                          {carPart?.code && (
                            <p className="text-xs text-gray-500">
                              Code: {carPart.code}
                            </p>
                          )}
                          {product && (
                            <div className="mt-2 text-xs">
                              <p className="text-gray-700">
                                <span className="font-medium">Product:</span>
                                {""}
                                <br />
                                <span>Brand: {product.brandName}</span>
                                <br />
                                <span>Type: {product.typeName}</span>
                                <br />
                                <span>Series: {product.seriesName}</span>
                                <br />
                                <span>Product Name: {product.productName}</span>
                              </p>
                              <p className="text-gray-600">
                                <span className="font-medium">Warranty:</span>
                                {""}
                                {product.warrantyInMonths} months
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-red-600">No car parts selected</p>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleConfirm}
            disabled={warrantyParts.length === 0 || isUploading}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading
              ? "Uploading..."
              : isEditMode
                ? "Confirm Update"
                : "Confirm Create"}
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-300  text-gray-800  rounded-md hover:bg-gray-400  transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
