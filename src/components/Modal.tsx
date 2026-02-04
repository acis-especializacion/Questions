import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { Fragment } from 'react'
import Form from './Form'
import { useQuestionStore } from '../store'

function Modal() {

   const modal = useQuestionStore(state => state.modal)
   const closeModal = useQuestionStore(state => state.closeModal)
   const showModal = useQuestionStore(state => state.showModal)
   const activeId = useQuestionStore(state => state.activeId)

   return (
      <>
         <button
            type="button"
            onClick={showModal}
            className="fixed bottom-6 right-6 z-5 w-12 h-12 rounded-full bg-blue-600 focus:outline-none flex items-center justify-center text-white p-0 cursor-pointer"
         ><PlusIcon className='size-8' /></button>

         <Transition appear show={modal} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={closeModal}>
               <TransitionChild
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
               >
                  <div className="fixed inset-0 bg-black/90" />
               </TransitionChild>

               <div className="fixed inset-0 overflow-y-auto">
                  <div className="flex min-h-full items-center justify-center p-4 text-center">
                     <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                     >
                        <DialogPanel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                           <div className='flex items-center justify-between bg-gray-100 px-6 py-4 shadow-2xl'>
                              <DialogTitle
                                 as='h3'
                                 className="text-slate-900 font-bold text-lg"
                              >{activeId ? 'Editar Pregunta' : 'Crear Pregunta'}</DialogTitle>
                              <button
                                 type='button'
                                 className='cursor-pointer'
                                 onClick={closeModal}
                              ><XMarkIcon className='size-6 text-slate-900'/></button>
                           </div>
                           <div className="overflow-y-scroll max-h-130 p-6 ">
                              <Form />
                           </div>
                        </DialogPanel>
                     </TransitionChild>
                  </div>
               </div>
            </Dialog>
         </Transition>
      </>
   )
}

export default Modal