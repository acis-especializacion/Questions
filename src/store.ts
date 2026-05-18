import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import type { DraftQuestion, Question } from "./types";

type QuestionState = {
   questions: Question[]
   activeId: Question['id']
   nextNumber: number
   addQuestion: (data: DraftQuestion) => void
   deleteQuestion: (id: Question['id']) => void
   getQuestionById: (id: Question['id']) => void
   updateQuestion: (data: DraftQuestion) => void
   closeModal: () => void
   resetApp: () => void
   setQuestionImage: (id: string, image?: string) => void
}

const createQuestion = (question: DraftQuestion, number: number): Question => {
   return { ...question, id: uuidv4(), number }
}

export const useQuestionStore = create<QuestionState>() (
   devtools(
      persist((set) => ({
         questions: [],
         activeId: '',
         nextNumber: 1,
         addQuestion: (data) => {
            set((state) => {
               const newQuestion = createQuestion(data, state.nextNumber)
               return {
                  questions: [...state.questions, newQuestion],
                  nextNumber: state.nextNumber + 1
               }
            })
         },
         deleteQuestion: (id) => {
            set((state) => {
               const remaining = state.questions.filter(question => question.id !== id)
               const renumbered = remaining.map((q, i) => ({ ...q, number: i + 1 }))
               return {
                  questions: renumbered,
                  nextNumber: renumbered.length + 1
               }
            })
         },
         getQuestionById: (id) => {
            set(() => ({
               activeId: id
            }))
         },
         updateQuestion: (data) => {
            set((state) => ({
               questions: state.questions.map(question =>
                  question.id === state.activeId
                     ? { id: state.activeId, number: question.number, ...data, image: data.image ?? question.image }
                     : question
               ),
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
               questions: [],
               nextNumber: 1
            })
         },
         setQuestionImage: (id, image) => {
            set((state) => ({
               questions: state.questions.map(q => q.id === id ? { ...q, image } : q)
            }))
         }
      }), {
         name: 'questions-store',
         onRehydrateStorage: () => (state) => {
            if (!state || !state.questions) return
            let changed = false
            state.questions.forEach((q, i) => {
               if (typeof q.number !== 'number') {
                  q.number = i + 1
                  changed = true
               }
            })
            if (changed) {
               state.nextNumber = state.questions.length + 1
               useQuestionStore.setState({ questions: [...state.questions], nextNumber: state.nextNumber })
            }
         }
      })
   )
)