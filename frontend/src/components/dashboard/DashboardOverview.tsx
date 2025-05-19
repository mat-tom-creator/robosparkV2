import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { 
  fetchUserRegistrations, 
  fetchPaymentHistory,
  selectRegistrations,
  selectPayments,
  selectIsLoading,
  selectDashboardError
} from '../../features/dashboard/dashboardSlice';
import { selectUser } from '../../features/auth/authSlice';
import { paths } from '../../routes/paths';
import { Button } from '../../components/ui/Button';
import { 
  Calendar, 
  CreditCard, 
  Book, 
  User,
  AlertCircle
} from 'lucide-react';

export function DashboardOverview() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const registrations = useAppSelector(selectRegistrations);
  const payments = useAppSelector(selectPayments);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectDashboardError);
  
  // Fetch dashboard data on component mount
  useEffect(() => {
    dispatch(fetchUserRegistrations());
    dispatch(fetchPaymentHistory());
  }, [dispatch]);
  
  // Filter upcoming courses (active registrations)
  const upcomingCourses = registrations.filter(reg => reg.status === 'active');
  
  // Get total amount spent
  const totalSpent = payments.reduce((sum, payment) => 
    payment.status === 'completed' ? sum + payment.amount : sum, 0
  );
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }
  
  // Find the registration
  const registration = registrations.find(reg => reg.id === id);
  
  // If registration not found, redirect back to courses page
  if (!registration && !isLoading) {
    return <Navigate to={`${paths.dashboard}/courses`} />;
  }
  
  // Print receipt
  const handlePrintReceipt = () => {
    setShowPrintReceipt(true);
    setTimeout(() => {
      window.print();
      setShowPrintReceipt(false);
    }, 100);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Link
          to={`${paths.dashboard}/courses`}
          className="flex items-center text-gray-500 hover:text-primary"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to My Courses
        </Link>
      </div>
      
      {registration && (
        <>
          <div className="rounded-lg border bg-white shadow-sm">
            <div className="border-b p-6">
              <div className="flex flex-col justify-between sm:flex-row sm:items-center">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">
                    {registration.courseName}
                  </h1>
                  <p className="mt-1 text-sm text-gray-500">
                    Confirmation Number: {registration.confirmationNumber}
                  </p>
                </div>
                <div className="mt-4 sm:mt-0">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                      registration.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : registration.status === 'completed'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {registration.status}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2">
                  <div className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="rounded-lg border bg-gray-50 p-4"
                    >
                      <h2 className="mb-4 text-lg font-medium text-gray-900">Course Details</h2>
                      
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="flex items-start">
                          <Calendar className="mr-3 mt-1 h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">Schedule</p>
                            <p className="text-sm text-gray-500">
                              {new Date(registration.startDate).toLocaleDateString()} - {new Date(registration.endDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <Clock className="mr-3 mt-1 h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">Sessions</p>
                            <p className="text-sm text-gray-500">
                              Mon, Wed, Fri | 9:00 AM - 12:00 PM
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <MapPin className="mr-3 mt-1 h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">Location</p>
                            <p className="text-sm text-gray-500">
                              123 Innovation Way, Techville, TX 75001
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <Award className="mr-3 mt-1 h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">Level</p>
                            <p className="text-sm text-gray-500">
                              Beginner
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className="rounded-lg border bg-gray-50 p-4"
                    >
                      <h2 className="mb-4 text-lg font-medium text-gray-900">Participant Information</h2>
                      
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="flex items-start">
                          <User className="mr-3 mt-1 h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">Participant</p>
                            <p className="text-sm text-gray-500">
                              {registration.childName}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <BookOpen className="mr-3 mt-1 h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">Materials</p>
                            <p className="text-sm text-gray-500">
                              All materials provided
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 rounded-md bg-primary/5 p-3">
                        <p className="text-sm text-gray-700">
                          <strong>Special Notes:</strong> Please ensure your child brings a water bottle and snack each day. All electronics and materials will be provided.
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="rounded-lg border bg-gray-50 p-4"
                >
                  <h2 className="mb-4 text-lg font-medium text-gray-900">Payment Summary</h2>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Course Fee:</span>
                      <span className="text-sm font-medium">${registration.amountPaid.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Discount:</span>
                      <span className="text-sm font-medium">$0.00</span>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-2">
                      <div className="flex justify-between font-medium">
                        <span>Total Paid:</span>
                        <span className="text-primary">${registration.amountPaid.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={handlePrintReceipt}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Print Receipt
                    </Button>
                    
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Download className="mr-2 h-4 w-4" />
                      Download Calendar
                    </Button>
                    
                    {registration.status === 'active' && (
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="mt-4 w-full"
                        asChild
                      >
                        <Link to={`${paths.dashboard}/courses`}>
                          Cancel Registration
                        </Link>
                      </Button>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
          
          {/* Print View - only visible when printing */}
          {showPrintReceipt && (
            <div className="print-only space-y-6 p-8">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-primary">RoboSpark</h1>
                <h2 className="mt-2 text-2xl font-semibold">Course Registration Receipt</h2>
              </div>
              
              <div className="rounded-lg border p-6">
                <h3 className="mb-4 text-xl font-semibold">{registration.courseName}</h3>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="font-medium">Confirmation Number:</p>
                    <p>{registration.confirmationNumber}</p>
                  </div>
                  
                  <div>
                    <p className="font-medium">Status:</p>
                    <p>{registration.status}</p>
                  </div>
                  
                  <div>
                    <p className="font-medium">Participant:</p>
                    <p>{registration.childName}</p>
                  </div>
                  
                  <div>
                    <p className="font-medium">Dates:</p>
                    <p>{new Date(registration.startDate).toLocaleDateString()} - {new Date(registration.endDate).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="mt-6 border-t pt-4">
                  <h4 className="mb-2 font-medium">Payment Details</h4>
                  
                  <div className="flex justify-between border-b pb-2">
                    <span>Course Fee:</span>
                    <span>${registration.amountPaid.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between border-b pb-2 pt-2">
                    <span>Discount:</span>
                    <span>$0.00</span>
                  </div>
                  
                  <div className="flex justify-between pt-2 font-bold">
                    <span>Total Paid:</span>
                    <span>${registration.amountPaid.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-center text-sm">
                <p>RoboSpark - 123 Innovation Way, Techville, TX 75001</p>
                <p>Email: info@robospark.com | Phone: (555) 123-4567</p>
                <p className="mt-4">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back, {user?.firstName}! Here's an overview of your account.
        </p>
      </div>
      
      {error && (
        <div className="flex items-center rounded-md bg-red-50 p-4 text-red-700">
          <AlertCircle className="mr-2 h-5 w-5" />
          <div>{error}</div>
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-lg border bg-white p-6 shadow-sm"
        >
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Account</h3>
              <p className="text-lg font-semibold text-gray-900">{user?.email}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="rounded-lg border bg-white p-6 shadow-sm"
        >
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Courses</h3>
              <p className="text-lg font-semibold text-gray-900">{registrations.length} Registered</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="rounded-lg border bg-white p-6 shadow-sm"
        >
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Spent</h3>
              <p className="text-lg font-semibold text-gray-900">${totalSpent.toFixed(2)}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="rounded-lg border bg-white p-6 shadow-sm"
        >
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Book className="h-6 w-6 text-primary" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Active Courses</h3>
              <p className="text-lg font-semibold text-gray-900">{upcomingCourses.length}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Upcoming Courses */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-lg border bg-white p-6 shadow-sm"
      >
        <h2 className="text-lg font-semibold text-gray-900">Upcoming Courses</h2>
        
        {upcomingCourses.length === 0 ? (
          <div className="mt-4 rounded-md bg-gray-50 p-6 text-center">
            <Calendar className="mx-auto h-10 w-10 text-gray-400" />
            <h3 className="mt-2 text-base font-medium text-gray-900">No upcoming courses</h3>
            <p className="mt-1 text-sm text-gray-500">
              You don't have any active course registrations.
            </p>
            <Button asChild className="mt-4">
              <Link to={paths.courses}>Browse Courses</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-4 overflow-hidden rounded-md border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Course
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Participant
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Dates
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
                {upcomingCourses.map((registration) => (
                  <tr key={registration.id}>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {registration.courseName}
                      </div>
                      <div className="text-sm text-gray-500">
                        Confirmation: {registration.confirmationNumber}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {registration.childName}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {new Date(registration.startDate).toLocaleDateString()} - {new Date(registration.endDate).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <Link
                        to={`${paths.dashboard}/courses/${registration.id}`}
                        className="text-primary hover:text-primary/80"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="mt-4 text-right">
          <Link
            to={`${paths.dashboard}/courses`}
            className="text-sm font-medium text-primary hover:text-primary/80"
          >
            View all courses →
          </Link>
        </div>
      </motion.div>

      {/* Recent Payments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="rounded-lg border bg-white p-6 shadow-sm"
      >
        <h2 className="text-lg font-semibold text-gray-900">Recent Payments</h2>
        
        {payments.length === 0 ? (
          <div className="mt-4 rounded-md bg-gray-50 p-6 text-center">
            <CreditCard className="mx-auto h-10 w-10 text-gray-400" />
            <h3 className="mt-2 text-base font-medium text-gray-900">No payment history</h3>
            <p className="mt-1 text-sm text-gray-500">
              You haven't made any payments yet.
            </p>
          </div>
        ) : (
          <div className="mt-4 overflow-hidden rounded-md border border-gray-200">
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
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {payments.slice(0, 5).map((payment) => (
                  <tr key={payment.id}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {new Date(payment.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{payment.description}</div>
                      <div className="text-sm text-gray-500">{payment.paymentMethod}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      ${payment.amount.toFixed(2)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          payment.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : payment.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : payment.status === 'refunded'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="mt-4 text-right">
          <Link
            to={`${paths.dashboard}/payments`}
            className="text-sm font-medium text-primary hover:text-primary/80"
          >
            View all payments →
          </Link>
        </div>
      </motion.div>
    </div>
  );
}