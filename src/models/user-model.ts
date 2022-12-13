import mongoose, { Schema } from 'mongoose';

const UserSchema: Schema = new Schema(
  {
    name: { type: 'String', required: true },
    email: { type: 'String', unique: true, required: true },
    password: { type: 'String', required: true },
    profilePhoto: {
      type: 'String',
      default:
        'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model('User', UserSchema);
