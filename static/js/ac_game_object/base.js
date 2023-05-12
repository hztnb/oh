let AC_GAME_OBJECTS = [];//存对象的每个元素
class AcgameObject {
    constructor() {
        this.timedelta = 0;//存当前这帧离上一帧的时间间隔
        this.has_call_start = false;//标记当前元素有没有被初始化
        AC_GAME_OBJECTS.push(this);
    }

    //初始化函数
    start() {

    }

    //更新每一帧的，除了第一帧
    update() {

    }

    //删除当前对象
    destroy() {
        for (let i in AC_GAME_OBJECTS) {
            //删除当前对象this
            if (AC_GAME_OBJECTS[i] === this) {
                AC_GAME_OBJECTS.splice(i, 1);
                break;
            }
        }
    }
}

let last_timestamp;//上一帧执行的时间
//step函数 刷新 timestamp当前这个函数执行的时刻
let AC_GAME_OBJECT_FRAME = (timestamp) => {
    for (let obj of AC_GAME_OBJECTS) {
        //如果没有初始化
        if (!obj.has_call_start) {
            obj.start();
            obj.has_call_start = true;
        } else {
            //更新当前这帧离上一帧的时间间隔
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }
    last_timestamp = timestamp;
    requestAnimationFrame(AC_GAME_OBJECT_FRAME);//递归执行

}

//启动 无论放在哪个类里,引入到index后，只要一调用就会启动
requestAnimationFrame(AC_GAME_OBJECT_FRAME);

export {
    AcgameObject
};