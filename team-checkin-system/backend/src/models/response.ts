export interface ResponseAnswer {
  questionId: string;
  answer: string;
}

export interface ResponseEntry {
  id: string;
  checkInId: string;
  userId: string;
  createdAt: string;
  answers: ResponseAnswer[];
}

export const responses: ResponseEntry[] = [];

