import { TrashIcon, PencilSquareIcon, EyeIcon, PhotoIcon } from "@heroicons/react/24/solid"
import { useQuestionStore } from "../store"
import type { Question } from "../types"

type QuestionItemProps = {
   question: Question
   onView: (question: Question) => void
   onDeleteRequest?: (id: string) => void
}

function QuestionItem({ question, onView, onDeleteRequest }: QuestionItemProps) {
   const getQuestionById = useQuestionStore(s => s.getQuestionById)

   return (
      <div className="flex items-center gap-2 bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 hover:bg-slate-700/50 hover:border-slate-600 transition-colors group">
         <span className="text-xs font-bold text-slate-500 w-7 shrink-0">{String(question.number).padStart(2, '0')}</span>
         <p className="flex-1 text-sm text-slate-200 line-clamp-2">{question.questionText}</p>
         {question.image && <PhotoIcon className="size-3.5 text-blue-400 shrink-0" title="Tiene imagen" />}
         <div className="flex gap-1.5 shrink-0">
            <button
               type="button"
               onClick={() => onView(question)}
               className="cursor-pointer p-1 text-slate-400 hover:text-white transition-colors"
               title="Ver"
            ><EyeIcon className="size-4" /></button>
            <button
               type="button"
               onClick={() => getQuestionById(question.id)}
               className="cursor-pointer p-1 text-blue-400 hover:text-blue-300 transition-colors"
               title="Editar"
            ><PencilSquareIcon className="size-4" /></button>
            <button
               type="button"
               onClick={() => onDeleteRequest?.(question.id)}
               className="cursor-pointer p-1 text-red-400 hover:text-red-300 transition-colors"
               title="Eliminar"
            ><TrashIcon className="size-4" /></button>
         </div>
      </div>
   )
}

export default QuestionItem
