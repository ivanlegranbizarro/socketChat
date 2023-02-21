import User from '../models/userModel.js';
import signToken from '../helpers/jwt.js';


const userControllers = {
  register: async ( req, res ) => {
    const { name, email, password, passwordConfirmation } = req.body;

    try {
      const user = await User.create( { name, email, password, passwordConfirmation } );

      const token = signToken( user._id );

      res.status( 201 ).json( {
        success: true,
        data: {
          user,
          token,
          message: 'User created'
        }
      } );
    } catch ( err ) {
      res.status( 400 ).json( {
        success: false,
        message: err.message
      } );
    }
  },

  login: async ( req, res ) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne( { email } );

      if ( !user ) {
        return res.status( 404 ).json( {
          success: false,
          message: 'User not found'
        } );
      }

      const isCorrect = await user.correctPassword( password, user.password );

      if ( !isCorrect ) {
        return res.status( 400 ).json( {
          success: false,
          message: 'Incorrect password'
        } );
      }

      const token = signToken( user._id );

      res.status( 200 ).json( {
        success: true,
        data: {
          user,
          token,
          message: 'User logged in'
        }
      } );

    } catch ( err ) {
      res.status( 400 ).json( {
        success: false,
        message: err.message
      } );
    }
  },

  getCurrentUser: async ( req, res ) => {
    try {
      const user = await User.findById( req.user.id );

      res.status( 200 ).json( {
        success: true,
        data: {
          user,
          message: 'User retrieved'
        }
      } );
    } catch ( err ) {
      res.status( 400 ).json( {
        success: false,
        message: err.message
      } );
    }
  }
};


export default userControllers;
