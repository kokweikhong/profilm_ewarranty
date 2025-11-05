"use server";

import { ProductBrandService } from "@/services/productBrandService";
import { revalidatePath } from "next/cache";
// Define a consistent return type

export async function createProductBrand(formData: FormData) {
  try {
    const name = formData.get("name") as string;

    if (!name || name.trim() === "") {
      throw new Error("Brand name is required");
    }

    await ProductBrandService.create({ name: name.trim() });
    // Revalidate the category page to show new data
    revalidatePath("/products/category");
  } catch (error) {
    console.error("Error in createProductBrand:", error);
    throw error;
  }
}
