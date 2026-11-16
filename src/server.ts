import express, { type Application, type Request, type Response } from "express";
import { Pool } from "pg";
const app:Application = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const pool=new Pool({
  connectionString:"postgresql://neondb_owner:npg_nSsBUkC7b4ZD@ep-old-art-az5igo26-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=false&channel_binding=require"
})

const initDB=async()=>{
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE NOT NULL,
        age INT,
        password VARCHAR(255) NOT NULL,

        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()

      )
      `)
      console.log("Database Connected");
  } catch (error) {
    console.log(error);
  }
}

initDB();

app.get('/', (req:Request, res:Response) => {
  res.status(200).json({
    success:true,
    message:"this is the root route",
    author:"Rad"
  })
});

app.post('/api/v1/users', async (req:Request, res:Response)=>{
    try {
      const {name, email, age, password}=req.body;

      const result=await pool.query(`
        INSERT INTO users(name, email, age, password) VALUES ($1,$2,$3,$4) RETURNING *
        `, [name, email, age, password]);

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
    }
});

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



app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});