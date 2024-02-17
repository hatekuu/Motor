"use client"
import React, { useState, useEffect } from 'react';
import * as Realm from 'realm-web';
import { useRouter } from 'next/navigation';
import Image from 'next/image';


const Earning = () => {
  const router = useRouter();
  const REALM_APP_ID = process.env.NEXT_PUBLIC_REALM_APP_ID;
  const app = new Realm.App({ id: REALM_APP_ID });

  // State để lưu trữ kết quả
  const [earningResults, setEarningResults] = useState([]);

  useEffect(() => {
    async function fetchData() {
      if (!app.currentUser) {
        router.push("/");
      } else {
        const functionName = 'Admin';
        const result = await app.currentUser.callFunction(functionName);
        if (result && result.length === 0) {
          router.push("/getproducts");
        }
      }

      try {
        const functionName = 'Earning';
        const results = await app.currentUser.callFunction(functionName);
        console.log(results);

        // Lưu trữ kết quả vào trạng thái
        setEarningResults(results);
      } catch (error) {
        console.error('Error:', error.error);
      }
    }

    fetchData();
  },[] ); 

  return (
    <div className="container mx-auto mt-8 min-h-screen">
  {earningResults.length > 0 && (
    <div>
      <h1 className="text-2xl font-bold mb-4">Earning Results</h1>
      {earningResults.map((result, index) => (
        <div key={index} className="mb-8 p-6 border border-gray-300 rounded shadow-lg">
          <h2 className="text-xl font-semibold mb-4">
            <span className="text-blue-500">Monthly Earnings {index + 1}</span> - Start Day: {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(result.StartDayValue)} - End Day: {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(result.EndayValue)} - Total Earnings: ${result.totalPrice}
          </h2>
          <table className="table-auto w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
              <th className="border p-2">Product Image</th>
                <th className="border p-2">Product ID</th>
                <th className="border p-2">Product Name</th>
                <th className="border p-2">Total Quantity</th>
                <th className="border p-2">Total Price Of Product</th>
              </tr>
            </thead>
            <tbody>
              {result.products.map((product, subIndex) => (
               <tr key={subIndex} className={subIndex % 2 === 0 ? "bg-gray-100" : ""}>
                <td className="border p-2 text-center">
                <div className="w-16 h-16">
                                        <Image
                        src={product.image}
                        alt={product.name}
                        width={100}
                        height={100}
                        className="object-cover rounded-md"
                        loading="lazy"
                        />
                                        </div></td>
               <td className="border p-2 text-center">{product.productId.toString()}</td>
               <td className="border p-2 text-center">{product.name}</td>
               <td className="border p-2 text-center">{product.totalQuantity}</td>
               <td className="border p-2 text-center">${product.totalprice}</td>
             </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  )}
</div>
  );
};

export default Earning;
