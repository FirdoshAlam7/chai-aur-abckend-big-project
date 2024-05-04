import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadCloudinary = async function (localFilePath) {
  try {
    if (!localFilePath) return null;
    //*upload the file to the cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    //* file has been successfully uploaded
    // console.log("File successfully uploaded for cloudinary", response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath) //* remove the locally saved temporary file as the upload operation got failed 
    return null;
  }
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_COULD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


export { uploadCloudinary};