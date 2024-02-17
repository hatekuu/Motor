// BillDetails.js
import React from 'react';
import Image from 'next/image';

const DetailsToggle = ({  onClick }) => {
  return (
    <button
    className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition-all"
      onClick={onClick}
    >
  Show Details
    </button>
  );
};

const DetailsModal = ({ isOpen, onClose, detailsData }) => {
  if (!isOpen) {
   
    return null;
  }
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
      <div className="p-4 bg-white rounded-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            {detailsData.cartData.product.map((item, itemIndex) => (
              <div key={itemIndex} className="flex items-center space-x-4">
                {item.image && (
                  <div className="w-16 h-16">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={100}
                      height={100}
                      className="object-cover rounded-md"
                    />
                  </div>
                )}
                <div>
                  <p className="font-bold">{item.name}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: ${item.price}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold mb-4">Bill Information</h2>
              <p>Date buying:</p>
              <ul className="list-disc pl-6">
                <li>{new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(detailsData.date)}</li>
                <li>{new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric' }).format(detailsData.date)}</li>
              </ul>
              {detailsData.DateReceived ? (
                detailsData.DateReceived !== "Null" ? (
                  <>
                    <p>Date Receiving:</p>
                    <ul className="list-disc pl-6">
                      <li>{new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(detailsData.DateReceived))}</li>
                      <li>{new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric' }).format(new Date(detailsData.DateReceived))}</li>
                    </ul>
                  </>
                ) : (
                  <p>Date Receiving: Not received</p>
                )
              ) : null}
              <p>User: {detailsData.cartData.user}</p>
              <p>Total Price: ${detailsData.cartData.output.totalprice}</p>
            </div>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={onClose}
            >
              Close Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  
};


const BillDetails = ({ isOpen, onClick, detailsData }) => {
  return (
    <>
      <DetailsToggle  onClick={onClick} />
      <DetailsModal isOpen={isOpen} onClose={onClick} detailsData={detailsData} />
    </>
  );
};

export default BillDetails;
