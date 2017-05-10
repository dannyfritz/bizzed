const app = require("./app")
const io = require('./socket')
var server = require("http").Server(app)
const PORT = process.env.PORT || 8080

io.attach(server)
server.listen(PORT, () => console.log(`Listening on port ${PORT}...`))
