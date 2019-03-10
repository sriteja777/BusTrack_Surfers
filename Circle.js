class Circle {
    constructor(center, radius, color) {
        this.center = center;
        this.radius = radius;
        let vertex_buffers_data = [];
        for(let i=0;i<20;i++)
        {
            vertex_buffers_data[9*i]=0.0;
            vertex_buffers_data[9*i+1]=0.0;
            vertex_buffers_data[9*i+2]=0.0;
            vertex_buffers_data[9*i+3]=radius*Math.cos((360/20)*i*(PI/180));
            vertex_buffers_data[9*i+4]=radius*Math.sin((360/20)*i*(PI/180));
            vertex_buffers_data[9*i+5]=0.0;
            vertex_buffers_data[9*i+6]=radius*Math.cos((360/20)*((i+1)%20)*(PI/180));
            vertex_buffers_data[9*i+7]=radius*Math.sin((360/20)*((i+1)%20)*(PI/180));
            vertex_buffers_data[9*i+8]=0.0;
        }

        this.texture = loadTexture(gl, 'coin.jpg');
        // const texture_one_coord = [
        //     0, 0,
        //     0, 1,
        //     1, 1,
        //
        //     1, 1,
        //     1, 0,
        //     0, 0
        // ];
        let textureCoordinates = [];
        // for (let i=0;i<60;i++) {
        //     textureCoordinates = textureCoordinates.concat(texture_one_coord);
        // }

        let textureCenter = [0.5, 0.5];
        let textureRadius = 0.37;
        for (let i=0;i<20;i++) {
            textureCoordinates[6*i]=textureCenter[0];
            textureCoordinates[6*i+1]=textureCenter[1];
            // textureCoordinates[9*i+2]=0.0;
            textureCoordinates[6*i+2]=textureCenter[0] + textureRadius*Math.cos((360/20)*i*(PI/180));
            textureCoordinates[6*i+3]=textureCenter[1] + textureRadius*Math.sin((360/20)*i*(PI/180));
            // textureCoordinates[9*i+5]=0.0;
            textureCoordinates[6*i+4]=textureCenter[0] + textureRadius*Math.cos((360/20)*((i+1)%20)*(PI/180));
            textureCoordinates[6*i+5]=textureCenter[1] + textureRadius*Math.sin((360/20)*((i+1)%20)*(PI/180));
            // textureCoordinates[9*i+8]=0.0;
        }

        console.log(textureCoordinates.length);
        // console.log(colors.length);

        const faceColors = [
            color,    // Left face: purple
        ];
        let colors = [];
        for (let i=0;i<60;i++) {
            colors[4*i] = color[0];
            colors[4*i+1] = color[1];
            colors[4*i+2] = color[2];
            colors[4*i+3] = color[3];

        }
        console.log(colors);
        // let colors = [];
        // for (var j = 0; j < 60; ++j) {
        //     const c = faceColors[j];
        //
        //     // Repeat each color four times for the four vertices of the face
        //     colors = colors.concat(c, c, c, c);
        // }

        this.vao = create3DObjectBoth(vertex_buffers_data, -1, textureCoordinates, colors, 20*3);
        this.modelMatrix = mat4.create();
        let trans_mat = mat4.create();
        let rotate_mat_z = mat4.create();
        let rotate_mat_y = mat4.create();
        let rotate_mat = mat4.create();
        mat4.translate(trans_mat, trans_mat, this.center);
        // mat4.rotateZ(rotate_mat_z, rotate_mat_z, PI);
        // mat4.rotateY(rotate_mat_y, rotate_mat_y, 0);
        // mat4.multiply(rotate_mat, rotate_mat_y, rotate_mat_z);
        mat4.multiply(this.modelMatrix, trans_mat, rotate_mat);
        this.rotate(180, X_AXIS, ORIGIN)

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
        let rotate_mat = mat4.create();
        let translate_mat = mat4.create();
        let inverse_mat = mat4.create();

        angle = angle*PI/180;
        mat4.translate(translate_mat, translate_mat, vec3.negate(vec3.create(), this.center));
        mat4.translate(inverse_mat, inverse_mat, this.center);
        mat4.rotate(rotate_mat, rotate_mat, angle, axis);
        mat4.multiply(this.modelMatrix, translate_mat, this.modelMatrix);
        mat4.multiply(this.modelMatrix, rotate_mat, this.modelMatrix);
        mat4.multiply(this.modelMatrix, inverse_mat, this.modelMatrix)
        // mat4.multiply(this.modelMatrix, rotate_mat, this.modelMatrix)
    }

}