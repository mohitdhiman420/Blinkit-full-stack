import axios from "axios";

const fetchuserDetails = async () => {


  try {
    const response = await axios.get(
      "http://localhost:5000/api/auth/user/user-detils",
      {
        withCredentials: true,
      },
    );

    return response.data.data;
    
    // console.log("user ed" ,response.data.data);
  } catch (error) {
    if (error.response?.status === 401) {
      console.log(error);
    }

    // console.log("Error:", error.response?.data || error);
  }
};


export default fetchuserDetails