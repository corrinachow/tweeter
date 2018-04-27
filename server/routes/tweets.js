"use strict";

const userHelper = require("../lib/util/user-helper");

const express = require("express");
const tweetsRoutes = express.Router();
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
 * HANDLES LIKES
 * ------------------------------------------------------------------------
 */

  tweetsRoutes.post("/:id", function(req, res) {
    console.log(req.params.id);
    DataHelpers.handleLike(req.params.id, (err, data) => {
      console.log(data)
      if (err) {
        res.status(500).json({error: err.message});
      } else {
        res.status(201).send(data);
      }
    })

  })

  return tweetsRoutes;
};
