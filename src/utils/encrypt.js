import bcrypt from "bcrypt";

export const createHashValue = (val) => {
  const salt = bcrypt.genSaltSync();
  return bcrypt.hashSync(val, salt);
};

export const isValidPwd =  (pwd, encryptedPwd) => {
  const validValue = bcrypt.compareSync(pwd, encryptedPwd);
  return validValue;
};