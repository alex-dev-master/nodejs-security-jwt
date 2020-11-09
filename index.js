require('dotenv').config()
const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    {verify} = require('./modules/middleware'),
    {login, refresh} = require('./modules/authentication'),
    {user} = require('./modules/user')

const host = '127.0.0.1'
const port = 7000

app.use(bodyParser.json())
app.use(verify)

app.post('/api/auth', login)
app.post('/api/refresh', refresh)

app.get('/user', user)

app.listen(port, host, () =>
    console.log(`Server listens http://${host}:${port}`)
)

module.exports = app
