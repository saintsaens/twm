import bcrypt from 'bcrypt';
import * as authRepository from '../repositories/authRepository.js';
import { HTTP_ERRORS } from "../controllers/errors.js";

const saltRounds = 10;

export const verifyUserCredentials = async (username, password) => {
    const user = await authRepository.findUserByUsername(username);
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.hashed_pw);
    return isMatch ? user : null;
};

export const registerUser = async (username, password) => {
    const existingUser = await authRepository.findUserByUsername(username);
    if (existingUser) throw new Error(HTTP_ERRORS.USERNAME_EXISTS);

    const hashedPw = await bcrypt.hash(password, saltRounds);
    return await authRepository.createUser(username, hashedPw);
};
