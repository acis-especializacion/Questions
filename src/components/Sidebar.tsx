import { useEffect, useState, useMemo, type ChangeEvent, type FormEvent } from "react"
import { useQuestionStore } from "../store"
import { useTeacherStore } from "../store/teacherStore"
import { capitalizeFirstLetter, labelOptions } from "../utils"
import TeacherSelector from "./TeacherSelector"
import TeacherPanel from "./TeacherPanel"
import { toast } from "react-toastify"
import type { DraftQuestion, Option } from "../types"

function Sidebar() {

   const addQuestion = useQuestionStore(state => state.addQuestion)
   const updateQuestion = useQuestionStore(state => state.updateQuestion)
   const activeId = useQuestionStore(state => state.activeId)
   const questions = useQuestionStore(state => state.questions)
   const closeModal = useQuestionStore(state => state.closeModal)
   const teachers = useTeacherStore(s => s.teachers)

   const initialState = (teacherId: string): DraftQuestion => ({
      questionText: '',
      feedback: '',
      teacherId,
      options: [
         { text: '', correct: false },
         { text: '', correct: false },
         { text: '', correct: false }
      ]
   })

   const [selectedTeacher, setSelectedTeacher] = useState(teachers.length > 0 ? teachers[0].id : '')
   const [question, setQuestion] = useState(initialState(selectedTeacher))
   const [teacherPanelOpen, setTeacherPanelOpen] = useState(false)

   useEffect(() => {
      if (activeId) {
         const activeQuestion = questions.filter(q => q.id === activeId)[0]
         if (activeQuestion) {
            setSelectedTeacher(activeQuestion.teacherId)
            setQuestion({
               questionText: activeQuestion.questionText,
               feedback: activeQuestion.feedback,
               teacherId: activeQuestion.teacherId,
               options: activeQuestion.options.map(o => ({ text: o.text, correct: o.correct }))
            })
         }
      }
   }, [activeId])

   const handleAddOption = () => {
      if (question.options.length < 6) {
         setQuestion({
            ...question,
            options: [...question.options, { text: '', correct: false }]
         })
      }
   }

   const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      setQuestion({
         ...question,
         [e.target.name]: capitalizeFirstLetter(e.target.value)
      })
   }

   const handleTeacherChange = (id: string) => {
      setSelectedTeacher(id)
      if (!activeId) {
         setQuestion(q => ({ ...q, teacherId: id }))
      }
   }

   const hasDuplicateOptions = (options: Option[]) => {
      const texts = options.filter(o => o.text.trim()).map(o => o.text.trim().toLowerCase())
      return new Set(texts).size !== texts.length
   }

   const duplicateIndexes = useMemo(() => {
      const texts = question.options.map(o => o.text.trim().toLowerCase())
      return question.options.reduce<number[]>((acc, _, i) => {
         if (texts[i] && texts.filter(t => t === texts[i]).length > 1) acc.push(i)
         return acc
      }, [])
   }, [question.options])

   const isDuplicateQuestion = useMemo(() => {
      if (activeId) return false
      const trimmed = question.questionText.trim().toLowerCase()
      if (!trimmed) return false
      return questions.some(q => q.questionText.trim().toLowerCase() === trimmed)
   }, [question.questionText, questions, activeId])

   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const filteredOptions = question.options.filter(o => o.text.trim() !== "")
      const hasDuplicates = (() => {
         const texts = filteredOptions.map(o => o.text.trim().toLowerCase())
         return new Set(texts).size !== texts.length
      })()
      if (hasDuplicates) {
         toast.error('Las alternativas no pueden repetirse')
         return
      }
       if (!activeId && isDuplicateQuestion) {
          toast.error('Pregunta ya registrada')
          setQuestion(initialState(selectedTeacher))
          return
       }
      const questionToSave = { ...question, options: filteredOptions, teacherId: selectedTeacher }

       if (activeId) {
          updateQuestion(questionToSave)
          toast.success('Pregunta actualizado')
          setQuestion(initialState(selectedTeacher))
       } else {
         addQuestion(questionToSave)
         toast.success('Pregunta registrado')
         setQuestion(initialState(selectedTeacher))
      }
   }

   const handleCancelEdit = () => {
      closeModal()
      setQuestion(initialState(selectedTeacher))
   }

   return (
      <aside className="lg:w-2/5 lg:min-w-80 bg-slate-800 p-3 lg:p-4 flex flex-col lg:h-screen lg:overflow-hidden">
         <div className="flex items-center mb-4">
            <img src="/logo-acis.svg" alt="Logo Acis" className="w-12" />
         </div>

           <div className="mb-4">
              <TeacherSelector
                 value={activeId ? question.teacherId : selectedTeacher}
                 onChange={handleTeacherChange}
                 onOpenPanel={() => setTeacherPanelOpen(true)}
              />
              {teacherPanelOpen && <TeacherPanel onClose={() => setTeacherPanelOpen(false)} />}
           </div>

          <div className="flex flex-col lg:flex-1 min-h-0">
             <form className="flex flex-col flex-1 min-h-0" onSubmit={handleSubmit}>
                <div className="flex-1 overflow-y-auto space-y-4 min-h-0">
                    <div>
                       <label className="block text-xs font-bold text-slate-300 mb-1.5">Pregunta:</label>
                        <textarea
                           spellCheck={true}
                           lang="es"
                           className="w-full border border-slate-600 bg-slate-800 text-white placeholder:text-slate-400 px-3 py-2 rounded-lg outline-none text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400 resize-none"
                           rows={3}
                           placeholder="Ingrese su pregunta"
                           name="questionText"
                           value={question.questionText}
                           onChange={handleChange}
                        />
                    </div>

                    <div className="border-t border-slate-800 pt-4">
                       <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs font-bold text-slate-300">Alternativas:</label>
                          <span className="text-xs text-slate-500">{question.options.length}/6</span>
                       </div>
                       {question.options.map((option, index) => {
                          const isDuplicate = duplicateIndexes.includes(index)
                          return (
                             <div
                                key={index}
                                className={`flex items-center rounded-lg border transition-all mb-1.5 focus-within:ring-1 focus-within:ring-blue-400 ${
                                   option.correct
                                      ? 'bg-green-900/20 border-green-500 shadow-sm'
                                      : isDuplicate
                                      ? 'bg-red-900/20 border-red-500'
                                      : 'bg-slate-800 border-slate-600 hover:bg-slate-700 hover:border-slate-500'
                                }`}
                             >
                                <div
                                   onClick={() => {
                                      if (option.text.trim() === '') return;
                                      const newOptions = question.options.map((opt, i) => ({ ...opt, correct: i === index }));
                                      setQuestion({ ...question, options: newOptions });
                                   }}
                                   className={`flex items-center justify-center w-9 h-9 rounded-l-lg text-xs font-bold shrink-0 transition-colors cursor-pointer ${
                                   option.correct
                                      ? 'bg-green-600 text-white'
                                      : isDuplicate
                                      ? 'bg-red-500 text-white'
                                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                }`}>
                                   {option.correct ? '✓' : labelOptions(index).slice(0, -1)}
                                </div>
                                <input
                                    spellCheck={true}
                                    lang="es"
                                    className="flex-1 text-white placeholder:text-slate-500 bg-transparent border-none outline-none ring-0 w-full text-sm py-2 px-2.5"
                                    type="text"
                                    placeholder="Ingrese la Alternativa"
                                    value={option.text}
                                    onChange={e => {
                                      const newOptions = [...question.options];
                                      newOptions[index].text = capitalizeFirstLetter(e.target.value)
                                      setQuestion({ ...question, options: newOptions })
                                   }}
                                />
                             </div>
                          )
                       })}

                      <button
                         type="button"
                         className="w-full text-center bg-slate-800 p-1.5 rounded-lg hover:bg-slate-700 text-blue-400 disabled:opacity-20 disabled:cursor-not-allowed text-sm mt-1 border border-dashed border-slate-600 hover:border-slate-500 cursor-pointer"
                         onClick={handleAddOption}
                         disabled={question.options.length >= 6}
                      >+ Añadir alternativa</button>
                    </div>

                    <div className="border-t border-slate-800 pt-4">
                       <label className="block text-xs font-bold text-slate-300 mb-1.5">Retroalimentación:</label>
                        <textarea
                           spellCheck={true}
                           lang="es"
                           className="w-full border border-slate-600 bg-slate-800 text-white placeholder:text-slate-400 px-3 py-2 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 text-sm resize-none"
                           rows={2}
                           placeholder="Retroalimentación para respuestas incorrectas"
                           name="feedback"
                           value={question.feedback}
                           onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="flex gap-2 pt-3 mt-2 border-t border-slate-700">
                   <input
                      type="submit"
                      value={activeId ? 'Actualizar' : 'Registrar'}
                      disabled={!selectedTeacher || !question.options.some(o => o.correct) || hasDuplicateOptions(question.options) || Object.values(question).some(v => v === '')}
                      className="bg-blue-600 hover:bg-blue-500 cursor-pointer w-full text-white font-bold p-2 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed text-sm transition-colors"
                   />
                   {activeId && (
                      <button
                         type="button"
                         onClick={handleCancelEdit}
                         className="bg-slate-700 hover:bg-slate-600 cursor-pointer text-slate-200 font-bold p-2 rounded-lg text-sm px-4 transition-colors"
                      >Cancelar</button>
                   )}
                </div>
             </form>
          </div>
      </aside>
   )
}

export default Sidebar
