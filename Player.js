"use strict";

class Player {
    constructor(position) {
        this.position = position;
        this.moving_in_circle = false;
        this.circle_center = vec3.fromValues(0,0,0);
        this.circle_radius = 0;
        this.circle_angle = 0;
        const body_height = 0.5;
        const leg_length = 0.4;
        this.head = new Cuboid([position[0], position[1], position[2]], 0.2, 0.2, 0.2, '');

        const body_pos = vec3.fromValues(position[0], position[1] - this.head.height/2 - body_height/2, position[2]);

        this.body = new Cuboid(body_pos, 0.4, body_height, 0.2, '');

        let left_leg_pos = vec3.create();
        vec3.sub(left_leg_pos, this.body.center, [0.1, this.body.height/2 + leg_length/2, 0]);

        // const left_leg_pos = vec3.fromValues(this.body.center[0] - 0.1, this.body.center[1] - this.body.height/2 - leg_length/2, this.body.center[2]);

        this.left_leg = new Cuboid(left_leg_pos, 0.1, leg_length, 0.1, '');
        let right_leg_pos = vec3.fromValues(this.body.center[0]+0.1, left_leg_pos[1], left_leg_pos[2]);

        this.right_leg = new Cuboid(right_leg_pos, 0.1, leg_length, 0.1, '');

        let left_hand_pos = vec3.create();
        const hand_width = 0.1;
        const hand_height = 0.4;
        vec3.sub(left_hand_pos, this.head.center, [this.body.width/2 + hand_width/2, this.head.height/2 + hand_height/2, 0]);

        this.left_hand = new Cuboid (left_hand_pos, hand_width, hand_height, 0.1, '');

        const pos = [left_hand_pos[0] + this.body.width + hand_width, left_hand_pos[1], left_hand_pos[2]];
        this.right_hand = new Cuboid(pos, hand_width, hand_height, 0.1, '');


        this.moving_left = false;
        this.moving_right = false;
        this.moving_up = false;

        this.x_move = 0;
        this.y_move = 0;

    }

    draw(programInfo, VP) {
        this.head.draw(programInfo, VP);
        this.body.draw(programInfo, VP);
        this.left_leg.draw(programInfo, VP);
        this.right_leg.draw(programInfo, VP);
        this.left_hand.draw(programInfo, VP);
        this.right_hand.draw(programInfo, VP);
    }

    translate(displacement) {
        this.head.translate(displacement);
        this.body.translate(displacement);
        this.left_leg.translate(displacement);
        this.right_leg.translate(displacement);
        this.left_hand.translate(displacement);
        this.right_hand.translate(displacement);
        // alert(this.position);
        vec3.add(this.position, this.position, displacement);
        // alert(this.position);
        cam_pos[0] += displacement[0];
        cam_pos[1] += displacement[1];
        cam_pos[2] += displacement[2];
    }

    move_forward(speed) {
        const distance = vec3.fromValues(0,0,-speed);
        // let distance = vec3.create();
        // vec3.set(distance, 0,0,-1.0);
        // this.translate(distance);
        // this.head.translate(distance);
        // this.body.translate(distance);
        // this.left_leg.translate(distance);
        // this.right_leg.translate(distance);
        // this.left_hand.translate(distance);
        // this.right_hand.translate(distance);
        // console.log(this.left_leg.modelMatrix);
    }

    tick(forward_speed) {
        let x=0, y=0,z=-forward_speed;
        if (this.moving_left) {
            if (this.x_move > 0) {
                x = -0.1;
                this.x_move -= 0.1;
            }
            else {
                this.moving_left = false;
                this.x_move = 0;
            }
        }
        if (this.moving_right) {
            if (this.x_move > 0) {
                x = 0.1;
                this.x_move -= 0.1;
            } else {
                this.moving_right = false;
                this.x_move = 0;
            }
        }


        if (this.moving_in_circle) {
            if (this.circle_angle < 179) {

                let increment = 0.5;
                this.circle_angle += increment;
                let angle = this.circle_angle * PI / 180;

                y = (this.circle_radius-30) * (Math.sin(angle + increment*PI/180) - Math.sin(angle) );
                z = this.circle_radius * (Math.cos(angle + increment*PI/180) - Math.cos(angle) );

            }
            else {
                this.circle_angle = 0;
                this.moving_in_circle = false;
            }
        }
        else {


            if (this.moving_up) {
                if (this.y_move > 0) {
                    y = 0.1;
                    this.y_move -= 0.1;
                    // console.log('y_move', this.y_move)
                } else {
                    this.moving_up = false;
                    this.y_move = 0;
                }

            } else {
                if (this.position[1] > 0) {
                    y = -0.1;
                }
            }
        }
        this.translate(vec3.fromValues(x,y,z))

    }

    move_left() {
        if (!this.moving_right && !this.moving_left && this.position[0] > -3) {
            this.moving_left = true;
            this.x_move = 3;
        }
        // const distance = vec3.fromValues(-2, 0, 0);
        // this.translate(distance)
    }

    move_right() {
        if (!this.moving_left && !this.moving_right && this.position[0] < 3) {
            this.moving_right = true;
            this.x_move = 3;
        }
        // const distance = vec3.fromValues(2, 0, 0);
        // this.translate(distance)
    }

    move_up() {
        if (!this.moving_up && this.position[1] < 1) {
            this.moving_up = true;
            this.y_move = 2;
        }
    }

    move_back() {
        this.translate([0, 0, 2])
    }

    move_in_circle(center, radius) {
        this.moving_in_circle = true;
        this.circle_center = center;
        this.circle_radius = radius;
    }


    }