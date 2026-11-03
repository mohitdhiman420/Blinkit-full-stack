import axios from "axios";

const uploadimage = async (image) => {
  try {
    const formData = new FormData();
    formData.append("image", image);

    const response = await axios.post(
      "http://localhost:5000/api/file/uploadimage",
      formData,
      {
        withCredentials: true,
      },
    );

    return response;
  } catch (error) {
    console.log("Error:", error.response?.data || error);
  }
};

export default uploadimage;
