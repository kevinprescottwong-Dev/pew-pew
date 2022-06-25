export default class Loading extends Phaser.Scene {
  constructor() {
    super("loadingGame");
  }

  init() {
    const socket = io("http://localhost:3000", { withCredentials: false });
    const handlePlayerConnected = (id) => {
      this.add.text(100, 100, `Player ID: ${id}`, { fill: "#0f0" });
    };
    socket.on("playerConnected", (e) => {
      console.log({ e });
      handlePlayerConnected(e.playerId);
    });
  }

  preload() {}
  create() {
    const screenCenterX =
      this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY =
      this.cameras.main.worldView.y + this.cameras.main.height / 2;

    const loading = this.add.text(
      screenCenterX,
      screenCenterY,
      "Loading Game...",
      {
        fill: "#0f0",
      }
    );
  }
  //   update() {
  //     super.update();
  //   }
}
