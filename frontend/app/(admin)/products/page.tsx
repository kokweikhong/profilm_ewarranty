import { Product, ProductDetails, ProductsResponse } from "@/types/product";
import { ProductService } from "@/services/productService";

export default async function Page() {
  // Fetch products data from the service using ProductsResponse format
  let products: ProductDetails[] = [];
  products = await ProductService.getProductsDetails();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Product Management</h1>

      <div className="grid gap-4">
        {products.length > 0 ? (
          products.map((product, index) => (
            <div
              key={product.productId || `product-${index}`}
              className="border p-4 rounded-lg"
            >
              <h3 className="font-semibold">{product.productName}</h3>
              <p className="text-sm text-gray-500">
                Series: {product.productSeries} | Type: {product.productType}
              </p>

              {/* Debug: Show ID for troubleshooting */}
              <p className="text-xs text-gray-400 mt-2">
                ID: {product.productId || "No ID"}
              </p>
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
}
