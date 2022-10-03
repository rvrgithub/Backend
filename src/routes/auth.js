const {
  login,
  register,
  setProfile,
  getAllUsers,
  logOut,
} = require("../controllers/userControllers");

const router = require("express").Router();

router.post("/login", login);
router.post("/register", register);
// get is only of gettign all user data by there id..
router.get("/allusers/:id", getAllUsers);
router.post("/setprofile/:id", setProfile);
router.get("/logout/:id", logOut);
module.exports = router;
