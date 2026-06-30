import { useState, useRef, type ChangeEvent } from "react"
import { parseQuestionsFromXML } from "../utils"
import { useTeacherStore } from "../store/teacherStore"
import { ArrowUpOnSquareIcon } from "@heroicons/react/24/outline"
import { toast } from "react-toastify"
import { useQuestionStore } from "../store"

type RestoreSectionProps = {
   onBack: () => void
}

function RestoreSection({ onBack }: RestoreSectionProps) {
   const [isDragging, setIsDragging] = useState(false)
   const [restoreFile, setRestoreFile] = useState<{
      fileName: string
      questions: { questionText: string; feedback: string; options: { text: string; correct: boolean }[]; teacherName: string; image?: string }[]
      teacherNames: string[]
   } | null>(null)
   const fileInputRef = useRef<HTMLInputElement>(null)
   const addQuestion = useQuestionStore(state => state.addQuestion)
   const addTeacher = useTeacherStore(s => s.addTeacher)

   const processFile = (file: File) => {
      const reader = new FileReader()
      reader.onload = () => {
         const result = parseQuestionsFromXML(reader.result as string)
         if (result.teacherNames.length === 0) {
            toast.error('El XML no contiene docentes válidos')
            return
         }
         setRestoreFile({ ...result, fileName: file.name })
      }
      reader.readAsText(file)
   }

   const handleFileRestore = (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      processFile(file)
      e.target.value = ''
   }

   const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(true)
   }

   const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
   }

   const handleDrop = (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (!file) return
      if (!file.name.endsWith('.xml')) {
         toast.error('Solo se permiten archivos XML')
         return
      }
      processFile(file)
   }

   const handleRestore = () => {
      if (!restoreFile) return
      const teachers = restoreFile.teacherNames.map(name => addTeacher(name))
      restoreFile.questions.forEach(q => {
         const teacher = teachers.find(t => t.name === q.teacherName)
         addQuestion({
            questionText: q.questionText,
            feedback: q.feedback,
            options: q.options,
            teacherId: teacher?.id || '',
            image: q.image
         })
      })
      toast.success('XML restaurado correctamente')
   }

   return (
      <div>
         <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white">Restaurar desde XML</h2>
            <button
               type="button"
               onClick={onBack}
               className="text-xs text-slate-400 hover:text-white cursor-pointer"
            >&larr; Volver</button>
         </div>

         <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
               isDragging
                  ? 'border-green-500 bg-green-900/20'
                  : 'border-slate-600 bg-slate-800'
            }`}
         >
            <ArrowUpOnSquareIcon className={`size-10 mx-auto mb-2 ${isDragging ? 'text-green-400' : 'text-slate-400'}`} />
            <p className="text-sm text-slate-400 mb-3">Arrastra un archivo XML o haz clic para seleccionar</p>
            <button
               type="button"
               onClick={() => fileInputRef.current?.click()}
               className="bg-green-600 hover:bg-green-500 cursor-pointer text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors"
            >Seleccionar archivo XML</button>
            <input
               ref={fileInputRef}
               type="file"
               accept=".xml"
               className="hidden"
               onChange={handleFileRestore}
            />
         </div>

         {restoreFile && (
            <div className="mt-4 bg-green-900/20 border border-green-700 rounded-xl p-4">
               <p className="text-sm font-semibold text-green-300 mb-2">
                  ✅ {restoreFile.fileName}
               </p>
               <div className="text-sm text-green-400 space-y-1">
                  <p>📝 Preguntas: {restoreFile.questions.length}</p>
                  <p>👤 Docentes: {restoreFile.teacherNames.length}</p>
               </div>
               <button
                  type="button"
                  onClick={handleRestore}
                  className="w-full mt-3 bg-green-600 hover:bg-green-500 cursor-pointer text-white font-bold p-2 rounded-lg text-sm transition-colors"
               >Restaurar</button>
            </div>
         )}
      </div>
   )
}

export default RestoreSection
