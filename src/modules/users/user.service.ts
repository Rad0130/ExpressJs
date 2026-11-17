import { pool } from "../../db";
import type { Iuser } from "./user.interface";


const userInsertIntoDB=async(payload:Iuser)=>{
    const {name, email, age, password}=payload;

    const result=await pool.query(`
        INSERT INTO users(name, email, age, password) VALUES ($1,$2,$3,$4) RETURNING *
        `, [name, email, age, password]);
    return result
}

export const userDB={userInsertIntoDB};

