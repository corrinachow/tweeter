"use strict";

const userHelper = require("../lib/util/user-helper");

const express = require("express");
const tweetsRoutes = express.Router();
const bcrypt = require("bcrypt");

module.exports = function(DataHelpers) {
  /**
   * ------------------------------------------------------------------------
   * GETS EXISTING TWEETS
   * ------------------------------------------------------------------------
   */

  tweetsRoutes.get("/", function(req, res) {
    DataHelpers.getTweets((err, tweets) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(tweets);
      }
    });
  });

  /**
   * ------------------------------------------------------------------------
   * HANDLES TWEET SUBMISSION
   * ------------------------------------------------------------------------
   */

  tweetsRoutes.post("/", function(req, res) {
    if (!req.body.text) {
      res.status(400).json({ error: "invalid request: no data in POST body" });
      return;
    }

    const user = req.body.user
      ? req.body.user
      : userHelper.generateRandomUser();

    const tweet = {
      user: user,
      content: {
        text: req.body.text
      },
      created_at: Date.now(),
      likes: 0,
      like: false
    };
    DataHelpers.saveTweet(tweet, err => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).redirect("/tweets");
      }
    });
  });

  /**
   * ------------------------------------------------------------------------
   * USER REGISTRATION
   * ------------------------------------------------------------------------
   */

  function generateRandomStr() {
    return Math.random()
      .toString(36)
      .substring(6);
  }

  function validateEmail(email) {
    const re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return re.test(email.toLowerCase());
  }

  tweetsRoutes.post("/register", function(req, res) {
    const { email, password } = req.body;
    console.log(email, password);

    // Checks for email and password
    if (!email || !password) {
      return res.status(400).send("<h1>Invalid email or password</h1>");

      // Checks if email is already used in database
      // } else if (DataHelpers.getUser(email)) {
      //   return res.status(400).send("<h1>Email already in use</h1>");

      //   // Checks for a valid email
      // } else if (!validateEmail(email)) {
      //   return res.status(400).send("<h1>Please enter a valid email</h1>");

      // Populates new user schema
    } else {
      const userSchema = {
        id: generateRandomStr(),
        email: email,
        password: bcrypt.hashSync(password, 10)
      };
      console.log(userSchema);

      DataHelpers.userRegistration(userSchema, (err, data) => {
        if (err) {
          console.log(err);
          return res.send(err);
        } else {
          req.session.user_id = userSchema.id;
        }
      });
    }
    res.status(201).redirect("/");
  });

  /**
   * ------------------------------------------------------------------------
   * LOGIN FORM
   * ------------------------------------------------------------------------
   */

  tweetsRoutes.post("/login", function(req, res) {
    const { email, password } = req.body;
    console.log(email,password)

    DataHelpers.getUser(email, (err, data) => {
      if (err) {
        return res.send(err);
      } else {
        if (bcrypt.compareSync(password, data[0].password)) {
          req.session.user_id = data[0].id;
          return res.status(201).redirect("/");
        }
      }
    });
  });

  /**
   * ------------------------------------------------------------------------
   * USER LOGOUT
   * ------------------------------------------------------------------------
   */

  tweetsRoutes.post("/logout", (req, res) => {
    req.session = null;
    return res.redirect("/");
  });

  /**
   * ------------------------------------------------------------------------
   * HANDLE LIKES
   * Must put after /register and /login
   * ------------------------------------------------------------------------
   */

  tweetsRoutes.post("/:id", function(req, res) {
    DataHelpers.handleLike(req.params.id, (err, data) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).send(data);
      }
    });
  });

  return tweetsRoutes;
};
