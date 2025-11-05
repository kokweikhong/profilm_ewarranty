import { Product, ProductDetails, ProductsResponse } from "@/types/product";
import { ProductService } from "@/services/productService";

export default async function Page() {
  // Fetch products data from the service using ProductsResponse format
  let products: Product[] = [];
  products = await ProductService.getProducts();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Product Management
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage and view all product entries
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <svg
                  className="-ml-1 mr-2 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Product
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          {products.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type & Series
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Warranty
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Film Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product, index) => (
                      <tr
                        key={product.id || `product-${index}`}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {product.name || "Unnamed Product"}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {product.id || "N/A"}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {product.type || "N/A"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.series || "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {product.warrantyYears || 0} years
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            Serial: {product.filmSerialNo || "N/A"}
                          </div>
                          <div className="text-sm text-gray-500">
                            Qty: {product.filmQuantity || 0} | Shipment:{" "}
                            {product.filmShipmentNo || "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.createdAt
                            ? new Date(product.createdAt).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900 transition-colors">
                              Edit
                            </button>
                            <button className="text-red-600 hover:text-red-900 transition-colors">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden">
                {products.map((product, index) => (
                  <div
                    key={product.id || `product-${index}`}
                    className="p-4 border-b border-gray-200 last:border-b-0"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {product.name || "Unnamed Product"}
                        </h3>
                        <p className="text-sm text-gray-500">
                          ID: {product.id || "N/A"}
                        </p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {product.warrantyYears || 0} years
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type & Series
                        </p>
                        <p className="text-sm text-gray-900">
                          {product.type || "N/A"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {product.series || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Film Details
                        </p>
                        <p className="text-sm text-gray-900">
                          Serial: {product.filmSerialNo || "N/A"}
                        </p>
                        <p className="text-sm text-gray-600">
                          Qty: {product.filmQuantity || 0}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-500">
                        Created:{" "}
                        {product.createdAt
                          ? new Date(product.createdAt).toLocaleDateString()
                          : "N/A"}
                      </p>
                      <div className="flex space-x-3">
                        <button className="text-sm text-blue-600 hover:text-blue-900 font-medium">
                          Edit
                        </button>
                        <button className="text-sm text-red-600 hover:text-red-900 font-medium">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Table Footer */}
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Showing {products.length} products</span>
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-white transition-colors">
                      Previous
                    </button>
                    <span className="px-3 py-1">Page 1</span>
                    <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-white transition-colors">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m8 0V4.5"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No products found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new product.
              </p>
              <div className="mt-6">
                <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                  <svg
                    className="-ml-1 mr-2 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add Product
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
