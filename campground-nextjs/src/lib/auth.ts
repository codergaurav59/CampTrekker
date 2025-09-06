import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import User from '@/models/User';
import dbConnect from './mongodb';

const JWT_SECRET = process.env.JWT_SECRET!;

export interface AuthUser {
  id: string;
  username: string;
  email: string;
}

export function generateToken(user: AuthUser): string {
  return jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): AuthUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthUser;
  } catch {
    return null;
  }
}

export async function getAuthUser(request: NextRequest): Promise<AuthUser | null> {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return null;
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return null;
    }

    await dbConnect();
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return null;
    }

    return {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
    };
  } catch {
    return null;
  }
}