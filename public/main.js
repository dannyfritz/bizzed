class Buzzer {
  constructor () {
    this.socket = io()
  }
  join ({ id, name }) {
    this.socket.emit("join", { id, name })
  }
  buzz ({ id, name }) {
    this.socket.emit("buzz", { id, name })
  }
  start ({ id, name }) {
    this.socket.emit("start", { id, name })
  }
}

const buzzer = new Buzzer()

const Lobby = {
  template: "#lobbyTemplate",
  data () {
    return {
      room: "",
    }
  }
}

const Room = {
  props: ["roomId"],
  template: "#roomTemplate",
  data () {
    return {
      name: "",
      winner: {},
    }
  },
  methods: {
    join () {
      buzzer.join({ id: this.roomId, name: this.name })
    },
    buzz () {
      buzzer.buzz({ id: this.roomId, name: this.name })
    },
    start () {
      buzzer.start({ id: this.roomId, name: this.name })
    },
  },
  mounted () {
    this.join()
    buzzer.socket.on("winner", ({ name, id }) => {
      console.log(name, id)
      this.winner = { name, id }
    })
    buzzer.socket.on("start", () => {
      this.winner = ""
    })
  },
  watch: {
    id () {
      this.join()
    }
  }
}

const routes = [
  { path: "/", component: Lobby },
  { path: "/room/:roomId", component: Room, props: true },
  { path: "*", redirect: "/" },
]

const router = new VueRouter({ routes })

const app = new Vue({
  el: "#app",
  template: "#appTemplate",
  router,
})