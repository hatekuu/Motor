"use client"
import React, { useState, useEffect } from 'react';
import * as Realm from 'realm-web';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const BillPage = () => {
    const REALM_APP_ID = process.env.NEXT_PUBLIC_REALM_APP_ID;
    const app = new Realm.App({ id: REALM_APP_ID });
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true); // Add loading state
    const [openDetailsIndex, setOpenDetailsIndex] = useState(null);
    const [openDetailsIndex1, setOpenDetailsIndex1] = useState(null);
    const [Bill, SetBill] = useState([]);
    const router = useRouter();
  
    useEffect(() => {
      async function fetchData() {
        if (!app.currentUser) {
          router.push("/");
        }
        try {
          const functionName = 'UserBill';
          const result = await app.currentUser.callFunction(functionName);
          const functionName2 = 'CheckShippingBill';
          const result1 = await app.currentUser.callFunction(functionName2);
          SetBill(result1)
          setProducts(result);
          setLoading(false); // Set loading to false when data is fetched
        } catch (error) {
          console.error('Error:', error);
          setLoading(false); // Set loading to false on error as well
        }
      }
  
      fetchData();
    }, [app.currentUser, router]); // Make sure to include app.currentUser and router in the dependency array
  
    const toggleDetails = (index) => {
      setOpenDetailsIndex(openDetailsIndex === index ? null : index);
    };
    const toggleDetails1 = (index1) => {
      setOpenDetailsIndex1(openDetailsIndex1 === index1 ? null : index1);
    };
    const handleReceivedClick = async (billId) => {
      try {
        const functionName = 'RecievedBill';
        const result = await app.currentUser.callFunction(functionName, String(billId), app.currentUser.id);
        console.log(result); // Log the result of the function call
      } catch (error) {
        console.error('Error:', error.error);
      }
    };
    return (
      <>
      <div className="container mx-auto my-8 p-6 bg-white shadow-lg rounded-md">
        <h1 className="text-3xl font-semibold mb-6">Waiting to Ship</h1>
  
        {loading ? (
      <p className="text-gray-600">Loading...</p>
    ) : (
      products && products.length > 0 ? (
        products.map((product, index) => (
            <div key={index} className="mb-8 p-4 border rounded-md">
              <p className="text-gray-600">Date: {new Date(product.date).toLocaleString()}</p>
              <p className="text-gray-600">Total Price: {JSON.stringify(product.cartData.output.totalprice)}$</p>
  
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer mt-4"
                onClick={() => toggleDetails(index)}
              >
                Toggle Details
              </button>
  
              {openDetailsIndex === index && (
                <div className="flex flex-wrap mt-4">
                  {product.cartData.product.map((item, itemIndex) => (
                    <div key={itemIndex} className="m-2 border p-4 rounded-md">
                      {item.image && (
                        <div className="flex items-center">
                          <div className="w-20 h-20 overflow-hidden rounded-md mr-4">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={100}
                              height={100}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        </div>
                      )}
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-gray-600">Quantity: {item.quantity}</p>
                      <p className="text-gray-600">Price: {item.price}</p>
                    </div>
                  ))}
                </div>
              )}
              </div>
        ))
      ) : (
        <p className="text-gray-600">No Data</p>
      )
    )}
      </div>
      <div className="container mx-auto my-8 p-6 bg-white shadow-lg rounded-md">
        <h1 className="text-3xl font-semibold mb-6">Shipping to you</h1>
  
        {loading ? (
      <p className="text-gray-600">Loading...</p>
    ) : (
      Bill && Bill.length > 0 ? (
        Bill.map((product, index1) => (
            <div key={index1} className="mb-8 p-4 border rounded-md">
              <p className="text-gray-600">Date: {new Date(product.date).toLocaleString()}</p>
              <p className="text-gray-600">Date Shipping: {new Date(product.dateShipping).toLocaleString()}</p>
              <p className="text-gray-600">Date Recive: {new Date(product.DateReceived).toLocaleString()}</p>
              <p className="text-gray-600">Total Price: {JSON.stringify(product.cartData.output.totalprice)}$</p>
              <p className="py-2 px-4 border-b">
                          {typeof product.DateReceived === 'string' ? (
                      <button
                        className="bg-green-500 hover:bg-green-700 text-white py-1 px-2 rounded-md"
                        onClick={() => handleReceivedClick(product._id)}
                      >
                        Received
                      </button>
                    ) : (
                      <span className="text-gray-400">Received</span>
                    )}
                    </p>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer mt-4"
                onClick={() => toggleDetails1(index1)}
              >
                Toggle Details
              </button>
  
              {openDetailsIndex1 === index1 && (
                <div className="flex flex-wrap mt-4">
                  {product.cartData.product.map((item1, itemIndex1) => (
                    <div key={itemIndex1} className="m-2 border p-4 rounded-md">
                      {item1.image && (
                        <div className="flex items-center">
                          <div className="w-20 h-20 overflow-hidden rounded-md mr-4">
                            <Image
                              src={item1.image}
                              alt={item1.name}
                              width={100}
                              height={100}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        </div>
                      )}
                      <p className="font-semibold">{item1.name}</p>
                      <p className="text-gray-600">Quantity: {item1.quantity}</p>
                      <p className="text-gray-600">Price: {item1.price}</p>
                

                    </div>
                  ))}
                </div>
              )}
              </div>
        ))
      ) : (
        <p className="text-gray-600">No Data</p>
      )
    )}
      </div>
      </>
    );
  };
  
  export default BillPage;