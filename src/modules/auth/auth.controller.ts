import type { Request, Response } from "express";
import { authService } from "./auth.service";
import sendResponse from "../../utils/sendResponse";

const userLogin=async(req:Request, res:Response)=>{
    try {
        const result=await authService.userLoginAuth(req.body);
        const {refreshToken}=result;
        res.cookie("refreshToken",refreshToken,{
            secure:false,
            httpOnly:true,
            sameSite:"lax",
            path:"/",
            domain:"localhost"
        })
        res.status(201).json({
            success:true,
            message:"user logged in successfully",
            data:result
        });
    } catch (error:any) {
        res.status(500).json({
            success:false,
            message:error?.message,
            error:error
        });
    }
};


const generateAccessToken=async(req:Request, res:Response)=>{
    try {
        const result=await authService.generateToken(req.cookies.refreshToken)
    
        sendResponse(res,{
            statusCode:201, 
            success:true, 
            message:"New AccessToken generated successfully",
            data:{accessToken:result}
        })
    } catch (error:any) {
        sendResponse(res,{
            statusCode:500, 
            success:false, 
            message:error?.message,
        })
    }
};

export const authController={userLogin,generateAccessToken};