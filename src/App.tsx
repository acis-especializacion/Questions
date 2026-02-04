import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import Modal from "./components/Modal";
import QuizDetail from "./components/QuizDetail";
import Sidebar from "./components/Sidebar";
import { useQuestionStore } from "./store";
import { useMemo } from "react";
import { toast, ToastContainer } from "react-toastify";

function App() {

   const questions = useQuestionStore(state => state.questions)
   const hasQuestions = useMemo(() => questions.length > 0, [questions])

   const handleGenerateXML = () => {

      let archivoXML = `<?xml version="1.0" encoding="UTF-8"?>\n`
      archivoXML += `<quiz>\n`;

      questions.forEach((option, index) => {
         const correctIndex = option.options.findIndex((item) => item.correct);
         const correctLabel = correctIndex !== -1 ? String.fromCharCode(65 + correctIndex) : "?";

         archivoXML += `   <question type="multichoice">\n`
         archivoXML += `      <name>\n`
         archivoXML += `         <text>Pregunta ${index + 1}</text>\n`
         archivoXML += `      </name>\n`
         archivoXML += `      <questiontext format="html">\n`
         archivoXML += `         <text>\n`
         archivoXML += `            <![CDATA[ <p>${option.questionText}</p> ]]>\n`
         archivoXML += `         </text>\n`
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
         option.options.forEach( item => {
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
      link.download = "Test.xml";
      link.click();

      toast.info('Cuestionario descargado')
   }

   return (
      <>
         <div className="flex flex-col lg:flex-row h-screen">
            <Sidebar
               coutn={questions.length}
               reset={hasQuestions}
            />
            <div className="flex-1 overflow-y-scroll">
               <div className="flex items-center justify-between py-4 px-6 w-full z-10 shadow-lg sticky top-0 bg-white">
                  <h1 className="font-bold text-2xl">Lista de <span className="text-blue-800">Preguntas</span></h1>
                  <button
                     type="button"
                     className="cursor-pointer disabled:opacity-10 disabled:cursor-not-allowed"
                     disabled={!hasQuestions}
                     onClick={handleGenerateXML}
                  ><ArrowDownTrayIcon className="size-6 text-black" /></button>
               </div>
               <div className="p-6 flex flex-col gap-5">
                  {hasQuestions ? (
                     <>
                        {questions.map((question, index) => (
                           <QuizDetail
                              key={question.id}
                              numero={index + 1}
                              question={question}
                           />
                        ))}
                     </>
                  ) : (
                     <p className="text-center">Aún no cuenta con preguntas registrados</p>
                  )}
               </div>

               <div className="p-6 bg-slate-300 text-center">
                  <p><span className="font-bold">Versión</span> 3.0.0</p>
                  <p className="text-black">
                     Todos los derechos reservados @{new Date().getFullYear()} - {''}
                     <a href="https://www.facebook.com/nelson.huaman.20" target="_blank" className="text-blue-800 font-bold cursor-pointer">Nelson Huamán</a></p>
               </div>
            </div>
         </div>
         <Modal />
         <ToastContainer />
      </>
   )
}

export default App