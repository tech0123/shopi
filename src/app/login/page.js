import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import React from "react";
import LoginForm from "./LoginForm";

export default function page() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <Card
        title=""
        className="max-lg:w-full max-lg:min-h-screen w-[40%] rounded-2xl p-5 shadow-2xl"
      >
        <LoginForm />
      </Card>
    </div>
  );
}
