"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/Header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CreditCard,
  Calendar,
  MapPin,
  Users,
  Download,
  Filter,
  Search,
  Eye,
  Receipt,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

interface Transaction {
  id: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  ticketQuantity: number;
  totalAmount: number;
  status: "COMPLETED" | "PENDING" | "CANCELLED" | "REFUNDED";
  paymentMethod: string;
  transactionDate: string;
  referenceNumber: string;
  organizerName: string;
  pointsUsed: number;
  discountApplied: number;
}

export default function TransactionsPage() {
  const { user, isLoaded } = useUser();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const [filters, setFilters] = useState({
    status: "ALL",
    search: "",
  });

  useEffect(() => {
    if (isLoaded && user) {
      fetchTransactions();
    }
  }, [isLoaded, user]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      // Simulate API call - in real app, this would be a real API call
      const mockTransactions: Transaction[] = [
        {
          id: "TXN001",
          eventName: "Tech Conference 2024",
          eventDate: "2024-12-15",
          eventLocation: "Jakarta Convention Center",
          ticketQuantity: 2,
          totalAmount: 1000000,
          status: "COMPLETED",
          paymentMethod: "Credit Card",
          transactionDate: "2024-11-20",
          referenceNumber: "REF-2024-001",
          organizerName: "Tech Events Inc",
          pointsUsed: 50000,
          discountApplied: 100000,
        },
        {
          id: "TXN002",
          eventName: "Music Festival 2024",
          eventDate: "2024-11-30",
          eventLocation: "GBK Stadium",
          ticketQuantity: 1,
          totalAmount: 750000,
          status: "PENDING",
          paymentMethod: "Bank Transfer",
          transactionDate: "2024-11-18",
          referenceNumber: "REF-2024-002",
          organizerName: "Music Productions",
          pointsUsed: 0,
          discountApplied: 0,
        },
        {
          id: "TXN003",
          eventName: "Startup Meetup",
          eventDate: "2024-10-25",
          eventLocation: "Co-working Space Jakarta",
          ticketQuantity: 1,
          totalAmount: 0,
          status: "COMPLETED",
          paymentMethod: "Free Event",
          transactionDate: "2024-10-15",
          referenceNumber: "REF-2024-003",
          organizerName: "Startup Community",
          pointsUsed: 0,
          discountApplied: 0,
        },
        {
          id: "TXN004",
          eventName: "Art Exhibition",
          eventDate: "2024-09-20",
          eventLocation: "National Gallery",
          ticketQuantity: 3,
          totalAmount: 450000,
          status: "REFUNDED",
          paymentMethod: "Credit Card",
          transactionDate: "2024-09-10",
          referenceNumber: "REF-2024-004",
          organizerName: "Art Gallery Jakarta",
          pointsUsed: 25000,
          discountApplied: 50000,
        },
      ];

      setTransactions(mockTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Completed
          </Badge>
        );
      case "PENDING":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Pending
          </Badge>
        );
      case "CANCELLED":
        return <Badge variant="destructive">Cancelled</Badge>;
      case "REFUNDED":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            Refunded
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="size-4 text-green-600" />;
      case "PENDING":
        return <Clock className="size-4 text-yellow-600" />;
      case "CANCELLED":
        return <XCircle className="size-4 text-red-600" />;
      case "REFUNDED":
        return <AlertCircle className="size-4 text-gray-600" />;
      default:
        return <Clock className="size-4 text-gray-600" />;
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesStatus =
      filters.status === "ALL" || transaction.status === filters.status;
    const matchesSearch =
      transaction.eventName
        .toLowerCase()
        .includes(filters.search.toLowerCase()) ||
      transaction.referenceNumber
        .toLowerCase()
        .includes(filters.search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const downloadReceipt = () => {
    // Simulate download
    toast.success("Receipt downloaded successfully!");
  };

  if (!isLoaded) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in</h1>
          <p className="text-muted-foreground mb-6">
            You need to be signed in to view your transactions.
          </p>
          <Button asChild>
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Transaction History</h1>
          <p className="text-muted-foreground mt-2">
            View all your event purchases and payment history.
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="size-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
                  <input
                    type="text"
                    placeholder="Search by event name or reference number..."
                    className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filters.search}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        search: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <Select
                  value={filters.status}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Status</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    <SelectItem value="REFUNDED">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <Card
                  key={transaction.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getStatusIcon(transaction.status)}
                          <h3 className="font-semibold text-lg">
                            {transaction.eventName}
                          </h3>
                          {getStatusBadge(transaction.status)}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="size-4" />
                            <span>{formatDate(transaction.eventDate)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="size-4" />
                            <span>{transaction.eventLocation}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="size-4" />
                            <span>{transaction.ticketQuantity} ticket(s)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CreditCard className="size-4" />
                            <span className="font-medium">
                              {transaction.totalAmount === 0
                                ? "FREE"
                                : formatPrice(transaction.totalAmount)}
                            </span>
                          </div>
                        </div>

                        <div className="mt-3 text-xs text-muted-foreground">
                          <span>Ref: {transaction.referenceNumber}</span>
                          <span className="mx-2">•</span>
                          <span>{formatDate(transaction.transactionDate)}</span>
                          <span className="mx-2">•</span>
                          <span>Organizer: {transaction.organizerName}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Dialog
                          open={
                            showDetailsDialog &&
                            selectedTransaction?.id === transaction.id
                          }
                          onOpenChange={(open) => {
                            setShowDetailsDialog(open);
                            if (open) setSelectedTransaction(transaction);
                            else setSelectedTransaction(null);
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="size-4 mr-2" />
                              Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Transaction Details</DialogTitle>
                              <DialogDescription>
                                Detailed information about this transaction.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label className="text-sm font-medium">
                                  Event
                                </Label>
                                <p className="text-sm">
                                  {transaction.eventName}
                                </p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">
                                  Reference Number
                                </Label>
                                <p className="text-sm font-mono">
                                  {transaction.referenceNumber}
                                </p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">
                                  Amount
                                </Label>
                                <p className="text-sm font-medium">
                                  {transaction.totalAmount === 0
                                    ? "FREE"
                                    : formatPrice(transaction.totalAmount)}
                                </p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">
                                  Payment Method
                                </Label>
                                <p className="text-sm">
                                  {transaction.paymentMethod}
                                </p>
                              </div>
                              {transaction.pointsUsed > 0 && (
                                <div>
                                  <Label className="text-sm font-medium">
                                    Points Used
                                  </Label>
                                  <p className="text-sm">
                                    {transaction.pointsUsed.toLocaleString()}{" "}
                                    points
                                  </p>
                                </div>
                              )}
                              {transaction.discountApplied > 0 && (
                                <div>
                                  <Label className="text-sm font-medium">
                                    Discount Applied
                                  </Label>
                                  <p className="text-sm">
                                    {formatPrice(transaction.discountApplied)}
                                  </p>
                                </div>
                              )}
                            </div>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => downloadReceipt()}
                              >
                                <Download className="size-4 mr-2" />
                                Download Receipt
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Receipt className="size-12 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-lg font-semibold mb-2">
                    No transactions found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {filters.search || filters.status !== "ALL"
                      ? "No transactions match your current filters."
                      : "You haven't made any transactions yet."}
                  </p>
                  {(filters.search || filters.status !== "ALL") && (
                    <Button
                      variant="outline"
                      onClick={() => setFilters({ status: "ALL", search: "" })}
                    >
                      Clear Filters
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
