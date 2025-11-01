"use client";

import { useState, useEffect } from "react";
import { ProductService } from "@/services/productService";
import {
  convertVwProductListToProducts,
  Product,
  VwProductDetail,
} from "@/types/product";

export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await ProductService.getProducts({
          //   page: 1,
          //   limit: 10,
        });
        if (response) {
          //   let products = convertVwProductListToProducts(response);
          setProducts(response);
        }
      } catch (err) {
        setError("Failed to fetch products");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Product Management</h1>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Product Management</h1>
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Product Management</h1>

      <div className="grid gap-4">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="border p-4 rounded-lg">
              <div>{product.name}</div>
              {/* <h3 className="font-semibold">{product.name}</h3>
              <p className="text-gray-600">{product.description}</p>
              <p className="text-sm text-gray-500">
                Brand: {product.brand} | Model: {product.model}
              </p>
              <p className="font-bold">${product.price}</p> */}
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
}
