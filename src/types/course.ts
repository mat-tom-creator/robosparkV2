export interface Course {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  ageRange: {
    min: number;
    max: number;
  };
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  topics: string[];
  duration: string;
  schedule: {
    startDate: string;
    endDate: string;
    days: string[];
    timeSlot: string;
  };
  instructor: {
    name: string;
    bio: string;
    image: string;
  };
  price: number;
  discountedPrice?: number;
  capacity: number;
  enrolledCount: number;
  image: string;
  featured: boolean;
}

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type AgeGroup = '7-9' | '10-12' | '13-16' | 'All Ages';