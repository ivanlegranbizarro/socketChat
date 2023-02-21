import mongoose from "mongoose";
import validator from "validator";

const roomSchema = new mongoose.Schema( {
  name: {
    type: String,
    required: true,
    unique: true,
    validator: value => {
      return validator.isLength( value, { min: 3, max: 10 } );
    },
  },
  messages: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      message: {
        type: String,
        required: true,
        validator: value => {
          return validator.isLength( value, { min: 1 } );
        }
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
