const userModel = require('../models/userModel');
const User = require('../models/userModel')
const path = require('path');
const bcrypt = require("bcryptjs")

// Simple controller for saving user to database
exports.createUser = async (req, res) => {
    try {
        const newUser = new User({
            firstname : req.body.fname,
            lastname : req.body.lname,
            email : req.body.email,
            password : await bcrypt.hash(req.body.password, 8),
            age : req.body.age,
            gender : req.body.gender,
            disability : req.body.disabilityOption,
            glasses : req.body.glassesOption,
            medicated : req.body.medicatedOption
           });

      await newUser.save();
      await res.redirect('/');
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  exports.validateUser = async (req, res) => {
    try {
     const user = await userModel.findOne({email : req.body.email})
  
    if(user != null) {
      bcrypt.compare(req.body.password, user.password, function(err, result) {
        if (err) {
          res.status(400).json({ error: err.message });
        }

        if (result) {
          req.session.logged_in = true;
          req.session.email = req.body.email;
          req.session.id
          res.redirect("/calibration")
        } else {
         res.status(200).json({success: false, message: 'passwords do not match'});
        }
      })
     } else {
      res.status(401).json({
        message: "Login not successful",
        error: "User not found"
      })
      }
     } catch (err) {
      res.status(400).json({ error: err.message });
     } 
};
  