const { auth } = require("express-openid-connect")
const mysql = require("mysql")
const express = require("express")
const fs = require("fs")

const db = mysql.createConnection(
  {
    user: "SUP",
    password: 'divyansh@SUP',
    database: "users"
  }
)

require("process")

// mysql -u SUP -p 

const app = express()

app.use(express.static("static"))
app.use(express.urlencoded({ extended: false }))


app.use(auth({
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET + "1029138028301",
  baseURL: 'http://192.168.29.145:4000',
  clientID: 'ILoDpkjxq7jY2ccruDIgHfpbnRJgo0c1',
  issuerBaseURL: 'https://dev-act72w1eeonuqy2p.us.auth0.com'
}))

app.set('view engine', 'pug')

app.get('/', async (req, res) => {
  const userDetails = req.oidc.user
  let userName = req.oidc.user?.name
  let userNickname = req.oidc.user?.nickname

  const promise = new Promise(async (rev, rej) => {
    if (req.oidc.isAuthenticated()) {
      sql = `SELECT * FROM users WHERE name = '${userName}'`

      db.query(sql, (err, result) => {
        if (err) () => { console.log(err); }
        if (result[0] == undefined && userName != undefined) {
          sql = `INSERT INTO users VALUES('${userName}','${req.oidc.user?.email ? req.oidc.user?.email : req.oidc.user?.nickname}')`
          db.query(sql, (err, result) => {
            console.log(err);
          })

          sql = `CREATE TABLE ${userNickname} (friendName VARCHAR(30))`
          db.query(sql)
        }
      })
    }
    rev()
  })
  let work = await promise
  res.render("home", { loggedIn: req.oidc.isAuthenticated(), userName: req.oidc?.user?.name, data: userDetails })
})

app.get('/addFriend', (req, res) => {
  if (req.oidc.isAuthenticated()) {
    const userDetails = req.oidc.user
    res.render("add", { loggedIn: req.oidc.isAuthenticated(), userName: req.oidc?.user?.name, data: userDetails })
  }
  else {
    res.oidc.login({ returnTo: "/addFriend", silent: false })
  }
})

app.get('/loginUser', (req, res) => {
  res.oidc.login({ returnTo: "/" })
})

app.get('/logoutUser', (req, res) => {
  res.oidc.logout();
})

app.post("/postRequest", (req, res) => {
  res.json(req.body)
})

app.listen(4000)