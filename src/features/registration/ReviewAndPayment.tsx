import { useState } from "react";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectRegistration,
  setAgreedToTerms,
  setPhotoRelease,
  setCurrentStep,
} from "./registrationSlice";
import {
  selectAppliedDiscount,
  selectDiscountCode,
  selectDiscountError,
  selectIsValidating,
  setDiscountCode,
  validateDiscountCode,
  removeDiscount,
} from "./discountSlice";
import { useGetCourseByIdQuery } from "../../services/courseApi";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { formatDate } from "../../lib/utils";
import { CheckSquare, Trash2, Tag } from "lucide-react";

export function ReviewAndPayment() {
  const dispatch = useAppDispatch();
  const registration = useAppSelector(selectRegistration);
  const discountCode = useAppSelector(selectDiscountCode);
  const appliedDiscount = useAppSelector(selectAppliedDiscount);
  const isValidating = useAppSelector(selectIsValidating);
  const discountError = useAppSelector(selectDiscountError);

  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const { data: course } = useGetCourseByIdQuery(
    registration.selectedCourseId || ""
  );

  const originalPrice = course?.price || 0;
  const discountedPrice = course?.discountedPrice;

  // Calculate price with applied discount code
  let finalPrice = discountedPrice ?? originalPrice;
  let discountAmount = 0;

  if (appliedDiscount) {
    discountAmount = finalPrice * appliedDiscount.discount;
    finalPrice = finalPrice - discountAmount;
  }

  const handleApplyDiscount = () => {
    if (discountCode) {
      dispatch(validateDiscountCode(discountCode));
    }
  };

  const handleRemoveDiscount = () => {
    dispatch(removeDiscount());
  };

  const goBack = () => {
    dispatch(setCurrentStep(3));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!registration.agreedToTerms) {
      return;
    }

    // Simulate payment processing
    setPaymentProcessing(true);
    setTimeout(() => {
      setPaymentProcessing(false);
      dispatch(setCurrentStep(5));
    }, 2000);
  };

  if (!course) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-xl font-semibold text-secondary">
          Review & Complete Registration
        </h2>
        <p className="text-gray-600">
          Please review all information before completing your registration.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Course Summary */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <h3 className="mb-2 text-lg font-medium text-secondary">
            Course Information
          </h3>

          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <img
              src={course.image}
              alt={course.title}
              className="h-32 w-32 rounded-md object-cover"
            />

            <div className="flex-1">
              <h4 className="text-lg font-semibold text-secondary">
                {course.title}
              </h4>
              <p className="text-sm text-gray-600">
                Ages {course.ageRange.min}-{course.ageRange.max} •{" "}
                {course.skillLevel}
              </p>
              <p className="text-sm text-gray-600">
                {formatDate(new Date(course.schedule.startDate))} -{" "}
                {formatDate(new Date(course.schedule.endDate))}
              </p>
              <p className="text-sm text-gray-600">
                {course.schedule.days.join(", ")} | {course.schedule.timeSlot}
              </p>
              <p className="mt-2 font-medium text-primary">
                ${discountedPrice ?? originalPrice}
                {discountedPrice && (
                  <span className="ml-2 text-sm text-gray-500 line-through">
                    ${originalPrice}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Parent Information */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <h3 className="mb-2 text-lg font-medium text-secondary">
            Parent Information
          </h3>

          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <span className="text-sm font-medium text-gray-500">Name:</span>
              <p>
                {registration.parentInfo.firstName}{" "}
                {registration.parentInfo.lastName}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Email:</span>
              <p>{registration.parentInfo.email}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Phone:</span>
              <p>{registration.parentInfo.phone}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">
                Address:
              </span>
              <p>
                {registration.parentInfo.address},{" "}
                {registration.parentInfo.city},{registration.parentInfo.state}{" "}
                {registration.parentInfo.zipCode}
              </p>
            </div>
          </div>
        </div>

        {/* Child Information */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <h3 className="mb-2 text-lg font-medium text-secondary">
            Participant Information
          </h3>

          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <span className="text-sm font-medium text-gray-500">Name:</span>
              <p>
                {registration.childInfo.firstName}{" "}
                {registration.childInfo.lastName}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">
                Date of Birth:
              </span>
              <p>{registration.childInfo.dateOfBirth}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">
                Grade Level:
              </span>
              <p>{registration.childInfo.gradeLevel}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">
                Emergency Contact:
              </span>
              <p>
                {registration.emergencyContact.name} (
                {registration.emergencyContact.relationship}) -
                {registration.emergencyContact.phone}
              </p>
            </div>
          </div>
        </div>

        {/* Discount Code */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <h3 className="mb-4 text-lg font-medium text-secondary">
            Discount Code
          </h3>

          {appliedDiscount ? (
            <div className="flex items-center justify-between rounded-md bg-accent/10 p-3">
              <div className="flex items-center">
                <Tag className="mr-2 h-5 w-5 text-accent" />
                <div>
                  <p className="font-medium text-secondary">
                    {appliedDiscount.code} ({appliedDiscount.discount * 100}%
                    off)
                  </p>
                  <p className="text-sm text-gray-600">
                    {appliedDiscount.description}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-red-500"
                onClick={handleRemoveDiscount}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove discount</span>
              </Button>
            </div>
          ) : (
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Input
                  placeholder="Enter discount code"
                  value={discountCode}
                  onChange={(e) => dispatch(setDiscountCode(e.target.value))}
                  disabled={isValidating}
                  className={discountError ? "border-red-300" : ""}
                />
                {discountError && (
                  <p className="mt-1 text-sm text-red-500">{discountError}</p>
                )}
              </div>
              <Button
                type="button"
                onClick={handleApplyDiscount}
                disabled={!discountCode || isValidating}
              >
                {isValidating ? "Applying..." : "Apply"}
              </Button>
            </div>
          )}
        </div>

        {/* Payment Summary */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <h3 className="mb-4 text-lg font-medium text-secondary">
            Payment Summary
          </h3>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Course Fee:</span>
              <span>${originalPrice.toFixed(2)}</span>
            </div>

            {discountedPrice && discountedPrice < originalPrice && (
              <div className="flex justify-between text-green-600">
                <span>Early Bird Discount:</span>
                <span>-${(originalPrice - discountedPrice).toFixed(2)}</span>
              </div>
            )}

            {appliedDiscount && (
              <div className="flex justify-between text-green-600">
                <span>Discount Code ({appliedDiscount.code}):</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="border-t border-gray-200 pt-2">
              <div className="flex justify-between font-bold">
                <span>Total Due:</span>
                <span className="text-primary">${finalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Agreements */}
        <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <h3 className="mb-2 text-lg font-medium text-secondary">
            Agreements
          </h3>

          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              id="termsAgreement"
              checked={registration.agreedToTerms}
              onChange={(e) => dispatch(setAgreedToTerms(e.target.checked))}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <div>
              <label
                htmlFor="termsAgreement"
                className={`text-sm font-medium ${!registration.agreedToTerms ? "text-red-500" : "text-gray-700"}`}
              >
                I agree to the Terms and Conditions*
              </label>
              <p className="text-xs text-gray-500">
                I acknowledge that I have read and agree to the RoboSpark Terms
                and Conditions, including the refund policy, code of conduct,
                and liability waiver.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              id="photoRelease"
              checked={registration.photoRelease}
              onChange={(e) => dispatch(setPhotoRelease(e.target.checked))}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <div>
              <label
                htmlFor="photoRelease"
                className="text-sm font-medium text-gray-700"
              >
                Photo Release Permission
              </label>
              <p className="text-xs text-gray-500">
                I authorize RoboSpark to use photographs and/or videos of my
                child for educational and promotional purposes on the website,
                social media, and other materials.
              </p>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <h3 className="mb-4 text-lg font-medium text-secondary">
            Payment Information
          </h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="cardName"
                className="block text-sm font-medium text-gray-700"
              >
                Name on Card*
              </label>
              <Input id="cardName" placeholder="John Smith" required />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="cardNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Card Number*
              </label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <label
                  htmlFor="expirationMonth"
                  className="block text-sm font-medium text-gray-700"
                >
                  Expiration Month*
                </label>
                <select
                  id="expirationMonth"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Month</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <option
                      key={month}
                      value={month.toString().padStart(2, "0")}
                    >
                      {month.toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="expirationYear"
                  className="block text-sm font-medium text-gray-700"
                >
                  Expiration Year*
                </label>
                <select
                  id="expirationYear"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Year</option>
                  {Array.from(
                    { length: 10 },
                    (_, i) => new Date().getFullYear() + i
                  ).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="cvv"
                  className="block text-sm font-medium text-gray-700"
                >
                  CVV*
                </label>
                <Input id="cvv" placeholder="123" required />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={goBack}>
            Back
          </Button>
          <Button
            type="submit"
            disabled={!registration.agreedToTerms || paymentProcessing}
            className="min-w-[120px]"
          >
            {paymentProcessing ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Processing...
              </>
            ) : (
              "Complete Registration"
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
