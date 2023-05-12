import { AcgameObject } from '../../../static/js/ac_game_object/base.js';
import { Controller } from '../../../static/js/controller/base.js';

class GameMap extends AcgameObject {
    constructor(root) {
        super();//父类的构造函数
        //tabindex=0 聚焦
        this.root = root;
        this.$canvas = $('<canvas  width="1280" height="720" tabindex=0></canvas>');
        this.ctx = this.$canvas[0].getContext('2d');
        this.root.$kof.append(this.$canvas);
        this.$canvas.focus();//聚焦
        this.controller = new Controller(this.$canvas);
    }

    start() {

    }

    update() {
        this.render();
    }

    render() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width,
            this.ctx.canvas.height);
        // console.log(this.ctx.canvas.width);
        // this.ctx.fillStyle = 'black';
        // this.ctx.fillRect(0, 0, this.$canvas.width(), this.$canvas.height());

    }

}

export {
    GameMap
};


