const SubCatmodel = require("../models/subcategory.model");

async function Addsubcategory(req, resp) {
  try {
    const { name, image, category } = req.body;

    if (!name || !image || !category || category.length === 0) {
      return resp.status(400).json({
        message: "provide name image and category",
        error: true,
        success: false,
      });
    }

    const newsubcate = await SubCatmodel.create({
      name,
      image,
      category,
    });
    return resp.status(201).json({
      message: "Add subcategory sucessflly",
      error: false,
      success: true,
      data: newsubcate,
    });
  } catch (error) {
    return resp.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

async function getallsubcategory(req, resp) {
  try {
    const getallsubcat = await SubCatmodel.find()
      .populate("category")
      .sort({ createdAt: -1 });
    if (!getallsubcat) {
      return resp.status(400).json({
        message: "no data found subcategory",
        error: true,
        success: false,
      });
    }

    return resp.status(200).json({
      message: "Success data found category",
      error: false,
      success: true,
      data: getallsubcat,
    });
  } catch (error) {
    return resp.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

async function UpdateSubcategory(req, resp) {
  try {
    const { _id, name, image, category } = req.body;
    console.log(_id);
    console.log(image);
    console.log(category);

    const checkSub = await SubCatmodel.findById(_id);

    if (!checkSub) {
      return resp.status(400).json({
        message: "Check your _id",
        error: true,
        success: false,
      });
    }

    const updateSubCategory = await SubCatmodel.findByIdAndUpdate(_id, {
      name,
      image,
      category,
    });

    return resp.status(200).json({
      message: "Updated Successfully",
      data: updateSubCategory,
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

async function deletesubcategory(req, resp) {
  try {
    const { _id } = req.body;
    console.log("Id", _id);
    const deleteSub = await SubCatmodel.findByIdAndDelete(_id);

    return resp.status(200).json({
      message: "Delete successfully",
      data: deleteSub,
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

module.exports = { Addsubcategory, getallsubcategory, UpdateSubcategory,deletesubcategory };
