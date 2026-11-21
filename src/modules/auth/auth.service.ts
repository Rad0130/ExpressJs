import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt, { type JwtPayload } from "jsonwebtoken";
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

    const accessToken=jwt.sign(jwtPayload, config.secret_key, {expiresIn:"1h"});

    const refreshToken=jwt.sign(jwtPayload, config.refresh_key, {expiresIn:"10d"});
    return {accessToken, refreshToken, user:user.rows[0]};
};


const generateToken=async(token:string)=>{
    if(!token){
        throw new Error("unauthorized Access!");
    };

    const decode=jwt.verify(token, config.refresh_key) as JwtPayload;
    console.log(decode);

    const user=await pool.query(`SELECT * FROM users WHERE email=$1`,[decode.email]);

    if(user.rowCount===0){
        throw new Error("user dosen't exist");
    };
    if(!user.rows[0].is_active){
        throw new Error("User is not active");
    }

    const jwtPayload={
        id:user.rows[0].id,
        name:user.rows[0].name,
        email:user.rows[0].email,
        role:user.rows[0].role
    }

    const accessToken=jwt.sign(jwtPayload, config.secret_key, {expiresIn:"1h"});
    return accessToken;


}

export const authService={userLoginAuth, generateToken};