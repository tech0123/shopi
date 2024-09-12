import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import React from "react";
import LoginForm from "./LoginForm";

export default function page() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="max-lg:w-full max-lg:min-h-screen w-[35%] rounded-3xl p-12 shadow-2xl border border-black-600">
        <LoginForm />
      </div>
    </div>
  );
}
