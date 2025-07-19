import mongoose, { Schema } from 'mongoose';

export interface IUser {
  email: string;
  name: string;
  password: string;
  age: string;
  gender: 'male' | 'female' | 'others';
  weight?: number;
  height?: number;
  bmi?: number;
  preference?: string;
  goal?: string;
  isActive?: boolean;
  activePlan: typeof mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  age: { type: String, required: true },
  weight: { type: Number, default: null },
  height: { type: Number, default: null },
  bmi: { type: Number, default: null },
  activePlan: { type: mongoose.Types.ObjectId, ref: 'Plan', default: null },
  preference: {
    type: String,
    enum: ['vegetarian', 'non-vegetarian', 'vegan'],
    default: null,
  },
  goal: {
    type: String,
    enum: ['weight loss', 'weight gain', 'maintaince'],
    default: null,
  },
  password: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female'] },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date },
  updatedAt: { type: Date, default: null },
});

const Users = mongoose.model<IUser>('User', userSchema);

export default Users;
