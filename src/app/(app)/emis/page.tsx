"use client";

import { Header } from "@/components/shared/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useOrders } from "@/lib/hooks/use-orders";
import { formatCurrency } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/date";
import { STATUS_COLORS } from "@/lib/constants/statuses";

export default function EMIsPage() {
  const { orders, loading } = useOrders();

  const emiOrders = orders.filter((o) => o.isEMI);
  const totalMonthly = emiOrders.reduce((s, o) => s + (o.emiPerMonth || 0), 0);
  const totalOutflow = orders.reduce((s, o) => s + o.totalAmount, 0);

  if (loading) {
    return (
      <>
        <Header title="EMIs & Orders" />
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          Loading...
        </div>
      </>
    );
  }

  return (
    <>
      <Header
        title="EMIs & Orders"
        description={`${orders.length} orders, ${emiOrders.length} on EMI`}
      />
      <div className="flex-1 p-4 md:p-6 space-y-6">
        {/* Summary */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="text-xl font-bold">{orders.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Outflow</p>
              <p className="text-xl font-bold">{formatCurrency(totalOutflow)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">EMI Orders</p>
              <p className="text-xl font-bold">{emiOrders.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Monthly EMI</p>
              <p className="text-xl font-bold">{formatCurrency(totalMonthly)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">All Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">
                No orders yet. Import from Excel to get started.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order #</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>EMI</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-sm">
                          #{order.orderId}
                        </TableCell>
                        <TableCell>{order.vendor}</TableCell>
                        <TableCell>{formatDate(order.orderDate)}</TableCell>
                        <TableCell className="max-w-[200px]">
                          <div className="truncate text-sm" title={order.items?.join(", ")}>
                            {order.items?.join(", ") || "—"}
                          </div>
                        </TableCell>
                        <TableCell className="text-right tabular-nums font-semibold">
                          {formatCurrency(order.totalAmount)}
                        </TableCell>
                        <TableCell>
                          {order.isEMI ? (
                            <div className="text-sm">
                              <span className="font-medium">
                                {formatCurrency(order.emiPerMonth || 0)}
                              </span>
                              <span className="text-muted-foreground">
                                {" "}x {order.emiMonths}M
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">Full payment</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={STATUS_COLORS[order.status] || ""}
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* EMI Details */}
        {emiOrders.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">EMI Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {emiOrders.map((order) => (
                <div key={order.id} className="rounded-lg border p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Order #{order.orderId}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.items?.join(", ")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(order.emiPerMonth || 0)}/mo</p>
                      <p className="text-xs text-muted-foreground">
                        {order.emiMonths} months total
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">{order.notes}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
