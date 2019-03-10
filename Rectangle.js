

class Rectangle {
    constructor(height, width, position, textureImage = -1, textureOptions = {s:gl.REPEAT, t:gl.REPEAT}, color = COLORS_0_1.WHITE) {
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


        this.color = color;
        const faceColors = [
            color,    // Left face: purple
        ];
        // const faceColors = [
        //     [1.0,  1.0,  1.0,  1.0],    // Left face: purple
        // ];
        // const textureCoordinates = [
        //     // Front
        //     0.0,  0.0,
        //     1.0,  0.0,
        //     1.0,  1.0,
        //     0.0,  1.0,
        // ];
        const textureCoordinates = [
            // Front
            0.0,  0.0,
            1,  0.0,
            1,  height,
            0.0,  height,
            // // Back
            // 0.0,  0.0,
            // 1.0,  0.0,
            // 1.0,  1.0,
            // 0.0,  1.0,
            // // Top
            // 0.0,  0.0,
            // 1.0,  0.0,
            // 1.0,  1.0,
            // 0.0,  1.0,
            // // Bottom
            // 0.0,  0.0,
            // 1.0,  0.0,
            // 1.0,  1.0,
            // 0.0,  1.0,
            // // Right
            // 0.0,  0.0,
            // 1.0,  0.0,
            // 1.0,  1.0,
            // 0.0,  1.0,
            // // Left
            // 0.0,  0.0,
            // 1.0,  0.0,
            // 1.0,  1.0,
            // 0.0,  1.0,
        ];

        // const textureCoordinates =
        //     [
        //         //square
        //         0.0,  0.0,
        //         1.0,  1.0,
        //         0.0,  1.0,
        //
        //         0.0,  0.0,
        //         1.0,  0.0,
        //         1.0,  1.0,
        //     ];

        let colors = [];
        for (var j = 0; j < faceColors.length; ++j) {
            const c = faceColors[j];

            // Repeat each color four times for the four vertices of the face
            colors = colors.concat(c, c, c, c);
        }
        const indices = [
            0,  1,  2,      0,  2,  3,    // front
        ];
        if (textureImage !== -1) {
            this.texture = loadTexture(gl, textureImage, textureOptions);

        }
        else {
            this.texture = emptyTexture();
        }
        this.modelMatrix = mat4.create();
        // console.log(this.modelMatrix);
        mat4.translate(this.modelMatrix, this.modelMatrix, this.position);
        // mat4.rotate(this.modelMatrix, this.modelMatrix, -90 * (22/7)/180, [1,0,0]);
        // console.log(this.modelMatrix);
        this.vao = create3DObjectBoth(vertex_buffer_data, indices, textureCoordinates, colors, 6);
        // this.vao = create3DObjectWithTexture(vertex_buffer_data, indices, textureCoordinates, 6);
        // this.vao = create3DObject(vertex_buffer_data, indices, 6, textureCoordinates)
    }
    draw(programInfo, VP) {
        var MVPMatrix = mat4.create();
        mat4.multiply(MVPMatrix, VP, this.modelMatrix);
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.MVPMatrix,
            false,
            MVPMatrix);
        draw3DObjectBoth(programInfo, this.vao, this.texture)
    }

    rotate(angle, axis, point) {
        angle = angle * (22/7) / 180;
        let pos= vec3.create();
        vec3.negate(pos, this.position);
        // mat4.translate(this.modelMatrix, this.modelMatrix, pos);
        mat4.rotate(this.modelMatrix, this.modelMatrix, angle, axis);
        // mat4.translate(this.modelMatrix, this.modelMatrix, this.position);
    }
}