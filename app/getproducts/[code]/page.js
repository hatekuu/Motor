"use client"
// Import các thư viện và components cần thiết
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import * as Realm from 'realm-web';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { useRouter } from 'next/router';
export async function generateStaticParams() {
  // ... logic to generate static parameters
}
const ProductDetail = ({ params: { code } }) => {
  const [product, setProduct] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const REALM_APP_ID = process.env.NEXT_PUBLIC_REALM_APP_ID;
      const app = new Realm.App({ id: REALM_APP_ID });
      if (!app.currentUser) {
        router.push("/");
      }
      try {
        const functionName = 'getOneProduct';
        const result = await app.currentUser.callFunction(functionName, code);
        setProduct(result);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
      }
    }

    fetchData();
  }, [code]);

  // Function to render star ratings
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;

    const fullStarsArray = Array.from({ length: fullStars }, (_, index) => (
      <FaStar key={index} className="text-yellow-500" />
    ));

    const halfStar = hasHalfStar && <FaStarHalfAlt key="halfStar" className="text-yellow-500" />;

    return (
      <>
        {fullStarsArray}
        {halfStar}
      </>
    );
  };

  return (
    <div className="flex items-center justify-center h-screen mt-8">
      <div className="bg-white p-8 rounded-lg shadow-md flex-1">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="flex">
            <div className="w-1/2">
              <h1 className="text-4xl font-extrabold mb-4 text-blue-900">{product.name}</h1>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <div className="flex items-center mb-4">
                <span className="text-green-700 mr-2">Rating:</span>
                {renderStars(product.rating)}
              </div>
              <div className="flex items-center mb-4">
                <span className="text-blue-700 font-semibold mr-2">Price:</span>
                <span className="text-2xl font-bold">${product.price}</span>
              </div>
              <p className="text-gray-700 mb-2">In Stock: {product.countInStock}</p>
              <p className="text-gray-700 mb-4">Number of Reviews: {product.numReviews}</p>
            </div>
            {product.image !== null ? (
              <div className="w-1/2 ml-8 overflow-hidden border-8 border-gray-200 rounded-md shadow-md">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={500}
                  height={500}
                  className=" object-cover rounded-md overflow-hidden transition-transform transform hover:scale-105"
                  priority
                />
              </div>
            ) : (
              <p>No image available</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Gán generateStaticParams vào trang
ProductDetail.generateStaticParams = generateStaticParams;
export default ProductDetail;
