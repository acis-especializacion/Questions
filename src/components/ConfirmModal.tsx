import { XMarkIcon, ExclamationTriangleIcon, ShieldCheckIcon, ArrowUpOnSquareIcon } from "@heroicons/react/24/outline"

type TeacherOption = {
   id: string
   name: string
   count: number
}

type ConfirmModalProps = {
   open: boolean
   icon: 'warning' | 'download' | 'upload'
   title: string
   message: string
   details?: string[]
   confirmLabel?: string
   cancelLabel?: string
   confirmClass?: string
   onConfirm: () => void
   onCancel: () => void
   teachers?: TeacherOption[]
   selectedTeachers?: string[]
   onTeacherToggle?: (id: string) => void
}

function ConfirmModal({
   open,
   icon,
   title,
   message,
   details,
   confirmLabel = 'Confirmar',
   cancelLabel = 'Cancelar',
   confirmClass = 'bg-blue-700 hover:bg-blue-800',
   onConfirm,
   onCancel,
   teachers,
   selectedTeachers,
   onTeacherToggle
}: ConfirmModalProps) {

   if (!open) return null

   const IconComponent = icon === 'warning' ? ExclamationTriangleIcon : icon === 'download' ? ShieldCheckIcon : ArrowUpOnSquareIcon
   const iconBg = icon === 'warning' ? 'bg-red-100' : icon === 'download' ? 'bg-blue-100' : 'bg-green-100'
   const iconColor = icon === 'warning' ? 'text-red-600' : icon === 'download' ? 'text-blue-600' : 'text-green-600'

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onCancel}>
         <div className="fixed inset-0 bg-black/70" />
         <div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md"
            onClick={e => e.stopPropagation()}
         >
            <button
               type="button"
               className="absolute top-3 right-3 cursor-pointer text-gray-400 hover:text-gray-600 z-10"
               onClick={onCancel}
            ><XMarkIcon className="size-5" /></button>

            <div className="p-6 text-center">
               <div className={`w-14 h-14 mx-auto mb-4 rounded-full ${iconBg} flex items-center justify-center`}>
                  <IconComponent className={`size-7 ${iconColor}`} />
               </div>

               <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
               <p className="text-sm text-gray-600 mb-4">{message}</p>

               {teachers ? (
                  <div className="text-sm space-y-1 mb-4">
                     <p className="text-gray-600 mb-2">Seleccione docentes a incluir:</p>
                      {teachers.map(t => (
                         <label
                            key={t.id}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                               t.count === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                            } ${
                               selectedTeachers?.includes(t.id) ? 'bg-blue-50 text-blue-800 font-medium' : 'text-gray-600'
                            }`}
                         >
                            <input
                               type="checkbox"
                               className={`accent-blue-600 ${t.count === 0 ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                               checked={selectedTeachers?.includes(t.id) ?? false}
                               disabled={t.count === 0}
                               onChange={() => onTeacherToggle?.(t.id)}
                            />
                            {t.name} <span className="text-xs text-gray-400">({t.count} preguntas)</span>
                         </label>
                      ))}
                  </div>
               ) : details && details.length > 0 && (
                  <ul className="text-sm text-gray-600 space-y-1 mb-4 text-left bg-gray-50 p-3 rounded-lg">
                     {details.map((d, i) => (
                        <li key={i} className="flex items-center gap-2">
                           <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block" />
                           {d}
                        </li>
                     ))}
                  </ul>
               )}

               <div className="flex gap-2">
                  <button
                     type="button"
                     onClick={onConfirm}
                     className={`flex-1 cursor-pointer text-white font-bold p-2 rounded-lg text-sm ${confirmClass}`}
                  >{confirmLabel}</button>
                  <button
                     type="button"
                     onClick={onCancel}
                     className="flex-1 bg-gray-200 hover:bg-gray-300 cursor-pointer text-gray-700 font-bold p-2 rounded-lg text-sm"
                  >{cancelLabel}</button>
               </div>
            </div>
         </div>
      </div>
   )
}

export default ConfirmModal
