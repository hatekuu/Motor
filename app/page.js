// Login.js
'use client'
import Link from "next/link";
import { useState,useEffect,useRef } from "react";
import { useRouter } from "next/navigation";
import * as Realm from "realm-web";
import LoadingSpinner from "@/components/LoadingSpinner";
import AlertModal from "@/components/modal/AlertModal";
const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const REALM_APP_ID = process.env.NEXT_PUBLIC_REALM_APP_ID;
  const app = new Realm.App({ id: REALM_APP_ID });

  const emailInputRef = useRef(null); 
  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  
  }, []);
  useEffect(() => {
 if(app.currentUser?.customData==="customer"){
  router.push("/getproducts")
 }else if(app.currentUser?.customData==="shipper")
 router.push("/shipper")
  },);
  const loginEmailPassword = async () => {
     
    try {

      setLoading(true);
      
      // Tạo đối tượng credential
      const credentials = Realm.Credentials.emailPassword(email, password);
      const user = await app.logIn(credentials);
      const result = await user.functions.Admin();
        
      if (result && result.length > 0) {
        router.push("/admin");
      } else{
        if(user.customData.userRole=="shipper"){
          router.push("/shipper");}
          if(user.customData.userRole=="customer"){
            router.push("/getproducts");}
       
      }
  
      console.log("login succesfull")
    
   
 
  
    } catch (error) {
     
      // Sử dụng errorMessageCapitalized khi cần
      setMessage(error.error)
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      loginEmailPassword();
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
          onKeyDown={handleKeyDown} 
        />
      </div>

      <button
        className="flex items-center bg-blue-500 py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue"
        onClick={loginEmailPassword}
        disabled={loading}
      >
        {loading && <LoadingSpinner />} 
        {loading ? " Please wait" : "Log In"}
      </button>

      <p className="mt-4 text-gray-500">
        Have not an account?{' '}
        <Link href="/register" className="text-blue-500">
          Register now
        </Link>
      </p>

      <p className="mt-4 text-gray-500">
        Forgot your password?{' '}
        <Link href="/dong/resetpassword" className="text-blue-500">
          Click here to reset
        </Link>
      </p>
      {showModal && (
        <AlertModal
          message={message}
          closeModal={closeModal}
          router={null}
        />
      )}
    </div>
  );
};

export default Login;
