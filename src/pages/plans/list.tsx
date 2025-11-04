/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTable, useNavigation, useDelete } from "@refinedev/core";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash } from "lucide-react";

export const PlanList = () => {
    const { create, edit } = useNavigation();
    const { mutate: deletePlan } = useDelete();
    const {
        tableQuery: { data, isLoading },
        setCurrentPage,
        currentPage,
        pageSize,
        pageCount,
    } = useTable({ resource: "plans", pagination: { currentPage: 1, pageSize: 10 } });

    const plans = data?.data ?? [];
    const total = data?.total || 0;

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Plans</h1>
                    <p className="text-muted-foreground mt-1">Manage all subscription plans</p>
                </div>
                <Button onClick={() => create("plans")} className="btn-brand">
                    <Plus className="w-4 h-4 mr-2" /> Create Plan
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Plans</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <p className="text-center text-muted-foreground">Loading...</p>
                    ) : (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Code</TableHead>
                                        <TableHead>Interval</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Max Brands</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Popular</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {plans.map((plan: any) => (
                                        <TableRow key={plan._id}>
                                            <TableCell>{plan.name}</TableCell>
                                            <TableCell>{plan.code}</TableCell>
                                            <TableCell>
                                                {plan.intervalCount} {plan.interval}
                                            </TableCell>
                                            <TableCell>
                                                {(plan.amount / 100).toFixed(2)} {plan.currency?.toUpperCase()}
                                            </TableCell>
                                            <TableCell>{plan.maxBrands ?? "∞"}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    className={
                                                        plan.isActive
                                                            ? "bg-green-500 text-white"
                                                            : "bg-gray-400 text-white"
                                                    }
                                                >
                                                    {plan.isActive ? "Active" : "Inactive"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {plan.isPopular ? (
                                                    <Badge className="bg-indigo-500 text-white">Yes</Badge>
                                                ) : (
                                                    <Badge variant="secondary">No</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => edit("plans", plan._id)}
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Button>

                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        if (confirm(`Are you sure you want to delete "${plan.name}"?`)) {
                                                            deletePlan({ resource: "plans", id: plan._id });
                                                        }
                                                    }}
                                                >
                                                    <Trash className="w-4 h-4 text-red-500" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            {/* Pagination */}
                            {plans.length > 0 && (
                                <div className="flex items-center justify-between px-6 py-4 border-t">
                                    <div className="text-sm text-muted-foreground">
                                        Showing {(currentPage - 1) * pageSize + 1} to{" "}
                                        {Math.min(currentPage * pageSize, total)} of {total} plans
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        >
                                            Previous
                                        </Button>
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: Math.min(pageCount, 5) }, (_, i) => {
                                                let pageNum: number;
                                                if (pageCount <= 5) {
                                                    pageNum = i + 1;
                                                } else if (currentPage <= 3) {
                                                    pageNum = i + 1;
                                                } else if (currentPage >= pageCount - 2) {
                                                    pageNum = pageCount - 4 + i;
                                                } else {
                                                    pageNum = currentPage - 2 + i;
                                                }

                                                return (
                                                    <Button
                                                        key={pageNum}
                                                        variant={currentPage === pageNum ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => setCurrentPage(pageNum)}
                                                        className={
                                                            currentPage === pageNum ? "bg-blue-500 text-white" : ""
                                                        }
                                                    >
                                                        {pageNum}
                                                    </Button>
                                                );
                                            })}
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage(currentPage + 1)}
                                            disabled={currentPage === pageCount}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
