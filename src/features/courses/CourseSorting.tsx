import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectCourseSortBy, setSortBy } from "./coursesSlice";

export function CourseSorting() {
  const dispatch = useAppDispatch();
  const sortBy = useAppSelector(selectCourseSortBy);

  return (
    <div className="flex items-center">
      <span className="mr-2 text-sm text-gray-600">Sort by:</span>
      <select
        className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        value={sortBy}
        onChange={(e) => dispatch(setSortBy(e.target.value as any))}
      >
        <option value="default">Featured</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
        <option value="date">Start Date</option>
      </select>
    </div>
  );
}
