const express = require('express')

const app = express()

app.get('/',(req,res)=>{
    res.status(200).json({status:'success',message:'hello from the server'})
})

const port = 3000

app.listen(port,()=>{
    console.log(`server is runnning on ${port}`)
})