const mongoose = require('mongoose')
const plm = require('passport-local-mongoose')

mongoose.connect('mongodb+srv://pranavdeshmukh5454:JGjl6sJivT6c4xjz@pinterest-clone.rjalz.mongodb.net/');

const userSchema = new mongoose.Schema({
  username: {
     type: String, 
     required: true, 
     unique: true 
    },

  password: {
    type: String,
  },

  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],

  dp: {
    type: String,
  },

  email: {
    type: String, 
    required: true, 
    unique: true 
  },

  fullname: {
    type: String,
    required: true,
  },

  bio: {
    type: String
  }
});

userSchema.plugin(plm);

module.exports = mongoose.model('User', userSchema);

