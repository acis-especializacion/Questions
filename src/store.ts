import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import type { DraftQuestion, Question } from "./types";

type QuestionState = {
   questions: Question[]
   activeId: Question['id']
   addQuestion: (data: DraftQuestion) => void
   deleteQuestion: (id: Question['id']) => void
   getQuestionById: (id: Question['id']) => void
   updateQuestion: (data: DraftQuestion) => void
   closeModal: () => void
   resetApp: () => void
   setQuestionImage: (id: string, image?: string) => void
}

const createQuestion = (question: DraftQuestion) : Question => {
   return { ...question, id: uuidv4() }
}

export const useQuestionStore = create<QuestionState>() (
   devtools(
      persist((set) => ({
         questions: [],
         activeId: '',
         addQuestion: (data) => {
            const newQuestion = createQuestion(data)
            set((state) => ({
               questions: [...state.questions, newQuestion]
            }))
         },
         deleteQuestion: (id) => {
            set((state) => ({
               questions: state.questions.filter(question => question.id !== id)
            }))
         },
         getQuestionById: (id) => {
            set(() => ({
               activeId: id
            }))
         },
          updateQuestion: (data) => {
            set((state) => ({
               questions: state.questions.map( question => question.id === state.activeId ? {id: state.activeId, ...data, image: data.image ?? question.image} : question),
               activeId: ''
            }))
         },
         closeModal: () => {
            set({
               activeId: ''
            })
         },
          resetApp: () => {
            set({
               questions: []
            })
         },
         setQuestionImage: (id, image) => {
            set((state) => ({
               questions: state.questions.map(q => q.id === id ? { ...q, image } : q)
            }))
         }
      }), {
         name: 'questions-store'
      })
   )
)