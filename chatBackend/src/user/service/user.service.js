import { User } from "../model/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// JWT Token Creation
const handleCreateToken = async function (id) {
  return jwt.sign({ id }, process.env.CHAT_USER_JWT_SECRET);
};

export const userRegistrationService = async function ({
  userName,
  email,
  password,
}) {
  if (!userName && !email && !password) {
    throw new Error(" UserName and Email and Password are Required !");
  }
  if (!userName) {
    throw new Error("userName is Required !");
  }
  if (!email) {
    throw new Error("Email is Required !");
  }
  if (!password) {
    throw new Error("Password is Required!");
  }
  if (password.length < 6 || password.length > 10) {
    throw new Error("Password should be between 6 and 10 char");
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    throw new Error("Invalid Email address");
  }
  const existingUser = await User.findOne({
    where: { email },
  });
  if (existingUser) {
    throw new Error("User is Already Exist 😕");
  }

  const saltRound = Number(process.env.CHAT_USER_JWT_SECRET);
  const hashingPassword = await bcrypt.hash(password, saltRound);
  const user = await User.create({
    userName,
    password: hashingPassword,
    email,
  });

  //   JWT Token
  const jwtToken = await handleCreateToken(user.id);
  console.log(">>>>>JWTToken", jwtToken);

  return {
    message: "user Registered Successfully 🎉",
    statusCode: 201,
    data: {
      id: user.id,
      userName: user.userName,
      email: user.email,
      jwtToken,
    },
  };
};
export const userLoggedInService = async function ({ email, password }) {
  if (!email && !password) {
    throw new Error("Email and Password are Required !");
  }
  if (!email) {
    throw new Error("Email is Required !");
  }
  if (!password) {
    throw new Error("Password is Required!");
  }
  if (password.length < 6 || password.length > 10) {
    throw new Error("Password should be between 6 and 10 char");
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    throw new Error("Invalid Email address");
  }

  const user = await User.findOne({ where: { email } });

  if (!user) throw new Error("User is Not Found 😕");
  const auth = await bcrypt.compare(password, user.password);

  if (!auth) throw new Error("Password In Correct ❌");

  const jwtToken = await handleCreateToken(user.id);

  return {
    message: "✅ User Logged In Successfully",
    statusCode: 201,
    data: {
      id: user.id,
      email: user.email,
    },
    jwtToken,
  };
};

export const userLogoutService = async function () {
  return {
    message: "User Successfully Logged Out 🎉",
    statusCode: 201,
  };
};
