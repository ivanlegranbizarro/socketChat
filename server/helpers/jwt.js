import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const signToken = ( id ) => {
  return jwt.sign( { id }, process.env.JWT_SECRET, {
    expiresIn: 3600
  } );
};

export default signToken;
