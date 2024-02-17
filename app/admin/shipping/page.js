
"use client"
import React, { useState, useEffect } from 'react';
import * as Realm from 'realm-web';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BillDetails from '@/components/modal/BillDetails';
const ShippingPage = () => {
    const [Bill, setBill] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDetailsIndex, setOpenDetailsIndex] = useState(null);
    const router=useRouter();
    const REALM_APP_ID = process.env.NEXT_PUBLIC_REALM_APP_ID;
    const app = new Realm.App({ id: REALM_APP_ID });
    useEffect(() => {
  
        async function fetchData() {
          
          if(!app.currentUser){
            router.push("/")
          }else{
          const functionName = 'Admin';
          const result = await app.currentUser.callFunction(functionName);
          if (result && result.length == 0) {
            router.push("/getproducts");
          } 
        }
          try {
            const functionName = 'getAllShipping';
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
      const toggleDetails = (index) => {
        setOpenDetailsIndex(openDetailsIndex === index ? null : index);
      };
  return (
    <div className="bg-gray-100 ">
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
                <th className="py-3 px-4 bg-indigo-600 text-white border-b hover:bg-indigo-700 transition-all">Date Buying</th>
                <th className="py-3 px-4 bg-indigo-600 text-white border-b hover:bg-indigo-700 transition-all">Date Shipping</th>
                <th className="py-3 px-4 bg-indigo-600 text-white border-b hover:bg-indigo-700 transition-all">User</th>
                <th className="py-3 px-4 bg-indigo-600 text-white border-b hover:bg-indigo-700 transition-all">Total Price</th>
                <th className="py-3 px-4 bg-indigo-600 text-white border-b hover:bg-indigo-700 transition-all">BillDetail</th>
              
              </tr>
            </thead>
            <tbody>
              {Bill.map((bill, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white hover:bg-gray-200 transition-all'}>
               <td className="py-2 px-4 border-b ">{bill.date.toLocaleString()}</td>
               <td className="py-2 px-4 border-b">
                      <div className="flex items-center justify-center">{bill.date.toLocaleString()}</div>
                    </td>
                    <td className="py-2 px-4 border-b">
                      <div className="flex items-center justify-center">{bill.cartData.user}</div>
                    </td>
                    <td className="py-2 px-4 border-b">
                      <div className="flex items-center justify-center">${bill.cartData.output.totalprice.toFixed(2)}</div>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>
  )
}

export default ShippingPage