"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getShopByIdApi } from "@/lib/apis/shopsApi";
import { Shop } from "@/types/shopsType";

export default function Page() {
  const { user, isLoading: authLoading } = useAuth();
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchShopInfo = async () => {
      if (authLoading) return;

      if (!user?.shopId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const shopData = await getShopByIdApi(user.shopId);
        setShop(shopData);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching shop:", err);
        setError("Failed to load shop information");
      } finally {
        setLoading(false);
      }
    };

    fetchShopInfo();
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-600">Please log in to view your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My Profile</h1>
          <p className="mt-1 text-sm text-gray-600">
            View your account and shop information
          </p>
        </div>
      </div>

      {/* User Information Card */}
      <div className="bg-white  rounded-lg shadow">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900  mb-4">
            User Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Username
              </label>
              <p className="mt-1 text-sm text-gray-900">{user.username}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">
                User ID
              </label>
              <p className="mt-1 text-sm text-gray-900">#{user.id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Role
              </label>
              <p className="mt-1 text-sm">
                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                  {user.role}
                </span>
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Shop ID
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {user.shopId ? `#${user.shopId}` : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Shop Information Card */}
      {user.shopId && (
        <div className="bg-white  rounded-lg shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900  mb-4">
              Shop Information
            </h3>

            {error ? (
              <div className="rounded-md bg-red-50  p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            ) : shop ? (
              <div className="space-y-6">
                {/* Shop Image */}
                {shop.shopImageUrl && (
                  <div className="flex justify-center sm:justify-start">
                    <img
                      src={shop.shopImageUrl}
                      alt={shop.shopName}
                      onClick={() => setEnlargedImage(shop.shopImageUrl)}
                      className="h-32 w-32 sm:h-40 sm:w-40 rounded-lg object-cover shadow-md cursor-pointer hover:opacity-90 transition-opacity"
                      title="Click to enlarge"
                    />
                  </div>
                )}

                {/* Shop Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-500">
                      Shop Name
                    </label>
                    <p className="mt-1 text-base font-semibold text-gray-900">
                      {shop.shopName}
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-500">
                      Branch Code
                    </label>
                    <p className="mt-1 text-sm">
                      <span className="inline-flex items-center rounded-md bg-green-100 px-2.5 py-0.5 text-sm font-medium text-green-800">
                        {shop.branchCode}
                      </span>
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-500">
                      Address
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {shop.shopAddress}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      State
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {shop.msiaStateName}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Status
                    </label>
                    <p className="mt-1 text-sm">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          shop.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {shop.isActive ? "Active" : "Inactive"}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Company Information */}
                <div className="border-t border-gray-200  pt-6">
                  <h4 className="text-base font-medium text-gray-900  mb-4">
                    Company Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-500">
                        Company Name
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {shop.companyName}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Registration Number
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {shop.companyRegistrationNumber}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Contact Number
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {shop.companyContactNumber}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Email
                      </label>
                      <p className="mt-1 text-sm text-gray-900  break-all">
                        {shop.companyEmail}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Website
                      </label>
                      <p className="mt-1 text-sm text-gray-900  break-all">
                        {shop.companyWebsiteUrl || "N/A"}
                      </p>
                    </div>

                    {shop.companyLicenseImageUrl && (
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-500  mb-2">
                          Company License
                        </label>
                        <img
                          src={shop.companyLicenseImageUrl}
                          alt="Company License"
                          onClick={() =>
                            setEnlargedImage(shop.companyLicenseImageUrl)
                          }
                          className="h-32 w-auto rounded-lg object-contain border border-gray-300  cursor-pointer hover:opacity-90 transition-opacity"
                          title="Click to enlarge"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Person In Charge Information */}
                <div className="border-t border-gray-200  pt-6">
                  <h4 className="text-base font-medium text-gray-900  mb-4">
                    Person In Charge
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Name
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {shop.picName}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Position
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {shop.picPosition}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Contact Number
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {shop.picContactNumber}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Email
                      </label>
                      <p className="mt-1 text-sm text-gray-900  break-all">
                        {shop.picEmail}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-gray-600">
                  No shop information available
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Admin User Note */}
      {!user.shopId && (
        <div className="bg-blue-50  rounded-lg p-4">
          <div className="flex">
            <div className="shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                You are an admin user without an associated shop.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Image Enlargement Modal */}
      {enlargedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
          onClick={() => setEnlargedImage(null)}
        >
          <div className="relative max-h-[90vh] max-w-[90vw]">
            <button
              onClick={() => setEnlargedImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
              aria-label="Close"
            >
              <svg
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <img
              src={enlargedImage}
              alt="Enlarged view"
              className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
