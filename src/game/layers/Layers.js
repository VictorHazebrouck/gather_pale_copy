import { Application, Container } from "pixi.js";
import Camera from "../camera/Camera";
import Background from "./background/Background";
import Walls from "./walls/Walls";
import PlayersLayer from "./players/PlayersLayer";
import PlayerSelf from "../player/PlayerSelf";

class Layers extends Container {
    constructor() {
        super();
    }
    /**
     * 
     * @param {Application} app 
     * @param {UserStore} playerSelfData 
     */
    async createLayers(app, playerSelfData) {
        //init camera
        this.camera = new Camera(app);

        //init background
        this.background = new Background();
        await this.background.generateBackground();
        this.camera.addChild(this.background);

        //init walls
        this.walls = new Walls();
        await this.walls.generateWalls();
        this.camera.addChild(this.walls);
        
        // inti players layer
        this.playersLayer = new PlayersLayer();

        // init self
        this.playerSelf = await PlayerSelf.createPlayer(playerSelfData, this);
        this.playerSelf.registerMovementInput();
        this.playerSelf.registerMovementInput("KeyW", "KeyS", "KeyA", "KeyD");

        this.playersLayer.addChild(this.playerSelf);

        this.camera.attachCameraToObject(this.playerSelf);
        this.camera.addChild(this.playersLayer);
    }
}

export default Layers;
