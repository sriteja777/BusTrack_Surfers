// class Barrier {
//     constructor(position) {
//         this.position = position;
//         const stick_height = 1;
//         this.up_stick = new Cuboid(position, 1, 0.1, 0.1, '', './downobst.jpg');
//
//
//
//         this.left_stick = new Cuboid([position[0] - this.up_stick.width/2, position[1] - stick_height/2, position[2]],
//             0.1,stick_height, 0.1, '', './stickobst.jpg');
//         this.right_stick = new Cuboid([this.left_stick.center[0] + this.up_stick.width, this.left_stick.center[1], this.left_stick.center[2]],
//             0.1,stick_height, 0.1, '', './stickobst.jpg');
//         this.modelMatrix = mat4.create();
//         // let trans_mat = mat4.rotate();
//     }
//
//     draw(programInfo, VP) {
//         this.up_stick.draw(programInfo, VP);
//         this.left_stick.draw(programInfo, VP);
//         this.right_stick.draw(programInfo, VP);
//     }
// }


class BandPassBarrier {
    constructor(position) {
        this.position = position;

        this.object = new Barrier(position, [position[0] - 0.5, position[1] - 0.5, position[2]], 1, 0.1 )

    }
    draw(programInfo, VP) {
        this.object.draw(programInfo, VP)
    }
}