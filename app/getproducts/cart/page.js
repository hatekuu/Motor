"use client"
import React, { useState, useEffect } from 'react';
import * as Realm from 'realm-web';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
const GetProducts = () => {
  const REALM_APP_ID = process.env.NEXT_PUBLIC_REALM_APP_ID;
  const app = new Realm.App({ id: REALM_APP_ID });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [billId,setBillId]= useState("")
  const [discount,setDiscount]= useState("")
  const router = useRouter();

const [price,setPrice]=useState("")
useEffect(() => {
  async function fetchData() {
    if (!app.currentUser) {
      router.push("/");
    }
    try {
      const functionName = 'MyCart';
      const result = await app.currentUser.callFunction(functionName);
      const customdata=await app.currentUser.refreshCustomData();
      setDiscount(customdata.discount)
     
      // Check if result is defined and has the expected structure

        // Truy cập mảng 'product' bên trong đối tượng trong mảng
        setProducts(result[0]?.product);
        setBillId(String(result[0]?._id || '')); // Ensure _id is defined or use a default value
        setPrice(result[0]?.output ? result[0]?.output.totalprice : 0); // Ensure output is defined
        setLoading(false);
  
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  }

  fetchData();
}, [app.currentUser, router]);

  const handleInputChange = async (index, newQuantity) => {
    // Kiểm tra giá trị nhập vào
    const validatedQuantity = Math.min(Math.max(parseInt(newQuantity, 10) || 0, 1), products[index].countInStock);
    const args = [billId, String(products[index]._id),validatedQuantity,app.currentUser.id];
    const functionName = 'handelOnchange';
    const result = await app.currentUser.callFunction(functionName, ...args);
    // Cập nhật quantity của sản phẩm tại vị trí index
    const updatedProducts = [...products];
    updatedProducts[index].quantity = validatedQuantity;
    setProducts(updatedProducts);
  
  };
  const handleRemoveProduct = async (index) => {
    const args = [app.currentUser.id, String(products[index]._id)];
      const functionName = 'RemoveOneProduct';
       await app.currentUser.callFunction(functionName, ...args);
  
    // Xóa sản phẩm tại vị trí index
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1);
    setProducts(updatedProducts);
  };
  const handleSubmit = async () => {
    try {
      // Convert products to JSON string
      const product = products.map(product => ({
        ...product,
        // Add any additional properties if needed
      }));
      console.log(product)
      // Call the Realm function
      const args = [billId, app.currentUser.id];
      const functionName = 'CartToBill';
       await app.currentUser.callFunction(functionName, ...args);
      // Access the totalprice from the result
      setLoading(false);
    } catch (error) {
      // Handle errors
      console.error(error);
    }finally{
      setPrice(null)
    }
  };
  const handleSaleOff = async (productCode) => {

    const args = [productCode, app.currentUser.id];
   
    const functionName = 'handelSaleOff';

    try {
     await app.currentUser.callFunction(functionName, ...args);
     
    } catch (error) {
      console.log(error.error)
     
    } 
  };
  return (
    <div className="container mx-auto mt-8 min-h-screen">
      {loading ? (
        <p className="text-center text-2xl font-bold text-blue-500">Loading...</p>
      ) : (
        <div>
          <h1 className="text-3xl font-bold mb-4">Product List</h1>
          {!products? (
            <>
            <p className="text-center text-2xl font-bold text-blue-500">No products in cart</p>
                  <p className=" text-center text-2xl mt-4">
              Return to home Page?{' '}
              <Link href="/getproducts" className="text-blue-500 py-10">
                Click here to return
        </Link>
      </p>
      </>
          ) : (
            <div>
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">In Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 overflow-hidden rounded-md mr-4">
                            <Image
                              src={product.image}
                              alt={product.name}
                              width={48}
                              height={48}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">{product.name}</td>
                      <td className="px-6 py-4">${product.price}</td>
                      <td className="px-6 py-4">{product.countInStock}</td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          value={product.quantity || 0}
                          min="1"
                          max={product.countInStock}
                          onChange={(e) => handleInputChange(index, e.target.value)}
                          className="w-16 px-2 py-1 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors"
                          onClick={() => handleRemoveProduct(index)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <h3 className="bg-green-500 text-white p-4 rounded fixed bottom-4 left-4 hover:bg-green-600 transition-bg">
                Total Price: ${price}
              </h3>
              <button
                className="bg-green-500 text-white p-4 rounded fixed bottom-4 right-4 hover:bg-green-600 transition-bg"
                onClick={handleSubmit}
              >
                <span className="font-bold">Submit</span>
              </button>
              <button
                className="bg-green-500 text-white p-4 rounded fixed bottom-4 right-48 hover:bg-green-600 transition-bg"
                onClick={() => handleSaleOff(discount)}
              >
                <span className="font-bold">{discount?.name}</span>
              </button>
            </div>
          )}
        </div>
      )}
       <Link href="/getproducts/cart/bill" className=" py-10 grid place-content-center text-left  font-medium text-3xl text-gray-500 uppercase tracking-wider">
                See your bill
        </Link>
    </div>
  );
};
export default GetProducts;
