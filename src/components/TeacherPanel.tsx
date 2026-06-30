import { useState } from "react"
import { XMarkIcon, PencilSquareIcon, TrashIcon, CheckIcon } from "@heroicons/react/24/solid"
import { useTeacherStore } from "../store/teacherStore"
import { useQuestionStore } from "../store"
import { getTeacherColor, getInitials } from "../utils/teacherColors"
import { capitalizeFirstLetter } from "../utils"
import { toast } from "react-toastify"

type TeacherPanelProps = {
   onClose: () => void
}

function TeacherPanel({ onClose }: TeacherPanelProps) {
   const teachers = useTeacherStore(s => s.teachers)
   const addTeacher = useTeacherStore(s => s.addTeacher)
   const updateTeacher = useTeacherStore(s => s.updateTeacher)
   const deleteTeacher = useTeacherStore(s => s.deleteTeacher)
   const questions = useQuestionStore(s => s.questions)
   const [editingId, setEditingId] = useState<string | null>(null)
   const [editValue, setEditValue] = useState("")
   const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

   const startEdit = (id: string, name: string) => {
      setEditingId(id)
      setEditValue(name)
   }

   const confirmEdit = (id: string) => {
      const name = capitalizeFirstLetter(editValue.trim())
      if (!name) return
      updateTeacher(id, name)
      setEditingId(null)
   }

   const handleAdd = () => {
      const t = addTeacher("")
      startEdit(t.id, "")
   }

   const handleDelete = (id: string) => {
      if (questions.some(q => q.teacherId === id)) {
         toast.error("No se puede eliminar un docente con preguntas asignadas")
         return
      }
      if (confirmDelete === id) {
         deleteTeacher(id)
         setConfirmDelete(null)
         toast.success("Docente eliminado")
      } else {
         setConfirmDelete(id)
      }
   }

   const questionCount = (id: string) => questions.filter(q => q.teacherId === id).length

   return (
      <div className="fixed inset-0 z-50" onClick={onClose}>
         <div className="fixed inset-0 bg-black/60" />
         <div
            className="fixed right-0 top-0 h-full w-90 bg-slate-800 shadow-2xl flex flex-col"
            onClick={e => e.stopPropagation()}
         >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
               <h3 className="font-bold text-sm text-white">Gestionar Docentes</h3>
               <button
                  type="button"
                  onClick={onClose}
                  className="cursor-pointer text-slate-400 hover:text-white"
               ><XMarkIcon className="size-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
               {teachers.length === 0 && (
                  <p className="text-sm text-slate-400 text-center py-6">No hay docentes registrados</p>
               )}
               {teachers.map((t, i) => {
                  const c = getTeacherColor(i)
                  const count = questionCount(t.id)
                  const isEditing = editingId === t.id
                  const deleting = confirmDelete === t.id
                  return (
                     <div
                        key={t.id}
                        className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                           deleting ? 'bg-red-900/20' : 'hover:bg-slate-700'
                        }`}
                     >
                        <span
                           className="flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold shrink-0"
                           style={{ backgroundColor: c.bg, color: c.text }}
                        >{getInitials(t.name)}</span>

                        <div className="flex-1 min-w-0">
                           {isEditing ? (
                              <input
                                 type="text"
                                 value={editValue}
                                 onChange={e => setEditValue(e.target.value)}
                                 onKeyDown={e => {
                                    if (e.key === 'Enter') confirmEdit(t.id)
                                    if (e.key === 'Escape') setEditingId(null)
                                 }}
                                 className="w-full border border-slate-600 bg-slate-800 text-white rounded px-1.5 py-0.5 text-sm outline-none"
                                 autoFocus
                              />
                           ) : (
                              <div className="flex items-center gap-2">
                                 <span className="text-sm text-white truncate">{t.name || <span className="text-slate-400 italic">Sin nombre</span>}</span>
                                 <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 ${
                                    count > 0 ? 'bg-blue-900/30 text-blue-400' : 'bg-slate-700 text-slate-400'
                                 }`}>
                                    {count} preg.
                                 </span>
                              </div>
                           )}
                        </div>

                        <div className="flex gap-0.5 shrink-0">
                           {isEditing ? (
                              <button
                                 type="button"
                                 onClick={() => confirmEdit(t.id)}
                                 className="cursor-pointer text-green-400 hover:text-green-300 p-0.5"
                              ><CheckIcon className="size-4" /></button>
                           ) : (
                              <button
                                 type="button"
                                 onClick={() => startEdit(t.id, t.name)}
                                 className="cursor-pointer text-slate-400 hover:text-blue-400 p-0.5"
                              ><PencilSquareIcon className="size-4" /></button>
                           )}
                           {deleting ? (
                              <div className="flex gap-0.5">
                                 <button
                                    type="button"
                                    onClick={() => handleDelete(t.id)}
                                    className="text-xs text-red-400 font-bold hover:text-red-300 cursor-pointer px-1"
                                 >Eliminar</button>
                                 <button
                                    type="button"
                                    onClick={() => setConfirmDelete(null)}
                                    className="text-xs text-slate-400 hover:text-white cursor-pointer"
                                 >No</button>
                              </div>
                           ) : (
                              <button
                                 type="button"
                                 onClick={() => handleDelete(t.id)}
                                 className="cursor-pointer text-slate-400 hover:text-red-400 p-0.5"
                              ><TrashIcon className="size-4" /></button>
                           )}
                        </div>
                     </div>
                  )
               })}
            </div>

            <div className="px-3 pb-3 space-y-2 border-t border-slate-700 pt-3">
               <button
                  type="button"
                  onClick={handleAdd}
                  className="w-full text-center bg-slate-700 p-1.5 rounded-lg hover:bg-slate-600 text-blue-400 cursor-pointer text-sm"
               >+ Agregar docente</button>
               <button
                  type="button"
                  onClick={onClose}
                  className="w-full bg-blue-600 hover:bg-blue-500 cursor-pointer text-white font-bold p-2 rounded-lg text-sm"
               >Listo</button>
            </div>
         </div>
      </div>
   )
}

export default TeacherPanel
