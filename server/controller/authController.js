const userModel = require("../models/userModels");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.loginUser = async (request, h) => {
  const { email, password } = request.payload;
  try {
    const [user] = await userModel.getUserWithEmail(email);
    if (!user) return h.response("User not found").code(404);
    // console.log('password from payload !' , JSON.stringify(password));
    const compare = await bcrypt.compare(password.trim(), user.password);
    // console.log(password, "password");
    // console.log(user.password, "user.password");
    if (!compare) return h.response("Password is incorrect !");

    const token = jwt.sign(
      { id: user.id, role: user.role , name : user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    return h.response({ token, role: user.role , user_id : user.id }).code(200);
  } catch (error) {
    console.log("error occurred in controller !", error.message);
    return h.response("Internal server error").code(500);
  }
};

exports.addUser = async (request, h) => {
  const { name, email, password, role, manager_id, hr_id, director_id } =
    request.payload;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await userModel.createUser(
      name,
      email,
      hashed,
      role,
      manager_id,
      hr_id,
      director_id
    );
    return h
      .response({ message: "User successfully created ", user })
      .code(201);
  } catch (error) {
    console.log("error occurred in vajesh ", error.message);
    return h.response("Internal server error").code(500);
  }
};
