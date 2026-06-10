import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { config } from "../../config";
import type { IUser } from "./auth.interface";

const userRegisterIntoDB = async (payload: IUser) => {
  const { name, email, password, role } = payload;
  const hashPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `
    INSERT INTO users (name,
      email,
      password,
      role) VALUES ($1,$2,$3,COALESCE($4, 'contributor')) RETURNING *
    `,
    [name, email, hashPassword, role],
  );
  delete result.rows[0].password;
  return result;
};

const loginUserIntoDB = async (payload: {
  email: string;
  password: string;
}) => {
  const { email, password } = payload;
  const userData = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  const user = userData.rows[0];

  if (!user) {
    throw new Error("User Not Found!");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid Password!");
  }

  // * JWT Payload
  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  // * Generate Token
  const accessToken = jwt.sign(
    jwtPayload as JwtPayload,
    config.accessSecret as string,
    {
      expiresIn: "15d",
    },
  );

  const { password: _, ...remainingUserData } = user;
  return {
    data: { token: accessToken, ...remainingUserData },
  };
};

export const authService = {
  userRegisterIntoDB,
  loginUserIntoDB,
};
