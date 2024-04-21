import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/uploadOnCloudinary";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  //* get user details from frontend
  //* validation - not empty
  //* check if user already exists: username ,email
  //* check for images ,check for avatar
  //* upload them to cloudinary avatar check
  //* create user object - create entry in db
  //* remove password and refresh token fields from response
  //* check for user creation
  //* return response

  const { fullName, email, username, password } = req.body;
  console.log(email);

  //* standard rule for prints Error message

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUse = User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUse) {
    throw new ApiError(409, "User already exists");
  }

  //* check for images ,check for avatar

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  //* upload them to cloudinary avatar check

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  //* upload them to cloudinary avatar check

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  //* create user object - create entry in db

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }
   //* return response
   return res.status(201).json(
    new ApiResponse(200,createdUser,"user registered successfully")
   )
});

export { registerUser };
