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

const getAllUser=async(req:Request, res:Response)=>{
  try {
    const result=await userDB.getAllFromDB();
    res.status(200).json({
            success:true,
            message:"users retrieved successfully",
            data:result.rows
        });
  } catch (error:any) {
    res.status(500).json({
            success:false,
            message:error?.message,
            error:error
        });
  };
};


const getOneUser=async(req:Request, res:Response)=>{
  try {
    const {id}=req.params;
    const result=await userDB.getOneFromDB(id as string);
    if(result.rowCount==0){
      return res.status(404).json({
            success:false,
            message:"user dosen't exist",
        });
    }
    res.status(200).json({
            success:true,
            message:"user retrieved successfully",
            data:result.rows[0]
        });
  } catch (error:any) {
    res.status(500).json({
            success:false,
            message:error?.message,
            error:error
        });
  }
}

const updateUser=async(req:Request, res:Response)=>{
  try {
    const {id}=req.params;
    const result=await userDB.updateDB(req.body,id as string);

    if(result.rowCount===0){
      res.status(404).json({
            success:false,
            message:"user dosen't exist",
        });
    }
    res.status(200).json({
            success:true,
            message:"user updated successfully",
            data:result.rows[0]
        });
  } catch (error:any) {
    res.status(500).json({
            success:false,
            message:error?.message,
            error:error
        });
  }
}


const deleteUser=async(req:Request, res:Response)=>{
  try {
    const {id}=req.params;
    const result=await userDB.deleteFromDB(id as string);
    if(result.rowCount!=0){
      res.status(200).json({
            success:true,
            message:"user deleted successfully",
        });
    }
    else{
      res.status(404).json({
            success:false,
            message:"user dosen't exist",
        });
    }
  } catch (error:any) {
    res.status(500).json({
            success:false,
            message:error?.message,
            error:error
        });
  }
}

export const userController={createUser,getAllUser,getOneUser,updateUser,deleteUser};