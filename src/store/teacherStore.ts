import { create } from "zustand"
import { v4 as uuidv4 } from "uuid"
import { getTeachers, saveTeachers } from "../utils"

export type Teacher = { id: string; name: string }

type TeacherState = {
   teachers: Teacher[]
   addTeacher: (name: string) => Teacher
   updateTeacher: (id: string, name: string) => void
   deleteTeacher: (id: string) => boolean
}

const hasQuestions = (teacherId: string) => {
   try {
      const raw = localStorage.getItem('questions-store')
      if (!raw) return false
      const parsed = JSON.parse(raw)
      const questions = parsed?.state?.questions ?? []
      return questions.some((q: { teacherId: string }) => q.teacherId === teacherId)
   } catch {
      return false
   }
}

export const useTeacherStore = create<TeacherState>()((set, get) => ({
   teachers: getTeachers(),
   addTeacher: (name) => {
      const teacher: Teacher = { id: uuidv4(), name }
      const next = [...get().teachers, teacher]
      set({ teachers: next })
      saveTeachers(next)
      return teacher
   },
   updateTeacher: (id, name) => {
      const next = get().teachers.map(t => t.id === id ? { ...t, name } : t)
      set({ teachers: next })
      saveTeachers(next)
   },
   deleteTeacher: (id) => {
      if (hasQuestions(id)) return false
      const next = get().teachers.filter(t => t.id !== id)
      set({ teachers: next })
      saveTeachers(next)
      return true
   }
}))
