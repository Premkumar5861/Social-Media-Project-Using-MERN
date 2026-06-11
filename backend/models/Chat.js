const mongoos = require("mongoose");

const chatSchema = mongoos.Schema({
  users: [
    {
      type: mongoos.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  messages: [
    {
      sender: {
        type: mongoos.Schema.Types.ObjectId,
        ref: "User",
      },
      content: {
        type: String,
        required: true,
      },
      timestamp:{
        type: Date,
      default: Date.now,
      }
    },
  ],
},
{
    timestamp:true
}

);


const Chat = mongoos.model('Chat',chatSchema);
module.exports = Chat

