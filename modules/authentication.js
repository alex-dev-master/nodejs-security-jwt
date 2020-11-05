const jwt = require('jsonwebtoken')
const users = require('../users')


exports.login = (req, res) => {
    for (let user of users) {
        if (
            req.body.login === user.login &&
            req.body.password === user.password
        ) {
            return res.status(200).json({
                id: user.id,
                login: user.login,
                token: jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, {
                    algorithm: "HS256",
                }),
            })
        }
    }

    return res.status(404).json({ message: 'User not found' })
}

