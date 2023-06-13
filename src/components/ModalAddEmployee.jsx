import React, { useState, useRef } from "react";
import Modal from "react-modal";
import ReactInputMask from "react-input-mask";
import * as yup from "yup";

import { Button } from "./Button";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { secondAuth, createNewEmployee } from "../helpers/firebaseControl";
import { toast } from "react-toastify";

const schema = yup.object().shape({
  surname: yup.string().required("Прізвище обов'язкове для заповнення"),
  name: yup.string().required("Ім'я обов'язкове для заповнення"),
  patronymic: yup.string().required("По-батькові обов'язкове для заповнення"),
  phoneNumber: yup
    .string()
    .required("Номер телефону обов'язковий для заповнення"),
  birthDate: yup
    .string()
    .required("Дата народження обов'язкова для заповнення"),
  email: yup
    .string()
    .email("Введіть дійсну адресу електронної пошти")
    .matches(/.*@.*/, "Email повинен містити символ '@'")
    .required("Email обов'язковий для заповнення"),
  password: yup.string().required("Пароль обов'язковий для заповнення"),
  role: yup.string().required("Роль обов'язкова для вибору"),
});

const ModalAddEmployee = ({ isOpen, closeModal }) => {
  const [formErrors, setFormErrors] = useState({});

  const [formData, setFormData] = useState({
    surname: "",
    name: "",
    patronymic: "",
    phoneNumber: "",
    birthDate: "",
    email: "",
    password: "",
    role: "",
  });

  const {
    name,
    surname,
    patronymic,
    phoneNumber,
    birthDate,
    email,
    password,
    role,
  } = formData;

  const surnameRef = useRef(null);
  const nameRef = useRef(null);
  const patronymicRef = useRef(null);
  const phoneNumberRef = useRef(null);
  const birthDateRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const roleRef = useRef(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", // Очищаем ошибку для текущего поля
    }));
  };

  const handleClose = (event) => {
    event.preventDefault();
    closeModal();
    setFormData({
      name: "",
        surname: "",
        patronymic: "",
        phoneNumber: "",
        birthDate: "",
        email: "",
        password: "",
        role: "",
    });
    setFormErrors({});
  };

  

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await schema.validate(formData, { abortEarly: false });
      await createUserWithEmailAndPassword(secondAuth, formData.email, formData.password)
        .then((userCredential) => {
          const newUser = userCredential.user;
          createNewEmployee(newUser.uid, formData);
          signOut(secondAuth);
          toast.success("Нового співробітника успішно додано")
        })
        .catch((error) => {
           console.log(error);
        });;
      closeModal();
      setFormData({
        name: "",
        surname: "",
        patronymic: "",
        phoneNumber: "",
        birthDate: "",
        email: "",
        password: "",
        role: "",
      });
      setFormErrors({});
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setFormErrors(validationErrors);
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      shouldCloseOnOverlayClick={false}
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#FAFAFA] w-[688px] h-[502px] rounded-lg shadow-md p-8"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <p className=" text-2xl">Додати нового співробітника</p>
      <form onSubmit={(e) => handleSubmit(e)} className="pt-6">
        <div className="flex flex-row justify-between">
          <label className="flex-col">
            <span>Прізвище</span>
            <div>
              <input
                name="surname"
                type="text"
                value={surname}
                onChange={handleChange}
                placeholder="Введіть прізвище"
                className="w-[193px] h-[36px] rounded border-[#E9E9E9] border pl-3 mt-2"
                ref={surnameRef}
              />
              {formErrors.surname && (
                <div>
                  <span className="text-red-500 text-[8px]">
                    {formErrors.surname}
                  </span>
                </div>
              )}
            </div>
          </label>

          <label className="flex-col">
            <span>Ім’я</span>
            <div>
              <input
                name="name"
                type="text"
                value={name}
                onChange={handleChange}
                placeholder="Введіть ім’я"
                className="w-[193px] h-[36px] rounded border-[#E9E9E9] border pl-3 mt-2"
                ref={nameRef}
              />
              {formErrors.name && (
                <div>
                  <span className="text-red-500 text-[8px]">
                    {formErrors.name}
                  </span>
                </div>
              )}
            </div>
          </label>

          <label className="flex-col">
            <span>По-батькові</span>
            <div>
              <input
                name="patronymic"
                type="text"
                value={patronymic}
                onChange={handleChange}
                placeholder="Введіть по-батькові"
                className="w-[193px] h-[36px] rounded border-[#E9E9E9] border pl-3 mt-2"
                ref={patronymicRef}
              />
              {formErrors.patronymic && (
                <div>
                  <span className="text-red-500 text-[8px]">
                    {formErrors.patronymic}
                  </span>
                </div>
              )}
            </div>
          </label>
        </div>

        <div className="flex flex-row justify-between pt-4">
          <label className="flex-col">
            <span>Номер телефону</span>
            <div>
              <ReactInputMask
                type="tel"
                name="phoneNumber"
                mask="+38(099) 999 99 99"
                maskChar="_"
                value={phoneNumber}
                onChange={handleChange}
                placeholder="+38 (0 _ _ )  _ _ _  _ _  _ _ "
                className="w-[299px] h-[36px] rounded border-[#E9E9E9] border pl-3 mt-2"
                inputRef={phoneNumberRef}
              />
              {formErrors.phoneNumber && (
                <div>
                  <span className="text-red-500 text-[8px]">
                    {formErrors.phoneNumber}
                  </span>
                </div>
              )}
            </div>
          </label>
          <label className="flex-col">
            <span>Дата народження</span>
            <div>
              <ReactInputMask
                type="text"
                name="birthDate"
                mask="99.99.9999"
                maskChar="_"
                value={birthDate}
                onChange={handleChange}
                placeholder="_ _. _ _. _ _ _ _ "
                className="w-[299px] h-[36px] rounded border-[#E9E9E9] border pl-3 mt-2"
                inputRef={birthDateRef}
              />
              {formErrors.birthDate && (
                <div>
                  <span className="text-red-500 text-[8px]">
                    {formErrors.birthDate}
                  </span>
                </div>
              )}
            </div>
          </label>
        </div>

        <div className="flex flex-row justify-between pt-4">
          <label className="flex-col">
            <span>Email</span>
            <div>
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="Введіть адресу"
                className="w-[299px] h-[36px] rounded border-[#E9E9E9] border pl-3 mt-2"
                ref={emailRef}
              />
              {formErrors.email && (
                <div>
                  <span className="text-red-500 text-[8px]">
                    {formErrors.email}
                  </span>
                </div>
              )}
            </div>
          </label>
          <label className="flex-col">
            <span>Пароль</span>
            <div>
              <input
                name="password"
                type="password"
                value={password}
                onChange={handleChange}
                placeholder="Пароль"
                className="w-[299px] h-[36px] rounded border-[#E9E9E9] border pl-3 mt-2"
                ref={passwordRef}
              />
              {formErrors.password && (
                <div>
                  <span className="text-red-500 text-[8px]">
                    {formErrors.password}
                  </span>
                </div>
              )}
            </div>
          </label>
        </div>

        <div className="pt-4 mb-6 ">
          <label className="flex-col relative">
            Роль
            <select
              type="text"
              name="role"
              value={role}
              onChange={handleChange}
              className="w-[624px] h-[36px] rounded border-[#E9E9E9] border pl-2 pr-6 mt-2 text-gray-600 appearance-none z-10 relative bg-[transparent]"
              ref={roleRef}
            >
              <option value="" disabled hidden className="text-gray-400">
                Оберіть роль
              </option>
              <option value="Оператор">Оператор</option>
              <option value="Бухгалтер">Бухгалтер</option>
              <option value="Контент-менеджер">Контент-менеджер</option>
              
            </select>
            <span className="absolute right-2 bottom-[3px] transform rotate-180">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-400 pointer-events-none"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 7.707a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1-1.414 1.414L10 10.414l-3.293 3.293a1 1 0 1 1-1.414-1.414l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </label>
          {formErrors.role && (
            <div>
              <span className="text-red-500 text-[8px]">{formErrors.role}</span>
            </div>
          )}
        </div>
        <div className="flex flex-row justify-between">
          <button onClick={handleClose}>
            <span className="text-[#DC0000] text-sm">Скасувати</span>
          </button>
          <div className="flex justify-end">
            <Button type="submit" label="Додати" labelColor="white" />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ModalAddEmployee;
