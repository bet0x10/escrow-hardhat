const express = require('express')
var cors = require('cors')
const app = express()
const port = 3104
app.use(cors())
app.use(express.json())


const data = {}

app.post('/add', (req, res) => {
    console.log(req.body.address)
    data[req.body.address] = req.body
    return  res.json({"done": "done"});

})

app.get("/list", (req, res) => {

    return res.json(data)

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})