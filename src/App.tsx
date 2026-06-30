import { ArrowDownTrayIcon, ArrowPathIcon } from "@heroicons/react/24/solid";
import QuestionGroup from "./components/QuestionGroup";
import Sidebar from "./components/Sidebar";
import ViewModal from "./components/ViewModal";
import ConfirmModal from "./components/ConfirmModal";
import Welcome from "./components/Welcome";
import { useQuestionStore } from "./store";
import { useTeacherStore } from "./store/teacherStore";
import { useMemo, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import type { Question } from "./types";

type ConfirmAction = 'reset' | 'download' | null

function App() {

    const [viewingId, setViewingId] = useState<string | null>(null)
   const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null)
   const [selectedDownloadTeachers, setSelectedDownloadTeachers] = useState<string[]>([])
   const questions = useQuestionStore(state => state.questions)
   const teachers = useTeacherStore(s => s.teachers)
   const resetApp = useQuestionStore(state => state.resetApp)
   const hasQuestions = useMemo(() => questions.length > 0, [questions])
   const viewingQuestion = useMemo(
      () => viewingId ? questions.find(q => q.id === viewingId) ?? null : null,
      [viewingId, questions]
   )

   const allTeachers = useMemo(() => {
      return teachers.map(t => ({
         ...t,
         count: questions.filter(q => q.teacherId === t.id).length
      }))
   }, [teachers, questions])

   const groupedQuestions = useMemo(() => {
      const groups: { teacherName: string; teacherId: string; questions: Question[] }[] = []
      const seen = new Set<string>()
      questions.forEach(q => {
         const teacher = teachers.find(t => t.id === q.teacherId)
         const name = teacher ? teacher.name : 'Sin docente'
         if (!seen.has(q.teacherId)) {
            seen.add(q.teacherId)
            groups.push({ teacherName: name, teacherId: q.teacherId, questions: [] })
         }
         const group = groups.find(g => g.teacherId === q.teacherId)
         if (group) group.questions.push(q)
      })
      return groups
   }, [questions, teachers])

   if (teachers.length === 0) return <Welcome />

   const handleResetAll = () => setConfirmAction('reset')

   const handleOpenDownload = () => {
      const allIds = allTeachers.filter(t => t.count > 0).map(t => t.id)
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
          <div className="flex flex-col lg:flex-row h-screen lg:overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col border-t lg:border-t-0 lg:border-l border-slate-700 bg-slate-900">
                <div className="flex-1 overflow-y-auto min-h-0">
                   <div className="flex items-center justify-between py-3 px-4 w-full sticky top-0 bg-slate-800/95 backdrop-blur border-b border-slate-700 z-10">
                     <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30">
                           <span className="text-xs font-bold text-blue-400">{questions.length}</span>
                        </div>
                        <h1 className="font-bold text-sm text-white leading-tight">Lista de Preguntas</h1>
                     </div>
                     <div className="flex items-center gap-2">
                        <button
                           type="button"
                           className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium bg-red-900/20 text-red-400 hover:bg-red-900/40 disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer"
                           disabled={!hasQuestions}
                           onClick={handleResetAll}
                        ><ArrowPathIcon className="size-3.5" /> Reiniciar</button>
                        <button
                           type="button"
                           className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium bg-blue-900/20 text-blue-400 hover:bg-blue-900/40 disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer"
                           disabled={!hasQuestions}
                           onClick={handleOpenDownload}
                        ><ArrowDownTrayIcon className="size-3.5" /> Descargar</button>
                     </div>
                   </div>
                  <div className="p-4 space-y-5">
                     {hasQuestions ? (
                        groupedQuestions.map(group => (
                           <QuestionGroup
                              key={group.teacherId}
                              teacherName={group.teacherName}
                              teacherId={group.teacherId}
                              questions={group.questions}
                              onView={(q: Question) => setViewingId(q.id)}
                           />
                        ))
                     ) : (
                        <div className="flex items-center justify-center py-16">
                           <p className="text-sm text-slate-500">Aún no cuenta con preguntas registradas</p>
                        </div>
                     )}
                  </div>
               </div>

               <div className="p-3 bg-slate-800 flex justify-between items-center text-[11px] text-slate-500 border-t border-slate-700">
                  <span>Todos los derechos reservados @{new Date().getFullYear()} - <a href="https://www.facebook.com/nelson.huaman.20" target="_blank" className="text-slate-400 hover:text-white transition-colors font-bold cursor-pointer">Nelson Huamán</a></span>
                  <span className="font-bold">Versión 6.0</span>
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