class cuboidWithTexture {
    constructor(center, width, height, depth) {
        this.center = center;
        this.height = height;
        this.width = width;
        this.depth = depth;

        const vertex_buffer_data = [
            -1.0, -1.0,  1.0,
            1.0, -1.0,  1.0,
            1.0,  1.0,  1.0,
            -1.0,  1.0,  1.0,

            // Back face
            -1.0, -1.0, -1.0,
            -1.0,  1.0, -1.0,
            1.0,  1.0, -1.0,
            1.0, -1.0, -1.0,

            // Top face
            -1.0,  1.0, -1.0,
            -1.0,  1.0,  1.0,
            1.0,  1.0,  1.0,
            1.0,  1.0, -1.0,

            // Bottom face
            -1.0, -1.0, -1.0,
            1.0, -1.0, -1.0,
            1.0, -1.0,  1.0,
            -1.0, -1.0,  1.0,

            // Right face
            1.0, -1.0, -1.0,
            1.0,  1.0, -1.0,
            1.0,  1.0,  1.0,
            1.0, -1.0,  1.0,

            // Left face
            -1.0, -1.0, -1.0,
            -1.0, -1.0,  1.0,
            -1.0,  1.0,  1.0,
            -1.0,  1.0, -1.0
        ];

        const textureCoordinates = [
            // Front
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // Back
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // Top
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // Bottom
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // Right
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // Left
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
        ];

        const indices = [
            0,  1,  2,      0,  2,  3,    // front
            4,  5,  6,      4,  6,  7,    // back
            8,  9,  10,     8,  10, 11,   // top
            12, 13, 14,     12, 14, 15,   // bottom
            16, 17, 18,     16, 18, 19,   // right
            20, 21, 22,     20, 22, 23,   // left
        ];

        this.vao = create3DObjectWithTexture(vertex_buffer_data, indices, textureCoordinates, 36);
        this.modelMatrix = mat4.create();
        mat4.translate(this.modelMatrix, this.modelMatrix, this.center);
        this.texture = loadTexture(gl, 'rail7.jpg');
        mat4.rotate(this.modelMatrix, this.modelMatrix, -90 * (22/7)/180, [1,0,0]);
        // mat4.scale(this.modelMatrix, this.modelMatrix, [this.width,this.height,this.depth])
        // mat4.rotate(this.modelMatrix, this.modelMatrix, 90 * (22/7)/180, [0,1,0])

    }

    draw(programInfo, VP) {
        var MVPMatrix = mat4.create();
        mat4.multiply(MVPMatrix, VP, this.modelMatrix);
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.MVPMatrix,
            false,
            MVPMatrix);
        draw3DObjectWithTexture(programInfo, this.vao, this.texture)
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