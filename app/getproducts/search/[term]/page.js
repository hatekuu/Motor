
// Import necessary libraries and components
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import * as Realm from 'realm-web';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';
import AddToCartModal from '@/components/modal/AddToCartModal';
// Thêm phương thức generateStaticParams()
export async function generateStaticParams() {
  // ... logic để sinh các tham số tĩnh
}

const Term = ({ params: { term } }) => {
    const [products, setProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [loadingButtons, setLoadingButtons] = useState([]);
  const router=useRouter();
  useEffect(() => {
    async function fetchData() {
      const REALM_APP_ID = process.env.NEXT_PUBLIC_REALM_APP_ID;
      const app = new Realm.App({ id: REALM_APP_ID });
      if(!app.currentUser){
        router.push("/")
      }
      try {
        const functionName = 'searchProducts';
      
        const result = await app.currentUser.callFunction(functionName, term);
    
        setProduct(result);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
      }
    }

    fetchData();
  }, );

  // Function to render star ratings
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

  return (
    <div>
      
      {isLoading ? (
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
  );
};

export default Term;