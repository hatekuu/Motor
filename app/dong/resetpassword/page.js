// Import necessary modules
"use client"
import AlertModal from '@/components/modal/AlertModal';
import Link from 'next/link';
import React, { useState } from 'react';
import * as Realm from 'realm-web';
import LoadingSpinner from '@/components/LoadingSpinner';

const REALM_APP_ID = process.env.NEXT_PUBLIC_REALM_APP_ID;
const app = new Realm.App({ id: REALM_APP_ID });

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [processing, setProcessing] = useState(false); // New processing state

  const sendResetEmailHandle = async () => {
    try {
      setProcessing(true); // Set processing state to true

      await app.emailPasswordAuth.sendResetPasswordEmail({ email });
      setIsEmailSent(true);

      setMessage("Check your email please!")
      setShowModal(true);
    } catch (error) {
      // Handle error
      let errorMessage = error.error;
    
      setMessage(errorMessage)
      setShowModal(true);
    } finally {
      setProcessing(false); // Set processing state back to false
    }
  }

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className={`bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-96 ${isEmailSent ? 'hidden' : ''}`}>
        <h1 className="text-2xl font-semibold mb-4">Reset Password</h1>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Your email is:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={sendResetEmailHandle}
          disabled={processing}
        >
          {processing && <LoadingSpinner />} 
          {processing ? " Please wait" : "Send Reset Email"}
        </button>
      </div>
      {isEmailSent && (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-96 text-center">
          <p className="text-2xl font-semibold mb-4">Check your email</p>
          <Link href="/" className="text-blue-500">
            Return to Login
          </Link>
        </div>
      )}
      {showModal && (
        <AlertModal
          message={message}
          closeModal={closeModal}
        />
      )}
    </div>
  );
}

export default ResetPassword;
