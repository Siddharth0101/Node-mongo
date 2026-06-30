const express = require('express')
const fs = require('fs')
const morgan = require('morgan')
const app = express()

app.use(morgan('dev'))

// express.json() incoming JSON request body ko parse karta hai taaki req.body use kar sakein
app.use(express.json())

// app.get('/',(req,res)=>{
//     res.status(200).json({status:'success',message:'hello from the server'})
// })

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))

const getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        result: tours.length,
        data: {
            tours
        }
    })
}

const getTour = (req, res) => {
    res.status(200).json({
        status: 'success',
        result: tours.length,
        data: {
            tours
        }
    })
}

const createTour = (req, res) => {
    console.log(req.body)
    res.send('done')
}

app.route('/api/v1/tours').get(getAllTours).post(createTour)
app.get('/api/v1/tours/:id', getTour)

const port = 3000

app.listen(port, () => {
    console.log(`server is runnning on ${port}`)
})