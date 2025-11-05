"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProductBrandService } from "@/services/productBrandService";
import { ProductTypeService } from "@/services/productTypeService";
import { ProductSeriesService } from "@/services/productSeriesService";
import { ProductNameService } from "@/services/productNameService";
import { ProductService } from "@/services/productService";
import { WarrantyYearService } from "@/services/warrantyYearService";
import { ProductBrand } from "@/types/productBrand";
import { ProductType } from "@/types/productType";
import { ProductSeries } from "@/types/productSeries";
import { ProductName } from "@/types/productName";
import { ProductCreateRequest } from "@/types/product";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  productNameId: z.string().min(1, "Product Name is required"),
  productBrandId: z.string().min(1, "Product Brand is required"),
  warrantyYears: z.number().min(2, "Warranty Years must be at least 2"),
  filmSerialNo: z.string().min(1, "Film Serial No is required"),
  filmQuantity: z.number().min(1, "Film Quantity must be at least 1"),
  // optional
  // with default value
  filmShipmentNo: z.string(),
});

export default function CreateProductPage() {
  const router = useRouter();

  // State for dropdown options
  const [brands, setBrands] = useState<ProductBrand[]>([]);
  const [types, setTypes] = useState<ProductType[]>([]);
  const [series, setSeries] = useState<ProductSeries[]>([]);
  const [names, setNames] = useState<ProductName[]>([]);
  const [warrantyYears, setWarrantyYears] = useState<number[]>([]);

  // State for selected values
  const [selectedBrandId, setSelectedBrandId] = useState<string>("");
  const [selectedTypeId, setSelectedTypeId] = useState<string>("");
  const [selectedSeriesId, setSelectedSeriesId] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productNameId: "",
      productBrandId: "",
      warrantyYears: 2,
      filmSerialNo: "",
      filmQuantity: 2,
      filmShipmentNo: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("Form submitted with values:", values);
  };

  // Load brands on component mount
  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates if component unmounts

    const loadBrands = async () => {
      try {
        const brandsData = await ProductBrandService.getAll();
        // Only update state if component is still mounted
        if (isMounted) {
          setBrands(brandsData);
        }
      } catch (error) {
        if (isMounted) {
          setBrands([]);
        }
      }
    };

    const loadWarrantyYears = async () => {
      try {
        const warrantyYearsData = await WarrantyYearService.getAll();
        setWarrantyYears(warrantyYearsData.map((year) => year.years));
      } catch (error) {
        console.error("Error loading warranty years:", error);
        setWarrantyYears([]);
      }
    };

    loadBrands();
    loadWarrantyYears();

    // Cleanup function to prevent memory leaks
    return () => {
      isMounted = false;
    };
  }, []);

  // Load types when brand is selected
  useEffect(() => {
    let isMounted = true;

    const loadTypes = async () => {
      if (!selectedBrandId) {
        if (isMounted) {
          setTypes([]);
          setSelectedTypeId("");
          setSeries([]);
          setSelectedSeriesId("");
          setNames([]);
        }
        return;
      }

      try {
        if (isMounted) {
          setSelectedTypeId(""); // Reset type selection
          setSeries([]); // Clear series
          setSelectedSeriesId(""); // Reset series selection
          setNames([]); // Clear names
          form.setValue("productNameId", ""); // Reset name selection
        }

        const typesData = await ProductTypeService.getByBrandId(
          selectedBrandId
        );

        if (isMounted) {
          setTypes(typesData);
        }
      } catch (error) {
        console.error("Error loading types:", error);
        if (isMounted) {
          setTypes([]);
        }
      }
    };

    loadTypes();

    return () => {
      isMounted = false;
    };
  }, [selectedBrandId]);

  // Load series when type is selected
  useEffect(() => {
    let isMounted = true;

    const loadSeries = async () => {
      if (!selectedTypeId) {
        if (isMounted) {
          setSeries([]);
          setSelectedSeriesId("");
          setNames([]);
          form.setValue("productNameId", ""); // Reset name selection
        }
        return;
      }

      try {
        if (isMounted) {
          setSelectedSeriesId(""); // Reset series selection
        }

        const seriesData = await ProductSeriesService.getByProductTypeId(
          selectedTypeId
        );

        if (isMounted) {
          form.setValue("productNameId", ""); // Reset name selection
          setSeries(seriesData);
        }
      } catch (error) {
        console.error("Error loading series:", error);
        if (isMounted) {
          setSeries([]);
        }
      }
    };

    loadSeries();

    return () => {
      isMounted = false;
    };
  }, [selectedTypeId]);

  // Load names when series is selected
  useEffect(() => {
    let isMounted = true;

    const loadNames = async () => {
      if (!selectedSeriesId) {
        if (isMounted) {
          setNames([]);
        }
        return;
      }

      try {
        form.setValue("productNameId", ""); // Reset name selection
        const namesData = await ProductNameService.getBySeriesId(
          selectedSeriesId
        );

        if (isMounted) {
          setNames(namesData);
        }
      } catch (error) {
        console.error("Error loading names:", error);
        if (isMounted) {
          setNames([]);
        }
      }
    };

    loadNames();

    return () => {
      isMounted = false;
    };
  }, [selectedSeriesId]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
            Create Product
          </h1>
          <p className="mt-1 text-sm text-gray-600 hidden sm:block">
            Fill in the details below to create a new product entry
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 lg:p-8">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 sm:space-y-8"
            >
              {/* Product Brand - Full width with responsive styling */}
              <FormField
                control={form.control}
                name="productBrandId"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm sm:text-base font-medium text-gray-700">
                      Product Brand *
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedBrandId(value);
                        }}
                        value={field.value}
                      >
                        <SelectTrigger
                          className="w-full h-10 sm:h-11 text-sm sm:text-base"
                          data-form-type="other"
                          data-lpignore="true"
                        >
                          <SelectValue placeholder="Select a brand..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Brands</SelectLabel>
                            {brands.map((brand) => (
                              <SelectItem key={brand.id} value={brand.id}>
                                {brand.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Product Type - Dependent on Brand */}
              <div className="space-y-2">
                <label className="text-sm sm:text-base font-medium text-gray-700">
                  Product Type *
                </label>
                <Select
                  onValueChange={(value) => {
                    setSelectedTypeId(value);
                  }}
                  disabled={!selectedBrandId}
                >
                  <SelectTrigger
                    className="w-full h-10 sm:h-11 text-sm sm:text-base disabled:opacity-50"
                    data-form-type="other"
                    data-lpignore="true"
                  >
                    <SelectValue
                      placeholder={
                        !selectedBrandId
                          ? "Please select a brand first..."
                          : "Select a product type..."
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Types</SelectLabel>
                      {types.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Product Series - Dependent on Type */}
              <div className="space-y-2">
                <label className="text-sm sm:text-base font-medium text-gray-700">
                  Product Series *
                </label>
                <Select
                  onValueChange={(value) => {
                    setSelectedSeriesId(value);
                  }}
                  disabled={!selectedTypeId}
                >
                  <SelectTrigger
                    className="w-full h-10 sm:h-11 text-sm sm:text-base disabled:opacity-50"
                    data-form-type="other"
                    data-lpignore="true"
                  >
                    <SelectValue
                      placeholder={
                        !selectedTypeId
                          ? "Please select a type first..."
                          : "Select a product series..."
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Series</SelectLabel>
                      {series.map((seriesItem) => (
                        <SelectItem key={seriesItem.id} value={seriesItem.id}>
                          {seriesItem.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Product Name - Dependent on Series */}
              <FormField
                control={form.control}
                name="productNameId"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm sm:text-base font-medium text-gray-700">
                      Product Name *
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={!selectedSeriesId}
                      >
                        <SelectTrigger className="w-full h-10 sm:h-11 text-sm sm:text-base disabled:opacity-50">
                          <SelectValue
                            placeholder={"Select a product name..."}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Names</SelectLabel>
                            {names.map((nameItem) => (
                              <SelectItem key={nameItem.id} value={nameItem.id}>
                                {nameItem.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Input Fields Grid - Responsive Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <FormField
                  control={form.control}
                  name="warrantyYears"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm sm:text-base font-medium text-gray-700">
                        Warranty Years *
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(parseInt(value))
                          }
                          value={field.value.toString()}
                        >
                          <SelectTrigger className="w-full h-10 sm:h-11 text-sm sm:text-base py-5 m-0">
                            <SelectValue placeholder="Select warranty years..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Warranty Years</SelectLabel>
                              {warrantyYears.map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                  {year} {year > 1 ? "years" : "year"}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="filmQuantity"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm sm:text-base font-medium text-gray-700">
                        Film Quantity *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          className="h-10 sm:h-11 text-sm sm:text-base"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Full-width fields */}
              <FormField
                control={form.control}
                name="filmSerialNo"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm sm:text-base font-medium text-gray-700">
                      Film Serial Number *
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-10 sm:h-11 text-sm sm:text-base"
                        data-form-type="other"
                        data-lpignore="true"
                        autoComplete="off"
                        {...field}
                        placeholder="Enter film serial number"
                        maxLength={100}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="filmShipmentNo"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm sm:text-base font-medium text-gray-700">
                      Film Shipment Number{" "}
                      <span className="text-gray-500">(Optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-10 sm:h-11 text-sm sm:text-base"
                        data-form-type="other"
                        data-lpignore="true"
                        autoComplete="off"
                        {...field}
                        placeholder="Enter film shipment number"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-4 sm:pt-6 border-t border-gray-200">
                <Button
                  type="submit"
                  className="w-full sm:w-auto sm:min-w-[150px] h-10 sm:h-11 text-sm sm:text-base"
                >
                  Create Product
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
