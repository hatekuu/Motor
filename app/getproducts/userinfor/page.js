'use client'
import React, { useState, useEffect } from 'react';
import * as Realm from 'realm-web';
import { useRouter } from 'next/navigation';
const UserForm = () => {
  const REALM_APP_ID = process.env.NEXT_PUBLIC_REALM_APP_ID;
  const app = new Realm.App({ id: REALM_APP_ID });
  const [user, setUser] = useState({});
  const [formData, setFormData] = useState({
    fullName: '',
    contactDetails: {
      phone: '',
      address: {
        street: '',
        city: '',
        country: '',
      },
    },
  });
  const [isEdit, setIsEdit] = useState(false);
const router=useRouter();
  useEffect(() => {
    async function fetchData() {
      try {
        const result = await app.currentUser.refreshCustomData();
        setUser(result);
        // Set formData fields to user data if they exist
        setFormData((prevFormData) => ({
          ...prevFormData,
          fullName: result.fullName || prevFormData.fullName,
          contactDetails: {
            phone: result.contactDetails?.phone || prevFormData.contactDetails.phone,
            address: {
              street: result.contactDetails?.address?.street || prevFormData.contactDetails.address.street,
              city: result.contactDetails?.address?.city || prevFormData.contactDetails.address.city,
              country: result.contactDetails?.address?.country || prevFormData.contactDetails.address.country,
            },
          },
        }));
      } catch (error) {
        console.log(error.error);
      }
    }
    fetchData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleAddressChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      contactDetails: {
        ...prevFormData.contactDetails,
        address: {
          ...prevFormData.contactDetails.address,
          [name]: value,
        },
      },
    }));
  };

  const handlePhoneChange = (event) => {
    const { value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      contactDetails: {
        ...prevFormData.contactDetails,
        phone: value,
      },
    }));
  };

  const handleEditToggle = () => {
    setIsEdit((prevIsEdit) => !prevIsEdit);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    alert(`Full Name: ${formData.fullName}\nPhone: ${formData.contactDetails.phone}\nAddress: ${formData.contactDetails.address.street}, ${formData.contactDetails.address.city}, ${formData.contactDetails.address.country}`);
    const args = [app.currentUser.id, formData];
    const functionName = 'userInfo'; // Adjust this if needed
    await app.currentUser.callFunction(functionName, ...args);
    handleEditToggle(); // Toggle isEdit after submitting
    router.push("/getproducts")
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Information</h1>

      {/* Render full name field */}
      {(user.fullName || isEdit) && !isEdit ? (
        <p className="text-lg mb-2 cursor-pointer">
          Full Name: {user.fullName}
        </p>
      ) : (
        <div className="mb-4">
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
            Full Name:
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="mt-1 p-2 border rounded-md w-full"
          />
        </div>
      )}

      {/* Render phone field */}
      {(user.contactDetails?.phone || isEdit) && !isEdit ? (
        <p className="text-lg mb-2 cursor-pointer" >
          Phone: {user.contactDetails?.phone}
        </p>
      ) : (
        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone:
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.contactDetails.phone}
            onChange={handlePhoneChange}
            required
            className="mt-1 p-2 border rounded-md w-full"
          />
        </div>
      )}

      {/* Render address fields */}
      {(user.contactDetails?.address?.street || isEdit) && !isEdit ? (
       <p
       className="text-lg mb-2 cursor-pointer"
   
       style={{ textDecoration: 'underline', cursor: 'pointer', color: 'blue' }}
     >
       Address: {user.contactDetails.address.street}, {user.contactDetails.address.city}, {user.contactDetails.address.country}
     </p>
      ) : (
        <div>
          <label htmlFor="street" className="block text-sm font-medium text-gray-700">
            Street:
          </label>
          <input
            type="text"
            id="street"
            name="street"
            value={formData.contactDetails.address.street}
            onChange={handleAddressChange}
            required
            className="mt-1 p-2 border rounded-md w-full"
          />

          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            City:
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.contactDetails.address.city}
            onChange={handleAddressChange}
            required
            className="mt-1 p-2 border rounded-md w-full"
          />

          <label htmlFor="country" className="block text-sm font-medium text-gray-700">
            Country:
          </label>
          <input
            type="text"
            id="country"
            name="country"
            value={formData.contactDetails.address.country}
            onChange={handleAddressChange}
            required
            className="mt-1 p-2 border rounded-md w-full"
          />
        </div>
      )}

      <button
        type="submit"
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Submit
      </button>

      {/* Edit button */}
      <button
        type="button"
        onClick={handleEditToggle}
        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md ml-2 hover:bg-gray-400"
      >
        {isEdit ? 'Cancel' : 'Edit'}
      </button>
    </div>
  );
};

export default UserForm;
