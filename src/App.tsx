import { ArrowDownTrayIcon, ArrowPathIcon } from "@heroicons/react/24/solid";
import QuizDetail from "./components/QuizDetail";
import Sidebar from "./components/Sidebar";
import ViewModal from "./components/ViewModal";
import ConfirmModal from "./components/ConfirmModal";
import Welcome from "./components/Welcome";
import { useQuestionStore } from "./store";
import { useMemo, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { getTeachers, hasTeachers } from "./utils";
import type { Question } from "./types";

type ConfirmAction = 'reset' | 'download' | null

function App() {

   const [viewingId, setViewingId] = useState<string | null>(null)
   const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null)
   const [selectedDownloadTeachers, setSelectedDownloadTeachers] = useState<string[]>([])
   const questions = useQuestionStore(state => state.questions)
   const resetApp = useQuestionStore(state => state.resetApp)
   const hasQuestions = useMemo(() => questions.length > 0, [questions])
   const viewingQuestion = useMemo(
      () => viewingId ? questions.find(q => q.id === viewingId) ?? null : null,
      [viewingId, questions]
   )

   const allTeachers = useMemo(() => {
      const teachers = getTeachers()
      return teachers.map(t => ({
         ...t,
         count: questions.filter(q => q.teacherId === t.id).length
      }))
   }, [questions])

   const groupedQuestions = useMemo(() => {
      const teachers = getTeachers()
      const groups: { teacherName: string; questions: Question[] }[] = []
      const seen = new Set<string>()
      questions.forEach(q => {
         const teacher = teachers.find(t => t.id === q.teacherId)
         const name = teacher ? teacher.name : 'Sin docente'
         if (!seen.has(q.teacherId)) {
            seen.add(q.teacherId)
            groups.push({ teacherName: name, questions: [] })
         }
         const group = groups.find(g => g.teacherName === name)
         if (group) group.questions.push(q)
      })
      return groups
   }, [questions])

   if (!hasTeachers()) return <Welcome />

   const handleResetAll = () => setConfirmAction('reset')

   const handleOpenDownload = () => {
      const allIds = allTeachers.map(t => t.id)
      setSelectedDownloadTeachers(allIds)
      setConfirmAction('download')
   }

   const handleTeacherToggle = (id: string) => {
      setSelectedDownloadTeachers(prev =>
         prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
      )
   }

   const handleConfirm = () => {
      if (confirmAction === 'reset') {
         resetApp()
         localStorage.removeItem('docentes')
         toast.error('App reiniciada — Todos los datos eliminados')
         window.location.reload()
      } else if (confirmAction === 'download') {
         handleGenerateXML()
      }
      setConfirmAction(null)
   }

   const handleGenerateXML = () => {
      const teachers = getTeachers()
      const filtered = selectedDownloadTeachers.length > 0
         ? questions.filter(q => selectedDownloadTeachers.includes(q.teacherId))
         : questions

      let archivoXML = `<?xml version="1.0" encoding="UTF-8"?>\n`
      archivoXML += `<quiz>\n`;

      filtered.forEach(option => {
         const teacher = teachers.find(t => t.id === option.teacherId)
         const correctIndex = option.options.findIndex((item) => item.correct);
         const correctLabel = correctIndex !== -1 ? String.fromCharCode(65 + correctIndex) : "?";

         archivoXML += `   <question type="multichoice">\n`
         archivoXML += `      <name>\n`
         archivoXML += `         <text>Pregunta ${String(option.number ?? 0).padStart(2, '0')} — ${teacher ? teacher.name : 'Sin docente'}</text>\n`
         archivoXML += `      </name>\n`
         let imgTag = ''
         let fileTag = ''
         if (option.image) {
            const m = option.image.match(/^data:(image\/\w+);base64,(.+)$/)
            if (m) {
               const ext = m[1].split('/')[1].replace('jpeg', 'jpg')
               const fileName = `image-${String(option.number ?? 0).padStart(2, '0')}.${ext}`
               imgTag = `<p><img src="@@PLUGINFILE@@/${fileName}" /></p>`
               const lines: string[] = []
               for (let i = 0; i < m[2].length; i += 76) {
                  lines.push(m[2].slice(i, i + 76))
               }
               const wrapped = lines.join('\n')
               fileTag = `\n         <file name="${fileName}" path="/" encoding="base64">\n${wrapped}\n         </file>`
            }
         }
         archivoXML += `      <questiontext format="html">\n`
         archivoXML += `         <text>\n`
         archivoXML += `            <![CDATA[ <p>${option.questionText}</p>${imgTag}<small style="color: #999;">#${String(option.number ?? 0).padStart(2, '0')} — ${teacher ? teacher.name : 'Sin docente'}</small> ]]>\n`
         archivoXML += `         </text>${fileTag}\n`
         archivoXML += `      </questiontext>\n`
         archivoXML += `      <generalfeedback format="html">\n`
         archivoXML += `         <text/>\n`
         archivoXML += `      </generalfeedback>\n`
         archivoXML += `      <defaultgrade>1.0000000</defaultgrade>\n`
         archivoXML += `      <penalty>0.0000000</penalty>\n`
         archivoXML += `      <hidden>0</hidden>\n`
         archivoXML += `      <idnumber/>\n`
         archivoXML += `      <single>true</single>\n`
         archivoXML += `      <shuffleanswers>false</shuffleanswers>\n`
         archivoXML += `      <answernumbering>abc</answernumbering>\n`
         archivoXML += `      <showstandardinstruction>0</showstandardinstruction>\n`
         archivoXML += `      <correctfeedback format="html">\n`
         archivoXML += `         <text>\n`
         archivoXML += `            <![CDATA[ <p style="color: green;"><strong>¡Felicidades!</strong> Marcó la Alternativa Correcta</p> ]]>\n`
         archivoXML += `         </text>\n`
         archivoXML += `      </correctfeedback>\n`
         archivoXML += `      <partiallycorrectfeedback format="html">\n`
         archivoXML += `         <text/>\n`
         archivoXML += `      </partiallycorrectfeedback>\n`
         archivoXML += `      <incorrectfeedback format="html">\n`
         archivoXML += `         <text>\n`
         archivoXML += `            <![CDATA[ <p style="color: red;"><strong>La opción correcta es la (${correctLabel})</strong></p><p style="color: red;">${option.feedback}</p> ]]>\n`
         archivoXML += `         </text>\n`
         archivoXML += `      </incorrectfeedback>\n`
         archivoXML += `      <shownumcorrect/>\n`
         option.options.forEach(item => {
            const fraction = item.correct ? "100" : "0";
            archivoXML += `      <answer fraction="${fraction}" format="html">\n`
            archivoXML += `         <text>\n`
            archivoXML += `            <![CDATA[ <p>${item.text}</p> ]]>\n`
            archivoXML += `         </text>\n`
            archivoXML += `         <feedback format="html">\n`
            archivoXML += `            <text/>\n`
            archivoXML += `         </feedback>\n`
            archivoXML += `      </answer>\n`
         })
         archivoXML += `   </question>\n`
      })

      archivoXML += `</quiz>`;
      const blob = new Blob([archivoXML], { type: "application/xml" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "Cuestionario.xml";
      link.click();

      toast.info('Cuestionario descargado')
   }

   return (
      <>
         <div className="flex flex-col lg:flex-row min-h-screen">
            <Sidebar
               count={questions.length}
            />
            <div className="flex-1 flex flex-col border-t lg:border-t-0 lg:border-l border-gray-300">
               <div className="flex-1 overflow-y-scroll">
                  <div className="flex items-center justify-between py-2 px-4 w-full z-10 shadow-lg sticky top-0 bg-white">
                     <h1 className="font-bold text-base">Lista de <span className="text-blue-800">Preguntas</span></h1>
                     <div className="flex items-center gap-3">
                        <button
                           type="button"
                           className="cursor-pointer text-red-600 hover:text-red-800 disabled:opacity-10 disabled:cursor-not-allowed"
                           disabled={!hasQuestions}
                           onClick={handleResetAll}
                        ><ArrowPathIcon className="size-5" /></button>
                        <button
                           type="button"
                           className="cursor-pointer disabled:opacity-10 disabled:cursor-not-allowed"
                           disabled={!hasQuestions}
                              onClick={handleOpenDownload}
                        ><ArrowDownTrayIcon className="size-5 text-black" /></button>
                     </div>
                  </div>
                  <div className="p-3 flex flex-col gap-3">
                     {hasQuestions ? (
                        <>
                           {groupedQuestions.map(group => (
                              <div key={group.teacherName}>
                                 <h2 className="font-bold text-sm text-blue-800 bg-blue-50 p-2 rounded-lg mb-2">
                                    {group.teacherName} <span className="font-normal text-gray-500">({group.questions.length} preguntas)</span>
                                 </h2>
                                  {group.questions.map(question => (
                                     <QuizDetail
                                        key={question.id}
                                        question={question}
                                        onView={(q: Question) => setViewingId(q.id)}
                                     />
                                  ))}
                              </div>
                           ))}
                        </>
                     ) : (
                        <p className="text-center text-sm">Aún no cuenta con preguntas registrados</p>
                     )}
                  </div>
               </div>

               <div className="p-4 bg-slate-300 flex justify-between items-center text-xs border-t border-gray-400">
                  <span>Todos los derechos reservados @{new Date().getFullYear()} - <a href="https://www.facebook.com/nelson.huaman.20" target="_blank" className="text-blue-800 font-bold cursor-pointer">Nelson Huamán</a></span>
                  <span className="font-bold">Versión 4.0</span>
               </div>
            </div>
         </div>
          <ConfirmModal
             open={confirmAction !== null}
             icon={confirmAction === 'reset' ? 'warning' : 'download'}
             title={confirmAction === 'reset' ? 'Reiniciar Aplicación' : 'Descargar XML'}
             message={
                confirmAction === 'reset'
                   ? '¿Está seguro de reiniciar la aplicación?'
                   : 'Confirme la descarga del cuestionario'
             }
             details={
                confirmAction === 'reset'
                   ? ['Se eliminarán todas las preguntas', 'Se eliminará la lista de docentes', 'Esta acción no se puede deshacer']
                   : undefined
             }
             teachers={confirmAction === 'download' ? allTeachers : undefined}
             selectedTeachers={confirmAction === 'download' ? selectedDownloadTeachers : undefined}
             onTeacherToggle={confirmAction === 'download' ? handleTeacherToggle : undefined}
             confirmLabel={confirmAction === 'reset' ? 'Sí, reiniciar' : 'Sí, descargar'}
             confirmClass={confirmAction === 'reset' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-700 hover:bg-blue-800'}
             onConfirm={handleConfirm}
             onCancel={() => {
                setConfirmAction(null)
                setSelectedDownloadTeachers([])
             }}
          />
         <ViewModal question={viewingQuestion} onClose={() => setViewingId(null)} />
         <ToastContainer pauseOnHover={false} pauseOnFocusLoss={false} />
      </>
   )
}

export default App