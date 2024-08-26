import { Application, Container } from "pixi.js";
import Camera from "../camera/Camera";
import Background from "./background/Background";
import Walls from "./walls/Walls";
import PlayersLayer from "./players/PlayersLayer";
import PlayerSelf from "../player/PlayerSelf";
import Zones from "./zones/Zones";

class Layers extends Container {
    /**
     *
     * @param {Application} app
     * @param {Background} background
     * @param {Walls} walls
     * @param {UserStore} playerSelfData
     */
    constructor(app, background, walls, playerSelfData) {
        super();

        //init camera
        this.camera = new Camera(app);

        //artache baccjground to cameraa
        this.background = background;
        this.camera.addChild(this.background);

        //attach walls to camera
        this.walls = walls;
        this.camera.addChild(this.walls);

        //attach players
        this.playersLayer = new PlayersLayer(this);
        this.camera.addChild(this.playersLayer);

        //create self and bind camera position to it
        this.playersLayer.createSelf(playerSelfData, this).then((self) => {
            this.camera.attachCameraToObject(self);
        });

        //init zones definitions
        this.zones = new Zones(this);
    }
    /**
     *
     * @param {Application} app
     * @param {UserStore} playerSelfData
     */
    static async createLayers(app, playerSelfData) {
        //init background
        const background = new Background();
        await background.generateBackground();

        //init walls
        const walls = new Walls();
        await walls.generateWalls();

        return new Layers(app, background, walls, playerSelfData);
    }
}

export default Layers;
