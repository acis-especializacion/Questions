import { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { capitalizeFirstLetter } from "../utils"
import { useTeacherStore } from "../store/teacherStore"
import { getTeacherColor, getInitials } from "../utils/teacherColors"
import { toast } from "react-toastify"

type RegisterSectionProps = {
   onBack: () => void
}

function RegisterSection({ onBack }: RegisterSectionProps) {
   const addTeacher = useTeacherStore(s => s.addTeacher)
   const [teachers, setTeachers] = useState([{ id: uuidv4(), name: "" }])

   const handleAdd = () => {
      setTeachers([...teachers, { id: uuidv4(), name: "" }])
   }

   const handleNameChange = (id: string, value: string) => {
      setTeachers(teachers.map(t => t.id === id ? { ...t, name: capitalizeFirstLetter(value) } : t))
   }

   const handleRemove = (id: string) => {
      if (teachers.length <= 1) return
      setTeachers(teachers.filter(t => t.id !== id))
   }

   const hasValidTeachers = teachers.every(t => t.name.trim() !== "")

   const handleSubmit = () => {
      const valid = teachers.filter(t => t.name.trim() !== "")
      valid.forEach(t => addTeacher(t.name))
      toast.success("Docentes registrados correctamente")
   }

   return (
      <div>
         <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white">Registrar Docentes</h2>
            <button
               type="button"
               onClick={onBack}
               className="text-xs text-slate-400 hover:text-white cursor-pointer"
            >&larr; Volver</button>
         </div>

         <p className="text-xs text-slate-400 mb-4">Registre al menos un docente para continuar</p>

         <div className="space-y-2">
            {teachers.map((teacher, index) => {
               const c = getTeacherColor(index)
               return (
                  <div key={teacher.id} className="flex gap-1.5 items-center">
                     <span
                        className="flex items-center justify-center w-7 h-7 rounded-full text-[10px] font-bold shrink-0"
                        style={{ backgroundColor: c.bg, color: c.text }}
                     >{getInitials(teacher.name || "N")}</span>
                     <input
                        type="text"
                        placeholder="Nombre Completo del Docente"
                        value={teacher.name}
                        onChange={e => handleNameChange(teacher.id, e.target.value)}
                        className="flex-1 border border-slate-600 bg-slate-800 rounded-lg px-2 py-1.5 text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-400 text-sm"
                     />
                     {teachers.length > 1 && (
                        <button
                           type="button"
                           onClick={() => handleRemove(teacher.id)}
                           className="text-red-500 hover:text-red-700 text-lg font-bold cursor-pointer px-1"
                        >&times;</button>
                     )}
                  </div>
               )
            })}
         </div>

         <button
            type="button"
            onClick={handleAdd}
            className="w-full text-center bg-slate-800 p-1.5 rounded-lg hover:bg-slate-700 text-blue-400 cursor-pointer mt-2 text-sm border border-dashed border-slate-600"
         >+ Agregar otro docente</button>

         <button
            type="button"
            onClick={handleSubmit}
            disabled={!hasValidTeachers}
            className="w-full bg-blue-600 hover:bg-blue-500 cursor-pointer text-white font-bold p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed mt-4 text-sm transition-colors"
         >Ingresar</button>
      </div>
   )
}

export default RegisterSection
