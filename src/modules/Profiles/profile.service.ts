import { pool } from "../../db";
import type { Iprofile } from "./profile.interface";


const profileInsert=async(payload:Iprofile)=>{
    const {user_id, bio, phone, gender}=payload;

    const user=await pool.query(`SELECT * FROM users WHERE id=${user_id}`);
    if(user.rowCount===0){
        throw new Error("User not found");
    }
    const result=await pool.query(`
        INSERT INTO profile(user_id, bio, phone, gender) VALUES ($1,$2,$3,$4) RETURNING *
        `, [user_id, bio, phone, gender]);
    return result
};

export const profileDB={profileInsert};