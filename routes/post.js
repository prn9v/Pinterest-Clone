const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    imageText: { 
        type: String,
        required: true 
    },
    image: {
      type: String
    },
    createdAt: { 
        type: Date, 
        default: Date.now() 
    },
    likes: { 
        type: Array, 
        default: [] 
    },
    userid:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    }
  },
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
