import { useState, useRef, useLayoutEffect } from "react"
import { ChevronDownIcon } from "@heroicons/react/24/solid"
import { useTeacherStore } from "../store/teacherStore"
import { getTeacherColor, getInitials } from "../utils/teacherColors"
import QuestionItem from "./QuestionItem"
import type { Question } from "../types"

type QuestionGroupProps = {
   teacherName: string
   teacherId: string
   questions: Question[]
   onView: (question: Question) => void
}

function QuestionGroup({ teacherName, teacherId, questions, onView }: QuestionGroupProps) {
   const teachers = useTeacherStore(s => s.teachers)
   const teacherIndex = teachers.findIndex(t => t.id === teacherId)
   const color = teacherIndex >= 0 ? getTeacherColor(teacherIndex) : null
   const [open, setOpen] = useState(true)
   const contentRef = useRef<HTMLDivElement>(null)

   useLayoutEffect(() => {
      const el = contentRef.current
      if (!el) return
      el.style.maxHeight = open ? `${el.scrollHeight}px` : '0px'
   }, [open])

   return (
      <div>
         <button
            type="button"
            onClick={() => setOpen(!open)}
            className="w-full flex items-center gap-2 mb-2 px-1 cursor-pointer group"
         >
            {color && (
               <span
                  className="flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold shrink-0"
                  style={{ backgroundColor: color.dot, color: '#fff' }}
               >{getInitials(teacherName)}</span>
            )}
            <h3 className="font-bold text-sm text-white group-hover:text-slate-300 transition-colors">{teacherName}</h3>
            <span className="text-xs font-bold text-white/70">({questions.length})</span>
            <ChevronDownIcon className={`size-4 text-slate-500 ml-auto transition-transform ${open ? '' : '-rotate-90'}`} />
         </button>
         <div
            ref={contentRef}
            className="overflow-hidden transition-all duration-300 ease-in-out pl-8 pt-2"
         >
            <div className="space-y-1">
               {questions.map(q => (
                  <QuestionItem key={q.id} question={q} onView={onView} />
               ))}
            </div>
         </div>
      </div>
   )
}

export default QuestionGroup
