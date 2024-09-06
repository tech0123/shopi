"use client";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React from "react";
import { useForm } from "react-hook-form";

export default function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = data => {
    console.log(data);
  };

  console.log(errors);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="w-full mt-4">
        <label className="w-6rem">Username</label>
        <div className="mt-2 mb-10">
          <InputText
            id="username"
            name="email"
            placeholder="Email"
            className="p-3 w-full"
            {...register("email", { required: true })}
          />
          {errors.email &&
            <p className="text-red-500 text-xs italic mt-2">
              Please enter your email.
            </p>}
        </div>
      </div>
      <div className="w-full">
        <label className="w-6rem">Password</label>
        <div className="mt-2 mb-10">
          <InputText
            id="password"
            name="password"
            type="password"
            className="p-3 w-full"
            placeholder="Password"
            {...register("password", { required: true })}
          />
          {errors.password &&
            <p className="text-red-500 text-xs italic mt-2">
              Please enter your password.
            </p>}
        </div>
      </div>
      <div className="mt-10 flex justify-center items-center">
        <Button
          type="submit"
          label="Login"
          icon="pi pi-user"
          className="w-10rem hover:text-gray-400 focus:shadow-none"
        />
      </div>
    </form>
  );
}
