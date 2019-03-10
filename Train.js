class Wheel {
    constructor(position, radius) {
        this.position = position;
        this.cylinder = new Cylinder(position, 0.3, radius, COLORS_0_1.BLACK);
        this.cylinder.rotate(90, Y_AXIS, ORIGIN);
        this.cir1 = new Circle([position[0]+this.cylinder.length, position[1], position[2]],radius, COLORS_0_1.CHOCOLATE);
        this.cir1.rotate(90, Y_AXIS, ORIGIN);
        this.cir2 = new Circle([position[0], position[1], position[2]],0.5, COLORS_0_1.CHOCOLATE);
        this.cir2.rotate(90, Y_AXIS, ORIGIN);
    }

    draw(programInfo, VP) {
        this.cylinder.draw(programInfo, VP);


        this.cir1.draw(programInfo, VP);


        this.cir2.draw(programInfo, VP);

    }
}





class Train {
    constructor (position) {
        this.body = new Cuboid(position, 2, 3, 25, '', './train8.jpg', {s:gl.REPEAT, t:gl.REPEAT}, false);
        this.wheels = [];
        let wheel_pos = [position[0] - this.body.width/2 + 0.3, position[1] - this.body.height/2 - 0.2, position[2] + this.body.depth/2 - 0.5];
        // this.wheels.push(new Circle(wheel_pos,0.5, COLORS_0_1.CHOCOLATE));
        // this.wheels[this.wheels.length - 1].rotate(90, Y_AXIS, ORIGIN);
        //
        // this.cyl = new Cylinder(wheel_pos, 0.3, 0.5, COLORS_0_1.BLACK);
        // this.cyl.rotate(90, Y_AXIS, ORIGIN);
        //
        // this.cir = new Circle([wheel_pos[0]+0.3, wheel_pos[1], wheel_pos[2]],0.5, COLORS_0_1.CHOCOLATE)
        // this.cir.rotate(90, Y_AXIS, ORIGIN)

        // this.wheels.push(new Wheel(wheel_pos, 0.5));
        // wheel_pos[2] -= this.body.depth -2;
        //
        // this.wheels.push(new Wheel(wheel_pos, 0.5));
        // wheel_pos[0] += this.body.width -0.8;
        //
        // this.wheels.push(new Wheel(wheel_pos, 0.5));
        // wheel_pos[2] += this.body.depth -2;
        //
        // this.wheels.push(new Wheel(wheel_pos, 0.5));

    }

    draw(programInfo, VP) {
        this.body.draw(programInfo, VP);
        // this.wheels[0].draw(programInfo, VP);
        this.wheels.forEach((v,i,a) => {a[i].draw(programInfo, VP)})
        // this.cyl.draw(programInfo, VP);
        // this.cir.draw(programInfo, VP);
    }

}