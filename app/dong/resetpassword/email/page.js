// Import necessary modules
'use client'
import React, { useState } from 'react';
import * as Realm from 'realm-web';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import AlertModal from '@/components/modal/AlertModal'; // Import AlertModal component

const REALM_APP_ID = process.env.NEXT_PUBLIC_REALM_APP_ID;
const app = new Realm.App({ id: REALM_APP_ID });

const TokenEmail = () => {
  const [password, setPassword] = useState("");
  const [processing, setProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  // Function to handle the token and tokenId
  const handleTokenData = async () => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const tokenId = params.get("tokenId");

    try {
      setProcessing(true);

      // Reset the password using the provided token and tokenId
      await app.emailPasswordAuth.resetPassword({
        password,
        token,
        tokenId,
      });

      // Password reset successful, you can redirect or show a success message
      setModalMessage("Password reset successful");
      setShowModal(true);
      router.push("/");
    } catch (error) {
      // Handle error
      let errorMessage 

      setMessage(errorMessage);
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
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            New Password:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={processing}
          />
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={handleTokenData}
          disabled={processing}
        >
          {processing ? <LoadingSpinner /> : "Reset Password"}
        </button>
        {processing && <p className="text-gray-700 mt-2">Processing...</p>}
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
