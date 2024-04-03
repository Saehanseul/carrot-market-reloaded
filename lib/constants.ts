export const PASSWORD_MIN_LENGTH = 4;
export const PASSWORD_REGEX = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).+$/
);
export const SMS_TOKEN_MIN = 100000;
export const SMS_TOKEN_MAX = 999999;

export const PASSWORD_REGEX_ERROR =
  "비밀번호는 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.";
export const PASSWORD_MIN_LENGTH_ERROR = `비밀번호는 ${PASSWORD_MIN_LENGTH}자 이상이어야 합니다.`;
export const EMAIL_ERROR = "이메일 형식에 맞지 않습니다.";
export const USERNAME_ERROR = "이름은 공백을 포함할 수 없습니다.";
export const PASSWORD_CONFIRM_ERROR = "비밀번호가 일치하지 않습니다.";
export const PHONE_ERROR = "전화번호 형식에 맞지 않습니다.";
