export type Option = {
   text: string;
   correct: boolean;
}

export type Question = {
   id: string;
   number: number;
   questionText: string;
   feedback: string;
   options: Option[];
   teacherId: string;
   image?: string;
}

export type DraftQuestion = Omit<Question, 'id' | 'number'>

export type Teacher = {
   id: string;
   name: string;
}