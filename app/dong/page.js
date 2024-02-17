// Import necessary modules
"use client"
import React, { useState } from 'react';
import * as Realm from 'realm-web';
import { useRouter } from 'next/navigation';
import AlertModal from '@/components/modal/AlertModal';
import LoadingSpinner from '@/components/LoadingSpinner';

const REALM_APP_ID = process.env.NEXT_PUBLIC_REALM_APP_ID;
const app = new Realm.App({ id: REALM_APP_ID });

const TokenEmail = () => {
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const router = useRouter();

  // Function to handle the token and tokenId
  const handleTokenData = async () => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const tokenId = params.get("tokenId");

    try {
      setProcessing(true);

      // Reset the password using the provided token and tokenId
      await app.emailPasswordAuth.confirmUser({ token, tokenId });

      // Password reset successful, you can redirect or show a success message
      setMessage("Confirm Successfully");
      setShowModal(true);
      router.push("/");
    } catch (error) {
      // Handle error
      let errorMessage = error.error;
      let errorMessageCapitalized = errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1);
      setMessage(errorMessageCapitalized);
      setShowModal(true);
    } finally {
      setProcessing(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-96">
        <h1 className="text-2xl font-semibold mb-4">Token Email Confirmation</h1>
        <div className="mb-4">
        </div>
        <button
          className="flex items-center bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue"
          onClick={handleTokenData}
          disabled={processing}
        >
          {processing && <LoadingSpinner />}
          {processing ? " Please wait" : "Confirm"}
        </button>
      </div>
      {showModal && (
        <AlertModal
          message={message}
          closeModal={closeModal}
        />
      )}
    </div>
  );
};

export default TokenEmail;
