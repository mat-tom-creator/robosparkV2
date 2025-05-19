import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchPaymentHistory,
  selectPayments,
  selectIsLoading,
  selectDashboardError,
} from "../../features/dashboard/dashboardSlice";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import {
  CreditCard,
  Search,
  Download,
  AlertCircle,
  Calendar,
} from "lucide-react";

export function PaymentHistory() {
  const dispatch = useAppDispatch();
  const payments = useAppSelector(selectPayments);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectDashboardError);

  // State for filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({
    from: "",
    to: "",
  });

  // Fetch payment history on component mount
  useEffect(() => {
    dispatch(fetchPaymentHistory());
  }, [dispatch]);

  // Filter and search payments
  const filteredPayments = payments.filter((payment) => {
    // Search filter
    const matchesSearch =
      payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus =
      filterStatus === "all" || payment.status === filterStatus;

    // Date range filter
    let matchesDateRange = true;
    if (dateRange.from) {
      const fromDate = new Date(dateRange.from);
      const paymentDate = new Date(payment.date);
      if (paymentDate < fromDate) {
        matchesDateRange = false;
      }
    }
    if (dateRange.to) {
      const toDate = new Date(dateRange.to);
      toDate.setHours(23, 59, 59, 999); // End of day
      const paymentDate = new Date(payment.date);
      if (paymentDate > toDate) {
        matchesDateRange = false;
      }
    }

    return matchesSearch && matchesStatus && matchesDateRange;
  });

  // Calculate totals
  const totalAmount = filteredPayments.reduce(
    (sum, payment) =>
      payment.status === "completed" ? sum + payment.amount : sum,
    0
  );

  // Download receipt function
  const downloadReceipt = (paymentId: string) => {
    console.log(`Downloading receipt for payment ${paymentId}`);
    // In a real app, this would trigger an API call to generate and download a PDF receipt
    alert(`Receipt for payment ${paymentId} would be downloaded.`);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Payment History
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          View and download receipts for your payments
        </p>
      </div>

      {/* Error message if API call fails */}
      {error && (
        <div className="flex items-center rounded-md bg-red-50 p-4 text-red-700">
          <AlertCircle className="mr-2 h-5 w-5" />
          <div>{error}</div>
        </div>
      )}

      {/* Filters section */}
      <div className="space-y-4 rounded-lg border bg-white p-6 shadow-sm">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          {/* Search input */}
          <div className="relative max-w-xs flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by description or payment method..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status filter buttons */}
          <div className="flex space-x-2">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("all")}
            >
              All
            </Button>
            <Button
              variant={filterStatus === "completed" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("completed")}
            >
              Completed
            </Button>
            <Button
              variant={filterStatus === "pending" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("pending")}
            >
              Pending
            </Button>
            <Button
              variant={filterStatus === "refunded" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("refunded")}
            >
              Refunded
            </Button>
          </div>
        </div>

        {/* Date range filters */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <div className="flex-1">
            <label
              htmlFor="from-date"
              className="block text-sm font-medium text-gray-700"
            >
              From Date
            </label>
            <div className="relative mt-1">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                id="from-date"
                type="date"
                value={dateRange.from}
                onChange={(e) =>
                  setDateRange({ ...dateRange, from: e.target.value })
                }
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex-1">
            <label
              htmlFor="to-date"
              className="block text-sm font-medium text-gray-700"
            >
              To Date
            </label>
            <div className="relative mt-1">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                id="to-date"
                type="date"
                value={dateRange.to}
                onChange={(e) =>
                  setDateRange({ ...dateRange, to: e.target.value })
                }
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex items-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDateRange({ from: "", to: "" })}
              className="w-full sm:w-auto"
            >
              Clear Dates
            </Button>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid gap-4 sm:grid-cols-3"
      >
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Total Transactions</p>
          <p className="mt-1 text-2xl font-semibold text-primary">
            {filteredPayments.length}
          </p>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Total Paid</p>
          <p className="mt-1 text-2xl font-semibold text-primary">
            ${totalAmount.toFixed(2)}
          </p>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Refunded Amount</p>
          <p className="mt-1 text-2xl font-semibold text-primary">
            $
            {payments
              .filter((p) => p.status === "refunded")
              .reduce((sum, p) => sum + p.amount, 0)
              .toFixed(2)}
          </p>
        </div>
      </motion.div>

      {/* Payments list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : filteredPayments.length === 0 ? (
        <div className="rounded-lg border bg-white p-12 text-center">
          <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No payments found
          </h3>
          <p className="mt-2 text-gray-500">
            {payments.length === 0
              ? "You haven't made any payments yet."
              : "No payments match your search or filter criteria."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Description
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Payment Method
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredPayments.map((payment, index) => (
                  <motion.tr
                    key={payment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                  >
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {new Date(payment.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {payment.description}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {payment.paymentMethod}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      ${payment.amount.toFixed(2)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          payment.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : payment.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : payment.status === "refunded"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-red-100 text-red-800"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      <button
                        className="flex items-center text-primary hover:text-primary/80"
                        onClick={() => downloadReceipt(payment.id)}
                      >
                        <Download className="mr-1 h-4 w-4" />
                        Receipt
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
