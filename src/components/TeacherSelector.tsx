import { useState, useRef, useEffect } from "react"
import { Cog6ToothIcon, PlusIcon, ChevronDownIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid"
import { useTeacherStore } from "../store/teacherStore"
import { getTeacherColor, getInitials } from "../utils/teacherColors"

type TeacherSelectorProps = {
   value: string
   onChange: (id: string) => void
   onOpenPanel: () => void
}

function TeacherSelector({ value, onChange, onOpenPanel }: TeacherSelectorProps) {
   const teachers = useTeacherStore(s => s.teachers)
   const addTeacher = useTeacherStore(s => s.addTeacher)
   const [open, setOpen] = useState(false)
   const [query, setQuery] = useState("")
   const [adding, setAdding] = useState(false)
   const [addName, setAddName] = useState("")
   const containerRef = useRef<HTMLDivElement>(null)
   const searchRef = useRef<HTMLInputElement>(null)
   const addRef = useRef<HTMLInputElement>(null)

   const selected = teachers.find(t => t.id === value)
   const selectedIndex = selected ? teachers.indexOf(selected) : -1

   const filtered = query
      ? teachers.filter(t => t.name.toLowerCase().includes(query.toLowerCase()))
      : teachers

   useEffect(() => {
      if (open) searchRef.current?.focus()
   }, [open])

   useEffect(() => {
      if (adding) addRef.current?.focus()
   }, [adding])

   useEffect(() => {
      const handleClick = (e: MouseEvent) => {
         if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
            setOpen(false)
            setQuery("")
            setAdding(false)
            setAddName("")
         }
      }
      document.addEventListener('mousedown', handleClick)
      return () => document.removeEventListener('mousedown', handleClick)
   }, [])

   const selectTeacher = (id: string) => {
      onChange(id)
      setOpen(false)
      setQuery("")
   }

   const handleAdd = () => {
      const name = addName.trim()
      if (!name) return
      const t = addTeacher(name)
      selectTeacher(t.id)
      setAddName("")
      setAdding(false)
   }

   if (teachers.length === 0) {
      return (
         <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-200">Docente:</span>
            <button
               type="button"
               onClick={onOpenPanel}
               className="flex-1 text-center bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs py-1.5 rounded-lg cursor-pointer"
            >+ Agregar docente</button>
         </div>
      )
   }

   return (
      <div className="space-y-1">
         <div className="flex items-center justify-between">
             <label className="block text-xs font-bold text-slate-300">Docente:</label>
            <button
               type="button"
               onClick={onOpenPanel}
               className="text-slate-300 hover:text-white cursor-pointer"
               title="Gestionar docentes"
            ><Cog6ToothIcon className="size-4" /></button>
         </div>
         <div className="relative" ref={containerRef}>
            <button
               type="button"
               onClick={() => setOpen(!open)}
               className="w-full flex items-center gap-2 bg-slate-700 hover:bg-slate-600 rounded-lg px-2.5 py-1.5 transition-colors cursor-pointer"
            >
               {selected ? (
                  <>
                     <span
                        className="flex items-center justify-center w-5 h-5 rounded-full text-[9px] font-bold shrink-0"
                        style={{ backgroundColor: getTeacherColor(selectedIndex).dot, color: '#fff' }}
                     >{getInitials(selected.name)}</span>
                     <span className="flex-1 text-left text-sm text-white truncate">{selected.name}</span>
                  </>
               ) : (
                  <span className="flex-1 text-left text-sm text-slate-400">Seleccionar docente</span>
               )}
               <ChevronDownIcon className={`size-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-slate-800 rounded-xl shadow-xl border border-slate-700 z-30 overflow-hidden">
                   <div className="p-2">
                      <div className="flex items-center gap-1.5 bg-slate-700 rounded-lg px-2 py-1">
                         <MagnifyingGlassIcon className="size-3.5 text-slate-400 shrink-0" />
                         <input
                            ref={searchRef}
                            type="text"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Buscar docente..."
                            className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-400"
                         />
                      </div>
                   </div>

                   <div className="max-h-48 overflow-y-auto">
                      {filtered.length === 0 ? (
                         <p className="text-xs text-slate-400 text-center py-4">Sin resultados</p>
                      ) : (
                         filtered.map(t => {
                            const idx = teachers.indexOf(t)
                            const c = getTeacherColor(idx)
                            const isSelected = t.id === value
                            return (
                               <button
                                  key={t.id}
                                  type="button"
                                  onClick={() => selectTeacher(t.id)}
                                  className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm text-left transition-colors cursor-pointer ${
                                     isSelected
                                        ? 'bg-blue-900/20 text-blue-400 font-medium'
                                        : 'text-slate-300 hover:bg-slate-700'
                                  }`}
                               >
                                  <span
                                     className="flex items-center justify-center w-5 h-5 rounded-full text-[9px] font-bold shrink-0"
                                     style={{ backgroundColor: c.dot, color: '#fff' }}
                                  >{getInitials(t.name)}</span>
                                  <span className="flex-1 truncate">{t.name}</span>
                                  {isSelected && <span className="text-blue-400 text-xs">✓</span>}
                               </button>
                            )
                         })
                      )}
                   </div>

                   <div className="border-t border-slate-700 p-1.5">
                      {adding ? (
                         <div className="flex gap-1 items-center px-1">
                            <input
                               ref={addRef}
                               type="text"
                               value={addName}
                               onChange={e => setAddName(e.target.value)}
                               onKeyDown={e => {
                                  if (e.key === 'Enter') handleAdd()
                                  if (e.key === 'Escape') { setAdding(false); setAddName("") }
                               }}
                               placeholder="Nombre del docente..."
                               className="flex-1 text-sm border border-slate-600 bg-slate-800 text-white rounded px-2 py-1 outline-none placeholder:text-slate-400"
                            />
                            <button
                               type="button"
                               onClick={handleAdd}
                               className="text-xs text-green-400 font-semibold hover:text-green-300 cursor-pointer px-1"
                            >OK</button>
                         </div>
                      ) : (
                         <button
                            type="button"
                            onClick={() => setAdding(true)}
                            className="w-full flex items-center gap-1.5 px-2 py-1 text-sm text-blue-400 hover:bg-blue-900/20 rounded-lg cursor-pointer"
                         ><PlusIcon className="size-4" /> Agregar docente</button>
                      )}
                   </div>
                </div>
             )}
         </div>
      </div>
   )
}

export default TeacherSelector
