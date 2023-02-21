import mongoose from "mongoose";
import validator from "validator";

const chatSchema = new mongoose.Schema(
  {
    messages: [
      {
        message: {
          type: String,
          required: true,
          validate: [ validator.isLength, { min: 1, max: 100 } ],
        },
      }
    ],
    room: {
      type: String,
      required: true,
      validate: [ validator.isLength, { min: 3, max: 10 } ],
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model( "Chat", chatSchema );

export default Chat;
