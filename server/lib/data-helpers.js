"use strict";

// Simulates the kind of delay we see with network or filesystem operations
const simulateDelay = require("./util/simulate-delay");
const ObjectId = require("mongodb").ObjectID;

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db) {
  return {
    // Saves a tweet to `db`
    saveTweet: function(newTweet, callback) {
      simulateDelay(() => {
        db.collection("tweets").insert(newTweet, callback);
      });
    },

    // Get all tweets in `db`, sorted by newest first
    getTweets: function(callback) {
      simulateDelay(() => {
        db
          .collection("tweets")
          .find()
          .sort({ created_at: -1 })
          .toArray(callback);
      });
    },

    // Liking Tweets
    likeTweet: function(tweetID, callback) {
      console.log("inside likeTweet");
      console.log(`About to search for ${tweetID}`);
      db
        .collection("tweets")
        .update(
          { _id: ObjectId(tweetID) },
          { $inc: { likes: 1 } },
          { like: true }
        );
      db
        .collection("tweets")
        .find({ _id: ObjectId(tweetID) }, { likes: 1 })
        .toArray(callback);
    }
  };
};
