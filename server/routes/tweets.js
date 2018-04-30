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
    } else if (!req.session.user_id) {
      return res.status(400).send("Must be logged in to make a Tweet");
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
        return res.status(500).json({ error: err.message });
      } else {
        return res.status(201).redirect("/tweets");
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

    DataHelpers.getUser(email, (err, data) => {
      // If no matches are found, continue with registration
      if (data.length === 0) {
        const userSchema = {
          id: generateRandomStr(),
          email: email,
          password: bcrypt.hashSync(password, 10)
        };

        // Adds userSchema to database
        DataHelpers.userRegistration(userSchema, (err, data) => {
          if (err) {
            return res.send(err);
          } else {
            // Sets cookie for session
            req.session.user_id = userSchema.id;
          }
          return res.status(201).redirect("/");
        });
        // Throws error for using existing email
      } else if (data[0].email === email) {
        return res.send("Email already in use");
      }
    });
  });

  /**
   * ------------------------------------------------------------------------
   * LOGIN FORM
   * ------------------------------------------------------------------------
   */

  tweetsRoutes.post("/login", function(req, res) {
    const { email, password } = req.body;

    // Retrieves user from database
    DataHelpers.getUser(email, (err, data) => {
      if (err) {
        return res.send(err);
      } else {
        // If password matches, sets cookie
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
