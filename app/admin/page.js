"use client"
import React, { useState, useEffect } from 'react';
import * as Realm from 'realm-web';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useRouter } from 'next/navigation';
import BillDetails from '@/components/modal/BillDetails';
const AdminPage = () => {
  const [Bill, setBill] = useState([]);
  const [openDetailsIndex, setOpenDetailsIndex] = useState(null);
  const [loadingShipping, setLoadingShipping] = useState(false);

  const [loading, setLoading] = useState(true);
  const router=useRouter();
  const REALM_APP_ID = process.env.NEXT_PUBLIC_REALM_APP_ID;
  const app = new Realm.App({ id: REALM_APP_ID });
  useEffect(() => {
  
    async function fetchData() {
      
      if(!app.currentUser){
        router.push("/")
      } else{
      const functionName = 'Admin';
      const result = await app.currentUser.callFunction(functionName);
      if (result && result.length == 0) {
        router.push("/getproducts");
      } 
    } 
      try {
        const functionName = 'AllShopBill';
        const result = await app.currentUser.callFunction(functionName);
      
        setBill(result);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, );

  const handleShippingClick = async (index, id) => {
    try {
      // Set the loading state to true
      setLoadingShipping(true);
  
      const functionName = 'Shipping';
      await app.currentUser.callFunction(functionName, String(id));
  
      // Implement the logic to perform shipping action
      // For now, let's remove the row from the state
      const updatedBill = [...Bill];
      updatedBill.splice(index, 1);
      setBill(updatedBill);
    } catch (error) {
      console.log(error.error);
    } finally {
      // Set the loading state back to false after the operation is complete (whether it succeeded or failed)
      setLoadingShipping(false);
    }
  };
  
  const toggleDetails = (index) => {
    setOpenDetailsIndex(openDetailsIndex === index ? null : index);
  };
  return (
    <div className="bg-gray-100">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-700 mb-2">Admin Dashboard</h1>
          <p className="text-lg text-gray-600">Exclusive Access for Admins</p>
        </div>
  
        {loading ? (
          <div className="flex items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 shadow-lg rounded-md overflow-hidden">
              <thead>
                <tr>
                  <th className="py-3 px-4 bg-indigo-600 text-white border-b hover:bg-indigo-700 transition-all">Date</th>
                  <th className="py-3 px-4 bg-indigo-600 text-white border-b hover:bg-indigo-700 transition-all">User</th>
                  <th className="py-3 px-4 bg-indigo-600 text-white border-b hover:bg-indigo-700 transition-all">Total Price</th>
                  <th className="py-3 px-4 bg-indigo-600 text-white border-b hover:bg-indigo-700 transition-all">Bill Detail</th>
                  <th className="py-3 px-4 bg-indigo-600 text-white border-b hover:bg-indigo-700 transition-all">Action</th>
                </tr>
              </thead>
              <tbody>
                {Bill.map((bill, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white hover:bg-gray-200 transition-all'}>
                    <td className="py-2 px-4 border-b">
                      <div className="flex items-center justify-center">{bill?.date?.toLocaleString()}</div>
                    </td>
                    <td className="py-2 px-4 border-b">
                      <div className="flex items-center justify-center">{bill?.cartData?.user}</div>
                    </td>
                    <td className="py-2 px-4 border-b">
                      <div className="flex items-center justify-center">${bill?.cartData?.output?.totalprice?.toFixed(2)}</div>
                    </td>
                    <td className="py-2 px-4 border-b">
                      <div className="flex items-center justify-center">
                        <BillDetails
                          isOpen={openDetailsIndex === index}
                          onClick={() => toggleDetails(index)}
                          detailsData={bill}
                        />
                      </div>
                    </td>
                    <td className="py-2 px-4 border-b">
                      <div className="flex items-center justify-center">
                          <button
                              onClick={() => handleShippingClick(index, bill?._id)}
                              className={`bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition-all ${loadingShipping ? 'opacity-50 cursor-not-allowed' : ''}`}
                              disabled={loadingShipping}
                                >
                              {loadingShipping ? 'Waiting...' : 'Shipping'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
                };  

export default AdminPage;
