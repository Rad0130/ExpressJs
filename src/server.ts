import express, { type Application, type Request, type Response } from "express";
const app:Application = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/', (req:Request, res:Response) => {
  res.status(200).json({
    success:true,
    message:"this is the root route",
    author:"Rad"
  })
});

app.post('/',(req:Request, res:Response)=>{
    const body=req.body;
    res.status(200).json({
        success:true,
        message:"data created successfully",
        data:body
    });
});



app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});