import mongoose from 'mongoose';

export interface IPlan {
  userId: typeof mongoose.Types.ObjectId;
  caloriesPerDay: number;
  planType: 'weekly' | 'monthly';
  createdAt?: Date;
}

const planSchema = new mongoose.Schema<IPlan>({
  userId: { type: mongoose.Types.ObjectId, ref: 'User' },
  caloriesPerDay: { type: Number },
  planType: { type: String, enum: ['weekly', 'monthly'] },
  createdAt: { type: Date, default: Date.now },
});

const Plans = mongoose.model<IPlan>('Plan', planSchema);

export default Plans;
