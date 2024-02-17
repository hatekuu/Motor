// Import necessary modules
import React, { useState, useEffect } from 'react';
import * as Realm from 'realm-web';
import Image from 'next/image';

// Define the GetProducts component
const GetProducts = () => {
  const [products, setProducts] = useState([]);
  const [id, setId] = useState('');

  // Fetch data when the component mounts
  useEffect(() => {
    async function fetchData() {
      const REALM_APP_ID = process.env.NEXT_PUBLIC_REALM_APP_ID;
      const app = new Realm.App({ id: REALM_APP_ID });

      try {
        const functionName = 'products';
        const userId = app.currentUser.id;
        const result = await app.currentUser.callFunction(functionName, 'dong');

        setProducts(result);
        setId(userId);
      } catch (error) {
        console.error('Error:', error);
      }
    }

    fetchData();
  }, []);

  // Render the component
  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Product List</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product, index) => (
          <div key={index} className="product-card border p-4 rounded-md shadow-md">
            {/* Use next/image for optimized image rendering */}
            <Image
              src={product.image}
              alt={product.name}
              width={1000}
              height={1000}
              layout="responsive" 
              className="product-image rounded-md mb-4"
            />
            <p className="text-lg font-semibold">{product.name}</p>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-blue-500 mt-2">${product.price}</p>
            <div className="flex items-center mt-2">
              <span className="text-yellow-500">&#9733;</span>
              <span className="text-gray-500 ml-1">{product.rating}</span>
            </div>
            {/* Add other product details as needed */}
          </div>
        ))}
      </div>
    </div>
  );
};

// Export the component
export default GetProducts;
