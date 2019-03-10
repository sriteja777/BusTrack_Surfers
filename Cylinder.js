class Cylinder {
    constructor(position, l, r, color) {
        this.position = position;
        this.length = l;
        this.radius = r;
        let vertex_buffer_data = [];
        let idx = 0;
        for(let i=0;i<=360;i++)
        {
            let j=i+1;
            vertex_buffer_data[idx++] = r*Math.cos(PI*i/180);
            vertex_buffer_data[idx++] = r*Math.sin(PI*i/180);
            vertex_buffer_data[idx++] = 0;
            vertex_buffer_data[idx++] = r*Math.cos(PI*i/180);
            vertex_buffer_data[idx++] = r*Math.sin(PI*i/180);
            vertex_buffer_data[idx++] = l;
            vertex_buffer_data[idx++] = r*Math.cos(PI*j/180);
            vertex_buffer_data[idx++] = r*Math.sin(PI*j/180);
            vertex_buffer_data[idx++] = 0;
            vertex_buffer_data[idx++] = r*Math.cos(PI*j/180);
            vertex_buffer_data[idx++] = r*Math.sin(PI*j/180);
            vertex_buffer_data[idx++] = 0;
            vertex_buffer_data[idx++] = r*Math.cos(PI*i/180);
            vertex_buffer_data[idx++] = r*Math.sin(PI*i/180);
            vertex_buffer_data[idx++] = l;
            vertex_buffer_data[idx++] = r*Math.cos(PI*j/180);
            vertex_buffer_data[idx++] = r*Math.sin(PI*j/180);
            vertex_buffer_data[idx++] = l;
        }

        const num_vertices = 360*2*3;
        const texture_one_coord = [
            0, 0,
            0, 1,
            1, 1,

            1, 1,
            1, 0,
            0, 0
        ];
        let textureCoordinates = [];
        for (let i=0;i<num_vertices;i++) {
            textureCoordinates = textureCoordinates.concat(texture_one_coord);

        }
        this.texture = emptyTexture();
        let colors = [];
        for (let i=0;i<num_vertices;i++) {
            colors[4*i] = color[0];
            colors[4*i+1] = color[1];
            colors[4*i+2] = color[2];
            colors[4*i+3] = color[3];

        }

        this.vao = create3DObjectBoth(vertex_buffer_data, -1, textureCoordinates, colors, num_vertices);
        this.modelMatrix = mat4.create();
        let trans_mat = mat4.create();
        mat4.translate(trans_mat, trans_mat, this.position);
        this.modelMatrix = trans_mat;
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
        let trans_point = vec3.create();
        vec3.add(trans_point, point, this.position);

        angle = angle*PI/180;
        mat4.translate(translate_mat, translate_mat, vec3.negate(vec3.create(), trans_point));
        mat4.translate(inverse_mat, inverse_mat, trans_point);
        mat4.rotate(rotate_mat, rotate_mat, angle, axis);
        mat4.multiply(this.modelMatrix, translate_mat, this.modelMatrix);
        mat4.multiply(this.modelMatrix, rotate_mat, this.modelMatrix);
        mat4.multiply(this.modelMatrix, inverse_mat, this.modelMatrix)

        // mat4.multiply(this.modelMatrix, rotate_mat, this.modelMatrix)
    }
}