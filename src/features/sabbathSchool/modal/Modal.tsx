import React from "react";
import "./ModalStyles.css";
import { X } from "@phosphor-icons/react";
const Modal = ({ showModal, toggleModal, children }: { showModal: boolean, toggleModal: () => void, children: React.ReactNode }) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50" onClick={toggleModal} />
      <div className="relative px-4 w-full max-w-2xl h-full md:h-auto">
        <div className="modal-content relative bg-white rounded-lg shadow overflow-y-auto" 
             style={{ maxHeight: '50vh' }}>
          <div className="flex justify-end p-2">
            <X 
              className="p-1 text-xl bg-accent-6 text-primary-1 rounded-full hover:bg-accent-8 hover:cursor-pointer transition-all"
              size={24}
              onClick={toggleModal}
            >
            </X>
          </div>
          <div className="px-6 py-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
