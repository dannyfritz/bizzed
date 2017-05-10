const Express = require("express")
const app = Express()

app.use(Express.static("./public"))

module.exports = app