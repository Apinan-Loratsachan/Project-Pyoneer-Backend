const express = require('express')
const bodyparser = require('body-parser')
const app = express()

app.use(bodyparser.json())

const port = 8000

//variable global
let users = []

//ระบุ path
app.get('/', (req, res) => {
    let user = {
        firstname: 'nicha',
        lastname: 'wong',
        email: 'nicha@gmail.com'
    }
    res.json(user)
})

app.get('/users', (req, res) => {
    res.json(users)
})

app.post('/user', (req, res) => {
    let user = req.body
    users.push(user)
    res.json({
        message: 'add ok',
        user: user
    })
})

app.listen(port, (req, res) => {
    console.log('http server run at' + port)
})