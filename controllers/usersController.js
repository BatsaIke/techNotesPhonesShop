const User = require("../models/User.js");
const Notes = require("../models/Note.js");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

//getall users
//@route GET /users
//@acces private
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean();
  if (!users?.length) {
    return res.status(400).json({ message: "No user found" });
  }
  res.json(users);
});

//create users
//@route POSt /users
//@acces private
const createNewUser = asyncHandler(async (req, res) => {
  const { username, password, roles } = req.body;
  //congirm data
  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    return res.status(400).json({ message: "All fields are required" });
  }
  //check for duplicates
  const duplicate = await User.findOne({ username }).lean().exec();
  if (duplicate) {
    return res.status(409).json({ message: "Username Already Exist" });
  }
  //hash password
  const hashedPwd = await bcrypt.hash(password, 10);

  const userObject = { username, password: hashedPwd, roles };
  //create and store new user
  const user = await User.create(userObject);
  if (user) {
    res.status(201).json({ message: `${`new user ${user.username} created succesfully`}` });
  } else {
    res.status(400).json({ message: "invalid user data received" });
  }
});

//update users
//@route PATCH/users
//@acces private
const updateUser = asyncHandler(async (req, res) => {
  const { id, username, roles, active, password } = req.body
  console.log("body",req.body);
  
  if (
    !id ||
    !username ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== 'boolean'
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  //checks for duplicate
  const duplicate = await User.findOne({ username }).lean().exec();
  //Allow updates to the original user
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate username" });
  }
  user.username = username;
  user.roles = roles;
  user.active = active;

  if (password) {
    //hash pasowrd
    user.password = await bcrypt.hash(password, 10); //salt round
  }
  const updatedUser = await user.save();
  res.json({ message: `${updatedUser.username} updated` });
});

//delete a  users
//@route DELETE /users
//@acces private
const deleteUsesr = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "User Required" });
  }
  const notes = await Notes.findOne({ user: id }).lean().exec();
  if (notes) {
    return res.status(400).json({ message: "User has assinged notes" });
  }
  const user = await User.findById(id).exec();
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  const result = await user.deleteOne();
  const reply = `Username ${result.username} with ID ${result.id} is deleted`;
  res.json(reply);
});

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUsesr,
};
