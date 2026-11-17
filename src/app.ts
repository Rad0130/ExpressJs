import express, { type Application, type Request, type Response } from "express";
import { pool } from "./db";
import { userRoute } from "./modules/users/user.route";
const app:Application = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/', (req:Request, res:Response) => {
  res.status(200).json({
    success:true,
    message:"this is the root route",
    author:"Rad"
  })
});

app.use('/api/v1/users', userRoute);

app.get('/api/v1/users', async(req:Request, res:Response)=>{
  try {
    const result=await pool.query(`SELECT * FROM users`)
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
  }
})

app.get('/api/v1/users/:id', async(req:Request, res:Response)=>{
  try {
    const {id}=req.params;
    const result=await pool.query(`SELECT * FROM users WHERE id=${id}`);
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
})


app.put('/api/v1/users/:id', async(req:Request, res:Response)=>{
  try {
    const {id}=req.params;
    const {name, age, password}=req.body;
    const result=await pool.query(`
      UPDATE users 
      SET name=COALESCE($1, name),
      age=COALESCE($2, age),
      password=COALESCE($3, password),
      updated_at=NOW()
      WHERE id=${id} RETURNING *
      `, [name??null, age??null, password??null]);

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
})


app.delete('/api/v1/users/:id', async(req:Request, res:Response)=>{
  try {
    const {id}=req.params;
    const result=await pool.query(`DELETE FROM users WHERE id=${id}`);
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
})

export default app;