export type Option = {
   text: string;
   correct: boolean;
}

export type Question = {
   id: string;
   questionText: string;
   feedback: string;
   options: Option[];
   teacherId: string;
   image?: string;
}

export type DraftQuestion = Omit<Question, 'id'>

export type Teacher = {
   id: string;
   name: string;
}