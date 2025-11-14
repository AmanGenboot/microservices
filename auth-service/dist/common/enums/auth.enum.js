"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMessage = exports.AuthStatus = void 0;
var AuthStatus;
(function (AuthStatus) {
    AuthStatus["SUCCESS"] = "success";
    AuthStatus["ERROR"] = "error";
})(AuthStatus || (exports.AuthStatus = AuthStatus = {}));
var AuthMessage;
(function (AuthMessage) {
    AuthMessage["USER_REGISTERED"] = "User registered successfully";
    AuthMessage["INVALID_CREDENTIALS"] = "Invalid credentials";
    AuthMessage["USER_ALREADY_EXISTS"] = "User already exists";
    AuthMessage["USER_NOT_FOUND"] = "User not found";
    AuthMessage["LOGIN_SUCCESS"] = "Login successful";
    AuthMessage["OTP_SENT"] = "OTP sent to your email. Use OTP: 123456 for testing";
    AuthMessage["PASSWORD_RESET_SUCCESS"] = "Password reset successfully";
    AuthMessage["INVALID_OTP"] = "Invalid or expired OTP";
})(AuthMessage || (exports.AuthMessage = AuthMessage = {}));
//# sourceMappingURL=auth.enum.js.map