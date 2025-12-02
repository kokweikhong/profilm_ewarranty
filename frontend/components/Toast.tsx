"use client";

import { useEffect, useState } from "react";
import {
  CheckCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export type ToastType = "success" | "error";

interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onClose: () => void;
}

export default function Toast({
  message,
  type,
  duration = 5000,
  onClose,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const bgColor = type === "success" ? "bg-green-50" : "bg-red-50";
  const textColor = type === "success" ? "text-green-800" : "text-red-800";
  const iconColor = type === "success" ? "text-green-400" : "text-red-400";

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-md w-full transition-all duration-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
      }`}
    >
      <div className={`rounded-lg p-4 shadow-lg ${bgColor}`}>
        <div className="flex items-start">
          <div className="shrink-0">
            {type === "success" ? (
              <CheckCircleIcon className={`h-6 w-6 ${iconColor}`} />
            ) : (
              <XCircleIcon className={`h-6 w-6 ${iconColor}`} />
            )}
          </div>
          <div className="ml-3 flex-1">
            <p className={`text-sm font-medium ${textColor}`}>{message}</p>
          </div>
          <div className="ml-4 flex shrink-0">
            <button
              type="button"
              onClick={handleClose}
              className={`inline-flex rounded-md ${bgColor} ${textColor} hover:${
                type === "success" ? "bg-green-100" : "bg-red-100"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                type === "success"
                  ? "focus:ring-green-500"
                  : "focus:ring-red-500"
              }`}
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
