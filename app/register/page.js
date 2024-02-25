"use client"
import Link from "next/link";
import { useState ,useRef,useEffect} from "react";
import * as Realm from "realm-web";
import AlertModal from "@/components/modal/AlertModal";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [loading, setLoading] = useState(false); // New loading state
  const emailInputRef = useRef(null); 
  const REALM_APP_ID = process.env.NEXT_PUBLIC_REALM_APP_ID;
  const app = new Realm.App({ id: REALM_APP_ID });
  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);
  const registerUser = async () => {
    // Check if password and confirm password match
    if (password !== confirmPassword) {
      setPasswordMismatch(true);
      return;
    }

    try {
      setLoading(true); // Set loading state to true

      await app.emailPasswordAuth.registerUser({ email, password });
      setMessage("User registered successfully, please check your email to confirm user!");
      setShowModal(true);
    } catch (error) {
      // Handle error
     
      setMessage(error.error);
      setShowModal(true);
    } finally {
      setLoading(false); // Set loading state back to false
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      registerUser();
    }
  };
  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="container mx-auto mt-10 p-6 bg-gray-100 border rounded-md shadow-md max-w-md">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">Email:</label>
        <input
          ref={emailInputRef} 
          type="text"
          className="mt-1 p-2 border rounded-md w-full text-gray-900"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">Password:</label>
        <input
          type="password"
          className="mt-1 p-2 border rounded-md w-full text-gray-900"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">Confirm Password:</label>
        <input
          type="password"
          className={`mt-1 p-2 border rounded-md w-full text-gray-900 ${passwordMismatch ? 'border-red-500' : ''}`}
          value={confirmPassword}
          onKeyDown={handleKeyDown} 
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setPasswordMismatch(false);
          }}
        />
        {passwordMismatch && (
          <p className="text-red-500 text-sm mt-1">Passwords do not match.</p>
        )}
      </div>

      <button
        className="bg-blue-500  py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue"
        onClick={registerUser}
        disabled={loading} // Disable button while loading
      >
        {loading && <LoadingSpinner />}
        {loading ? " Registering..." : "Register User"}
      </button>
      <p className="mt-4 text-gray-600">
        Already have an account?{' '}
        <Link href="/" className="text-blue-500">
          Login now
        </Link>
      </p>
      {showModal && (
        <AlertModal
          message={message}
          closeModal={closeModal}
          router="/"
        />
      )}
    </div>
  );
}
