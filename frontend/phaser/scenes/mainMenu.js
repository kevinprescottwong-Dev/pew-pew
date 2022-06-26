import createClientSocket from '../../socket/createSocket.js'
export default class MainMenu extends Phaser.Scene {
    clientSocket;
    constructor() {
        super("mainMenu");
    }

    init() {
        this.clientSocket = createClientSocket();
    }
    preload() {

    }
    create() {
        const screenCenterX =
            this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY =
            this.cameras.main.worldView.y + this.cameras.main.height / 2;

        const logo = this.add.text(screenCenterX, screenCenterY, 'Welcome to Pew Pew!', { fill: "#0f0" })
        const enterLobbyButton = this.add.text(screenCenterX, screenCenterY + 100, 'Enter Lobby!', { fill: "#0f0" })
        enterLobbyButton.setInteractive().on('pointerup', (e) => { console.log({ e }); this.clientSocket.emit("enterLobby") })




    }
    update() { }
}