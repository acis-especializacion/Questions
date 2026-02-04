export type Option = {
   text: string;
   correct: boolean;
}

export type Question = {
   id: string;
   questionText: string;
   feedback: string;
   options: Option[];
}

export type DraftQuestion = Omit<Question, 'id'>