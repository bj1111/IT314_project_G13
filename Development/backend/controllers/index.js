const User = require("../models/User");
const bcrypt = require("bcrypt");

const getHome = (req, res) => {
  res.render("home");
};
const view_course = (req, res) => {
  const courses = [
    {
      name: "Introduction to Computer Science",
      code: "CS101",
      professor: "Dr. Jane Doe",
      location: "Room 101"
    },
    {
      name: "Web Development",
      code: "CS201",
      professor: "Dr. John Smith",
      location: "Room 201"
    },
    {
      name: "Introduction to Computer Science",
      code: "CS101",
      professor: "Dr. Jane Doe",
      location: "Room 101"
    },
    {
      name: "Web Development",
      code: "CS201",
      professor: "Dr. John Smith",
      location: "Room 201"
    },
    {
      name: "Introduction to Computer Science",
      code: "CS101",
      professor: "Dr. Jane Doe",
      location: "Room 101"
    },
    {
      name: "Web Development",
      code: "CS201",
      professor: "Dr. John Smith",
      location: "Room 201"
    },
    {
      name: "Introduction to Computer Science",
      code: "CS101",
      professor: "Dr. Jane Doe",
      location: "Room 101"
    },
    {
      name: "Web Development",
      code: "CS201",
      professor: "Dr. John Smith",
      location: "Room 201"
    }
  ];
  const showCourses = req.query.showCourses === 'true';
  res.render('view_courses.ejs', { courses: courses, showCourses: showCourses });

}


const registeruser = async (req, res) => {
  const { username, email, age, institute, password, confirmedPassword } =
    req.body;
  if (password != confirmedPassword) {
    res.redirect("/register");
  }
  const hashPw = await bcrypt.hash(password, 12);
  const user = new User({
    username,
    email,
    password: hashPw,
    age,
    institute,
  });
  try {
    await user.save();
    res.redirect("/login");
  } catch (error) {
    console.log("Internal Error", error);
  }
};

const loginuser = async (req, res) => {
  try {
    const { username_email, password } = req.body;
    const foundUsername = await User.findOne({ username: username_email });
    const foundUseremail = await User.findOne({ email: username_email });
    const foundUser = foundUsername || foundUseremail;
    const isValid = await bcrypt.compare(password, foundUser.password);
    if (!isValid) {
      res.send("FAILED TO LOGIN!!");
    } else {
      req.session.user_id = foundUser._id;
      res.redirect("/");
    }
  } catch (error) {
    return res.status(404).send({
      data: {},
      success: false,
      error: "Internal Server Error",
    });
  }
};

const logoutUser = async (req, res) => {
  req.session.user_id = null;
  res.redirect("/login");
};

const requireLogin = (req, res, next) => {
  if (!req.session.user_id) {
    return res.redirect("/login");
  }
  next();
};

module.exports = {
  getHome,
  registeruser,
  loginuser,
  logoutUser,
  requireLogin,
  view_course,
};
