exports = async function() {
    const shippingCollection = context.services.get("mongodb-atlas").db("store").collection("shipping");
    const EarningCollection = context.services.get("mongodb-atlas").db("store").collection("Earn");
    
     const CartData2 = await shippingCollection.aggregate([
      { $match: { received: 'YES',Checked:'NO'} },
      {
        $project: {
          _id: 0,
          user: '$cartData.user',
          product: '$cartData.product',
          total: '$cartData.output.totalprice',
          date: 1,
          dateShipping: 1
        }
      }
    ]).toArray();
    // Sử dụng Aggregation Framework để cộng tất cả các giá trị của trường totalprice
    const aggregationResult = await shippingCollection.aggregate(
    [
      { $match: { received: 'YES' } },
      {
        $group: {
          _id: null,
          total: {
            $sum: '$cartData.output.totalprice'
          }
        }
      },
      {
          $addFields: {
            newDate: {
              $subtract: [
                new Date(), // Lấy thời gian hiện tại
                300000 // 5 phút trong milliseconds
              ]
            }
          }
        },
        {
          $addFields: {
            day: { $dayOfMonth: "$newDate" },
            result: {
              $trunc: {
                $divide: [
                  { $dayOfMonth: "$newDate" }, // Lấy ngày trong tháng
                  7
                ]
              }
            }
          }
        },
        {
          $addFields: {
            secondResult: {
              $subtract: [
                "$day",
                {
                  $multiply: [
                    "$result",
                    7
                  ]
                }
              ]
            }
          }
        }
       
    ]).toArray();
    
  const foundDocuments = await shippingCollection.find({ received: 'YES', Checked: 'NO' }).toArray();
  
  // Lấy danh sách ID của các documents đã tìm thấy
  const documentIds = foundDocuments.map(doc => doc._id);
  
  // Cập nhật giá trị của trường Checked thành 'YES' cho các documents có ID trong danh sách
  if (documentIds.length > 0) {
    await shippingCollection.updateMany(
      { _id: { $in: documentIds } },
      { $set: { Checked: 'YES' } }
    );
  }
  
  
  
  
    // Lấy giá trị tổng cộng từ kết quả aggregation
    const totalSum = aggregationResult.length > 0 ? aggregationResult[0].total : 0;
    const day = aggregationResult.length > 0 ? aggregationResult[0].secondResult: 0;
    const currentDate = aggregationResult.length > 0 ? aggregationResult[0].newDate : 0;
  
    currentDate.setDate(currentDate.getDate() - day);
    const sundayDate = new Date();
    sundayDate.setMinutes(currentDate.getMinutes() -10);
      // Chuyển đổi ngày thành định dạng MongoDB Date
  const mondayDate = new Date(currentDate.toISOString());
    
    const newDocument = {
      totalprice: totalSum,
      Monday: mondayDate,
      Sunday: sundayDate,
     dong: CartData2
    };
    // Trả về danh sách các documents đã được cập nhật và đã bị xóa
    return EarningCollection.insertOne(newDocument);
   // return CartData2
  };
  // Định nghĩa hàm để chạy aggregation
exports = async function() {
    const database = "store";
    const collection = "Earn";
    
    const pipeline = [
    { $unwind: "$dong" },
    { $unwind: "$dong.product" },
    {
      $group: {
        _id: {
          user: "$dong.user",
          productId: "$dong.product._id",
        },
        quantity: { $sum: "$dong.product.quantity" },
        discount: { $first: "$dong.product.discount" },
      },
    },
    {
      $group: {
        _id: "$_id.user",
        products: {
          $push: {
            productId: "$_id.productId",
            quantity: "$quantity",
            discount: "$discount",
          },
        },
      },
    },
    {
      $group: {
        _id: "$_id",
        userProducts: {
          $push: {
            userId: "$_id",
            products: "$products",
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        userProducts: {
          $map: {
            input: "$userProducts",
            as: "userProduct",
            in: {
              userId: "$$userProduct.userId",
              products: "$$userProduct.products",
            },
          },
        },
      },
    },
    {
      $unwind: "$userProducts",
    },
    {
      $project: {
        _id: 1,
        userid: "$userProducts.userId",
        products: "$userProducts.products",
      },
    },
    {
      $project: {
        userid: 1,
        productCount: {
          $size: {
            $filter: {
              input: "$products",
              as: "product",
              cond: { $gte: ["$$product.quantity", "$$product.discount"] },
            },
          },
        },
      },
    },
    {
      $addFields: {
        discount: {
          $cond: {
            if: { $gte: ["$productCount", 4] },
            then: { name: "20% sale off", value: 0.02, timesUse: 3 },
            else: null,
          },
        },
      },
    },
  ];
  
    const result = await context.services.get("mongodb-atlas").db(database).collection(collection).aggregate(pipeline).toArray();
    
   const usersCollection = context.services.get("mongodb-atlas").db("AppDB").collection("users");
  
    // Lặp qua từng kết quả trong result
    for (const entry of result) {
      const userId = entry._id;
  
      // Chỉ thực hiện cập nhật nếu newField không phải là null
      if (entry.discount !== null) {
        const updateResult = await usersCollection.updateMany(
          { "userId": userId },
          { $set: { "discount": entry.discount } }
        );
  
        // Kiểm tra kết quả cập nhật (optional)
        if (updateResult.modifiedCount > 0) {
          console.log(`Updated ${updateResult.modifiedCount} document(s) for userId ${userId}`);
        }
      }
    }
  };
  exports = async function() {
    const shippingCollection = context.services.get("mongodb-atlas").db("store").collection("shipping");
    const EarningCollection = context.services.get("mongodb-atlas").db("store").collection("Earn");
    
    const CartData2 = await shippingCollection.aggregate([
        { $match: { received: 'YES',Checked:'NO'} },
        {
          $project: {
            _id: 0,
            user: '$cartData.user',
            product: '$cartData.product',
            total: '$cartData.output.totalprice',
            date: 1,
            dateShipping: 1
          }
        }
      ]).toArray();
      // Sử dụng Aggregation Framework để cộng tất cả các giá trị của trường totalprice
      const aggregationResult = await shippingCollection.aggregate(
      [
        { $match: { received: 'YES' } },
        {
          $group: {
            _id: null,
            total: {
              $sum: '$cartData.output.totalprice'
            }
          }
        },
        {
            $addFields: {
              newDate: {
                $subtract: [
                  new Date(), // Lấy thời gian hiện tại
                  300000 // 5 phút trong milliseconds
                ]
              }
            }
          },
          {
            $addFields: {
              day: { $dayOfMonth: "$newDate" },
              result: {
                $trunc: {
                  $divide: [
                    { $dayOfMonth: "$newDate" }, // Lấy ngày trong tháng
                    7
                  ]
                }
              }
            }
          },
          {
            $addFields: {
              secondResult: {
                $subtract: [
                  "$day",
                  {
                    $multiply: [
                      "$result",
                      7
                    ]
                  }
                ]
              }
            }
          }
         
      ]).toArray();
      
    const foundDocuments = await shippingCollection.find({ received: 'YES', Checked: 'NO' }).toArray();
    
    // Lấy danh sách ID của các documents đã tìm thấy
    const documentIds = foundDocuments.map(doc => doc._id);
    
    // Cập nhật giá trị của trường Checked thành 'YES' cho các documents có ID trong danh sách
    if (documentIds.length > 0) {
      await shippingCollection.updateMany(
        { _id: { $in: documentIds } },
        { $set: { Checked: 'YES' } }
      );
    }
      // Lấy giá trị tổng cộng từ kết quả aggregation
      const totalSum = aggregationResult.length > 0 ? aggregationResult[0].total : 0;
      const day = aggregationResult.length > 0 ? aggregationResult[0].secondResult: 0;
      const currentDate = aggregationResult.length > 0 ? aggregationResult[0].newDate : 0;
    
      currentDate.setDate(currentDate.getDate() - day);
      const sundayDate = new Date();
      sundayDate.setMinutes(currentDate.getMinutes() -10);
        // Chuyển đổi ngày thành định dạng MongoDB Date
    const mondayDate = new Date(currentDate.toISOString());
      
      const newDocument = {
        totalprice: totalSum,
        Monday: mondayDate,
        Sunday: sundayDate,
       dong: CartData2
      };
      // Trả về danh sách các documents đã được cập nhật và đã bị xóa
      await EarningCollection.insertOne(newDocument);
     // pipline
    const pipeline = [
    { $unwind: "$dong" },
    { $unwind: "$dong.product" },
    {
      $group: {
        _id: {
          user: "$dong.user",
          productId: "$dong.product._id",
        },
        quantity: { $sum: "$dong.product.quantity" },
        discount: { $first: "$dong.product.discount" },
      },
    },
    {
      $group: {
        _id: "$_id.user",
        products: {
          $push: {
            productId: "$_id.productId",
            quantity: "$quantity",
            discount: "$discount",
          },
        },
      },
    },
    {
      $group: {
        _id: "$_id",
        userProducts: {
          $push: {
            userId: "$_id",
            products: "$products",
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        userProducts: {
          $map: {
            input: "$userProducts",
            as: "userProduct",
            in: {
              userId: "$$userProduct.userId",
              products: "$$userProduct.products",
            },
          },
        },
      },
    },
    {
      $unwind: "$userProducts",
    },
    {
      $project: {
        _id: 1,
        userid: "$userProducts.userId",
        products: "$userProducts.products",
      },
    },
    {
      $project: {
        userid: 1,
        productCount: {
          $size: {
            $filter: {
              input: "$products",
              as: "product",
              cond: { $gte: ["$$product.quantity", "$$product.discount"] },
            },
          },
        },
      },
    },
    {
      $addFields: {
        discount: {
          $cond: {
            if: { $gte: ["$productCount", 4] },
            then: { name: "20% sale off", value: 0.02, timesUse: 3 },
            else: null,
          },
        },
      },
    },
  ];
  
    const result = await EarningCollection.aggregate(pipeline).toArray();
    
   const usersCollection = context.services.get("mongodb-atlas").db("AppDB").collection("users");
  
    // Lặp qua từng kết quả trong result
    for (const entry of result) {
      const userId = entry._id;
  
      // Chỉ thực hiện cập nhật nếu newField không phải là null
      if (entry.discount !== null) {
        const updateResult = await usersCollection.updateMany(
          { "userId": userId },
          { $set: { "discount": entry.discount } }
        );
  
        // Kiểm tra kết quả cập nhật (optional)
        if (updateResult.modifiedCount > 0) {
          console.log(`Updated ${updateResult.modifiedCount} document(s) for userId ${userId}`);
        }
      }
    }
  };
  