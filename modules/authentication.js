const jwt = require('jsonwebtoken')
const users = require('../users')

const refreshTokens = {}

exports.login = (req, res) => {
    for (let user of users) {
        if (
            req.body.login === user.login &&
            req.body.password === user.password
        ) {
            const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, {
                algorithm: "HS256",
                expiresIn: process.env.REFRESH_TOKEN_LIFE
            });
            refreshTokens[refreshToken] = user.login;

            return res.status(200).json({
                id: user.id,
                login: user.login,
                token: jwt.sign({ id: user.id, refreshToken: refreshTokens }, process.env.ACCESS_TOKEN_SECRET, {
                    algorithm: "HS256",
                    expiresIn: process.env.ACCESS_TOKEN_LIFE
                }),
                refreshToken: refreshToken
            })
        }
    }

    return res.status(404).json({ message: 'User not found' })
}

exports.refresh = (req, res) => {
    const login = req.body.login
    const refreshToken = req.body.refreshToken
    // console.log(refreshTokens);
    if(
        (refreshToken in refreshTokens) &&
        (refreshTokens[refreshToken] == login) &&
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    ) {
        for (let user of users) {
            if (user.login == login) {
                return res.status(200).json({
                    id: user.id,
                    login: user.login,
                    token: jwt.sign({ id: user.id, refreshToken: refreshTokens }, process.env.ACCESS_TOKEN_SECRET, {
                        algorithm: "HS256",
                        expiresIn: process.env.ACCESS_TOKEN_LIFE
                    }),
                    refreshToken: refreshToken
                })
            }
        }

    }
    else {
        res.send(401)
    }
};

