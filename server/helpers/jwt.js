import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const signToken = ( id, username ) => {
  return jwt.sign( { user: { id, username } }, process.env.JWT_SECRET, {
    expiresIn: 3600
  } );
};

export default signToken;
