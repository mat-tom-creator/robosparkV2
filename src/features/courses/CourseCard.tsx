import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, Clock, Users } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { paths } from "../../routes/paths";
import { Course } from "../../types/course";
import { formatDate } from "../../lib/utils";

interface CourseCardProps {
  course: Course;
  index: number;
}

export function CourseCard({ course, index }: CourseCardProps) {
  const {
    id,
    title,
    description,
    ageRange,
    skillLevel,
    schedule,
    price,
    discountedPrice,
    capacity,
    enrolledCount,
    image,
  } = course;

  const hasDiscount = discountedPrice !== undefined;
  const spotsLeft = capacity - enrolledCount;
  const startDate = new Date(schedule.startDate);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-md">
        <div className="relative h-48 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          />
          {hasDiscount && (
            <div className="absolute right-0 top-0 bg-accent px-3 py-1 text-sm font-semibold text-accent-foreground">
              Save {Math.round((1 - discountedPrice / price) * 100)}%
            </div>
          )}
          {spotsLeft <= 3 && (
            <div className="absolute left-0 top-0 bg-primary px-3 py-1 text-sm font-semibold text-white">
              Only {spotsLeft} spots left!
            </div>
          )}
        </div>

        <CardHeader>
          <div className="flex justify-between">
            <div className="flex items-center space-x-2">
              <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                Ages {ageRange.min}-{ageRange.max}
              </span>
              <span className="rounded-full bg-secondary/10 px-2 py-1 text-xs font-medium text-secondary">
                {skillLevel}
              </span>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-secondary">{title}</h3>
        </CardHeader>

        <CardContent>
          <p className="mb-4 text-gray-600">{description}</p>

          <div className="mt-4 space-y-2">
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="mr-2 h-4 w-4 text-primary" />
              <span>Starts {formatDate(startDate)}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="mr-2 h-4 w-4 text-primary" />
              <span>
                {schedule.days.join(", ")} | {schedule.timeSlot}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Users className="mr-2 h-4 w-4 text-primary" />
              <span>
                {enrolledCount} enrolled (max {capacity})
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between">
          <div>
            {hasDiscount ? (
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-primary">
                  ${discountedPrice}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  ${price}
                </span>
              </div>
            ) : (
              <span className="text-lg font-bold text-primary">${price}</span>
            )}
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" size="sm" asChild>
              <Link to={paths.courseDetail(id)}>Details</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to={`${paths.register}?course=${id}`}>Register</Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
