// Navbar.js
"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import * as Realm from 'realm-web';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const ShiperNavBar = () => {
  const [isNavbarFixed, setIsNavbarFixed] = useState(false);
  const REALM_APP_ID = process.env.NEXT_PUBLIC_REALM_APP_ID;
  const app = new Realm.App({ id: REALM_APP_ID });
  const router = useRouter();

  const logoutEmailPassword = async () => {
    try {
      const userId = app.currentUser.id;
      await app.allUsers[userId].logOut();
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  useEffect(() => {
    const handleScroll = () => {
      const isFixed = window.scrollY > 0;
      setIsNavbarFixed(isFixed);
    };

    // Thêm sự kiện cuộn trang để kiểm tra khi nào phải cố định navbar
    window.addEventListener('scroll', handleScroll);

    // Cleanup để tránh memory leak
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  const navbarClass = isNavbarFixed
  ? "bg-gradient-to-r from-gray-600 to-gray-800 p-4 border-b-4 border-yellow-500 fixed w-full top-0 z-50"
  : "bg-gradient-to-r from-gray-600 to-gray-800 p-4 border-b-4 border-yellow-500";

  return (
    <nav className={navbarClass}>
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-2xl">THIS IS FOR SHIPPER ONLY!</div>
        <ul className="flex space-x-4 items-center">
          <li>
            <Link href="/admin">
              <p className="text-white hover:text-gray-300 transition duration-300">Shipper Home Page</p>
            </Link>
          </li>
         
          <li className="ml-2 relative group">
            {/* Sử dụng ảnh đại diện của người dùng thay vì icon */}
            <Image
              src="/favicon.ico"
              alt="User Avatar"
              width={32}
              height={32}
              className="rounded-full transition duration-300 transform group-hover:scale-110 cursor-pointer"
            />
            {/* Thêm dropdown menu */}
            <div className="hidden group-hover:block absolute bg-gray-200 p-2 rounded-md top-8 right-0 shadow-md border border-gray-300 transition duration-300">
        
              <button
                className="text-gray-800 hover:text-red-500 font-semibold transition duration-300"
                onClick={logoutEmailPassword} >
                Logout
              </button>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default ShiperNavBar;
