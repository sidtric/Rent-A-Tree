import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import User from '../models/User';
import Otp from '../models/Otp';

const signToken = (id: string) =>
  jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: '7d' });

const sendSms = async (phone: string, otp: string): Promise<void> => {
  const key = process.env.MSG91_API_KEY;
  if (!key) {
    process.stdout.write(`[OTP] ${phone} → ${otp}\n`);
    return;
  }
  await axios.post(
    'https://control.msg91.com/api/v5/otp',
    { template_id: process.env.MSG91_TEMPLATE_ID, mobile: `91${phone}`, otp },
    { headers: { authkey: key, 'Content-Type': 'application/json' } }
  );
};

export const sendOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone } = req.body;
    if (!phone || !/^\d{10}$/.test(phone)) {
      res.status(400).json({ message: 'Valid 10-digit phone number required' }); return;
    }
    const otp    = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);
    await Otp.findOneAndUpdate({ phone }, { otp, expiry }, { upsert: true, new: true });
    await sendSms(phone, otp);
    res.json({ message: 'OTP sent' });
  } catch {
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone, otp, name } = req.body;
    if (!phone || !otp) { res.status(400).json({ message: 'Phone and OTP required' }); return; }
<<<<<<< HEAD

=======
>>>>>>> fe78ba1bccf9cc1665cdae4b53af6774281e64fb
    const record = await Otp.findOne({ phone });
    if (!record || record.otp !== otp || record.expiry < new Date()) {
      res.status(401).json({ message: 'Invalid or expired OTP' }); return;
    }
<<<<<<< HEAD

    await Otp.deleteOne({ phone });

=======
    await Otp.deleteOne({ phone });
>>>>>>> fe78ba1bccf9cc1665cdae4b53af6774281e64fb
    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({ phone, name: name || undefined });
    } else if (name && !user.name) {
<<<<<<< HEAD
      user.name = name;
      await user.save();
    }

=======
      user.name = name; await user.save();
    }
>>>>>>> fe78ba1bccf9cc1665cdae4b53af6774281e64fb
    res.json({ token: signToken(user.id), user: { id: user.id, name: user.name, phone: user.phone } });
  } catch {
    res.status(500).json({ message: 'Verification failed' });
  }
};

export const getMe = async (req: Request & { userId?: string }, res: Response): Promise<void> => {
  try {
<<<<<<< HEAD
    const user = await User.findById(req.userId).select('-otp -otpExpiry');
=======
    const user = await User.findById(req.userId);
>>>>>>> fe78ba1bccf9cc1665cdae4b53af6774281e64fb
    res.json(user);
  } catch {
    res.status(500).json({ message: 'Failed to fetch user' });
  }
};
