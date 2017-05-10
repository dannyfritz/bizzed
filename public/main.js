class Buzzer {
  constructor () {
    this.socket = io()
  }
  join ({ id }) {
    this.socket.emit("join", { id })
  }
  buzz ({ id }) {
    this.socket.emit("buzz", { id })
  }
  start ({ id }) {
    this.socket.emit("start", { id })
  }
}

const buzzer = new Buzzer()

const Lobby = {
  template: "#lobbyTemplate",
}

const Room = {
  props: ["id"],
  template: "#roomTemplate",
  data() {
    return {
      winner: "",
    }
  },
  methods: {
    join () {
      buzzer.join({ id: this.id })
    },
    buzz () {
      buzzer.buzz({ id: this.id })
    },
    start () {
      buzzer.start({ id: this.id })
    },
  },
  mounted () {
    this.join()
    buzzer.socket.on("winner", ({ winner }) => {
      this.winner = winner
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
  { path: "/room/:id", component: Room, props: true },
  { path: "*", redirect: "/" },
]

const router = new VueRouter({ routes })

const app = new Vue({
  el: "#app",
  template: "#appTemplate",
  router,
})