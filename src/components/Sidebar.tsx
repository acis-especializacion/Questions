import { useEffect, useState, useMemo, type ChangeEvent, type FormEvent } from "react"
import { useQuestionStore } from "../store"
import { getTeachers, capitalizeFirstLetter, labelOptions } from "../utils"
import TeacherCombobox from "./TeacherCombobox"
import { toast } from "react-toastify"
import type { DraftQuestion, Option } from "../types"

type SidebarProps = {
   count: number
}

function Sidebar({ count }: SidebarProps) {

   const addQuestion = useQuestionStore(state => state.addQuestion)
   const updateQuestion = useQuestionStore(state => state.updateQuestion)
   const activeId = useQuestionStore(state => state.activeId)
   const questions = useQuestionStore(state => state.questions)
   const closeModal = useQuestionStore(state => state.closeModal)

   const teachers = getTeachers()

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
         return
      }
      const questionToSave = { ...question, options: filteredOptions, teacherId: selectedTeacher }

      if (activeId) {
         updateQuestion(questionToSave)
         toast.success('Pregunta actualizado')
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
      <aside className="lg:w-2/5 bg-slate-900 p-3 lg:p-4 flex flex-col lg:h-screen lg:overflow-hidden">
         <div className="flex items-center justify-between mb-4">
            <img src="/logo-acis.svg" alt="Logo Acis" className="w-12" />
            <p className="flex items-center gap-1 text-white font-black">
               <span className="text-xl">{count}</span>
               <span className="text-sm font-bold">Preguntas</span>
            </p>
         </div>

         <div className="mb-4 relative">
            <label className="block text-xs font-bold text-slate-200 mb-1">Docente:</label>
            <TeacherCombobox
               value={activeId ? question.teacherId : selectedTeacher}
               onChange={handleTeacherChange}
            />
         </div>

         <div className="bg-white rounded-lg p-3 lg:p-4 flex flex-col lg:flex-1 min-h-0">
            <form className="flex flex-col flex-1 min-h-0" onSubmit={handleSubmit}>
               <div className="flex-1 overflow-y-auto space-y-3 min-h-0">
                  <div>
                     <label className="block text-xs font-bold text-gray-600 mb-1">Pregunta:</label>
                     <textarea
                        className="w-full border border-slate-400 bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg outline-none text-sm focus:border-blue-500"
                        placeholder="Ingrese su pregunta"
                        name="questionText"
                        value={question.questionText}
                        onChange={handleChange}
                     />
                  </div>

                  <div>
                     <label className="block text-xs font-bold text-gray-600 mb-1">Alternativas:</label>
                     {question.options.map((option, index) => {
                        const isDuplicate = duplicateIndexes.includes(index)
                        return (
                           <div key={index} className={`flex gap-2 items-center mb-1.5 ${option.correct ? 'bg-green-200 p-1.5 rounded-lg' : ''} ${isDuplicate ? 'bg-red-100 border border-red-400 rounded-lg p-1.5' : ''}`}>
                              <span className="w-5 font-bold text-sm text-gray-600">{labelOptions(index)}</span>
                              <input
                                 className={`border py-1 px-2 rounded flex-1 text-gray-700 focus:outline-none focus:border-blue-500 w-full text-sm ${isDuplicate ? 'border-red-400 bg-red-50' : 'border-gray-400 bg-gray-50'}`}
                                 type="text"
                                 placeholder="Ingrese la Alternativa"
                                 value={option.text}
                                 onChange={e => {
                                    const newOptions = [...question.options];
                                    newOptions[index].text = capitalizeFirstLetter(e.target.value)
                                    setQuestion({ ...question, options: newOptions })
                                 }}
                              />
                              <input
                                 className="cursor-pointer w-4 h-4"
                                 type="radio"
                                 name="correctOption"
                                 checked={option.correct}
                                 onChange={() => {
                                    if (option.text.trim() === '') return;
                                    const newOptions = question.options.map((opt, i) => ({
                                       ...opt,
                                       correct: i === index
                                    }));
                                    setQuestion({ ...question, options: newOptions });
                                 }}
                              />
                           </div>
                        )
                     })}

                     <button
                        type="button"
                        className="w-full text-center bg-slate-100 p-1 rounded-lg hover:bg-slate-200 text-blue-700 disabled:opacity-10 disabled:cursor-not-allowed text-sm mt-1"
                        onClick={handleAddOption}
                        disabled={question.options.length >= 6}
                     >+ Añadir alternativa</button>
                  </div>

                  <div>
                     <label className="block text-xs font-bold text-gray-600 mb-1">Retroalimentación:</label>
                     <textarea
                        className="w-full border border-gray-400 bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                        placeholder="Retroalimentación para respuestas incorrectas"
                        name="feedback"
                        value={question.feedback}
                        onChange={handleChange}
                     />
                  </div>
               </div>

               <div className="flex gap-2 pt-3 mt-1 border-t border-gray-200">
                  <input
                     type="submit"
                     value={activeId ? 'Actualizar' : 'Registrar'}
                     disabled={!selectedTeacher || !question.options.some(o => o.correct) || hasDuplicateOptions(question.options) || Object.values(question).some(v => v === '')}
                     className="bg-blue-700 hover:bg-blue-800 cursor-pointer w-full text-white font-bold p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  />
                  {activeId && (
                     <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="bg-gray-200 hover:bg-gray-300 cursor-pointer text-gray-700 font-bold p-2 rounded-lg text-sm px-4"
                     >Cancelar</button>
                  )}
               </div>
            </form>
         </div>
      </aside>
   )
}

export default Sidebar
