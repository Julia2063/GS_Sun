import React, { useState } from "react";
import {  getAuth, signInWithEmailAndPassword } from "firebase/auth";

import { toast } from "react-toastify";

import { Divider } from "../components/Divider";
import { Checkbox } from "../components/Checkbox";
import { Button } from "../components/Button";

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
    } catch (error) {
      console.log(error);
      toast.error("Bad user credentials");
    }
  };

  

  return (
    <section className="flex justify-center mt-[211px]">
      <div className="w-[572px] h-[267px] bg-white">
        <div>
          <div className=" mt-3 mb-3 ml-4">
            <span className=" text-lg">Вхід</span>
          </div>
          <Divider />
        </div>
        <div className="ml-[19px] mr-[21px] mt-8">
          <form onSubmit={(e) => onSubmit(e)}>
            <div className="flex flex-row items-center justify-between">
              <div>
                <span>Логін</span>
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={onChange}
                className="w-[426px] h-[36px] rounded border-[#E9E9E9] border pl-3"
                placeholder="Логін"
              />
            </div>
            <div className="flex flex-row items-center justify-between pt-[18px]">
              <div>
                <span>Пароль</span>
              </div>
              <div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={onChange}
                  className="w-[426px] h-[36px] rounded border-[#E9E9E9] border pl-3"
                  placeholder="Пароль"
                />
              </div>
            </div>
            <div className="pt-[17px] pl-[115px]">
              <Checkbox label="Запам’ятати мене" />
            </div>
            <div className="flex justify-end">
              <Button type="submit" label="Увійти" labelColor="white" />
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
