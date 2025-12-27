"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getWarrantyByIdApi, getCarPartsApi } from "@/lib/apis/warrantiesApi";
import WarrantyForm from "../../_components/WarrantyForm";
import { formatDate } from "@/lib/utils";
import { Warranty, CarPart } from "@/types/warrantiesType";

export default function Page() {
  const params = useParams();
  const id = params.id as string;
  const [warranty, setWarranty] = useState<Warranty | null>(null);
  const [carParts, setCarParts] = useState<CarPart[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [warrantyData, carPartsData] = await Promise.all([
          getWarrantyByIdApi(Number(id)),
          getCarPartsApi(),
        ]);

        if (warrantyData) {
          warrantyData.installationDate = formatDate(
            warrantyData.installationDate
          );
        }

        setWarranty(warrantyData);
        setCarParts(carPartsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <WarrantyForm warranty={warranty} carParts={carParts} mode="update" />
    </div>
  );
}
