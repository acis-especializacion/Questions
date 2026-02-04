import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import { labelOptions } from "../utils";
import type { Question } from "../types";
import { useQuestionStore } from "../store";
import { toast } from "react-toastify";

type QuizDetailProps = {
   numero: number,
   question: Question
}

function QuizDetail({question, numero}: QuizDetailProps) {

   const deleteQuestion = useQuestionStore(state => state.deleteQuestion)
   const getQuestionById = useQuestionStore(state => state.getQuestionById)

   const handleClick = () => {
      deleteQuestion(question.id)
      toast.error('Pregunta eliminado')
   }

   return (
      <div className="bg-slate-200 p-5 rounded-lg flex flex-col md:flex-row">
         <div className="flex-1">
            <p><span className="font-bold">Pregunta: {numero}: </span>{question.questionText}</p>
            <p className="text-sm py-1 italic text-gray-500">{question.feedback}</p>
            <ul className="ml-2 text-black font-medium">
               {question.options.map((option, index) => (
                  <li key={index} className={option.correct ? 'text-green-700 font-bold' : ''}>
                     <span className="font-bold w-6 inline-block">{labelOptions(index)}</span>{option.text}
                  </li>
               ))}
            </ul>
         </div>
         <div className="flex justify-between items-center gap-5 mt-3 md:flex-col md:mt-0 md:justify-start">
            <button
               type="button"
               className="cursor-pointer"
               onClick={() => getQuestionById(question.id)}
            ><PencilSquareIcon className="size-6 text-blue-700 hover:text-blue-800" /></button>
            <button
               type="button"
               className="cursor-pointer"
               onClick={handleClick}
            ><TrashIcon className="size-6 text-red-700 hover:text-red-800" /></button>
         </div>
      </div>
   )
}

export default QuizDetail