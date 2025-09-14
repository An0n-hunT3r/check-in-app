export interface Question {
  id: string;
  text: string;
}

export interface CheckIn {
  id: string;
  title: string;
  dueDate: string;
  createdBy: string;
  createdAt: string;
  questions: Question[];
}

export const checkIns: CheckIn[] = [];

