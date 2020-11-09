const assert = require('assert');
const chai = require('chai'),
    chaiHttp = require('chai-http'),
    expect = chai.expect,
    app = require('../index');

chai.use(chaiHttp)

describe('Test API', function() {
    const test_user = {
        "id": 2,
        "login": "user2",
        "password": "password2"
    }

    describe('Authorization', function() {

        function signIn(callback) {
            chai
                .request(app)
                .post('/api/auth')
                .send({
                    login: test_user.login,
                    password: test_user.password
                })
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res).to.have.status(200)
                    expect(res.body).to.haveOwnProperty('id')
                    expect(res.body).to.haveOwnProperty('login')
                    expect(res.body).to.haveOwnProperty('token')
                    expect(res.body).to.haveOwnProperty('refreshToken')
                    if (callback) {
                        callback(res.body.token, res.body.refreshToken)
                    }
                })
        }

        function getUser(token, refreshToken) {
            chai
                .request(app)
                .get('/user')
                .set('Authorization', 'Bearer ' + token)
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res).to.have.status(200)
                    expect(res.body).to.haveOwnProperty('id')
                    expect(res.body).to.haveOwnProperty('login')
                    expect(res.body).to.haveOwnProperty('password')
                })
        }

        function refreshToken(accessToken, refreshToken) {
            chai
                .request(app)
                .post('/api/refresh')
                .send({
                    login: test_user.login,
                    refreshToken: refreshToken
                })
                .set('Authorization', 'Bearer ' + accessToken)
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res).to.have.status(200)
                    expect(res.body).to.haveOwnProperty('id')
                    expect(res.body).to.haveOwnProperty('login')
                    expect(res.body).to.haveOwnProperty('token')
                    expect(res.body).to.haveOwnProperty('refreshToken')
                })
        }

        it('sign in user', (done) => {
            signIn()
            done()
        })

        it('sign in and get user', (done) => {
            signIn(getUser)
            done()
        })

        it('sign in and refresh token', (done) => {
            signIn(refreshToken)
            done()
        })

    });


});