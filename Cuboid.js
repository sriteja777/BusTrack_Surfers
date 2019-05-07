class Cuboid {
    constructor(center, width, height, depth, color, textureImage = WHITE_TEXTURE, textureOptions = {s:gl.REPEAT, t:gl.REPEAT}, is_2 = true, has_normal = false) {
        this.center = center;
        this.height = height;
        this.width = width;
        this.depth = depth;
        this.color = color;
        if (textureImage !== WHITE_TEXTURE) {
            this.texture = loadTexture(gl, textureImage, textureOptions);
        }
        else {
            this.texture = textureImage;
        }
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

        // const vert = [
        //     1.0, 1.0, 1.0,
        //     -1.0, 1.0, 1.0,
        //     -1.0, -1.0, 1.0,
        //     1.0, -1.0, 1.0,
        //
        //     1.0, 1.0, -1.0,
        //     -1.0, 1.0, -1.0,
        //     -1.0, -1.0, -1.0,
        //     1.0, -1.0, -1.0,
        // ];
        let faceColors = [];

        if (color === -1 || color === '') {
            faceColors = [
                [1.0, 1.0, 1.0, 1.0],    // Front face: white
                [1.0, 0.0, 0.0, 1.0],    // Back face: red
                [0.0, 1.0, 0.0, 1.0],    // Top face: green
                [0.0, 0.0, 1.0, 1.0],    // Bottom face: blue
                [1.0, 1.0, 0.0, 1.0],    // Right face: yellow
                [1.0, 0.0, 1.0, 1.0],    // Left face: purple
            ];
        }
        else if (color === 0){
            faceColors = [
                COLORS_0_1.WHITE,
                COLORS_0_1.WHITE,
                COLORS_0_1.WHITE,
                COLORS_0_1.WHITE,
                COLORS_0_1.WHITE,
                COLORS_0_1.WHITE,
            ];

        } else if (color.length === 6) {
            faceColors = color;
            console.log('facecolors',faceColors)
        }
        let textureCoordinates = [];
        if (is_2) {


             textureCoordinates = [
                // Front
                0, 0,
                width, 0,
                width, height,
                0, height,

                // Back
                0.0, 0.0,
                width, 0.0,
                height, height,
                0.0, height,
                // Top
                0.0, 0.0,
                depth, 0.0,
                depth, width,
                0.0, width,

                // Bottom
                0.0, 0.0,
                width, 0.0,
                width, depth,
                0.0, depth,
                // Right
                0.0, 0.0,
                height, 0.0,
                height, depth,
                0.0, depth,
                // Left
                0.0, 0.0,
                depth, 0.0,
                depth, height,
                0.0, height,
            ];
        } else {
            textureCoordinates = [
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
                0.0,  1.0,
                0.0,  0.0,
                1.0,  0.0,
                1.0,  1.0,
                // Left
                1.0,  1.0,
                0.0,  1.0,
                0.0,  0.0,
                1.0,  0.0,
            ];
        }
        var colors = [];


        for (var j = 0; j < faceColors.length; ++j) {
            const c = faceColors[j];

            // Repeat each color four times for the four vertices of the face
            colors = colors.concat(c, c, c, c);
        }

        const indices = [
            0,  1,  2,      0,  2,  3,    // front
            4,  5,  6,      4,  6,  7,    // back
            8,  9,  10,     8,  10, 11,   // top
            12, 13, 14,     12, 14, 15,   // bottom
            16, 17, 18,     16, 18, 19,   // right
            20, 21, 22,     20, 22, 23,   // left
        ];

        let vertexNormals = [
            // Front
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,

            // Back
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,

            // Top
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,

            // Bottom
            0.0, -1.0,  0.0,
            0.0, -1.0,  0.0,
            0.0, -1.0,  0.0,
            0.0, -1.0,  0.0,

            // Right
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,

            // Left
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0
        ];




        // const ind = [
        //   0, 1, 2,   0, 2, 3,  //front
        //   4,5,6,     4,7,6, // back
        //    1,5,0,   0, 4, 5, //top
        //    2,3,6,    3,7,6, // bottom
        //    1,2,6,    1,5,6, //left
        //     0,3,7,  0,4,7
        // ];
        // this.vao = create3DObject(vertex_buffer_data, indices, 36, colors);
        if (!has_normal)
        {
            vertexNormals = -1;
        }
        this.vao = create3DObjectBoth(vertex_buffer_data, indices, textureCoordinates, colors, 36, vertexNormals);
        this.modelMatrix = mat4.create();
        // let temp_mat = mat4.create();
        // console.log(temp_mat);
        // mat4.translate(temp_mat, temp_mat, [1,2,3]);
        // console.log(temp_mat);
        // sleep(500);

        // while (true) {
        //
        // }
        let trans = mat4.create();
        let scale = mat4.create();
        let comp = mat4.create();
        // mat4.scale(this.modelMatrix, this.modelMatrix, [width/2, height/2, depth/2]);
        // mat4.translate(this.modelMatrix, this.modelMatrix, this.center);
        mat4.scale(scale, scale, vec3.fromValues(width/2, height/2, depth/2));
        mat4.translate(trans, trans, this.center);
        mat4.multiply(this.modelMatrix, trans, scale);
        // mat4.fromRotationTranslationScale(this.modelMatrix, mat4.create(), this.center, vec3.fromValues(width/2, height/2, depth/2))
    }

    draw(programInfo, VP) {
        var MVPMatrix = mat4.create();
        mat4.multiply(MVPMatrix, VP, this.modelMatrix);
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.MVPMatrix,
            false,
            MVPMatrix);

        let invert_mat = mat4.create();
        mat4.invert(invert_mat, projectionMatrix);
        let view_mat = mat4.create();
        mat4.multiply(view_mat, invert_mat, VP);

        let model_view = mat4.create();
        mat4.multiply(model_view, view_mat, this.modelMatrix);

        const normalMatrix = mat4.create();
        mat4.invert(normalMatrix, model_view);
        mat4.transpose(normalMatrix, normalMatrix);
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.normalMatrix,
            false,
            normalMatrix);



        draw3DObjectBoth(programInfo, this.vao, this.texture)
    }
    rotate(angle, axis, point) {
        angle = angle * (22/7) / 180;
        let pos= vec3.create();
        vec3.negate(pos, this.center);
        // mat4.translate(this.modelMatrix, this.modelMatrix, pos);
        mat4.rotate(this.modelMatrix, this.modelMatrix, angle, axis);
        // mat4.translate(this.modelMatrix, this.modelMatrix, this.position);
    }
    translate(distance) {
        let temp_mat = mat4.create();
        mat4.translate(temp_mat, temp_mat, distance);
        mat4.multiply(this.modelMatrix, temp_mat, this.modelMatrix);
        vec3.add(this.center, this.center, distance)
    }
}