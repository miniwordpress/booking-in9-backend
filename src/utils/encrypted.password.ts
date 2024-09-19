import * as bcrypt from 'bcrypt';

export default function encryptedPassword(password: string): string {
  const encryptedPassword = bcrypt.hashSync(password, 10);
  return encryptedPassword;
}