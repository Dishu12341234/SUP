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

let isCreating = 0;

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
  const userDetails = req.oidc?.user
  if(isCreating)  
    {
      isCreating = 0
      res.oidc.logout()
    }
  else
    res.render("home", { loggedIn: req.oidc.isAuthenticated(), data: userDetails })
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
  res.oidc.login({ returnTo: "/createUser" })
})

app.get('/createUser', (req, res) => {
  const userData = req.oidc.user
  isCreating = true;
  sql = `CREATE TABLE IF NOT EXISTS ${userData?.nickname}`+"(nickname VARCHAR(50))"
  userExists = 0;
  db.query(sql,(e,r)=>{
    let userExists = r?.warningCount
    console.log(!userExists);
    if(!userExists)
  {
    const params =
    {
      data: userData
    }
    res.render("login", params)
  }
  else 
  {
    res.redirect('/')
  }
  })
  
})

app.post('/createUser', (req, res) => {
  const userData = req.oidc.user
  if (!(req.body.nickname && req.body.password))
  {
    sql = `DROP TABLE ${req.oidc.user.nickname}`
    db.query(sql,(e,r)=>console.log(e))
    res.oidc.logout({returnTo:"/"})
    isCreating = false;
  }
  else
  {
    isCreating = false;
    res.json({ ...req.body , ...userData})
  }
}
)

app.get('/logoutUser', (req, res) => {
  res.oidc.logout();
})

app.post("/postRequest", (req, res) => {
  res.json(req.body)
})

app.listen(4000)