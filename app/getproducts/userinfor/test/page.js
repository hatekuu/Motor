// pages/index.js
'use client'
import React, { useState,useEffect } from 'react';

import * as Realm from 'realm-web';
const Home = () => {
  const REALM_APP_ID = process.env.NEXT_PUBLIC_REALM_APP_ID;
  const app = new Realm.App({ id: REALM_APP_ID });
  const [user,setUser]=useState([])
  const [userInfo, setUserInfo] = useState({
    profile: {
      fullName: '',
      contactDetails: {
        phone: '',
        address: {
          street: '',
          city: '',
          country: '',
        },
      },
      personalDetails: {
        gender: '',
        age: '',
        birthdate: {
          day: '',
          month: '',
          year: '',
        },
      },
     
    },
    preferences: {
      language: '',
      theme: '',
    },
  });
  useEffect(() => {
    async function fetchData() {
      try {
        const result = await app.currentUser.refreshCustomData();
        setUser(result.profile.fullName);
      
      } catch (error) {
        console.log(error.error);
      }
    }
    fetchData();
  }, );

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      profile: {
        ...prevUserInfo.profile,
        [name]: value,
      },
    }));
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      profile: {
        ...prevUserInfo.profile,
        contactDetails: {
          ...prevUserInfo.profile.contactDetails,
          [name]: value,
        },
      },
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      profile: {
        ...prevUserInfo.profile,
        contactDetails: {
          ...prevUserInfo.profile.contactDetails,
          address: {
            ...prevUserInfo.profile.contactDetails.address,
            [name]: value,
          },
        },
      },
    }));
  };

  const handleBirthdateChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      profile: {
        ...prevUserInfo.profile,
        personalDetails: {
          ...prevUserInfo.profile.personalDetails,
          birthdate: {
            ...prevUserInfo.profile.personalDetails.birthdate,
            [name]: value,
          },
        },
      },
    }));
  };
  const handleGenderChange = (e) => {
    const { value } = e.target;
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      profile: {
        ...prevUserInfo.profile,
        personalDetails: {
          ...prevUserInfo.profile.personalDetails,
          gender: value,
        },
      },
    }));
  };
  
  const handleAgeChange = (e) => {
    const { value } = e.target;
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      profile: {
        ...prevUserInfo.profile,
        personalDetails: {
          ...prevUserInfo.profile.personalDetails,
          age: value,
        },
      },
    }));
  };
  const handlePreferencesChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      preferences: {
        ...prevUserInfo.preferences,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    const args = [app.currentUser.id,(userInfo)];
    const functionName = 'userInfo';
    await app.currentUser.callFunction(functionName, ...args);
  };
  return (
    <div className="container mx-auto mt-8">
    <h1 className="text-3xl font-bold text-center mb-4">Update User Information</h1>
    <form className="max-w-md mx-auto">
    <div className="mb-4">
       <label htmlFor="fullName" className="block text-gray-600 text-sm font-medium">Full Name:</label>
  {user ? (
    <p>{user}</p>
  ) : (
    <>
     
      <input
        type="text"
        id="fullName"
        name="fullName"
        value={userInfo.profile.fullName}
        onChange={handleProfileChange}
        className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
      />
    </>
  )}
</div>
  
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="phone"
           className="block text-gray-600 text-sm font-medium">Phone:</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={userInfo.profile.contactDetails.phone}
            onChange={handleContactChange}
            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div>
          <label htmlFor="street" className="block text-gray-600 text-sm font-medium">Street:</label>
          <input
            type="text"
            id="street"
            name="street"
            value={userInfo.profile.contactDetails.address.street}
            onChange={handleAddressChange}
            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
      </div>
  
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="gender" className="block text-gray-600 text-sm font-medium">Gender:</label>
          <input
            type="text"
            id="gender"
            name="gender"
            value={userInfo.profile.personalDetails.gender}
            onChange={handleGenderChange}
            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div>
          <label htmlFor="age" className="block text-gray-600 text-sm font-medium">Age:</label>
          <input
            type="text"
            id="age"
            name="age"
            value={userInfo.profile.personalDetails.age}
            onChange={handleAgeChange}
            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
      </div>
  
      <div className="mb-4 grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="day" className="block text-gray-600 text-sm font-medium">Day of Birth:</label>
          <input
            type="text"
            id="day"
            name="day"
            value={userInfo.profile.personalDetails.birthdate.day}
            onChange={handleBirthdateChange}
            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div>
          <label htmlFor="month" className="block text-gray-600 text-sm font-medium">Month of Birth:</label>
          <input
            type="text"
            id="month"
            name="month"
            value={userInfo.profile.personalDetails.birthdate.month}
            onChange={handleBirthdateChange}
            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div>
          <label htmlFor="year" className="block text-gray-600 text-sm font-medium">Year of Birth:</label>
          <input
            type="text"
            id="year"
            name="year"
            value={userInfo.profile.personalDetails.birthdate.year}
            onChange={handleBirthdateChange}
            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
      </div>
  
      <div className="mb-4">
        <label htmlFor="language" className="block text-gray-600 text-sm font-medium">Language:</label>
        <input
          type="text"
          id="language"
          name="language"
          value={userInfo.preferences.language}
          onChange={handlePreferencesChange}
          className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>
  
      <div className="mb-4">
        <label htmlFor="theme" className="block text-gray-600 text-sm font-medium">Theme:</label>
        <input
          type="text"
          id="theme"
          name="theme"
          value={userInfo.preferences.theme}
          onChange={handlePreferencesChange}
          className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>
  
      <button
        type="button"
        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </form>
  </div>
  
  );
};


export default Home;
