import { AcgameObject } from '../../../static/js/ac_game_object/base.js';
import { Controller } from '../../../static/js/controller/base.js';

export class Player extends AcgameObject {
    constructor(root, info) {
        super();
        this.root = root;
        this.id = info.id;
        this.x = info.x;
        this.y = info.y;
        this.width = info.width;
        this.height = info.height;
        this.color = info.color;
        this.vx = 0;
        this.vy = 0;
        this.direction = 1;
        this.speedx = 400;//水平速度
        this.speedy = -1000;//跳起的初速度
        this.gravity = 50;
        this.ctx = this.root.game_map.ctx;
        this.status = 3;// 0:不动 1:向前走 2:向后 3:跳跃 4:攻击 5:被打 6:死亡
        this.pressed_keys = this.root.game_map.controller.pressed_keys;
        this.animations = new Map();
        this.frame_current_cnt = 0;
    }

    start() {

    }

    update_control() {
        let w, a, d, space;
        //第一个玩家
        if (this.id === 0) {
            w = this.pressed_keys.has('w');
            a = this.pressed_keys.has('a');
            d = this.pressed_keys.has('d');
            space = this.pressed_keys.has(' ');
        }
        else {
            w = this.pressed_keys.has('ArrowUp');
            a = this.pressed_keys.has('ArrowLeft');
            d = this.pressed_keys.has('ArrowRight');
            space = this.pressed_keys.has('Enter');
        }

        if (this.status === 0 || this.status === 1) {
            if (space) {
                this.status = 4;
                this.vx = 0;
                this.frame_current_cnt = 0;
            }
            else if (w) {
                // if (this.frame_current_cnt != 0) this.frame_current_cnt = 0;
                if (d) {
                    this.vx = this.speedx;
                }
                else if (a) {
                    this.vx = -this.speedx;
                }
                else {
                    this.vx = 0;
                }
                this.vy = this.speedy;
                this.status = 3;
                this.frame_current_cnt = 0;
            }
            else if (d) {
                this.vx = this.speedx;
                this.status = 1;
            }
            else if (a) {
                this.vx = -this.speedx;
                this.status = 1;
            }
            else {
                this.vx = 0;
                this.status = 0;
            }
        }
    }

    //timedelta为距离上一帧的时间间隔
    update_move() {
        if (this.status === 3) this.vy += this.gravity;
        this.x += this.vx * this.timedelta / 1000;
        this.y += this.vy * this.timedelta / 1000;

        if (this.y > 450) {
            this.y = 450;
            this.vy = 0;
            this.status = 0;
        }
        if (this.x < 0) {
            this.x = 0;
        }
        else if (this.x + this.width > this.root.game_map.$canvas.width()) {
            this.x = this.root.game_map.$canvas.width() - this.width;
        }
    }

    update_direction() {
        let players = this.root.players;
        let me = this, you = players[1 - this.id];
        if (me.x < you.x) me.direction = 1;
        else me.direction = -1;
    }

    update() {

        this.update_control();
        this.update_move();
        this.update_render();
        this.update_direction();
    }

    update_render() {
        // this.ctx.fillStyle = this.color;

        // this.ctx.fillRect(this.x, this.y, this.width, this.height);
        let status = this.status;
        let obj = this.animations.get(status);//获取状态
        if (this.status === 1 && this.direction * this.vx < 0) status = 2;
        if (obj && obj.loaded) {
            // let k = this.frame_current_cnt  % obj.frame_cnt;
            if (this.direction > 0) {
                let k = parseInt(this.frame_current_cnt / obj.frame_rate) % obj.frame_cnt;
                let image = obj.gif.frames[k].image;
                this.ctx.drawImage(image, this.x, this.y + obj.offset_y, image.width * obj.scale, image.height * obj.scale);
            }
            else {
                this.ctx.save();
                this.ctx.scale(-1, 1);
                this.ctx.translate(-this.root.game_map.$canvas.width(), 0);

                let k = parseInt(this.frame_current_cnt / obj.frame_rate) % obj.frame_cnt;
                let image = obj.gif.frames[k].image;
                this.ctx.drawImage(image, this.root.game_map.$canvas.width() - this.x - this.width, this.y + obj.offset_y, image.width * obj.scale, image.height * obj.scale);
                this.ctx.restore();
            }

        }
        //播完最后一帧后停下来
        if (status === 4 && this.frame_current_cnt === obj.frame_rate * (obj.frame_cnt - 1)) {
            this.status = 0;

        }
        this.frame_current_cnt++;
    }

}