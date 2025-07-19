import { Response } from 'express';
import { ProtectedRequest } from '../../types/request';
import AppError from '../../utils/appError';
import Plans from '../../models/Plans';
import catchAsync from '../../utils/catchAsync';
import Users from '../../models/Users';
import mongoose from 'mongoose';
import BMI from '../../models/BmiLog';

function getCaloriePlan(
  bmi: string | number,
  goal: string | number,
  planType: string,
): { calories: number; planType: string } | { error: string } {
  const bmiValue = +bmi;
  const type = planType?.toLowerCase();

  if (bmiValue < 18.5) {
    if (goal === 'weight gain') {
      return type === 'daily'
        ? { calories: 2500, planType: 'daily' }
        : { calories: 2700, planType: 'weekly' };
    }
    if (goal === 'maintenance') {
      return type === 'daily'
        ? { calories: 2200, planType: 'daily' }
        : { calories: 2400, planType: 'weekly' };
    }
    return { error: 'Weight loss not advised for underweight users' };
  }

  if (bmiValue >= 18.5 && bmiValue <= 24.9) {
    if (goal === 'weight loss') {
      return type === 'daily'
        ? { calories: 1700, planType: 'daily' }
        : { calories: 1800, planType: 'weekly' };
    }
    if (goal === 'maintenance') {
      return type === 'daily'
        ? { calories: 2100, planType: 'daily' }
        : { calories: 2200, planType: 'weekly' };
    }
    if (goal === 'weight gain') {
      return type === 'daily'
        ? { calories: 2400, planType: 'daily' }
        : { calories: 2500, planType: 'weekly' };
    }
  }

  if (bmiValue >= 25 && bmiValue < 30) {
    if (goal === 'weight loss') {
      return type === 'daily'
        ? { calories: 1500, planType: 'daily' }
        : { calories: 1600, planType: 'weekly' };
    }
    if (goal === 'maintenance') {
      return type === 'daily'
        ? { calories: 1900, planType: 'daily' }
        : { calories: 2000, planType: 'weekly' };
    }
    return { error: 'Weight gain not recommended for overweight users' };
  }

  if (bmiValue >= 30) {
    if (goal === 'weight loss') {
      return type === 'daily'
        ? { calories: 1300, planType: 'daily' }
        : { calories: 1400, planType: 'weekly' };
    }
    if (goal === 'maintenance') {
      return type === 'daily'
        ? { calories: 1700, planType: 'daily' }
        : { calories: 1800, planType: 'weekly' };
    }
    return { error: 'Weight gain not recommended for obese users' };
  }

  return { error: 'Invalid BMI or goal' };
}

async function createBMILog(body: {
  height: number;
  weight: number;
  bmi: number;
  userId: typeof mongoose.Types.ObjectId;
}) {
  BMI.create(body);
}

export const genratePlan = catchAsync(
  async (req: ProtectedRequest, res: Response) => {
    const user = req.user;

    const { weight, height, preference, goal, bmi, planType } = req.body;

    const genratedCalorie = getCaloriePlan(bmi, goal, planType);

    if ('error' in genratedCalorie) {
      throw new AppError(genratedCalorie.error, 400);
    }

    const createdPlan = await Plans.create({
      userId: user._id,
      caloriesPerDay: genratedCalorie.calories,
      planType: planType,
    });

    const registerPlan = await Users.findByIdAndUpdate(
      user._id,
      {
        height: +height,
        weight: +weight,
        bmi: +bmi,
        activePlan: createdPlan._id,
        goal: goal,
        preference: preference,
      },
      { new: true },
    );

    createBMILog({
      height,
      weight,
      userId: user._id,
      bmi: bmi,
    });

    res.status(201).json({
      status: 'success',
      message: 'Plan Genrated...',
      data: {
        height: +height,
        weight: +weight,
        bmi: +bmi,
        activePlan: createdPlan._id,
        goal: goal,
        preference: preference,
        planType: planType,
        caloriesPerDay: genratedCalorie.calories,
        planId: registerPlan!._id,
      },
    });
  },
);

export const getMyPlan = catchAsync(
  async (req: ProtectedRequest, res: Response) => {
    const user = req.user._id;

    const myplan = await Plans.findOne({
      userId: user,
    });

    res.status(200).json({
      status: 'success',
      data: myplan,
    });
  },
);

export const updateMyPlan = catchAsync(
  async (req: ProtectedRequest, res: Response) => {
    const user = req.user;

    const { weight, height, preference, goal, bmi, planType } = req.body;

    const genratedCalorie = getCaloriePlan(bmi, goal, planType);

    if ('error' in genratedCalorie) {
      throw new AppError(genratedCalorie.error, 400);
    }

    const updatedPlan = await Plans.findOneAndUpdate(
      {
        userId: user._id,
      },
      {
        userId: user._id,
        caloriesPerDay: genratedCalorie.calories,
        planType: planType,
      },
      {
        new: true,
      },
    );

    const registerPlan = await Users.findByIdAndUpdate(
      user._id,
      {
        height: +height,
        weight: +weight,
        bmi: +bmi,
        activePlan: updatedPlan!._id,
        goal: goal,
        preference: preference,
      },
      { new: true },
    );

    createBMILog({
      height,
      weight,
      userId: user._id,
      bmi: bmi,
    });

    res.status(201).json({
      status: 'success',
      message: 'Plan Updated...',
      data: {
        height: +height,
        weight: +weight,
        bmi: +bmi,
        activePlan: updatedPlan!._id,
        goal: goal,
        preference: preference,
        planType: planType,
        caloriesPerDay: genratedCalorie.calories,
        planId: registerPlan!._id,
      },
    });
  },
);
