export enum AuthStatus {
  SUCCESS = 'success',
  ERROR = 'error',
}

export enum AuthMessage {
  USER_REGISTERED = 'User registered successfully',
  INVALID_CREDENTIALS = 'Invalid credentials',
  USER_ALREADY_EXISTS = 'User already exists',
  USER_NOT_FOUND = 'User not found',
  LOGIN_SUCCESS = 'Login successful',
  OTP_SENT = 'OTP sent to your email. Use OTP: 123456 for testing',
  PASSWORD_RESET_SUCCESS = 'Password reset successfully',
  INVALID_OTP = 'Invalid or expired OTP',
}
