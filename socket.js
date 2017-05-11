var io = require("socket.io")({ serveClient: false })

class Room {
  constructor () {
    this.reset()
  }
  reset () {
    this.winner = null
  }
  setWinner ({ name, id }) {
    if (this.winner) {
      return
    }
    this.winner = { name, id }
  }
  getWinner () {
    return this.winner
  }
}

class RoomManager {
  constructor () {
    this.rooms = {}
  }
  get ({ id }) {
    if (!this.rooms[id]) {
      this.rooms[id] = new Room()
    }
    return this.rooms[id]
  }
}

const roomManager = new RoomManager()

io.on("connection", function (socket) {
  socket.on("join", function ({ id }) {
    for (const room in socket.rooms) {
      socket.leave(room)
    }
    socket.join(id)
  })
  socket.on("start", function ({ id }) {
    const room = roomManager.get({ id })
    room.reset()
    io.to(id).emit("start")
  })
  socket.on("buzz", function ({ id, name }) {
    const room = roomManager.get({ id })
    console.log(id, name)
    room.setWinner({ name, id: socket.id })
    io.to(id).emit("winner", room.getWinner())
  })
})

module.exports = io