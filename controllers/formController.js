const User = require('../models/userModel')

// Simple controller for saving user to database
exports.createUser = async (req, res) => {
    try {
        const newUser = new User({
            firstname : req.body.fname,
            lastname : req.body.lname,
            email : req.body.email,
            age : req.body.age,
            gender : req.body.gender,
            disability : req.body.disabilityOption,
            glasses : req.body.glassesOption,
            medicated : req.body.medicatedOption
           });

      await newUser.save();
      req.session.formSubmitted = true;
      res.redirect('/calibration');
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };