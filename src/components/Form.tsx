import { useEffect, useState, type ChangeEvent, type FormEvent } from "react"
import { useQuestionStore } from "../store"
import type { DraftQuestion } from "../types"
import { capitalizeFirstLetter, labelOptions } from "../utils"
import { toast } from "react-toastify"

function Form() {

   const addQuestion = useQuestionStore(state => state.addQuestion)
   const updateQuestion = useQuestionStore(state => state.updateQuestion)
   const activeId = useQuestionStore(state => state.activeId)
   const questions = useQuestionStore(state => state.questions)

   const initialState: DraftQuestion = {
      questionText: '',
      feedback: '',
      options: [
         { text: '', correct: false },
         { text: '', correct: false },
         { text: '', correct: false }
      ]
   }

   const [question, setQuestion] = useState(initialState)

   useEffect(() => {
      if (activeId) {
         const activeQuestion = questions.filter(question => question.id === activeId)[0]
         setQuestion({
            questionText: activeQuestion.questionText,
            feedback: activeQuestion.feedback,
            options: activeQuestion.options.map(option => ({
               text: option.text,
               correct: option.correct
            }))
         })
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

   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      // Filtrar opciones vacías antes de guardar
      const filteredOptions = question.options.filter(option => option.text.trim() !== "");
      const questionToSave = { ...question, options: filteredOptions };

      if (activeId) {
         updateQuestion(questionToSave)
         toast.success('Pregunta actualizado')
      } else {
         addQuestion(questionToSave)
         toast.success('Pregunta registrado')
      }
   }

   return (
      <form className="space-y-3" onSubmit={handleSubmit}>
         <div className="flex gap-2 items-center">
            <textarea
               className="w-full border border-slate-500  text-gray-500 px-2 py-1 rounded-lg outline-none"
               placeholder="Ingrese su pregunta"
               name="questionText"
               value={question.questionText}
               onChange={handleChange}
            />
         </div>

         {question.options.map((option, index) => (
            <div key={index} className={`flex gap-2 items-center ${option.correct ? 'bg-green-300 p-2' : ''}`}>
               <span className="w-4 font-bold">{labelOptions(index)}</span>
               <input
                  className="border py-1 px-3 rounded flex-1 border-gray-400 text-gray-500 focus:outline-none focus:border-blue-500 w-full"
                  type="text"
                  placeholder="Ingrese  la Alternativa"
                  value={option.text}
                  onChange={e => {
                     const newOptions = [...question.options];
                     newOptions[index].text = capitalizeFirstLetter(e.target.value)
                     setQuestion({ ...question, options: newOptions })
                  }}
               />
               <input
                  className="cursor-pointer w-6 h-6"
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
         ))}

         <button
            type="button"
            className="w-full text-center bg-slate-200 p-1 rounded-lg hover:bg-slate-100 text-blue-800 disabled:opacity-10 disabled:cursor-not-allowed"
            onClick={handleAddOption}
            disabled={question.options.length >= 6}
         >Añadir altenativa</button>

         <textarea
            className="w-full border border-gray-400 text-gray-500 px-2 py-1 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Retroalimentación Incorrectas"
            name="feedback"
            value={question.feedback}
            onChange={handleChange}
         />

         <input
            type="submit"
            value={activeId ? 'Actualizar' : 'Registrar'}
            disabled={!question.options.some(option => option.correct) || Object.values(question).some(value => value === '')}
            className="bg-blue-700 hover:bg-blue-800 cursor-pointer w-full text-white font-bold p-2 rounded-lg disabled:opacity-50 mt-4 disabled:cursor-not-allowed"
         />
      </form>
   )
}

export default Form