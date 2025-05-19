import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/app/store';
import { SkillLevel, AgeGroup } from '@/types/course';

interface CoursesState {
  filters: {
    search: string;
    ageGroup: AgeGroup | 'All';
    skillLevel: SkillLevel | 'All';
    topics: string[];
  };
  sortBy: 'default' | 'price-low' | 'price-high' | 'date';
}

const initialState: CoursesState = {
  filters: {
    search: '',
    ageGroup: 'All',
    skillLevel: 'All',
    topics: [],
  },
  sortBy: 'default',
};

export const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
    },
    setAgeGroupFilter: (state, action: PayloadAction<AgeGroup | 'All'>) => {
      state.filters.ageGroup = action.payload;
    },
    setSkillLevelFilter: (state, action: PayloadAction<SkillLevel | 'All'>) => {
      state.filters.skillLevel = action.payload;
    },
    addTopicFilter: (state, action: PayloadAction<string>) => {
      if (!state.filters.topics.includes(action.payload)) {
        state.filters.topics.push(action.payload);
      }
    },
    removeTopicFilter: (state, action: PayloadAction<string>) => {
      state.filters.topics = state.filters.topics.filter(
        (topic) => topic !== action.payload
      );
    },
    clearAllFilters: (state) => {
      state.filters = initialState.filters;
    },
    setSortBy: (state, action: PayloadAction<CoursesState['sortBy']>) => {
      state.sortBy = action.payload;
    },
  },
});

export const {
  setSearchFilter,
  setAgeGroupFilter,
  setSkillLevelFilter,
  addTopicFilter,
  removeTopicFilter,
  clearAllFilters,
  setSortBy,
} = coursesSlice.actions;

export const selectCourseFilters = (state: RootState) => state.courses.filters;
export const selectCourseSortBy = (state: RootState) => state.courses.sortBy;

export default coursesSlice.reducer;