import { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { capitalizeFirstLetter, saveTeachers } from "../utils"
import { toast } from "react-toastify"

function Welcome() {

   const [teachers, setTeachers] = useState([{ id: uuidv4(), name: "" }])

   const addTeacher = () => {
      setTeachers([...teachers, { id: uuidv4(), name: "" }])
   }

   const handleNameChange = (id: string, value: string) => {
      setTeachers(teachers.map(t => t.id === id ? { ...t, name: capitalizeFirstLetter(value) } : t))
   }

   const removeTeacher = (id: string) => {
      if (teachers.length <= 1) return
      setTeachers(teachers.filter(t => t.id !== id))
   }

   const hasValidTeachers = teachers.every(t => t.name.trim() !== "")

   const handleSubmit = () => {
      const validTeachers = teachers.filter(t => t.name.trim() !== "")
      saveTeachers(validTeachers)
      toast.success("Docentes registrados correctamente")
      window.location.reload()
   }

   return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-slate-900 flex items-center justify-center p-4">
         <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-6">
            <div className="text-center mb-4">
               <img src="/logo-acis.svg" alt="Logo Acis" className="w-20 mx-auto mb-3" />
               <h1 className="text-2xl font-black text-blue-900">Bienvenido</h1>
               <p className="text-gray-600 text-sm mt-1">
                  Al sistema de creación de cuestionarios ACIS
               </p>
               <p className="text-xs text-gray-500 mt-1">
                  Registre al menos un docente para continuar
               </p>
            </div>

            <div className="space-y-2">
               {teachers.map((teacher, index) => (
                  <div key={teacher.id} className="flex gap-1 items-center">
                     <span className="text-xs font-bold text-gray-500 w-5">{index + 1}.</span>
                     <input
                        type="text"
                        placeholder="Nombre Completo del Docente"
                        value={teacher.name}
                        onChange={e => handleNameChange(teacher.id, e.target.value)}
                          className="flex-1 border border-gray-400 bg-gray-50 rounded-lg px-2 py-1.5 text-gray-700 focus:outline-none focus:border-blue-500 text-sm"
                     />
                     {teachers.length > 1 && (
                        <button
                           type="button"
                           onClick={() => removeTeacher(teacher.id)}
                           className="text-red-500 hover:text-red-700 text-lg font-bold cursor-pointer px-1"
                        >&times;</button>
                     )}
                  </div>
               ))}
            </div>

            <button
               type="button"
               onClick={addTeacher}
               className="w-full text-center bg-slate-200 p-1.5 rounded-lg hover:bg-slate-100 text-blue-800 cursor-pointer mt-2 text-sm"
            >+ Agregar otro docente</button>

            <button
               type="button"
               onClick={handleSubmit}
               disabled={!hasValidTeachers}
               className="w-full bg-blue-700 hover:bg-blue-800 cursor-pointer text-white font-bold p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed mt-4 text-sm"
            >Ingresar</button>
         </div>
      </div>
   )
}

export default Welcome
