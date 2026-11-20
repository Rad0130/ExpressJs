import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from 'jsonwebtoken';
import config from "../config";
import { pool } from "../db";
import type { role } from "../types";


const auth=(...roles:role[])=>{
    return async(req:Request,res:Response,next:NextFunction)=>{
        try {
            const token=req.headers.authorization as string;
            if(!token){
            res.status(500).json({
                    success:false,
                    message:"unauthorized access",
                }); 
            };

            const decode=jwt.verify(token, config.secret_key) as JwtPayload;
            console.log(decode);

            const user=await pool.query(`SELECT * FROM users WHERE email=$1`,[decode.email]);

            if(user.rowCount===0){
                res.status(404).json({
                    success:false,
                    message:"user not found"
                })
            };
            if(!user.rows[0].is_active){
                res.status(404).json({
                    success:false,
                    message:"user is not active"
                })
            }

            if(roles.length && !roles.includes(user.rows[0].role)){
                res.status(404).json({
                    success:false,
                    message:"Unauthorized Access"
                })
            }
            req.user=decode;
            next();
        } catch (error) {
            next(error);
        };
    };
};

export default auth;