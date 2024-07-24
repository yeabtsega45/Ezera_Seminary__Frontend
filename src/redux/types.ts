export interface User {
  _id: string;
  role: string;
  firstName: string;
  lastName: string;
  token: string;
  email: string;
  avatar: string | null;
  password: string | null;
  progress: Progress[];
  achievement: number;
  createdAt: string;
  deletedAt: string;
  lastLogin: string;
}

export interface Progress {
  courseId: string;
  currentChapter: number;
  currentSlide: number;
}

export interface AuthState {
  user: User | null;
  role: string | null;
  firstName: string | null;
  token: string | null;
  isAuthReady: boolean;
}

export interface Devotion {
  image: Devotion;
  previewUrl: Devotion;
  body: string[];
  month: string;
  day: string;
  title: string;
  chapter: string;
  verse: string;
  paragraphs: string[];
  prayer: string;
  subTitles: string[];
  photo: File | string | null; // Assuming 'photo' can be a File object or a string URL to the photo
  _id?: string;
}

export interface FormState {
  image: Devotion;
  previewUrl: Devotion;
  _id: string;
  body: string[] | undefined;
  month: string;
  day: string;
  title: string;
  chapter: string;
  verse: string;
  paragraphs: string[];
  prayer: string;
  subTitles: string[];
  photo: File | string | null;
}

export interface DevotionsState {
  form: FormState;
  devotions: Devotion[];
  selectedDevotion: Devotion | null;
  isEditing: boolean;
}

export interface LinkType {
  quarter: any;
  lesson: any;
  id?: string;
  videoUrl: string;
}

export interface RootState {
  auth: AuthState;
  user: User;
  devotions: DevotionsState;
  // other slices of state
}
