import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import type { DraftQuestion, Question } from "./types";

type QuestionState = {
   questions: Question[]
   activeId: Question['id']
   modal: boolean
   addQuestion: (data: DraftQuestion) => void
   deleteQuestion: (id: Question['id']) => void
   getQuestionById: (id: Question['id']) => void
   updateQuestion: (data: DraftQuestion) => void
   showModal: () => void
   closeModal: () => void
   resetApp: () => void
}

const createQuestion = (question: DraftQuestion) : Question => {
   return { ...question, id: uuidv4() }
}

export const useQuestionStore = create<QuestionState>() (
   devtools(
      persist((set) => ({
         questions: [],
         activeId: '',
         modal: false,
         addQuestion: (data) => {
            const newQuestion = createQuestion(data)
            set((state) => ({
               questions: [...state.questions, newQuestion],
               modal: false
            }))
         },
         deleteQuestion: (id) => {
            set((state) => ({
               questions: state.questions.filter(question => question.id !== id)
            }))
         },
         getQuestionById: (id) => {
            set(() => ({
               activeId: id,
               modal: true
            }))
         },
         updateQuestion: (data) => {
            set((state) => ({
               questions: state.questions.map( question => question.id === state.activeId ? {id: state.activeId, ...data} : question),
               modal: false,
               activeId: ''
            }))
         },
         showModal: () => {
            set({
               modal: true
            })
         },
         closeModal: () => {
            set({
               modal: false,
               activeId: ''
            })
         },
         resetApp: () => {
            set({
               questions: []
            })
         }
      }), {
         name: 'questions-store'
      })
   )
)