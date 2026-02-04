import { ArrowPathIcon } from "@heroicons/react/24/solid"
import { useQuestionStore } from "../store"
import { toast } from "react-toastify"
type SidebarProps = {
   coutn: number
   reset: boolean
}

function Sidebar({coutn, reset}: SidebarProps) {

   const resetApp = useQuestionStore(state => state.resetApp)

   const handleClick = () => {
      resetApp()
      toast.info('Se Limpio las preguntas')
   }

   return (
      <aside className='lg:w-1/5 bg-slate-900 p-6 flex lg:flex-col items-center justify-between gap-2 lg:gap-0'>
         <img src="/logo-acis.svg" alt="Logo Acis" className="w-20 lg:w-40" />
         <p className="text-4xl lg:text-9xl flex flex-col items-center font-black text-white">{coutn}<span className="text-lg lg:text-2xl font-bold">Preguntas</span></p>
         <button
            type="button"
            className="bg-white flex items-center gap-2 py-2 px-4 rounded-lg font-bold text-blue-800 cursor-pointer disabled:opacity-10 disabled:cursor-not-allowed"
            onClick={handleClick}
            disabled={!reset}
         ><ArrowPathIcon className="size-5"/> Reinicar App</button>
      </aside>
   )
}

export default Sidebar