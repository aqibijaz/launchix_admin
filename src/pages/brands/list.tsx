import { useTable } from "@refinedev/core";
import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableCell, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const BrandList = () => {
  const { tableQueryResult, current, setCurrent, pageCount } = useTable({
    resource: "brands",
    meta: { dataProviderName: "brands" },
    pagination: { current: 1, pageSize: 5 },
  });

  const brands = tableQueryResult?.data?.data ?? [];

  return (
    <Card className="p-4">
      <h2 className="text-xl font-semibold mb-4">Brands</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Business Name</TableCell>
            <TableCell>Industry</TableCell>
            <TableCell>Owner</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {brands.map((b: any) => (
            <TableRow key={b._id}>
              <TableCell>{b.businessName}</TableCell>
              <TableCell>{b.industry}</TableCell>
              <TableCell>{b.owner?.email}</TableCell>
              <TableCell>
                <Link to={`/brands/show/${b._id}`}>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between mt-4">
        <Button disabled={current === 1} onClick={() => setCurrent((p) => p - 1)}>
          Prev
        </Button>
        <span>Page {current} of {pageCount}</span>
        <Button disabled={current === pageCount} onClick={() => setCurrent((p) => p + 1)}>
          Next
        </Button>
      </div>
    </Card>
  );
};
