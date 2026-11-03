const productmodel = require("../models/product.model");

async function Addproduct(req, resp) {
  try {
    const {
      name,
      image,
      category,
      subCategory,
      unit,
      stock,
      price,
      discount,
      description,
      more_details,
    } = req.body;

    if (
      !name ||
      !image[0] ||
      !category[0] ||
      !subCategory[0] ||
      !unit ||
      !price ||
      !description
    ) {
      return resp.status(400).json({
        message: "Enter required fields",
        error: true,
        success: false,
      });
    }

    const newproduct = await productmodel.create({
      name,
      image,
      category,
      subCategory,
      unit,
      stock,
      price,
      discount,
      description,
      more_details,
    });

    return resp.status(201).json({
      message: "Product Created Successfully",
      data: newproduct,
      error: false,
      success: true,
    });
  } catch (error) {
    return resp.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

async function Getproduct(req, resp) {
  try {
    let { page, limit, search } = req.body;

    if (!page) {
      page = 1;
    }

    if (!limit) {
      limit = 10;
    }

    //     yha ye jo $ text h product model m ek query lga rakhi h wha se h
    const query = search
      ? {
          $text: {
            $search: search,
          },
        }
      : {};
    // console.log("SEARCH:", search);
    // console.log("QUERY:", query);

    const skip = (page - 1) * limit;
    // .populate('category subCategory')
    const [data, totalcount] = await Promise.all([
      productmodel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      productmodel.countDocuments(query),
    ]);
    // console.log("DATA:", data);
    // console.log("TOTAL:", totalcount);
    return resp.status(200).json({
      message: "Product data",
      error: false,
      success: true,
      totalCount: totalcount,
      totalNoPage: Math.ceil(totalcount / limit),
      data: data,
    });
  } catch (error) {
    return resp.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

async function getproductbycategory(req, resp) {
  try {
    const { id } = req.body;

    // console.log("ID:", id);

    if (!id) {
      return resp.status(400).json({
        message: "provide category id",
        error: true,
        success: false,
      });
    }
    // isme ye category k ander check karega id ki us se or limit isliye
    // taki product ki 15 hi aaye jayada aana par server hang
    const product = await productmodel
      .find({
        category: { $in: id },
      })
      .limit(15);

    return resp.json({
      message: "category product list",
      data: product,
      error: false,
      success: true,
    });
  } catch (error) {
    return resp.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

async function getproductbycategoryandsubcategoryid(req, resp) {
  try {
    let { categoryid, subcategoryid, page = 1, limit = 10 } = req.body;
    if (!categoryid || !subcategoryid) {
      return resp.status(400).json({
        message: "Provide categoryId and subCategoryId",
        error: true,
        success: false,
      });
    }

    if (!page) {
      page = 1;
    }
    if (!limit) {
      limit = 10;
    }
    const query = {
      category: { $in: [categoryid] },
      subCategory: { $in: [subcategoryid] },
    };

    const skip = (page - 1) * limit;

    const categoryProducts = await productmodel.find({
      category: { $in: [categoryid] },
    });

    // console.log("CATEGORY MATCH:", categoryProducts.length);

    // categoryProducts.forEach((item) => {
    //   console.log(
    //     item.name,
    //     "=> category:",
    //     item.category,
    //     "subCategory:",
    //     item.subCategory,
    //   );
    // });
    const [data, datacount] = await Promise.all([
      productmodel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      productmodel.countDocuments(query),
    ]);

    return resp.json({
      message: "Product list",
      data: data,
      totalCount: datacount,
      page: page,
      limit: limit,
      success: true,
      error: false,
    });
  } catch (error) {
    return resp.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

async function getproductdetails(req, resp) {
  try {
    const { productid } = req.body;
    if (!productid) {
      return resp.status(400).json({
        message: "Please Provide Productid",
        error: true,
        success: false,
      });
    }

    const product = await productmodel.findOne({ _id: productid });

    return resp.json({
      message: "Product Details ",
      data: product,
      error: false,
      success: true,
    });
  } catch (error) {
    return resp.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

async function Updateproduct(req, resp) {
  try {
    const {
      _id,
      name,
      image,
      category,
      subCategory,
      unit,
      stock,
      price,
      discount,
      description,
      more_details,
    } = req.body;

    if (!_id) {
      return resp.status(400).json({
        message: "Please Provide ID of Product",
        error: true,
        success: false,
      });
    }

    const updateproduct = await productmodel.updateOne(
      { _id: _id },
      {
        name,
        image,
        category,
        subCategory,
        unit,
        stock,
        price,
        discount,
        description,
        more_details,
      },
    );

    return resp.json({
      message: "Product Update SuccessFully",
      error: false,
      success: true,
      data: updateproduct,
    });
  } catch (error) {
    return resp.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

async function deleteproduct(req, resp) {
  try {
    const { _id } = req.body;

    if (!_id) {
      return resp.status(400).json({
        message: "Please Provide ID of Product",
        error: true,
        success: false,
      });
    }

    const delpro = await productmodel.findByIdAndDelete({ _id: _id });
    return resp.status(200).json({
      message: "Product Delete Success",
      error: false,
      success: true,
      data: delpro,
    });
  } catch (error) {
    return resp.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}



// async function searchproducts(req, resp) {
//   try {
//     let { search, page, limit } = req.body;

//     if (!page) {
//       page = 1;
//     }

//     if (!limit) {
//       limit = 10;
//     }
//     if (search) {
//       search = decodeURIComponent(search).trim();
//     }

//     const skip = (page - 1) * limit;

//     const query = search
//       ? {
//           $or: [
//             { name: { $regex: search, $options: "i" } },
//             { description: { $regex: search, $options: "i" } },
//           ],
//         }
//       : {};

//     const [data, datacount] = await Promise.all([
//       productmodel
//         .find(query)
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(limit)
//         .populate("category subCategory"),
//       productmodel.countDocuments(query),
//     ]);

//     console.log("Data:", data);
//     return resp.json({
//       message: "Product list",
//       data: data,
//       totalCount: datacount,
//       page: page,
//       limit: limit,
//       totalPage: Math.ceil(datacount / limit),
//       success: true,
//       error: false,
//     });
//   } catch (error) {
//     return resp.status(500).json({
//       message: error.message || error,
//       error: true,
//       success: false,
//     });
//   }
// }

async function searchproduct(req, resp) {
  try {
    let { search, page = 1, limit = 10 } = req.body;

    // Search ko decode karo yani %20 remove karna h 
    if (search) {
      search = decodeURIComponent(search).trim();
    }

    page = Number(page);
    limit = Number(limit);

    const skip = (page - 1) * limit;

    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ],
        }
      : {};

 

    const [data, datacount] = await Promise.all([
      productmodel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("category subCategory"),

      productmodel.countDocuments(query),
    ]);

    console.log("Data length:", data.length);
    console.log("Total count:", datacount);

    return resp.json({
      message: "Product list",
      data,
      totalCount: datacount,
      page,
      limit,
      totalPage: Math.ceil(datacount / limit),
      success: true,
      error: false,
    });
  } catch (error) {
    return resp.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

module.exports = {
  Addproduct,
  Getproduct,
  getproductbycategory,
  getproductbycategoryandsubcategoryid,
  getproductdetails,
  Updateproduct,
  deleteproduct,
  searchproduct,
};
