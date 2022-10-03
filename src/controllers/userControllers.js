const User = require("../models/uesrModules");
const bcrypt = require("bcrypt");

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.register = async (req, res, next) => {
  console.log(req.body);
  try {
    const { username, email, password } = req.body;
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.setProfile = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const profileImage = req.body.image;
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isProfileImageSet: true,
        profileImage,
      },
      { new: true }
    );
    return res.json({
      isSet: userData.isProfileImageSet,
      image: userData.profileImage,
    });
  } catch (ex) {
    next(ex);
  }
};

//.................

module.exports.getAllUsers = async (req, res, next) => {
  try {
    //  it get onlu outher user id not include our id....
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "profileImage",
      "_id",
    ]);
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};

// logout function .....
module.exports.logOut = (req, res, next) => {
  try {
    if (!req.params.id) return res.json({ msg: "User id is required " });
    onlineUsers.delete(req.params.id);
    return res.status(200).send();
  } catch (ex) {
    next(ex);
  }
};
