import { RequestHandler } from 'express';
import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import totalCountSlots from './utils/totalCountSlots';
import { existService, slotsCreate } from './slot.service';
import slotValidation from './slot.validation';

export const createSlots: RequestHandler = async (req, res, next) => {
  const data = await req.body;

  const isValidData = await slotValidation.parseAsync(data);
  if (!isValidData) {
    return next(new AppError('zod validation error', 400));
  }

  const { service: serviceId, date, startTime, endTime } = isValidData;

  const isValidId = mongoose.Types.ObjectId.isValid(serviceId);

  if (!isValidId) {
    return next(new AppError('invalid objectid', 400));
  }

  const isServiceExist = await existService(serviceId);
  if (!isServiceExist) {
    return next(new AppError('resource not found', 404));
  }

  const serviceDuration = isServiceExist?.duration;

  const totalSlots: any = await totalCountSlots(
    serviceId,
    serviceDuration,
    date,
    startTime,
    endTime
  );
  if (!totalSlots) {
    return next(new AppError('bad gateway', 502));
  }

  const result = await slotsCreate(totalSlots);
  if (!result) {
    return next(new AppError('data created unsuccessful', 500));
  }

  res.status(201).json({
    status: 'true',
    statusCode: 200,
    message: 'Slots created successfully',
    data: result
  });
};
