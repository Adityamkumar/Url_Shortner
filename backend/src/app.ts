import express from 'express'
const app = express()


app.use(express.json())
app.use(express.urlencoded({extended: true}))



//shortId router
import shortIdRouter from './routes/url.route.js'
app.use('/api/v1', shortIdRouter)

app.get('/', (req, res)=>{
    res.send("Hello Welcome to my App")
})

export default app

