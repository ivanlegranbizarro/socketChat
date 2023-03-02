import mongoose from 'mongoose';
import bcrypt from 'bcrypt';


const userSchema = new mongoose.Schema( {
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  passwordConfirmation: {
    type: String,
    required: true
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
