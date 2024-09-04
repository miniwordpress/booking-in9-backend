export default function generatePassword(): string {
  const length = 10;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    const at = Math.floor(Math.random() * charset.length);
    password += charset.charAt(at);
  }
  //TODO: encrypt password with sha256
  return password;
}