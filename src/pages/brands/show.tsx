import { useShow } from "@refinedev/core";
import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableCell, TableBody } from "@/components/ui/table";
import { useParams } from "react-router-dom";

export const BrandShow = () => {
  const { id } = useParams();
  const { queryResult } = useShow({
    resource: "brands",
    id,
    meta: { dataProviderName: "brands" },
  });

  const data = queryResult?.data?.data;
  if (!data) return <div>Loading...</div>;

  const { brand, assets } = data;

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-2">Brand Details</h2>
        <p><strong>Business:</strong> {brand.businessName}</p>
        <p><strong>Industry:</strong> {brand.industry}</p>
        <p><strong>Tagline:</strong> {brand.tagline}</p>
        <p><strong>Owner:</strong> {brand.owner?.email}</p>
      </Card>

      {assets && (
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Brand Assets</h3>
          <p><strong>Vision:</strong> {assets.vision}</p>
          <p><strong>Mission:</strong> {assets.mission}</p>
          {assets.palette?.length > 0 && (
            <div className="flex space-x-2 mt-2">
              {assets.palette.map((color: string) => (
                <div key={color} className="w-6 h-6 rounded" style={{ backgroundColor: color }} />
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
};
