import { useState } from "react"
import { ArrowUpOnSquareIcon, UserGroupIcon } from "@heroicons/react/24/outline"
import RestoreSection from "./RestoreSection"
import RegisterSection from "./RegisterSection"

type Accion = 'restaurar' | 'registrar' | null

function Welcome() {
   const [accion, setAccion] = useState<Accion>(null)

   const selectAccion = (a: Accion) => setAccion(a)

   return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
         <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl p-6">
            <div className="text-center mb-6">
               <img src="/logo-acis.svg" alt="Logo Acis" className="w-20 mx-auto mb-3" />
               <h1 className="text-2xl font-black text-white">Bienvenido</h1>
               <p className="text-slate-400 text-sm mt-1">
                  Al sistema de creación de cuestionarios ACIS
               </p>
            </div>

            {!accion ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                     type="button"
                     onClick={() => selectAccion('restaurar')}
                     className="border-2 border-dashed border-slate-600 rounded-xl p-6 text-center hover:border-green-500 hover:bg-green-900/20 transition-all cursor-pointer group"
                  >
                     <ArrowUpOnSquareIcon className="size-12 mx-auto text-slate-400 group-hover:text-green-400 mb-3" />
                     <h2 className="font-bold text-white text-lg">Restaurar</h2>
                     <p className="text-xs text-slate-400 mt-1">Importar preguntas desde un archivo XML</p>
                  </button>
                  <button
                     type="button"
                     onClick={() => selectAccion('registrar')}
                     className="border-2 border-dashed border-slate-600 rounded-xl p-6 text-center hover:border-blue-500 hover:bg-blue-900/20 transition-all cursor-pointer group"
                  >
                     <UserGroupIcon className="size-12 mx-auto text-slate-400 group-hover:text-blue-400 mb-3" />
                     <h2 className="font-bold text-white text-lg">Registrar</h2>
                     <p className="text-xs text-slate-400 mt-1">Crear nuevos docentes y empezar desde cero</p>
                  </button>
               </div>
            ) : accion === 'restaurar' ? (
               <RestoreSection onBack={() => selectAccion(null)} />
            ) : (
               <RegisterSection onBack={() => selectAccion(null)} />
            )}
         </div>
      </div>
   )
}

export default Welcome
