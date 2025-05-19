import { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchUserRegistrations,
  selectRegistrations,
  selectIsLoading,
} from "../../features/dashboard/dashboardSlice";
import { paths } from "../../routes/paths";
import { Button } from "../../components/ui/Button";
import {
  Calendar,
  Clock,
  Award,
  MapPin,
  User,
  BookOpen,
  ChevronLeft,
  FileText,
  Download,
} from "lucide-react";

export function CourseDetails() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const registrations = useAppSelector(selectRegistrations);
  const isLoading = useAppSelector(selectIsLoading);

  const [showPrintReceipt, setShowPrintReceipt] = useState(false);

  // Fetch registrations if not already loaded
  useEffect(() => {
    if (registrations.length === 0) {
      dispatch(fetchUserRegistrations());
    }
  }, [dispatch, registrations.length]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }
}
