import Loading from "./scenes/loading.js";
const p = document.getElementById("phaser");

var config = {
  type: Phaser.AUTO,
  parent: "phaser",
  width: p.offsetWidth,
  height: p.offsetHeight,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
    },
  },
  scene: [
    Loading,
    {
      preload: preload,
      create: create,
    },
  ],
};

var game = new Phaser.Game(config);

function preload() {
  this.load.setBaseURL("http://labs.phaser.io");

  this.load.image("sky", "assets/skies/space3.png");
  this.load.image("logo", "assets/sprites/phaser3-logo.png");
  this.load.image("red", "assets/particles/red.png");
}

function create() {
  this.add.image(400, 300, "sky");

  var particles = this.add.particles("red");

  var emitter = particles.createEmitter({
    speed: 100,
    scale: { start: 1, end: 0 },
    blendMode: "ADD",
  });

  var logo = this.physics.add.image(400, 100, "logo");
  const screenCenterX =
    this.cameras.main.worldView.x + this.cameras.main.width / 2;
  const screenCenterY =
    this.cameras.main.worldView.y + this.cameras.main.height / 2;

  logo.setVelocity(100, 200);
  logo.setBounce(1, 1);
  logo.setCollideWorldBounds(true);
  logo.setInteractive().on("pointerdown", (e) => {
    console.log("logo clicked", { emitter });
    if (emitter.on) {
      emitter.stop();
    } else {
      emitter.start();
    }
  });

  emitter.startFollow(logo);

  const helloButton = this.add.text(
    screenCenterX,
    screenCenterY,
    "Create Game!",
    {
      fill: "#0f0",
    }
  );

  helloButton.setInteractive().on("pointerdown", (e) => {
    console.log(e);
    socket.emit("newGame");
  });
}
