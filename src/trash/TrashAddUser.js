"use client";
import React from 'react';
import { useForm } from 'react-hook-form';

export default function TrashAddUser() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = async (data) => {
    console.log('data', data);
    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("result", result); // Log the full response
      return result; // Return the result for further processing
    } catch (error) {
      console.error("Error:", error);
      throw error; // Re-throw the error for error boundaries or other error handling
    }
  };


  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0F172A]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-[#0F172A] p-8 rounded-md w-full max-w-sm"
      >
        <h2 className="text-center text-white mb-4 border-b border-white pb-2">
          Add User
        </h2>

        <input
          className={`w-full mb-2 p-2 border ${errors['First name'] ? 'border-red-500' : 'border-gray-300'} rounded-md`}
          type="text"
          placeholder="First name"
          {...register("First name", { required: "First name is required", maxLength: 80 })}
        />
        {errors['First name'] && <small className="text-red-500">{errors['First name'].message}</small>}

        <input
          className={`w-full mb-2 p-2 border ${errors.Email ? 'border-red-500' : 'border-gray-300'} rounded-md`}
          type="text"
          placeholder="Email"
          {...register("Email", {
            required: "Email is required",
            pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" }
          })}
        />
        {errors.Email && <small className="text-red-500">{errors.Email.message}</small>}

        <input
          className={`w-full mb-2 p-2 border ${errors.Address ? 'border-red-500' : 'border-gray-300'} rounded-md`}
          type="text"
          placeholder="Address"
          {...register("Address", { required: "Address is required", maxLength: 80 })}
        />
        {errors.Address && <small className="text-red-500">{errors.Address.message}</small>}

        <input
          className={`w-full mb-2 p-2 border ${errors['Mobile Number'] ? 'border-red-500' : 'border-gray-300'} rounded-md`}
          type="text"
          placeholder="Mobile Number"
          {...register("Mobile Number", {
            required: "Mobile number is required",
            pattern: { value: /^[0-9]{10}$/, message: "Mobile number must be 10 digits" }
          })}
        />
        {errors['Mobile Number'] && <small className="text-red-500">{errors['Mobile Number'].message}</small>}

        <input
          className={`w-full mb-2 p-2 border ${errors['Shop Name'] ? 'border-red-500' : 'border-gray-300'} rounded-md`}
          type="text"
          placeholder="Shop Name"
          {...register("Shop Name", { required: "Shop name is required", maxLength: 80 })}
        />
        {errors['Shop Name'] && <small className="text-red-500">{errors['Shop Name'].message}</small>}

        <input
          className={`w-full mb-2 p-2 border ${errors['GST No'] ? 'border-red-500' : 'border-gray-300'} rounded-md`}
          type="text"
          placeholder="GST No"
          {...register("GST No", {
            pattern: { value: /^[0-9]{15}$/, message: "GST number must be 15 characters" }
          })}
        />
        {errors['GST No'] && <small className="text-red-500">{errors['GST No'].message}</small>}

        <button
          type="submit"
          className="w-full bg-gray-500 hover:bg-gray-700 text-white py-2 mt-4 rounded-md transition-colors duration-300"
        >
          SUBMIT
        </button>
      </form>
    </div>
  );
}
