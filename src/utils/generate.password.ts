import * as crypto from 'crypto';

export default function generatePassword(): string {
  const length = 10;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
  let password = '';
  for (let i = 0; i < length; i++) {
    const at = Math.floor(Math.random() * charset.length);
    password += charset.charAt(at);
  }
  const encryptedPassword = crypto.createHash('sha256').update(password).digest('hex');
  return encryptedPassword;
}