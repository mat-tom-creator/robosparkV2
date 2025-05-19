import { formatDate } from "../../../lib/utils";

interface Registration {
  id: string;
  date: string;
  studentName: string;
  courseName: string;
  amount: number;
  status: "completed" | "pending" | "cancelled";
}

interface RecentRegistrationsTableProps {
  registrations: Registration[];
}

export function RecentRegistrationsTable({
  registrations,
}: RecentRegistrationsTableProps) {
  return (
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
            Student
          </th>
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
        {registrations.map((registration) => (
          <tr key={registration.id} className="hover:bg-gray-50">
            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
              {formatDate(new Date(registration.date))}
            </td>
            <td className="px-6 py-4 text-sm font-medium text-gray-900">
              {registration.studentName}
            </td>
            <td className="px-6 py-4 text-sm text-gray-500">
              {registration.courseName}
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
              ${registration.amount.toLocaleString()}
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-sm">
              <span
                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  registration.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : registration.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                }`}
              >
                {registration.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
