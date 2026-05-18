import { PencilSquareIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/solid";
import { getTeachers, labelOptions } from "../utils";
import type { Question } from "../types";
import { useQuestionStore } from "../store";
import { toast } from "react-toastify";

type QuizDetailProps = {
   numero: number
   question: Question
   onView: (question: Question) => void
}

function QuizDetail({question, numero, onView}: QuizDetailProps) {

   const teachers = getTeachers()
   const teacher = teachers.find(t => t.id === question.teacherId)
   const correctOption = question.options.find(o => o.correct)
   const correctIndex = question.options.findIndex(o => o.correct)

   const deleteQuestion = useQuestionStore(state => state.deleteQuestion)
   const getQuestionById = useQuestionStore(state => state.getQuestionById)

   const handleClick = () => {
      deleteQuestion(question.id)
      toast.error('Pregunta eliminado')
   }

   return (
      <div className="bg-slate-200 p-3 rounded-lg flex flex-col md:flex-row text-sm">
         <div className="flex-1">
            <p><strong>{String(numero).padStart(2, '0')}:</strong> {question.questionText} {question.image && <span className="text-xs text-blue-600 font-semibold bg-blue-100 px-1.5 py-0.5 rounded ml-1">Imagen</span>}</p>
            {teacher && <p className="text-xs text-blue-700 font-medium"><strong>Docente:</strong> {teacher.name}</p>}
            {correctOption && <p className="text-green-700 font-bold text-xs mt-1">✓ {labelOptions(correctIndex)} {correctOption.text}</p>}
            <p className="text-xs py-0.5 italic text-gray-500">{question.feedback}</p>
         </div>
         <div className="flex justify-between items-center gap-1 md:gap-2 mt-1 md:flex-col md:mt-0 md:justify-start">
            <button
               type="button"
               className="cursor-pointer"
               onClick={() => onView(question)}
            ><EyeIcon className="size-4 text-gray-600 hover:text-gray-800" /></button>
            <button
               type="button"
               className="cursor-pointer"
               onClick={() => getQuestionById(question.id)}
            ><PencilSquareIcon className="size-4 text-blue-700 hover:text-blue-800" /></button>
            <button
               type="button"
               className="cursor-pointer"
               onClick={handleClick}
            ><TrashIcon className="size-4 text-red-700 hover:text-red-800" /></button>
         </div>
      </div>
   )
}

export default QuizDetail