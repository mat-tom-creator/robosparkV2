import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchUserRegistrations,
  cancelRegistration,
  selectRegistrations,
  selectIsLoading,
  selectDashboardError,
} from "../../features/dashboard/dashboardSlice";
import { paths } from "../../routes/paths";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/Dialog";
import { Calendar, Search, Check, X, AlertCircle } from "lucide-react";

export function MyCourses() {
  const dispatch = useAppDispatch();
  const registrations = useAppSelector(selectRegistrations);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectDashboardError);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isCancellationDialogOpen, setIsCancellationDialogOpen] =
    useState(false);
  const [selectedRegistrationId, setSelectedRegistrationId] = useState<
    string | null
  >(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  // Fetch registrations on component mount
  useEffect(() => {
    dispatch(fetchUserRegistrations());
  }, [dispatch]);

  // Filter and search registrations
  const filteredRegistrations = registrations.filter((registration) => {
    const matchesSearch =
      registration.courseName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      registration.childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.confirmationNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" || registration.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const openCancellationDialog = (registrationId: string) => {
    setSelectedRegistrationId(registrationId);
    setIsCancellationDialogOpen(true);
  };

  const handleCancelRegistration = async () => {
    if (!selectedRegistrationId || !cancellationReason) return;

    try {
      setIsCancelling(true);
      await dispatch(
        cancelRegistration({
          id: selectedRegistrationId,
          reason: cancellationReason,
        })
      );
      setIsCancellationDialogOpen(false);
      setCancellationReason("");
    } catch (error) {
      console.error("Failed to cancel registration:", error);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">My Courses</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and manage your course registrations
        </p>
      </div>

      {error && (
        <div className="flex items-center rounded-md bg-red-50 p-4 text-red-700">
          <AlertCircle className="mr-2 h-5 w-5" />
          <div>{error}</div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search courses..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex space-x-2">
          <Button
            variant={filterStatus === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("all")}
          >
            All
          </Button>
          <Button
            variant={filterStatus === "active" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("active")}
          >
            Active
          </Button>
          <Button
            variant={filterStatus === "completed" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("completed")}
          >
            Completed
          </Button>
          <Button
            variant={filterStatus === "canceled" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("canceled")}
          >
            Canceled
          </Button>
        </div>
      </div>

      {/* Courses list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : filteredRegistrations.length === 0 ? (
        <div className="rounded-lg border bg-white p-12 text-center">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No courses found
          </h3>
          <p className="mt-2 text-gray-500">
            {registrations.length === 0
              ? "You haven't registered for any courses yet."
              : "No courses match your search or filter criteria."}
          </p>
          {registrations.length === 0 && (
            <Button asChild className="mt-4">
              <Link to={paths.courses}>Browse Courses</Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredRegistrations.map((registration, index) => (
            <motion.div
              key={registration.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="overflow-hidden rounded-lg border bg-white shadow-sm"
            >
              <div className="border-b p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {registration.courseName}
                  </h3>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      registration.status === "active"
                        ? "bg-green-100 text-green-800"
                        : registration.status === "completed"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {registration.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Participant: {registration.childName}
                </p>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Start Date</p>
                    <p className="text-sm font-medium">
                      {new Date(registration.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">End Date</p>
                    <p className="text-sm font-medium">
                      {new Date(registration.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-xs text-gray-500">Confirmation Number</p>
                  <p className="text-sm font-medium">
                    {registration.confirmationNumber}
                  </p>
                </div>
              </div>

              <div className="flex border-t p-4">
                <Link
                  to={`${paths.dashboard}/courses/${registration.id}`}
                  className="flex-1 text-center text-sm font-medium text-primary hover:text-primary/80"
                >
                  View Details
                </Link>
                {registration.status === "active" && (
                  <button
                    onClick={() => openCancellationDialog(registration.id)}
                    className="flex-1 text-center text-sm font-medium text-red-600 hover:text-red-500"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Cancellation Dialog */}
      <Dialog
        open={isCancellationDialogOpen}
        onOpenChange={setIsCancellationDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Course Registration</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm text-gray-500">
              Are you sure you want to cancel this course registration? Please
              provide a reason for cancellation.
            </p>

            <div className="mt-4">
              <label
                htmlFor="cancellationReason"
                className="block text-sm font-medium text-gray-700"
              >
                Reason for cancellation*
              </label>
              <textarea
                id="cancellationReason"
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                required
              ></textarea>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsCancellationDialogOpen(false);
                setCancellationReason("");
              }}
              disabled={isCancelling}
            >
              <X className="mr-2 h-4 w-4" />
              Never mind
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleCancelRegistration}
              disabled={!cancellationReason || isCancelling}
            >
              {isCancelling ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Cancelling...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Confirm Cancellation
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
