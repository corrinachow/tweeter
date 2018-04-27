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

    handleLike: function(tweetID, callback) {
      db
        .collection("tweets")
        .find({ _id: ObjectId(tweetID) })
        .toArray()
        .then(tweetEntry => {
          console.log(tweetEntry[0].like);
          // if like === 1 (true)
          if (tweetEntry[0].like ) {
            console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
            console.log("tweet being UNLIKED");
            console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
            db.collection("tweets").update(
              { _id: ObjectId(tweetID) },

              // Set like == 0 (false) and dec. likes by 1
              {
                $set: { like: 0 },
                $inc: { likes: -1 }
              },
            );
          } else {
            console.log("tweet being LIKED");
            db.collection("tweets").update(
              { _id: ObjectId(tweetID) },

              // Set like == 1 (true) and inc. likes by 1
              {
                $set: { like: 1 },
                $inc: { likes: 1 }
              }
            );
          }
        }).then(
        db
        .collection("tweets")
        .find({ _id: ObjectId(tweetID) }, { likes: 1 })
        .toArray(callback)
        )
    }
  };
};
