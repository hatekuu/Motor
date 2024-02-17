// Import các module và components cần thiết
"use client"
import React, { useState, useEffect } from 'react';
import * as Realm from 'realm-web';
import Image from 'next/image';
import AddToCartModal from '@/components/modal/AddToCartModal';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
// Define the GetProducts component
const GetProducts = () => {
  const [products, setProducts] = useState([]);
  const [id, setId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedProductCode, setSelectedProductCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingButtons, setLoadingButtons] = useState([]);
  const router=useRouter();
  // Fetch data when the component mounts

  useEffect(() => {
    async function fetchData() {
      const REALM_APP_ID = process.env.NEXT_PUBLIC_REALM_APP_ID;
  const app = new Realm.App({ id: REALM_APP_ID });
      if(!app.currentUser){
        router.push("/")
      }
      try {
        const functionName = 'products';
        const userId = app.currentUser.id;
        const result = await app.currentUser.callFunction(functionName, 'dong');

        setProducts(result);
        setId(userId);
        setLoadingButtons(Array(result.length).fill(false));
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  });

  const handleAddToCart = async (productCode, index) => {
    const REALM_APP_ID = process.env.NEXT_PUBLIC_REALM_APP_ID;
    const app = new Realm.App({ id: REALM_APP_ID });
    const args = [productCode, app.currentUser.id];
   
    const functionName = 'addtocart';

    try {
      setLoadingButtons((prevLoadingButtons) => {
        const newLoadingButtons = [...prevLoadingButtons];
        newLoadingButtons[index] = true;
        return newLoadingButtons;
      });

      const response = await app.currentUser.callFunction(functionName, ...args);
  
     
      setSelectedProductCode(response);
      if (response.message === "You need to update your info. Contact details are missing or incomplete.") {
        setTimeout(() => {
          router.push("/getproducts/userinfor");
        }, 2000); // Chờ 1 giây trước khi chuyển hướng
      }
      setShowModal(true);
      
    } catch (error) {
      
      setSelectedProductCode(error.error);
      setShowModal(true);
    } finally {
      setLoadingButtons((prevLoadingButtons) => {
        const newLoadingButtons = [...prevLoadingButtons];
        newLoadingButtons[index] = false;
        return newLoadingButtons;
      });
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProductCode('');
  };
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
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
    <div className="container mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome to Our Store</h1>
        <p className="text-lg text-gray-600">Discover the Best Products</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
   <div key={index} className="relative overflow-hidden bg-white p-8 rounded-lg shadow-lg">
   <Link href={`/getproducts/${product._id}`}>
     <div className="block relative">
       <div className="image-container relative w-full h-96 overflow-hidden rounded-lg mb-4">
         <Image
           src={product.image}
           alt={product.name}
           width={900}
           height={1000}
           className="absolute top-0 left-0 w-full h-full object-cover transition-transform transform hover:scale-105 hover:shadow-xl"
           priority="lazy"
         />
       </div>
       <h3
         className="text-xl font-semibold mb-2 text-gray-800 transition-colors hover:text-blue-600"
       >
         {product.name}
       </h3>
       <div className="flex flex-col mb-8">
 
  <div className="flex items-center mb-4">
    <span className="text-2xl text-yellow-500">{`$${product.price}`}</span>
    <span className="ml-2 text-sm text-gray-600">per unit</span>
  </div>
  <div className="flex items-center mb-4">
  <span className="text-sm text-gray-600 mr-4">Rating:</span>
  <div className="flex items-center">
                {renderStars(product.rating)}
              </div>
</div>
  <div className="flex items-center mb-2">
    <span className="text-sm text-gray-600">Reviews:</span>
    <span className="ml-2 text-blue-500">{product.numReviews}</span>
  </div>
</div>

<p className="text-gray-700 leading-relaxed mb-8">{product.description}</p>

                  </div>
                </Link>
                <button
                 onClick={() => handleAddToCart(product.code, index)}
                 disabled={loadingButtons[index]}
                 className={`bg-blue-600 text-white px-6 py-3 rounded-full mt-4 hover:bg-blue-700 transition duration-300 ${
                   loadingButtons[index] ? 'opacity-50 cursor-not-allowed' : ''
                 
                  }`}
                >
                  {loadingButtons[index] ? 'Adding to Cart...' : 'Add to Cart'}
                </button>
              </div>
            ))}
          </div>
        )}
  
        {showModal && (
          <AddToCartModal productCode={selectedProductCode} closeModal={closeModal} />
        )}
      </div>
    </div>
  );
};


export default GetProducts;
