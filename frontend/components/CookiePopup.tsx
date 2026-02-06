"use client";
import React, { useEffect, useState } from "react";

const CookiePopup = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) setShow(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-900 text-white p-4 flex flex-col sm:flex-row justify-between items-center z-50">
      <div className="mb-2 sm:mb-0">
        <div className="font-semibold text-lg">We value your privacy</div>
        <div className="text-sm mt-1">
          We use cookies to enhance your browsing experience, serve personalized
          ads or content, and analyze our traffic.
          <br />
          By clicking "Accept All", you consent to our use of cookies.
        </div>
      </div>
      <button
        onClick={handleAccept}
        className="ml-0 sm:ml-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition mt-2 sm:mt-0"
      >
        Accept All
      </button>
    </div>
  );
};

export default CookiePopup;
