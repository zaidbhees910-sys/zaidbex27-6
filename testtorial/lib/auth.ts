// lib/auth.ts
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'my-secret-key-change-this';

export async function verifyAdmin(username: string, password: string) {
  const admin = await prisma.admin.findUnique({
    where: { username },
  });
  
  if (!admin) return false;
  return password === admin.password;
}

export function generateToken(adminId: number) {
  return jwt.sign({ adminId, role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}