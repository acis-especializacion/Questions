import { type ChangeEvent } from "react"
import { XMarkIcon, PhotoIcon, TrashIcon, ArrowUpTrayIcon } from "@heroicons/react/24/solid"
import { getTeachers } from "../utils"
import { useQuestionStore } from "../store"
import type { Question } from "../types"

type ViewModalProps = {
   question: Question | null
   onClose: () => void
}

function ViewModal({ question, onClose }: ViewModalProps) {

   if (!question) return null

   const teachers = getTeachers()
   const teacher = teachers.find(t => t.id === question.teacherId)
   const setQuestionImage = useQuestionStore(state => state.setQuestionImage)

   const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = () => {
         setQuestionImage(question.id, reader.result as string)
      }
      reader.readAsDataURL(file)
   }

   const handleRemoveImage = () => {
      setQuestionImage(question.id, undefined)
   }

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
         <div className="fixed inset-0 bg-black/70" />
         <div
             className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
         >
            <div className="flex items-center justify-between bg-gray-100 px-5 py-3 rounded-t-2xl sticky top-0 z-10">
               <h3 className="font-bold text-sm text-gray-800">Ver Pregunta</h3>
               <button
                  type="button"
                  className="cursor-pointer text-gray-500 hover:text-gray-800"
                  onClick={onClose}
               ><XMarkIcon className="size-5" /></button>
            </div>

             <div className="p-3 lg:p-5 space-y-3 lg:space-y-4 text-sm">
               <div>
                  <span className="font-bold text-gray-600">Docente:</span>
                  <span className="ml-2 text-gray-800">{teacher ? teacher.name : 'Sin docente'}</span>
               </div>

               <div>
                  <p className="font-bold text-gray-600 mb-1">Pregunta:</p>
                  <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{question.questionText}</p>
               </div>

               <div>
                  <p className="font-bold text-gray-600 mb-1">Imagen:</p>
                  {question.image ? (
                     <div className="space-y-2">
                        <img
                           src={question.image}
                           alt="Imagen de la pregunta"
                           className="max-w-full h-auto max-h-64 rounded-lg border border-gray-300"
                        />
                        <div className="flex gap-2">
                           <label className="flex items-center gap-1 cursor-pointer text-blue-700 hover:text-blue-800 text-xs font-semibold bg-blue-50 px-3 py-1.5 rounded-lg">
                              <ArrowUpTrayIcon className="size-4" />
                              Cambiar imagen
                              <input
                                 type="file"
                                 accept="image/*"
                                 className="hidden"
                                 onChange={handleFile}
                              />
                           </label>
                           <button
                              type="button"
                              onClick={handleRemoveImage}
                              className="flex items-center gap-1 cursor-pointer text-red-600 hover:text-red-800 text-xs font-semibold bg-red-50 px-3 py-1.5 rounded-lg"
                           >
                              <TrashIcon className="size-4" />
                              Quitar imagen
                           </button>
                        </div>
                     </div>
                  ) : (
                     <label className="inline-flex items-center gap-1 cursor-pointer text-blue-700 hover:text-blue-800 text-xs font-semibold bg-blue-50 px-3 py-1.5 rounded-lg">
                        <PhotoIcon className="size-4" />
                        Agregar imagen
                        <input
                           type="file"
                           accept="image/*"
                           className="hidden"
                           onChange={handleFile}
                        />
                     </label>
                  )}
               </div>

               <div>
                  <p className="font-bold text-gray-600 mb-1">Alternativas:</p>
                  <div className="space-y-1">
                     {question.options.map((option, index) => (
                        <div
                           key={index}
                           className={`flex items-center gap-2 p-2 rounded-lg ${option.correct ? 'bg-green-100 border border-green-400' : ''}`}
                        >
                           <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${option.correct ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                              {String.fromCharCode(65 + index)}
                           </span>
                           <span className={`flex-1 ${option.correct ? 'text-green-800 font-bold' : 'text-gray-700'}`}>
                              {option.text}
                           </span>
                           {option.correct && <span className="text-xs text-green-600 font-bold">Correcta</span>}
                        </div>
                     ))}
                  </div>
               </div>

               <div>
                  <p className="font-bold text-gray-600 mb-1">Retroalimentación:</p>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg italic">{question.feedback || 'Sin retroalimentación'}</p>
               </div>
            </div>

            <div className="px-3 lg:px-5 pb-3 lg:pb-4">
               <button
                  type="button"
                  onClick={onClose}
                  className="w-full bg-gray-200 hover:bg-gray-300 cursor-pointer text-gray-700 font-bold p-2 rounded-lg text-sm"
               >Cerrar</button>
            </div>
         </div>
      </div>
   )
}

export default ViewModal
