class Barrier {
    constructor(position_up_stick, position_left_stick, side_stick_height, up_stick_height) {
        // this.position = position;
        const stick_height = side_stick_height;
        this.up_stick = new Cuboid(position_up_stick, 1, up_stick_height, 0.1, '', './stickobst2.png', {s:gl.REPEAT, t:gl.REPEAT}, false, false);



        // this.left_stick = new Cuboid([position[0] - this.up_stick.width/2, position[1] - stick_height/2, position[2]],
        //     0.1,stick_height, 0.2, '', './stickobst.jpg');

        this.left_stick = new Cuboid(position_left_stick, 0.1, stick_height, 0.1, '', './stickobst.jpg');


        this.right_stick = new Cuboid([this.left_stick.center[0] + this.up_stick.width, this.left_stick.center[1], this.left_stick.center[2]],
            0.1,stick_height, 0.1, '', './stickobst.jpg');
        this.modelMatrix = mat4.create();
        // let trans_mat = mat4.rotate();
    }

    draw(programInfo, VP) {
        this.up_stick.draw(programInfo, VP);
        this.left_stick.draw(programInfo, VP);
        this.right_stick.draw(programInfo, VP);
    }
}
