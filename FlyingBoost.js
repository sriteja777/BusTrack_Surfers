class FlyingBoost {
    constructor(position) {
        this.position = position;
        this.taken = false;
        this.cyl1 = new Cylinder([position[0]- 0.2, position[1], position[2]], 0.7, 0.1, COLORS_0_1.DARK_GREEN);
        this.cyl2 = new Cylinder([position[0]+ 0.2, position[1], position[2]], 0.7, 0.1, COLORS_0_1.DARK_GREEN);
        let connector_color = [COLORS_0_1.GOLD,
        ];
        connector_color = connector_color.concat(connector_color, connector_color, connector_color, connector_color, connector_color);
        console.log('connector', connector_color);
        this.connector = new Cuboid([position[0], position[1]+0.7, position[2]], 0.5, 0.1, 0.1, connector_color);

        this.cyl1.rotate(-90, X_AXIS, ORIGIN);
        this.cyl2.rotate(-90, X_AXIS, ORIGIN);

    }

    draw(programInfo, VP) {
        if (this.taken) return;
        this.cyl1.draw(programInfo, VP);
        this.cyl2.draw(programInfo, VP);
        this.connector.draw(programInfo, VP);
    }

    tick() {
        this.cyl1.rotate(10, Y_AXIS, ORIGIN);
        this.cyl1.rotate(10, Y_AXIS, ORIGIN);
    }
}