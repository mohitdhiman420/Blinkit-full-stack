const categorymodel = require("../models/category.model");
const subcategorymodel = require("../models/subcategory.model");
const productmodel = require("../models/product.model");

async function Addcategory(req, resp) {
  try {
    const { name, image } = req.body;
    // console.log("name and image", name);

    if (!name || !image) {
      return resp.status(400).json({
        message: "Provide require All Fields",
        success: false,
        error: true,
      });
    }

    const newcat = await categorymodel.create({
      name,
      image,
    });

    return resp.status(201).json({
      message: "Add category Success",
      success: true,
      error: false,
      data: newcat,
    });
  } catch (error) {
    return resp.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

async function getallcategory(req, resp) {
  try {
    const data = await categorymodel.find().sort({ createdAt: -1 });;
    if (!data) {
      return resp.status(400).json({
        message: "no data found category",
        error: true,
        success: false,
      });
    }

    return resp.status(200).json({
      message: "Success data found category",
      error: false,
      success: true,
      data: data,
    });

    // console.log("cat details ", data );
  } catch (error) {
    return resp.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

async function Editcategory(req, resp) {
  try {
    const { _id, name, image } = req.body;

    console.log(name);
    console.log(image);

    const update = await categorymodel.updateOne(
      {
        _id: _id,
      },
      {
        name,
        image,
      },
    );

    return resp.status(200).json({
      message: "Updated Category",
      success: true,
      error: false,
      data: update,
    });
  } catch (error) {
    return resp.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// isme hm cat ko sidha delete nhi kar sakta kuki cat subcat m b h or jgha b isliye
// phla chek karega ager khi nhi h to delete
async function Deletecategory(req, resp) {
  try {
    const { _id } = req.body;

    const subcategory = await subcategorymodel.find({
      category: {
        $in: [_id],
      },
    }).countDocuments();

    const checkproduct = await productmodel.find({
      category: {
        $in: [_id],
      },
    }).countDocuments();

    if (subcategory > 0 || checkproduct > 0) {
      return resp.status(400).json({
        message: "Category is already use can't delete",
        error: true,
        success: false,
      });
    }

    const deletecat = await categorymodel.deleteOne({ _id: _id });

    return resp.status(200).json({
      message: "Delete category successfully",
      data: deletecat,
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
module.exports = { Addcategory, getallcategory, Editcategory,Deletecategory };
