import { Container, Ticker } from "pixi.js";

class Game extends Container {
    /**
     * Keep reference to the outter application state
     * @param {import("pixi.js").Application} app application object
     */
    constructor(app) {
        super();
        this.app = app;
        this.scale.x = 2;
        this.scale.y = 2;
        app.canvas.addEventListener("wheel", this._zoomCamera);
    }

    /**
     * Attaches the view to an object, following his every move
     * @param {Container} obj PIXI object containing a posision property
     */
    attachCameraToObject = (obj) => {
        Ticker.shared.add(() => this._moveCamera(obj));
    };

    /**
     * Moves the camera lul
     * @private
     *
     * @param {Container} obj PIXI object containing a posision property
     */
    _moveCamera = (obj) => {
        this.position.y = -obj.y * this.scale.x + this.app.screen.height / 2;
        this.position.x = -obj.x * this.scale.y + this.app.screen.width / 2;
    };

    /**
     * Zoom || Unzoom camera the camera lul
     * @private
     *
     * @todo smoothen the camerma zoom,
     *  - currently seems to focus towards its own anchor(0,0)
     *
     * @param {WheelEvent} e event triggered when using mouse wheel
     */
    _zoomCamera = (e) => {
        const speed = 0.03;
        if (e.deltaY > 0) {
            //don't allow for a zoom of more than 3
            if (this.scale.x > 3) {
                return;
            }
            this.scale.x *= 1 + speed;
            this.scale.y *= 1 + speed;
        } else {
            //don't allow for a zoom of less than .5
            if (this.scale.x < 1) {
                return;
            }
            this.scale.x *= 1 - speed;
            this.scale.y *= 1 - speed;
        }
    };
}

export default Game;
