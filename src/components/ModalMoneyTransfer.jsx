import { useState } from 'react';
import Modal from "react-modal";
import { BigButton } from "./BigButton";

import { toast } from "react-toastify";
import { createNewTransaction, updateFieldInDocumentInCollection } from '../helpers/firebaseControl';

export const ModalMoneyTransfer = ({ isOpen, closeModal, client, isGeneralPage, data }) => {
    const [sum, setSum] = useState(0);

    const handleChange = (e) => {
      setSum(+e.target.value);
    };

    
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await updateFieldInDocumentInCollection('users', client.id, 'balance', (+client.balance + sum));
        await createNewTransaction('transfer', client.clientNumber, sum);
        if (isGeneralPage) {
          await updateFieldInDocumentInCollection('requests', data.id, 'active', false);
        }
        setSum(0);
        toast.success("Кошти успішно зараховано")

      } catch (error) {
        console.log(error);
        toast.info("Заявку відхилено")
      }
     
      closeModal();
    };
   

    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        shouldCloseOnOverlayClick={false}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#FAFAFA] w-[688px] h-max rounded-lg shadow-md p-8"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        autoFocus={false}
    > 
      {isGeneralPage && 
        <p className="font-bold text-2xl">{`${client?.lastname} ${client?.name} #${client?.clientNumber}`}</p>
      } 
        <p className="font-semibold text-2xl">Зарахування коштів</p>
      <form className="pt-6 flex flex-col gap-10" onSubmit={(e) => handleSubmit(e)}>
        <div className="flex flex-row justify-between gap-4">
          <label className="flex-col">
            <span className="font-bold">Сума</span>
            <div>
              <input
                type='number'
                step="any"
                className="w-[299px] h-[36px] rounded border-[#E9E9E9] border pl-3 mt-2"
                value={sum}
                onChange={(e) => handleChange(e)}
                
                autoFocus={true}
              />
              
            </div>
          </label>
          {isGeneralPage && (
            <div cclassName="w-[300px] h-[200px]"> 
              <embed id="myimg" alt="receipt"  src={data?.url} className='object-cover w-[300px] h-[200px]' />
            </div>
            
          )}
        </div>
          
        <div className="flex flex-row justify-between">
          <button onClick={closeModal} type='button'>
            <span className="text-[#DC0000] text-sm">Скасувати</span>
          </button>
          <div className="flex justify-end">
            <BigButton type="submit" label="Зарахувати" labelColor="white" />
          </div>
        </div>
        
      </form>
    </Modal>
    )
}
