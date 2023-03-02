import mongoose from "mongoose";

const roomSchema = new mongoose.Schema( {
  name: {
    type: String,
    required: true,
    unique: true,
  },
  messages: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      name: {
        type: String,
      },
      message: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
    }
  ]
} );




const Room = mongoose.model( "Room", roomSchema );

export default Room;
