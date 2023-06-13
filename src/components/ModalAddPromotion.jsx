import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import ReactInputMask from "react-input-mask";
import { toast } from "react-toastify";
import { createNewPromotion, deleteImageFromStorage, updateDocumentInCollection, uploadFileToStoragesFolder } from "../helpers/firebaseControl";
import { BigButton } from "./BigButton";



export const ModalAddPromotion = ({ isOpen, closeModal, update, data }) => {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    images: [],
    title: '',
    promotionDate: '',
    text: '',
    isTop: false,
  });

  console.log(data);

  useEffect(() => {
    if(data){
      setFormData(data);
    }
  }, [isOpen]);


  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const soldCheckbox = ({ target: { checked } }) => {
   
    setFormData({...formData, isTop:  checked} );
  };

  const handleChangePhoto = (e) => {
    if (e.target.files[0]) {
      setFiles([...files, e.target.files[0]] );
      const reader = new FileReader();

      reader.onloadend = () => {
        setFormData({...formData, images: [...formData.images, reader.result] });
      };
    
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleDeletePhoto = (ind) => {
    const newImages = formData.images.filter((e, i) => i !== ind);
    setFormData({...formData, images: newImages });
    const newFiles = files.filter((e, i) => i !==ind);
    setFiles(newFiles);
  };
  

  const handleSubmit = update ? (
    async (e) => {
      e.preventDefault();    
   
      const oldData = Object.values({
        title: data.title,
        promotionDate: data.promotionDate,
        text: data.text,
        isTop: data.isTop,
      });

      const newData = Object.values({
        title: formData.title,
        promotionDate: formData.promotionDate,
        text: formData.text,
        isTop: formData.isTop,
      });

      if (oldData.some((el, i) => el !== newData[i])) {
    
        try {
        
          await updateDocumentInCollection('promotions', {
            ...data, 
            title: formData.title,
            promotionDate: formData.promotionDate,
            text: formData.text,
            isTop: formData.isTop,
            
          }, data.idPost);
          

        } catch (error) {
          console.log(error);
          toast.info("Заявку відхилено")
        }
      }


      if (files.length > 0 || data.images.length !== formData.images.length) {
        try {
          const restedImages = data.images.filter(el => formData.images.includes(el));
 
          const deletedImages = data.images.filter(el => !formData.images.includes(el));

          if (deletedImages.length > 0) {
            deletedImages.forEach(el => deleteImageFromStorage(el, data.idPost, restedImages));
          }
          if (restedImages.length > 0) {
            await uploadFileToStoragesFolder(files, data, restedImages);
          }
          

        } catch (error) {
          console.log(error);
          toast.info("Заявку відхилено")
        }
      }
      toast.success("Акцію успішно оновлено")
      setFormData({
        images: [],
        title: '',
        promotionDate: '',
        text: '',
        isTop: false,
      })
      setFiles([]);
      closeModal();
    })
    : (
      async (e) => {
        e.preventDefault(); 
        try {
         
          createNewPromotion(formData, files);
      
          toast.success("Акцію успішно додано")
        } catch (error) {
          console.log(error);
          toast.info("Заявку відхилено")
        }
        setFormData({
          images: [],
          title: '',
          promotionDate: '',
          text: '',
          isTop: false,
        })
        setFiles([]);
        closeModal();
      }
    );

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      shouldCloseOnOverlayClick={false}
      className="absolute left-1/2 transform -translate-x-1/2  bg-[#FAFAFA] w-[688px] h-full rounded-lg shadow-md p-8 overflow-y-scroll"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <p className="text-2xl font-bold">
        {update 
        ? 'Редагувати акцію'
        : 'Нова акція'
      }</p>
      <form onSubmit={(e) => handleSubmit(e)} className="pt-6 flex flex-col gap-[20px] mb-[20px]">
        {formData.images.length > 0 && (
          formData.images.map((el, i) => {
            return (
              <div className="flex gap-[16px]"  key={el}>
                <div className="w-[250px] h-[120px] rounded-lg">
                  <img 
                    src={el} 
                    alt="img"
                    className="w-full h-full rounded-lg object-cover"
                  />
                </div>
                <button 
                  type="button"
                  className="h-min text-[#E50404]"
                  onClick={() => handleDeletePhoto(i)}
                >
                  Видалити
                </button>
              </div>
              
            )
          })
        ) }
        <div className="bg-[#E9E9E9] w-[250px] h-[120px] rounded-lg relative">
          
          <div  
            className="text-[30px] text-[#727272] h-[36px] w-[36px] bg-[#fff] relative rounded-full absolute top-[45px] left-[110px] cursor-pointer" 
          >
          <p className="absolute top-[-7px] left-[8px]">+</p>
          </div>

          <input
            type="file"
            className="cursor-pointer opacity-0 h-[36px] w-[36px] absolute top-[45px] left-[110px] "
            onChange={(e) => handleChangePhoto(e)}
          />
        </div>

        <label className="flex flex-col gap-[8px]">
            <span className="font-bold">Заголовок</span>
            <div>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Введіть заголовок"
                className="w-full h-[36px] rounded border-[#E9E9E9] border py-[5px] px-3"
              />
    
            </div>
          </label>

        <label className="flex flex-col gap-[8px]">
            <span className="font-bold">Основний текст</span>
            <div>
              <textarea
                name="text"
                value={formData.text}
                onChange={handleChange}
                placeholder="Введіть текст акції"
                className="w-full h-[108px] rounded border-[#E9E9E9] border py-[5px] px-3 resize-none"
              />
    
            </div>
          </label>

          <label className="flex flex-col gap-[8px]">
            <span className="font-bold">Дійсна до</span>
            <div>
              <ReactInputMask
                type="text"
                name="promotionDate"
                mask="99.99.9999"
                maskChar="_"
                value={formData.promotionDate}
                onChange={handleChange}
                placeholder="_ _. _ _. _ _ _ _ "
                className="w-full h-[36px] rounded border-[#E9E9E9] border py-[5px] px-3"
              />
            </div>
          </label>

          <label className="w-full flex items-center gap-[10px]">
            
            <div>
              <input
                type="checkbox"
                name="isTop"
                value={formData.promotionDate}
                onChange={soldCheckbox}
                className=" rounded border-[#E9E9E9] border py-[5px] px-3"
              />
            </div>
            <span className="font-bold">Показувати на головному екрані</span>
          </label>
        

       
        <div className="flex flex-row justify-between">
          <button onClick={closeModal} type="button">
            <span className="text-[#DC0000] text-sm">Скасувати</span>
          </button>
          <div className="flex justify-end">
            <BigButton type="submit" label={update ? "Зберегти зміни": "Додати"}  labelColor="white" />
          </div>
        </div>
      </form>
    </Modal>
  );
};

