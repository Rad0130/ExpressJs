import type { Request, Response } from "express";
import { userDB } from "./user.service";

const createUser=async (req:Request, res:Response)=>{
    try {
      const result=await userDB.userInsertIntoDB(req.body);

      res.status(200).json({
            success:true,
            message:"user is registered successfully",
            data:result.rows[0]
        });
    } catch (error:any) {
      res.status(500).json({
            success:false,
            message:error?.message,
            error:error
        });
    };
};

export const userController={createUser};