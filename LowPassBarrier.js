class LowPassBarrier {
    constructor(position) {
        this.position = position;

        this.object = new Barrier(position, [position[0] - 0.5, position[1] - 2, position[2]], 6, 2  )

    }
    draw(programInfo, VP) {
        this.object.draw(programInfo, VP)
    }
}