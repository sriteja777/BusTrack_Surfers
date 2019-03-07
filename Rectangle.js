

class Rectangle {
    constructor(height, width, position) {
        this.height = height;
        this.width = width;
        const x = this.width / 2;
        const y = this.height / 2;
        this.position = position;
        let vertex_buffer_data = [
            x, y, 1,
            -x,y, 1,
            -x,-y, 1,
            x, -y, 1
        ];

        const faceColors = [
            [0.5,  0.5,  0.5,  1.0],    // Left face: purple
        ];
        let colors = [];
        for (var j = 0; j < faceColors.length; ++j) {
            const c = faceColors[j];

            // Repeat each color four times for the four vertices of the face
            colors = colors.concat(c, c, c, c);
        }
        const indices = [
            0,  1,  2,      0,  2,  3,    // front
        ];

        this.modelMatrix = mat4.create();
        console.log(this.modelMatrix);
        mat4.translate(this.modelMatrix, this.modelMatrix, this.position);
        console.log(this.modelMatrix);
        this.vao = create3DObject(vertex_buffer_data, indices, 6, colors)
    }
    draw(programInfo, VP) {
        var MVPMatrix = mat4.create();
        mat4.multiply(MVPMatrix, VP, this.modelMatrix);
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.MVPMatrix,
            false,
            MVPMatrix);
        draw3DObject(programInfo, this.vao, MVPMatrix)
    }
}