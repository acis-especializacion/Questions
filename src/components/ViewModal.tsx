import { type ChangeEvent } from "react"
import { XMarkIcon, PhotoIcon, TrashIcon, ArrowUpTrayIcon } from "@heroicons/react/24/solid"
import { useTeacherStore } from "../store/teacherStore"
import { getTeacherColor, getInitials } from "../utils/teacherColors"
import { useQuestionStore } from "../store"
import type { Question } from "../types"

type ViewModalProps = {
   question: Question | null
   onClose: () => void
}

function ViewModal({ question, onClose }: ViewModalProps) {

   if (!question) return null

   const teachers = useTeacherStore(s => s.teachers)
   const teacher = teachers.find(t => t.id === question.teacherId)
   const teacherIndex = teacher ? teachers.indexOf(teacher) : -1
   const color = teacher ? getTeacherColor(teacherIndex) : null
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
            className="relative bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
         >
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-700 sticky top-0 bg-slate-800 z-10">
               <h3 className="font-bold text-sm text-white">Ver Pregunta <span className="text-slate-500 font-normal">#{String(question.number).padStart(2, '0')}</span></h3>
               <button
                  type="button"
                  className="cursor-pointer text-slate-500 hover:text-white transition-colors"
                  onClick={onClose}
               ><XMarkIcon className="size-5" /></button>
            </div>

            <div className="p-5 space-y-4 text-sm">
               <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-300">Docente:</span>
                  {teacher && color ? (
                     <span className="flex items-center gap-1.5">
                        <span
                           className="flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold"
                           style={{ backgroundColor: color.dot, color: '#fff' }}
                        >{getInitials(teacher.name)}</span>
                        <span className="text-white">{teacher.name}</span>
                     </span>
                  ) : (
                     <span className="text-slate-400">Sin docente</span>
                  )}
               </div>

               <div>
                  <p className="font-bold text-slate-300 mb-1.5">Pregunta:</p>
                  <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white">{question.questionText}</div>
               </div>

               <div>
                  <p className="font-bold text-slate-300 mb-1.5">Imagen:</p>
                  {question.image ? (
                     <div className="space-y-2">
                        <img
                           src={question.image}
                           alt="Imagen de la pregunta"
                           className="max-w-full h-auto max-h-64 rounded-lg border border-slate-700"
                        />
                        <div className="flex gap-2">
                           <label className="flex items-center gap-1 cursor-pointer text-blue-400 hover:text-blue-300 text-xs font-semibold bg-slate-700 px-3 py-1.5 rounded-lg transition-colors">
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
                              className="flex items-center gap-1 cursor-pointer text-red-400 hover:text-red-300 text-xs font-semibold bg-slate-700 px-3 py-1.5 rounded-lg transition-colors"
                           >
                              <TrashIcon className="size-4" />
                              Quitar imagen
                           </button>
                        </div>
                     </div>
                  ) : (
                     <label className="inline-flex items-center gap-1 cursor-pointer text-blue-400 hover:text-blue-300 text-xs font-semibold bg-slate-700 px-3 py-1.5 rounded-lg transition-colors">
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
                  <p className="font-bold text-slate-300 mb-1.5">Alternativas:</p>
                  <div className="space-y-1">
                     {question.options.map((option, index) => (
                        <div
                           key={index}
                           className={`flex items-center gap-2 p-2.5 rounded-lg border ${
                              option.correct
                                 ? 'bg-green-900/20 border-green-500/50'
                                 : 'bg-slate-900/50 border-slate-700'
                           }`}
                        >
                           <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                              option.correct
                                 ? 'bg-green-600 text-white'
                                 : 'bg-slate-700 text-slate-400'
                           }`}>
                              {String.fromCharCode(65 + index)}
                           </span>
                           <span className={`flex-1 ${
                              option.correct
                                 ? 'text-green-300 font-bold'
                                 : 'text-slate-300'
                           }`}>
                              {option.text}
                           </span>
                           {option.correct && (
                              <span className="text-[10px] font-bold text-green-400 bg-green-900/30 px-1.5 py-0.5 rounded-full shrink-0">Correcta</span>
                           )}
                        </div>
                     ))}
                  </div>
               </div>

               <div>
                  <p className="font-bold text-slate-300 mb-1.5">Retroalimentación:</p>
                  <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-slate-300 italic">
                     {question.feedback || 'Sin retroalimentación'}
                  </div>
               </div>
            </div>

            <div className="px-5 pb-4">
               <button
                  type="button"
                  onClick={onClose}
                  className="w-full bg-slate-700 hover:bg-slate-600 cursor-pointer text-slate-200 font-bold p-2.5 rounded-lg text-sm transition-colors"
               >Cerrar</button>
            </div>
         </div>
      </div>
   )
}

export default ViewModal
