import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt from "jsonwebtoken";
import config from "../../config";
import type { Iauth } from "./auth.interface";

const userLoginAuth=async(payload:Iauth)=>{
    const {email,password}=payload;
    const user=await pool.query(`SELECT * FROM users WHERE email=$1`,[email]);
    if(user.rowCount===0){
        throw new Error("Invalid Credentials");
    }
    const matchPassword=await bcrypt.compare(password,user.rows[0].password);
    if(!matchPassword){
        throw new Error("Invalid Credentials");
    }

    const jwtPayload={
        id:user.rows[0].id,
        name:user.rows[0].name,
        email:user.rows[0].email,
        role:user.rows[0].role
    }

    const accessToken=jwt.sign(jwtPayload, config.secret_key, {expiresIn:"1d"});
    return {accessToken, user:user.rows[0]};
};

export const authService={userLoginAuth};