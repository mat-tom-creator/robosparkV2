import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  fetchAdminCourseById,
  createCourse,
  updateCourse,
  selectIsCoursesLoading,
} from "./adminCoursesSlice";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Label } from "../../../components/ui/Label";
import { Checkbox } from "../../../components/ui/Checkbox";
import { SkillLevel } from "../../../types/course";
import { paths } from "../../../routes/paths";

type CourseFormData = {
  title: string;
  description: string;
  longDescription: string;
  minAge: number;
  maxAge: number;
  skillLevel: SkillLevel;
  topics: string[];
  duration: string;
  startDate: string;
  endDate: string;
  days: string[];
  timeSlot: string;
  price: number;
  discountedPrice?: number;
  capacity: number;
  instructorId: string;
  image: string;
  featured: boolean;
};

// Available days for course schedule
const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export function CourseForm() {
  const { courseId } = useParams<{ courseId: string }>();
  const isEditMode = !!courseId;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoading = useAppSelector(selectIsCoursesLoading);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [topicInput, setTopicInput] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CourseFormData>({
    defaultValues: {
      title: "",
      description: "",
      longDescription: "",
      minAge: 7,
      maxAge: 16,
      skillLevel: "Beginner" as SkillLevel,
      topics: [],
      duration: "",
      startDate: "",
      endDate: "",
      days: [],
      timeSlot: "",
      price: 0,
      capacity: 15,
      instructorId: "",
      image: "<https://via.placeholder.com/800x600>",
      featured: false,
    },
  });

  // Fetch course data if in edit mode
  useEffect(() => {
    if (isEditMode && courseId) {
      dispatch(fetchAdminCourseById(courseId))
        .unwrap()
        .then((course) => {
          // Format dates for input fields
          const startDate = new Date(course.schedule.startDate);
          const endDate = new Date(course.schedule.endDate);

          const formattedStartDate = startDate.toISOString().split("T")[0];
          const formattedEndDate = endDate.toISOString().split("T")[0];

          // Set form values
          reset({
            title: course.title,
            description: course.description,
            longDescription: course.longDescription || "",
            minAge: course.ageRange.min,
            maxAge: course.ageRange.max,
            skillLevel: course.skillLevel,
            topics: course.topics,
            duration: course.duration,
            startDate: formattedStartDate,
            endDate: formattedEndDate,
            days: course.schedule.days,
            timeSlot: course.schedule.timeSlot,
            price: course.price,
            discountedPrice: course.discountedPrice,
            capacity: course.capacity,
            instructorId: course.instructor?.id || "",
            image: course.image,
            featured: course.featured,
          });
        })
        .catch((error) => {
          console.error("Failed to fetch course:", error);
        });
    }
  }, [courseId, dispatch, isEditMode, reset]);

  // Watch form values for validation
  const watchedMinAge = watch("minAge");
  const watchedMaxAge = watch("maxAge");
  const watchedStartDate = watch("startDate");
  const watchedEndDate = watch("endDate");
  const watchedPrice = watch("price");
  const watchedDiscountedPrice = watch("discountedPrice");
  const watchedTopics = watch("topics");

  // Add a new topic to the list
  const addTopic = () => {
    if (topicInput.trim() && !watchedTopics.includes(topicInput.trim())) {
      setValue("topics", [...watchedTopics, topicInput.trim()]);
      setTopicInput("");
    }
  };

  // Remove a topic from the list
  const removeTopic = (topic: string) => {
    setValue(
      "topics",
      watchedTopics.filter((t) => t !== topic)
    );
  };

  // Handle form submission
  const onSubmit = async (data: CourseFormData) => {
    try {
      setIsSubmitting(true);

      // Transform form data to match API structure
      const courseData = {
        title: data.title,
        description: data.description,
        longDescription: data.longDescription,
        ageRange: {
          min: data.minAge,
          max: data.maxAge,
        },
        skillLevel: data.skillLevel,
        topics: data.topics,
        duration: data.duration,
        schedule: {
          startDate: data.startDate,
          endDate: data.endDate,
          days: data.days,
          timeSlot: data.timeSlot,
        },
        price: data.price,
        discountedPrice: data.discountedPrice || undefined,
        capacity: data.capacity,
        instructorId: data.instructorId,
        image: data.image,
        featured: data.featured,
      };

      if (isEditMode && courseId) {
        await dispatch(
          updateCourse({ id: courseId, data: courseData })
        ).unwrap();
      } else {
        await dispatch(createCourse(courseData)).unwrap();
      }

      // Navigate back to course management page
      navigate(paths.adminCourses);
    } catch (error) {
      console.error("Failed to save course:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-secondary">
          {isEditMode ? "Edit Course" : "Add New Course"}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {isEditMode
            ? "Update the details of an existing course."
            : "Create a new course to add to the catalog."}
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-lg border bg-white p-6 shadow-sm"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Course Basic Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-secondary">
              Basic Information
            </h2>

            <div className="space-y-2">
              <Label htmlFor="title">Course Title*</Label>
              <Input
                id="title"
                placeholder="Enter course title"
                {...register("title", { required: "Course title is required" })}
                className={errors.title ? "border-red-300" : ""}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Short Description*</Label>
              <Input
                id="description"
                placeholder="Brief course description"
                {...register("description", {
                  required: "Description is required",
                })}
                className={errors.description ? "border-red-300" : ""}
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="longDescription">Detailed Description</Label>
              <textarea
                id="longDescription"
                rows={5}
                placeholder="Detailed course description"
                {...register("longDescription")}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="skillLevel">Skill Level*</Label>
                <select
                  id="skillLevel"
                  {...register("skillLevel", {
                    required: "Skill level is required",
                  })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration*</Label>
                <Input
                  id="duration"
                  placeholder="e.g., 2 weeks, 3 days"
                  {...register("duration", {
                    required: "Duration is required",
                  })}
                  className={errors.duration ? "border-red-300" : ""}
                />
                {errors.duration && (
                  <p className="text-sm text-red-500">
                    {errors.duration.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="minAge">Minimum Age*</Label>
                <Input
                  id="minAge"
                  type="number"
                  min={4}
                  max={18}
                  {...register("minAge", {
                    required: "Minimum age is required",
                    valueAsNumber: true,
                    validate: (value) =>
                      value <= watchedMaxAge ||
                      "Minimum age must be less than maximum age",
                  })}
                  className={errors.minAge ? "border-red-300" : ""}
                />
                {errors.minAge && (
                  <p className="text-sm text-red-500">
                    {errors.minAge.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxAge">Maximum Age*</Label>
                <Input
                  id="maxAge"
                  type="number"
                  min={4}
                  max={18}
                  {...register("maxAge", {
                    required: "Maximum age is required",
                    valueAsNumber: true,
                    validate: (value) =>
                      value >= watchedMinAge ||
                      "Maximum age must be greater than minimum age",
                  })}
                  className={errors.maxAge ? "border-red-300" : ""}
                />
                {errors.maxAge && (
                  <p className="text-sm text-red-500">
                    {errors.maxAge.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Topics */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-secondary">Topics</h2>

            <div className="flex items-end space-x-2">
              <div className="flex-1">
                <Label htmlFor="topicInput">Add Topic</Label>
                <Input
                  id="topicInput"
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  placeholder="e.g., Robot Design, Block Coding"
                />
              </div>
              <Button
                type="button"
                onClick={addTopic}
                disabled={!topicInput.trim()}
              >
                Add
              </Button>
            </div>

            {watchedTopics.length > 0 && (
              <div className="flex flex-wrap gap-2 rounded-md border border-gray-200 bg-gray-50 p-3">
                {watchedTopics.map((topic, index) => (
                  <div
                    key={index}
                    className="flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
                  >
                    <span>{topic}</span>
                    <button
                      type="button"
                      onClick={() => removeTopic(topic)}
                      className="ml-2 rounded-full p-1 text-primary hover:bg-primary/20"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}

            {errors.topics && (
              <p className="text-sm text-red-500">{errors.topics.message}</p>
            )}
          </div>

          {/* Schedule */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-secondary">Schedule</h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date*</Label>
                <Input
                  id="startDate"
                  type="date"
                  {...register("startDate", {
                    required: "Start date is required",
                    validate: (value) =>
                      !watchedEndDate ||
                      new Date(value) <= new Date(watchedEndDate) ||
                      "Start date must be before end date",
                  })}
                  className={errors.startDate ? "border-red-300" : ""}
                />
                {errors.startDate && (
                  <p className="text-sm text-red-500">
                    {errors.startDate.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date*</Label>
                <Input
                  id="endDate"
                  type="date"
                  {...register("endDate", {
                    required: "End date is required",
                    validate: (value) =>
                      !watchedStartDate ||
                      new Date(value) >= new Date(watchedStartDate) ||
                      "End date must be after start date",
                  })}
                  className={errors.endDate ? "border-red-300" : ""}
                />
                {errors.endDate && (
                  <p className="text-sm text-red-500">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Days of the Week*</Label>
              <div className="flex flex-wrap gap-2">
                <Controller
                  name="days"
                  control={control}
                  rules={{ required: "Please select at least one day" }}
                  render={({ field }) => (
                    <>
                      {WEEKDAYS.map((day) => (
                        <label
                          key={day}
                          className={`flex cursor-pointer items-center space-x-2 rounded-full px-3 py-1 text-sm ${
                            field.value.includes(day)
                              ? "bg-primary text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          <input
                            type="checkbox"
                            value={day}
                            checked={field.value.includes(day)}
                            onChange={(e) => {
                              const updatedDays = e.target.checked
                                ? [...field.value, day]
                                : field.value.filter((d: string) => d !== day);
                              field.onChange(updatedDays);
                            }}
                            className="sr-only"
                          />
                          <span>{day}</span>
                        </label>
                      ))}
                    </>
                  )}
                />
              </div>
              {errors.days && (
                <p className="text-sm text-red-500">{errors.days.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeSlot">Time Slot*</Label>
              <Input
                id="timeSlot"
                placeholder="e.g., 9:00 AM - 12:00 PM"
                {...register("timeSlot", { required: "Time slot is required" })}
                className={errors.timeSlot ? "border-red-300" : ""}
              />
              {errors.timeSlot && (
                <p className="text-sm text-red-500">
                  {errors.timeSlot.message}
                </p>
              )}
            </div>
          </div>

          {/* Pricing and Capacity */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-secondary">
              Pricing and Capacity
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price">Regular Price* ($)</Label>
                <Input
                  id="price"
                  type="number"
                  min={0}
                  step={0.01}
                  {...register("price", {
                    required: "Price is required",
                    valueAsNumber: true,
                    validate: (value) =>
                      value > 0 || "Price must be greater than 0",
                  })}
                  className={errors.price ? "border-red-300" : ""}
                />
                {errors.price && (
                  <p className="text-sm text-red-500">{errors.price.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountedPrice">Discounted Price ($)</Label>
                <Input
                  id="discountedPrice"
                  type="number"
                  min={0}
                  step={0.01}
                  {...register("discountedPrice", {
                    valueAsNumber: true,
                    validate: (value) =>
                      !value ||
                      (value > 0 && value < watchedPrice) ||
                      "Discounted price must be less than regular price",
                  })}
                  className={errors.discountedPrice ? "border-red-300" : ""}
                />
                {errors.discountedPrice && (
                  <p className="text-sm text-red-500">
                    {errors.discountedPrice.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">Maximum Capacity*</Label>
              <Input
                id="capacity"
                type="number"
                min={1}
                {...register("capacity", {
                  required: "Capacity is required",
                  valueAsNumber: true,
                  validate: (value) =>
                    value > 0 || "Capacity must be greater than 0",
                })}
                className={errors.capacity ? "border-red-300" : ""}
              />
              {errors.capacity && (
                <p className="text-sm text-red-500">
                  {errors.capacity.message}
                </p>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-secondary">
              Additional Information
            </h2>

            <div className="space-y-2">
              <Label htmlFor="instructorId">Instructor*</Label>
              <select
                id="instructorId"
                {...register("instructorId", {
                  required: "Instructor is required",
                })}
                className={`w-full rounded-md border ${
                  errors.instructorId ? "border-red-300" : "border-gray-300"
                } px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary`}
              >
                <option value="">Select an instructor</option>
                <option value="instructor1">Dr. Emily Chen</option>
                <option value="instructor2">Prof. James Wilson</option>
                <option value="instructor3">Maria Rodriguez</option>
                <option value="instructor4">Robert Chang</option>
              </select>
              {errors.instructorId && (
                <p className="text-sm text-red-500">
                  {errors.instructorId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                placeholder="<https://example.com/image.jpg>"
                {...register("image")}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="featured" {...register("featured")} />
              <Label htmlFor="featured" className="cursor-pointer">
                Feature this course on the homepage
              </Label>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(paths.adminCourses)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isLoading}>
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : isEditMode ? (
                "Update Course"
              ) : (
                "Create Course"
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
