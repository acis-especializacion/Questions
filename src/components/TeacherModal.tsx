import { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { XMarkIcon, PencilSquareIcon, TrashIcon, CheckIcon } from "@heroicons/react/24/solid"
import { getTeachers, saveTeachers, capitalizeFirstLetter } from "../utils"
import { useQuestionStore } from "../store"
import { toast } from "react-toastify"

type TeacherModalProps = {
   onClose: () => void
}

type TeacherEntry = {
   id: string
   name: string
}

function TeacherModal({ onClose }: TeacherModalProps) {

   const questions = useQuestionStore(s => s.questions)
   const [teachers, setTeachers] = useState<TeacherEntry[]>(getTeachers)
   const [editingId, setEditingId] = useState<string | null>(null)
   const [editValue, setEditValue] = useState("")

   const startEdit = (id: string, name: string) => {
      setEditingId(id)
      setEditValue(name)
   }

   const confirmEdit = (id: string) => {
      setTeachers(teachers.map(t => t.id === id ? { ...t, name: capitalizeFirstLetter(editValue.trim()) || t.name } : t))
      setEditingId(null)
   }

   const addTeacher = () => {
      setTeachers([...teachers, { id: uuidv4(), name: "" }])
      setEditingId(uuidv4())
      setEditValue("")
   }

   const removeTeacher = (id: string) => {
      if (questions.some(q => q.teacherId === id)) {
         toast.error("No se puede eliminar un docente con preguntas asignadas")
         return
      }
      setTeachers(teachers.filter(t => t.id !== id))
   }

   const hasQuestions = (id: string) => questions.some(q => q.teacherId === id)

   const hasEmptyName = teachers.some(t => t.name.trim() === "")

   const handleSave = () => {
      const valid = teachers.filter(t => t.name.trim() !== "")
      if (valid.length === 0) {
         toast.error("Debe haber al menos un docente")
         return
      }
      saveTeachers(valid)
      toast.success("Docentes actualizados correctamente")
      window.location.reload()
   }

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
         <div className="fixed inset-0 bg-black/70" />
         <div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col"
            onClick={e => e.stopPropagation()}
         >
            <div className="flex items-center justify-between bg-gray-100 px-5 py-3 rounded-t-2xl">
               <h3 className="font-bold text-sm text-gray-800">Gestionar Docentes</h3>
               <button
                  type="button"
                  className="cursor-pointer text-gray-500 hover:text-gray-800"
                  onClick={onClose}
               ><XMarkIcon className="size-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
               {teachers.map((teacher, index) => {
                  const isEditing = editingId === teacher.id
                  const blocked = hasQuestions(teacher.id)
                  return (
                     <div key={teacher.id} className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
                        <span className="text-xs font-bold text-gray-500 w-5">{index + 1}.</span>
                        {isEditing ? (
                           <input
                              type="text"
                              className="flex-1 border border-blue-400 bg-white rounded px-2 py-1 text-sm focus:outline-none"
                              value={editValue}
                              onChange={e => setEditValue(e.target.value)}
                              onKeyDown={e => { if (e.key === 'Enter') confirmEdit(teacher.id) }}
                              autoFocus
                           />
                        ) : (
                           <span className="flex-1 text-sm text-gray-700">{teacher.name || <span className="text-gray-400 italic">Sin nombre</span>}</span>
                        )}
                        <div className="flex gap-1">
                           {isEditing ? (
                              <button
                                 type="button"
                                 onClick={() => confirmEdit(teacher.id)}
                                 className="cursor-pointer text-green-600 hover:text-green-800"
                              ><CheckIcon className="size-4" /></button>
                           ) : (
                              <button
                                 type="button"
                                 onClick={() => startEdit(teacher.id, teacher.name)}
                                 className="cursor-pointer text-blue-600 hover:text-blue-800"
                              ><PencilSquareIcon className="size-4" /></button>
                           )}
                           <button
                              type="button"
                              onClick={() => removeTeacher(teacher.id)}
                              disabled={blocked}
                              className={`cursor-pointer ${blocked ? 'text-gray-300 cursor-not-allowed' : 'text-red-600 hover:text-red-800'}`}
                              title={blocked ? "Tiene preguntas asignadas" : "Eliminar"}
                           ><TrashIcon className="size-4" /></button>
                        </div>
                     </div>
                  )
               })}
            </div>

            <div className="px-4 pb-3 space-y-2">
               <button
                  type="button"
                  onClick={addTeacher}
                  className="w-full text-center bg-slate-100 p-1.5 rounded-lg hover:bg-slate-200 text-blue-700 cursor-pointer text-sm"
               >+ Agregar docente</button>

               <div className="flex gap-2">
                  <button
                     type="button"
                     onClick={handleSave}
                     disabled={hasEmptyName}
                     className="flex-1 bg-blue-700 hover:bg-blue-800 cursor-pointer text-white font-bold p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >Guardar</button>
                  <button
                     type="button"
                     onClick={onClose}
                     className="flex-1 bg-gray-200 hover:bg-gray-300 cursor-pointer text-gray-700 font-bold p-2 rounded-lg text-sm"
                  >Cancelar</button>
               </div>
            </div>
         </div>
      </div>
   )
}

export default TeacherModal
