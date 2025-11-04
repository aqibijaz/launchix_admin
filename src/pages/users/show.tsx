// pages/users/show.tsx
import { useNavigation, useOne, useShow } from "@refinedev/core";
import { useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Mail, Calendar, Shield, Briefcase, CreditCard, } from "lucide-react";
import { UserDetail } from "@/types/user";

export const UserShow = () => {
  const { id } = useParams<{ id: string }>();
  const { list } = useNavigation();
  const { result: record } = useShow({});

  const {
    result: userDetail,
    query: { isLoading },
  } = useOne<UserDetail>({
    resource: "users",
    id,
    queryOptions: {
      enabled: !!record,
    },
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };


   const getInitials = (firstName: string, lastName: string) => {
    const first = firstName ? firstName[0] : "";
    const last = lastName ? lastName[0] : "";
    return `${first}${last}`.toUpperCase();
  };

  if (!userDetail || isLoading ) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
            <span className="text-lg">Loading user details...</span>
          </div>
        </div>
      </div>
    );
  }

  const { user, stats, subscriptions, recentInvoices, brands } = userDetail;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => list("users")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Users
        </Button>
      </div>

      {/* User Profile Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={user.profileImage} alt={user.firstName} />
              <AvatarFallback className="text-2xl">
                {getInitials(user.firstName, user.lastName)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold">
                    {user.firstName} {user.lastName}
                  </h1>
                  {user.username && (
                    <p className="text-muted-foreground mt-1">@{user.username}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Badge
                    variant={user.role === "admin" ? "default" : "secondary"}
                    className={
                      user.role === "admin" ? "bg-brand-blue text-white" : ""
                    }
                  >
                    <Shield className="w-3 h-3 mr-1" />
                    {user.role}
                  </Badge>
                  <Badge
                    variant={user.isDeleted ? "destructive" : "default"}
                    className={!user.isDeleted ? "bg-green-500 text-white" : ""}
                  >
                    {user.isDeleted ? "Deleted" : "Active"}
                  </Badge>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {formatDate(user.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Brands
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-brand-blue" />
              <span className="text-3xl font-bold">{stats.brandCount}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Subscriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-brand-violet" />
              <span className="text-3xl font-bold">{stats.subscriptionCount}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Subscriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green-500" />
              <span className="text-3xl font-bold">{stats.activeSubscriptions}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Brands */}
      <Card>
        <CardHeader>
          <CardTitle>Brands</CardTitle>
        </CardHeader>
        <CardContent>
          {brands.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No brands found
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Business Name</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Brand Style</TableHead>
                  <TableHead>Subdomain</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead>Published URL</TableHead>
                  <TableHead>Created Time</TableHead>
                  {/* <TableHead className="text-right">Actions</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {brands.map((brand) => (
                  <TableRow
                    key={brand._id}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    <TableCell className="font-medium">{brand.businessName}</TableCell>
                    <TableCell>{brand.industry}</TableCell>
                    <TableCell>
                      {brand.brandStyle?.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {brand.brandStyle.map((style, i) => (
                            <Badge key={i} variant="secondary">
                              {style}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>{brand.subdomain || "-"}</TableCell>
                    <TableCell>
                      {brand.subdomain ? (
                        <Badge className="bg-green-500 text-white">Yes</Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-gray-300 text-gray-700">
                          No
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {brand.publishedUrl ? (
                        <a
                          href={brand.publishedUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {brand.publishedUrl}
                        </a>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                    {formatDate(brand.createdAt)}
                  </TableCell>
                    {/* <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => show("brands", brand._id)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Subscriptions */}
      <Card>
        <CardHeader>
          <CardTitle>Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          {subscriptions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No subscriptions found
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Billing Period</TableHead>
                  <TableHead>Current Period</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((subscription) => (
                  <TableRow key={subscription._id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{subscription.plan.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {subscription.plan.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          subscription.status === "active" ? "default" : "secondary"
                        }
                        className={
                          subscription.status === "active"
                            ? "bg-green-500 text-white"
                            : ""
                        }
                      >
                        {subscription.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(
                        subscription.plan.amount,
                        subscription.plan.currency
                      )}
                    </TableCell>
                    <TableCell>
                      Every {subscription.intervalCount}{" "}
                      {subscription.interval}
                      {subscription.intervalCount > 1 ? "s" : ""}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(subscription.currentPeriodStart)} -{" "}
                      {formatDate(subscription.currentPeriodEnd)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Recent Invoices */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          {recentInvoices.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No invoices found
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice Date</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Amount Due</TableHead>
                  <TableHead>Amount Paid</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentInvoices.map((invoice) => (
                  <TableRow key={invoice._id}>
                    <TableCell className="text-muted-foreground">
                      {formatDate(invoice.createdAt)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {invoice.subscription.plan.name}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(invoice.amountDue, invoice.currency)}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(invoice.amountPaid, invoice.currency)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          invoice.status === "paid"
                            ? "default"
                            : invoice.status === "open"
                              ? "secondary"
                              : "destructive"
                        }
                        className={
                          invoice.status === "paid"
                            ? "bg-green-500 text-white"
                            : invoice.status === "open"
                              ? "bg-yellow-500 text-white"
                              : ""
                        }
                      >
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(invoice.dueDate)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};