import { useState } from "react"
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react"
import { ChevronDownIcon } from "@heroicons/react/24/solid"
import { getTeachers } from "../utils"

type TeacherComboboxProps = {
   value: string
   onChange: (id: string) => void
}

function TeacherCombobox({ value, onChange }: TeacherComboboxProps) {

   const teachers = getTeachers()
   const selected = teachers.find(t => t.id === value) || null
   const [query, setQuery] = useState("")

   const filtered = query === ""
      ? teachers
      : teachers.filter(t => t.name.toLowerCase().includes(query.toLowerCase()))

   return (
      <Combobox
         value={selected}
         onChange={item => {
            onChange(item ? item.id : "")
            setQuery("")
         }}
      >
         <div className="relative">
             <ComboboxInput
                className="w-full bg-slate-300 border border-gray-400 text-gray-700 text-sm font-semibold rounded-md px-2 py-1 focus:outline-none focus:border-blue-500 pr-6"
                placeholder="Buscar docente..."
                displayValue={(t: typeof teachers[number] | null) => t ? t.name : ""}
                onChange={e => setQuery(e.target.value)}
             />
            <ComboboxButton className="absolute inset-y-0 right-0 flex items-center cursor-pointer">
               <ChevronDownIcon className="size-4 text-gray-500" />
            </ComboboxButton>
         </div>

         <ComboboxOptions className="absolute left-0 right-0 top-full mt-1 bg-slate-300 border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto z-20">
            {filtered.length === 0 ? (
               <div className="px-3 py-2 text-sm text-gray-500">Sin resultados</div>
            ) : (
               filtered.map(t => (
                  <ComboboxOption
                     key={t.id}
                     value={t}
                     className={({ active, selected: isSelected }) =>
                        `cursor-pointer px-3 py-1.5 text-sm ${
                           active ? "bg-blue-50 text-blue-800" : "text-gray-700"
                        } ${isSelected ? "font-semibold" : ""}`
                     }
                  >
                     {({ selected: isSelected }) => (
                        <span className="flex items-center justify-between">
                           {t.name}
                           {isSelected && <span className="text-blue-600 text-xs font-bold">✓</span>}
                        </span>
                     )}
                  </ComboboxOption>
               ))
            )}
         </ComboboxOptions>
      </Combobox>
   )
}

export default TeacherCombobox
