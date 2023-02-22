import Room from "../models/roomModel.js";

const getRooms = async ( req, res ) => {
  try {
    const rooms = await Room.find();
    res.status( 200 ).json( rooms );
  } catch ( error ) {
    res.status( 404 ).json( { message: error.message } );
  }
};

export default getRooms;
