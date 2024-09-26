"use client";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React from "react";
import { useForm } from "react-hook-form";

export default function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async data => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: data.email, password: data.password })
      });
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="w-full mt-4 min-x">
        <label className="w-6rem text-gray-700">Username</label>
        <div className="mt-2 mb-10">
          <InputText
            id="username"
            name="email"
            placeholder="Email"
            className="input_wrap"
            {...register("email", { required: true })}
          />
          {errors.email &&
            <p className="text-red-500 text-xs mt-1">
              Please enter your email.
            </p>}
        </div>
      </div>
      <div className="w-full">
        <label className="w-6rem text-gray-700">Password</label>
        <div className="mt-2 mb-10">
          <InputText
            id="password"
            name="password"
            type="password"
            className="input_wrap"
            placeholder="Password"
            {...register("password", { required: true })}
          />
          {errors.password &&
            <p className="text-red-500 text-xs mt-1">
              Please enter your password.
            </p>}
        </div>
      </div>
      <div className="mt-10 flex justify-center items-center">
        <Button
          type="submit"
          label="Login"
          // icon="pi pi-user"
          className="w-10rem text-gray-400 focus:shadow-none"
        />
      </div>
    </form>
  );
}
