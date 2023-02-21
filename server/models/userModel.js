import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';


const userSchema = new mongoose.Schema( {
  name: {
    type: String,
    required: [ true, 'Username is required' ],
    validate: [ validator.isLength, { min: 3, max: 12, message: 'Username must be between 3 and 12 characters' } ]
  },
  email: {
    type: String,
    required: [ true, 'Email is required' ],
    lowercase: true,
    validate: [
      validator.isEmail, 'Please provide a valid email',
      validator.isUnique, 'Email already exists'
    ]
  },
  password: {
    type: String,
    required: [ true, 'Password is required' ],
    validate: [ validator.isLength, { min: 6, max: 12, message: 'Password must be between 6 and 12 characters' } ]
  },
  passwordConfirmation: {
    type: String,
    required: [ true, 'Password confirmation is required' ],
    validate: {
      validator: function ( el ) {
        return el === this.password;
      }
    }
  }
},
  {
    timestamps: true
  }
);



userSchema.pre( 'save', async function ( next ) {
  this.password = await bcrypt.hash( this.password, 12 );
  this.passwordConfirmation = undefined;
  next();
} );

userSchema.methods.correctPassword = async function ( candidatePassword, userPassword ) {
  return await bcrypt.compare( candidatePassword, userPassword );
};

const User = mongoose.model( 'User', userSchema );


export default User;
