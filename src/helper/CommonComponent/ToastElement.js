"use client";
import React, { memo } from "react";
import { Toaster } from "react-hot-toast";

const ToastElement = () => {
  return <Toaster position="top-right" reverseOrder={false} />;
};

export default memo(ToastElement);
