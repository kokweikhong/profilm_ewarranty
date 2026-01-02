"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getWarrantiesWithPartsByIdApi } from "@/lib/apis/warrantiesApi";
import {
  updateWarrantyApprovalAction,
  updateWarrantyPartApprovalAction,
} from "@/actions/warrantiesAction";
import { WarrantyWithPartsResponse } from "@/types/warrantiesType";
import {
  ShieldCheckIcon,
  ArrowLeftIcon,
  PencilIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarIcon,
  UserIcon,
  TruckIcon,
  DocumentTextIcon,
  PhotoIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/contexts/AuthContext";
import { formatDate } from "@/lib/utils";

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const { user } = useAuth();
  const id = params.id as string;

  const [data, setData] = useState<WarrantyWithPartsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [updatingApproval, setUpdatingApproval] = useState<number | null>(null);

  const isAdmin = user?.role === "admin";

  const isImageFile = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  };

  const isPdfFile = (url: string) => {
    return /\.pdf$/i.test(url);
  };

  const getFileName = (url: string) => {
    return url.split("/").pop() || "document";
  };

  const handleToggleWarrantyApproval = async () => {
    if (!data || !isAdmin) return;

    try {
      const newApprovalStatus = !data.warranty.isApproved;
      const result = await updateWarrantyApprovalAction(
        data.warranty.id,
        newApprovalStatus
      );

      if (result.success) {
        setData({
          ...data,
          warranty: { ...data.warranty, isApproved: newApprovalStatus },
        });
        showToast(
          `Warranty ${
            newApprovalStatus ? "approved" : "unapproved"
          } successfully`,
          "success"
        );
      } else {
        showToast(
          result.error || "Failed to update warranty approval",
          "error"
        );
      }
    } catch (error) {
      showToast("Failed to update warranty approval", "error");
    }
  };

  const handleTogglePartApproval = async (
    partId: number,
    currentStatus: boolean
  ) => {
    if (!data || !isAdmin) return;

    try {
      setUpdatingApproval(partId);
      const newApprovalStatus = !currentStatus;
      const result = await updateWarrantyPartApprovalAction(
        partId,
        newApprovalStatus
      );

      if (result.success) {
        setData({
          ...data,
          parts: data.parts.map((part) =>
            part.id === partId
              ? { ...part, isApproved: newApprovalStatus }
              : part
          ),
        });
        showToast(
          `Part ${newApprovalStatus ? "approved" : "unapproved"} successfully`,
          "success"
        );
      } else {
        showToast(result.error || "Failed to update part approval", "error");
      }
    } catch (error) {
      showToast("Failed to update part approval", "error");
    } finally {
      setUpdatingApproval(null);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const warrantyData = await getWarrantiesWithPartsByIdApi(Number(id));
        setData(warrantyData);
      } catch (error) {
        console.error("Failed to fetch warranty details:", error);
        showToast("Failed to load warranty details", "error");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, showToast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading warranty details...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <XCircleIcon className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            Warranty not found
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            The warranty you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => router.push("/admin/warranties")}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Warranties
          </button>
        </div>
      </div>
    );
  }

  const { warranty, parts } = data;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push("/admin/warranties")}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Warranties
        </button>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <ShieldCheckIcon className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Warranty Details
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Warranty No: {warranty.warrantyNo}
              </p>
            </div>
          </div>

          {/* Hide if admin */}
          {!isAdmin && (
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  router.push(`/admin/warranties/edit/${warranty.id}`)
                }
                className="inline-flex items-center gap-2 rounded-lg bg-white border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                <PencilIcon className="h-4 w-4" />
                Edit
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Status Badges */}
      <div className="flex items-center gap-3 mb-6">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
            warranty.isActive
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {warranty.isActive ? (
            <CheckCircleIcon className="h-4 w-4" />
          ) : (
            <XCircleIcon className="h-4 w-4" />
          )}
          {warranty.isActive ? "Active" : "Inactive"}
        </span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
            warranty.isApproved
              ? "bg-blue-100 text-blue-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {warranty.isApproved ? (
            <ClipboardDocumentCheckIcon className="h-4 w-4" />
          ) : (
            <ClipboardDocumentCheckIcon className="h-4 w-4" />
          )}
          {warranty.isApproved ? "Approved" : "Pending Approval"}
        </span>
        {isAdmin && (
          <button
            onClick={handleToggleWarrantyApproval}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              warranty.isApproved
                ? "bg-yellow-500 text-white hover:bg-yellow-600"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            {warranty.isApproved ? "Unapprove" : "Approve"} Warranty
          </button>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <UserIcon className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Customer Information
              </h2>
            </div>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {warranty.clientName}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Contact</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {warranty.clientContact}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {warranty.clientEmail}
                </dd>
              </div>
            </dl>
          </div>

          {/* Vehicle Information */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <TruckIcon className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Vehicle Information
              </h2>
            </div>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Brand</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {warranty.carBrand}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Model</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {warranty.carModel}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Color</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {warranty.carColour}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Plate Number
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {warranty.carPlateNo}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">
                  Chassis Number
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {warranty.carChassisNo}
                </dd>
              </div>
            </dl>
          </div>

          {/* Installed Parts */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <PhotoIcon className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Installed Parts ({parts.length})
              </h2>
            </div>
            <div className="space-y-4">
              {parts.map((part) => (
                <div
                  key={part.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-primary/50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:justify-between gap-4">
                    <div className="flex-1 w-full">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="font-semibold text-gray-900">
                          {part.carPartName}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                            part.isApproved
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {part.isApproved ? (
                            <CheckCircleIcon className="h-3 w-3" />
                          ) : (
                            <XCircleIcon className="h-3 w-3" />
                          )}
                          {part.isApproved ? "Approved" : "Pending"}
                        </span>
                        {isAdmin && (
                          <button
                            onClick={() =>
                              handleTogglePartApproval(part.id, part.isApproved)
                            }
                            disabled={updatingApproval === part.id}
                            className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium transition-colors disabled:opacity-50 ${
                              part.isApproved
                                ? "bg-yellow-500 text-white hover:bg-yellow-600"
                                : "bg-green-500 text-white hover:bg-green-600"
                            }`}
                          >
                            {updatingApproval === part.id ? (
                              <span className="inline-block animate-spin rounded-full h-3 w-3 border-b-2 border-white"></span>
                            ) : part.isApproved ? (
                              "Unapprove"
                            ) : (
                              "Approve"
                            )}
                          </button>
                        )}
                      </div>
                      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <div>
                          <dt className="text-gray-500">Product</dt>
                          <dd className="font-medium text-gray-900">
                            {part.productName}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-gray-500">Brand</dt>
                          <dd className="font-medium text-gray-900">
                            {part.productBrand}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-gray-500">Serial Number</dt>
                          <dd className="font-medium text-gray-900">
                            {part.filmSerialNumber}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-gray-500">Warranty Period</dt>
                          <dd className="font-medium text-gray-900">
                            {part.warrantyInMonths} months
                          </dd>
                        </div>
                      </dl>
                    </div>
                    {part.installationImageUrl && (
                      <button
                        onClick={() =>
                          setSelectedImage(part.installationImageUrl)
                        }
                        className="shrink-0 group relative w-full sm:w-auto"
                      >
                        <img
                          src={part.installationImageUrl}
                          alt={`${part.carPartName} installation`}
                          className="h-32 w-full sm:h-24 sm:w-24 rounded-lg object-contain border border-gray-200 group-hover:border-primary transition-colors bg-gray-50"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 rounded-lg transition-colors">
                          <PhotoIcon className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Additional Info */}
        <div className="space-y-6">
          {/* Warranty Information */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <CalendarIcon className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Warranty Information
              </h2>
            </div>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Warranty Number
                </dt>
                <dd className="mt-1 text-sm font-mono text-gray-900 bg-gray-50 px-3 py-2 rounded">
                  {warranty.warrantyNo}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Installation Date
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {formatDate(warranty.installationDate)}
                </dd>
              </div>
              {warranty.referenceNo && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Reference Number
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {warranty.referenceNo}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Created At
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {formatDate(warranty.createdAt)}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Last Updated
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {formatDate(warranty.updatedAt)}
                </dd>
              </div>
            </dl>
          </div>

          {/* Invoice Attachment */}
          {warranty.invoiceAttachmentUrl && (
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <DocumentTextIcon className="h-5 w-5 text-gray-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Invoice
                  </h2>
                </div>
                <a
                  href={warranty.invoiceAttachmentUrl}
                  download
                  className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                    />
                  </svg>
                  Download
                </a>
              </div>

              {isImageFile(warranty.invoiceAttachmentUrl) ? (
                <button
                  onClick={() =>
                    setSelectedImage(warranty.invoiceAttachmentUrl)
                  }
                  className="block w-full group"
                >
                  <img
                    src={warranty.invoiceAttachmentUrl}
                    alt="Invoice"
                    className="w-full rounded-lg border border-gray-200 group-hover:border-primary transition-colors cursor-pointer"
                  />
                </button>
              ) : isPdfFile(warranty.invoiceAttachmentUrl) ? (
                <button
                  onClick={() => setShowPdfModal(true)}
                  className="w-full flex items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-gray-50 transition-all group"
                >
                  <div className="text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-red-500 group-hover:text-red-600 transition-colors"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18.5,9H13V3.5L18.5,9M6,20V4H12V10H18V20H6Z" />
                    </svg>
                    <p className="mt-2 text-sm font-medium text-gray-900">
                      {getFileName(warranty.invoiceAttachmentUrl)}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Click to preview PDF
                    </p>
                  </div>
                </button>
              ) : (
                <a
                  href={warranty.invoiceAttachmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg group-hover:border-primary transition-colors">
                    <div className="text-center">
                      <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400 group-hover:text-primary transition-colors" />
                      <p className="mt-2 text-sm font-medium text-gray-900">
                        {getFileName(warranty.invoiceAttachmentUrl)}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Click to open document
                      </p>
                    </div>
                  </div>
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-7xl max-h-[90vh]">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <XCircleIcon className="h-8 w-8" />
            </button>
            <img
              src={selectedImage}
              alt="Installation preview"
              className="max-w-full max-h-[85vh] rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* PDF Modal */}
      {showPdfModal && warranty.invoiceAttachmentUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setShowPdfModal(false)}
        >
          <div
            className="relative w-full max-w-6xl h-[90vh] bg-white rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-3">
                <DocumentTextIcon className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Invoice Preview
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={warranty.invoiceAttachmentUrl}
                  download
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                    />
                  </svg>
                  Download
                </a>
                <a
                  href={warranty.invoiceAttachmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                    />
                  </svg>
                  Open in New Tab
                </a>
                <button
                  onClick={() => setShowPdfModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* PDF Viewer */}
            <div className="w-full h-[calc(90vh-64px)]">
              <iframe
                src={warranty.invoiceAttachmentUrl}
                className="w-full h-full"
                title="Invoice PDF"
              />
            </div>
          </div>
        </div>
      )}

      {/* Status Badges */}
      <div className="flex items-center gap-3 my-6">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
            warranty.isActive
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {warranty.isActive ? (
            <CheckCircleIcon className="h-4 w-4" />
          ) : (
            <XCircleIcon className="h-4 w-4" />
          )}
          {warranty.isActive ? "Active" : "Inactive"}
        </span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
            warranty.isApproved
              ? "bg-blue-100 text-blue-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {warranty.isApproved ? (
            <ClipboardDocumentCheckIcon className="h-4 w-4" />
          ) : (
            <ClipboardDocumentCheckIcon className="h-4 w-4" />
          )}
          {warranty.isApproved ? "Approved" : "Pending Approval"}
        </span>
        {isAdmin && (
          <button
            onClick={handleToggleWarrantyApproval}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              warranty.isApproved
                ? "bg-yellow-500 text-white hover:bg-yellow-600"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            {warranty.isApproved ? "Unapprove" : "Approve"} Warranty
          </button>
        )}
      </div>
    </div>
  );
}
