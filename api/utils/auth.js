const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
// const User = mongoose.model("User");
const User = require("../model/user.model");
//hash user password
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/key");
const passport = require("passport");
// router.get('/', (req, res) => {
//     res.send("hello")
// })

// router.get("/protected", requireLogin, (req, res) => {
//   res.send("Hello");
// });

router.post("/register", (req, res) => {
  User.register(
    new User({ email: req.body.email, username: req.body.username }),
    req.body.password,
    function (err, user) {
      if (err) {
        return res.json({
          success: false,
          message: "Your account could not be saved. Error: " + err,
        });
      } else {
        req.login(user, (er) => {
          if (er) {
            return res.json({ success: false, message: er });
          } else {
            return res.json({
              success: true,
              message: "Your account has been saved",
            });
          }
        });
      }
    }
  );

  const { email } = req.body;
  const user = new User({
    email,
  });
  //Save the user to database
  user.save().then((user) => {
    res.json({ message: "saved successfully" });
  });
});
// .catch((err) => {
//   console.log(err);
// });

router.post("/login", async (req, res) => {
  // const email = req.body.email;
  // if (!email) {
  //   res.json({ success: false, message: "Email was not given" });
  // } else {
  //   // passport.authenticate("local", async function (err, user, info) {
  //   await User.findOne({ email: email })
  //     .exec()
  //     .then(async (savedUser) => {
  //       console.log(req.body.email);
  //       console.log(savedUser);
  //       console.log(await User.findOne({ email: email }).exec());
  //       if (!savedUser) {
  //         return res
  //           .status(200)
  //           .json({
  //             msg: "Invaild Email or password",
  //             code: 400,
  //             data: savedUser,
  //           });
  //       }
  //       const accessToken = jwt.sign({ email: email }, JWT_SECRET);
  //       res.status(200).json({
  //         msg: "Login successfully",
  //         code: 200,
  //         accessToken,
  //         data: savedUser,
  //       });
  //     });

      const email = req.query.email;
    console.log(req.query.email);
    console.log(email);
   const user = await User.findOne({email: email}).exec()
    console.log(user);
    if (!user) {
      return res.status(200).json({ msg: "failed", code: 400 });
    }
    return res.status(200).json({
     msg: "success",
      code: 200,
      data: user
   });
  })


  // const { email, password } = req.body;
  // if (!email) {
  //   res.status(200).json({ msg: "please add email or password", code: 400 });
  // }
  // User.findOne({ email: email }).then((savedUser) => {
  //   if (!savedUser) {
  //     res.status(200).json({ msg: "Invaild Email or password", code: 400 });
  //   }
  //   if (email === savedUser.email) {
  //     // res.json({ message: "successfully signed, welcome " + savedUser.name + "!" })
  //     const accessToken = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
  //     res
  //       .status(200)
  //       .set({
  //         Authorization: "Bearer " + accessToken,
  //       })
  //       .json({
  //         msg: "Login successfully",
  //         code: 200,
  //         accessToken,
  //         data: savedUser,
  //       });
  //   } else {
  //     res.status(400).json({ error: "Invaild Email or password" });
  //   }
  // });


module.exports = router;
