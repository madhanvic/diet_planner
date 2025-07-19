import mongoose from 'mongoose';

const bmiSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  height: Number,
  weight: Number,
  bmi: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const BMI = mongoose.model('BMI', bmiSchema);

export default BMI;
