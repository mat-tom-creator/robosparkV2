import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectCourseFilters,
  setSearchFilter,
  setAgeGroupFilter,
  setSkillLevelFilter,
  addTopicFilter,
  removeTopicFilter,
  clearAllFilters,
} from "./coursesSlice";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Search, X } from "lucide-react";

const ageGroups = ["All", "7-9", "10-12", "13-16"];
const skillLevels = ["All", "Beginner", "Intermediate", "Advanced"];
const allTopics = [
  "Robot Design",
  "Block Coding",
  "Python Programming",
  "AI Basics",
  "Electronics",
  "3D Design",
  "Autonomous Systems",
  "Sensor Networks",
  "Aerial Robotics",
  "Competition Strategy",
];

export function CourseFilters() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectCourseFilters);

  return (
    <div className="space-y-6 rounded-lg border bg-white p-6 shadow-sm">
      <div>
        <h3 className="mb-2 text-lg font-semibold text-secondary">Search</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            className="pl-10"
            placeholder="Search courses..."
            value={filters.search}
            onChange={(e) => dispatch(setSearchFilter(e.target.value))}
          />
          {filters.search && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary"
              onClick={() => dispatch(setSearchFilter(""))}
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-lg font-semibold text-secondary">Age Group</h3>
        <div className="flex flex-wrap gap-2">
          {ageGroups.map((age) => (
            <button
              key={age}
              className={`rounded-full px-3 py-1 text-sm ${
                filters.ageGroup === age
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => dispatch(setAgeGroupFilter(age as any))}
            >
              {age}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-lg font-semibold text-secondary">
          Skill Level
        </h3>
        <div className="flex flex-wrap gap-2">
          {skillLevels.map((level) => (
            <button
              key={level}
              className={`rounded-full px-3 py-1 text-sm ${
                filters.skillLevel === level
                  ? "bg-secondary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => dispatch(setSkillLevelFilter(level as any))}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-lg font-semibold text-secondary">Topics</h3>
        <div className="flex flex-wrap gap-2">
          {allTopics.map((topic) => (
            <button
              key={topic}
              className={`rounded-full px-3 py-1 text-sm ${
                filters.topics.includes(topic)
                  ? "bg-accent text-accent-foreground"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => {
                if (filters.topics.includes(topic)) {
                  dispatch(removeTopicFilter(topic));
                } else {
                  dispatch(addTopicFilter(topic));
                }
              }}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        onClick={() => dispatch(clearAllFilters())}
        className="w-full"
      >
        Clear All Filters
      </Button>
    </div>
  );
}
