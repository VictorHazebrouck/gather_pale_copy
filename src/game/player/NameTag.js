import { Graphics, Text } from "pixi.js";

class NameTag extends Graphics {
    /** @param {PlayerData} data*/
    constructor({ userName }) {
        super();
        this.init(userName);
    }

    init(userName = "") {
        const text = new Text({
            text: userName,
            style: {
                fontFamily: "Arial",
                fontSize: 20,
                fill: 0xffffff,
                align: "center",
            },
        });

        this.roundRect(0, 0, text.width + 18, text.height + 6, text.height + 6);
        this.fill({ r: 0, g: 0, b: 0, a: 0.5 });
        this.position.y = -22;

        text.x = (this.width - text.width) / 2; // Center horizontally
        text.y = (this.height - text.height) / 2;

        this.addChild(text);
        this.scale.set(0.4);
        //this.
        this.position.x = -this.width / 2;
    }
}

export default NameTag;
