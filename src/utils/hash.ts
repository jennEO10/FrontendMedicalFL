// src/utils/hash.ts
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export const hashPassword = async (plainPassword: string): Promise<string> => {
  return await bcrypt.hash(plainPassword, SALT_ROUNDS);
};

export const comparePassword = async (
  plainText: string,
  hash: string
): Promise<boolean> => {
  return await bcrypt.compare(plainText, hash);
};
