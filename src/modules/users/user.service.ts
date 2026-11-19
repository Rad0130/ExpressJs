import bcrypt from "bcryptjs";
import { pool } from "../../db";
import type { Iuser } from "./user.interface";


const userInsertIntoDB=async(payload:Iuser)=>{
    const {name, email, age, password}=payload;
    const hashPassword=await bcrypt.hash(password,10);
    const result=await pool.query(`
        INSERT INTO users(name, email, age, password) VALUES ($1,$2,$3,$4) RETURNING *
        `, [name, email, age, hashPassword]);
    delete(result.rows[0].password);
    return result
}

const getAllFromDB=async()=>{
    const result=await pool.query(`SELECT * FROM users`);
    return result;
}

const getOneFromDB=async(id:string)=>{
    const result=await pool.query(`SELECT * FROM users WHERE id=${id}`);
    return result;
}

const updateDB=async(payload:Iuser,id:string)=>{
    const {name, age, password}=payload;
    const result=await pool.query(`
      UPDATE users 
      SET name=COALESCE($1, name),
      age=COALESCE($2, age),
      password=COALESCE($3, password),
      updated_at=NOW()
      WHERE id=${id} RETURNING *
      `, [name??null, age??null, password??null]);
    return result;
}

const deleteFromDB=async(id:string)=>{
    const result=await pool.query(`DELETE FROM users WHERE id=${id}`);
    return result;
}

export const userDB={userInsertIntoDB,getAllFromDB,getOneFromDB,updateDB,deleteFromDB};