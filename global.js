const X_AXIS = vec3.fromValues(1,0,0);
const Y_AXIS = vec3.fromValues(0,1,0);
const Z_AXIS = vec3.fromValues(0,0,1);
const ORIGIN = vec3.fromValues(0,0,0);
var cam_pos = vec3.fromValues(0,2,5);
const PI = 3.14159265;
var projectionMatrix = mat4.create();





const canvas = document.querySelector('#glcanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
const WHITE_TEXTURE = emptyTexture();

const COLORS = {
    RED: [255, 0, 0, 1],
    BLUE: [0, 0, 255, 1],
    GREEN: [0, 255, 0, 1],
    BLACK: [0, 0, 0, 1],
    NAVY: [0, 0, 128, 1],
    MAROON: [128,0,0, 1],
    WHITE: [255, 255, 255, 1],
    SILVER: [192,192,192, 1],
    ORANGE_RED: [255, 69, 0, 1],
    DARK_ORANGE: [255, 140, 0, 1],
    CHOCOLATE: [210, 105, 30, 1],
    SKY_BLUE: [135, 206, 235, 1],
    GOLD: [255, 215, 0, 1],
    SADDLE_BROWN: [139, 69, 19, 1],
    SANDY_BROWN: [244,164,96, 1],
    DARK_GREEN: [0, 100, 0, 1]
};
console.log(COLORS);
COLORS_0_1 = {};
for (const [key, value] of Object.entries(COLORS) ) {
    COLORS_0_1[key] = [];
    for (let i=0;i<3;i++) {
        COLORS_0_1[key].push(value[i]/255)
    }
    COLORS_0_1[key].push(value[3])
}
console.log(COLORS_0_1);


function resize() {
    var displayWidth  = canvas.clientWidth;
    var displayHeight = canvas.clientHeight;

    // Check if the canvas is not the same size.
    if (canvas.width  !== displayWidth ||
        canvas.height !== displayHeight) {

        // Make the canvas the same size
        canvas.width  = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    }
}


function create3DObject(vertices, indices, num_vertices, color) {
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    return {
        numVertices: num_vertices,
        vertices: vertexBuffer,
        color: colorBuffer,
        indices: indexBuffer
    }
}

function draw3DObject(programInfo, vao, MVPMatrix) {
    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute
    {
        const numComponents = 3;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, vao.vertices);
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexPosition,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(
            programInfo.attribLocations.vertexPosition);
    }

    // Tell WebGL how to pull out the colors from the color buffer
    // into the vertexColor attribute.
    {
        const numComponents = 4;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, vao.color);
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexColor,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(
            programInfo.attribLocations.vertexColor);
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vao.indices);
    // gl.uniformMatrix4fv(
    //     programInfo.uniformLocations.MVPMatrix,
    //     false,
    //     projectionMatrix);
    // gl.uniformMatrix4fv(
    //     programInfo.uniformLocations.modelViewMatrix,
    //     false,
    //     modelViewMatrix);
    // gl.uniformMatrix4fv(
    //         programInfo.uniformLocations.MVPMatrix,
    //         false,
    //         MVPMatrix);
    {
        const vertexCount = vao.numVertices;
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }

}


function emptyTexture() {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    let whitePixel = new Uint8Array([255, 255, 255, 255]);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1,1,0,gl.RGBA, gl.UNSIGNED_BYTE, whitePixel);
    return texture
}

function loadTexture(gl, url, options = {s:gl.REPEAT, t:gl.REPEAT}) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Because images have to be download over the internet
    // they might take a moment until they are ready.
    // Until then put a single pixel in the texture so we can
    // use it immediately. When the image has finished downloading
    // we'll update the texture with the contents of the image.
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
        width, height, border, srcFormat, srcType,
        pixel);

    const image = new Image();
    image.onload = function() {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
            srcFormat, srcType, image);

        // WebGL1 has different requirements for power of 2 images
        // vs non power of 2 images so check if the image is a
        // power of 2 in both dimensions.
        if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
            // Yes, it's a power of 2. Generate mips.
            console.log('came here');
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, options.s);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, options.t);

        } else {
            // No, it's not a power of 2. Turn of mips and set
            // wrapping to clamp to edge
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }
    };
    image.src = url;

    return texture;
}

function create3DObjectWithTexture(vertices, indices, textureCoordinates, num_vertices) {
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    const textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    return {
        numVertices: num_vertices,
        vertices: vertexBuffer,
        texture: textureCoordBuffer,
        indices: indexBuffer
    }
}

function draw3DObjectWithTexture(programInfo, vao, texture) {
    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute
    {
        const numComponents = 3;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, vao.vertices);
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexPosition,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(
            programInfo.attribLocations.vertexPosition);
    }

    // Tell WebGL how to pull out the texture coordinates from
    // the texture coordinate buffer into the textureCoord attribute.
    {
        const numComponents = 2;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, vao.texture);
        gl.vertexAttribPointer(
            programInfo.attribLocations.textureCoord,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(
            programInfo.attribLocations.textureCoord);
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vao.indices);
    // Tell WebGL we want to affect texture unit 0
    gl.activeTexture(gl.TEXTURE0);

    // Bind the texture to texture unit 0
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Tell the shader we bound the texture to texture unit 0
    gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

    {
        const vertexCount = vao.numVertices;
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }

}

function isPowerOf2(value) {
    return (value & (value - 1)) === 0;
}


function create3DObjectBoth(vertices, indices, textureCoordinates, color, numVertices, vertexNormals = -1) {
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);


    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);

    const textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);

    let normalBuffer;
    let having_normals;
    // let normalBuffer = gl.createBuffer();
    if (vertexNormals === -1) {
        // normalBuffer = -1;
        having_normals = false;
        normalBuffer = gl.createBuffer();
        let temp_arr = [];
        for (let i=0;i<numVertices;i++) {
            temp_arr.push(0,0,0)
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(temp_arr),
            gl.STATIC_DRAW);
        console.log('sddsf', numVertices)
    }
    else {
        having_normals = true;
        normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals),
            gl.STATIC_DRAW);

    }


    if (indices !== -1) {
        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

        return {
            numVertices: numVertices,
            vertices: vertexBuffer,
            color: colorBuffer,
            texture: textureCoordBuffer,
            indices: indexBuffer,
            normal: normalBuffer,
            having_normals: having_normals
        }
    }
    else {
        return {
            numVertices: numVertices,
            vertices: vertexBuffer,
            color: colorBuffer,
            texture: textureCoordBuffer,
            indices: -1,
            normal: normalBuffer,
            having_normals: having_normals
        }
    }



}


function draw3DObjectBoth(programInfo, vao, texture) {
    {
        const numComponents = 3;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, vao.vertices);
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexPosition,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(
            programInfo.attribLocations.vertexPosition);
    }

    {
        const numComponents = 2;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, vao.texture);
        gl.vertexAttribPointer(
            programInfo.attribLocations.textureCoord,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(
            programInfo.attribLocations.textureCoord);
    }

    {
        const numComponents = 4;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, vao.color);
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexColor,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(
            programInfo.attribLocations.vertexColor);
    }
    if (vao.having_normals) {

        // Tell WebGL how to pull out the normals from
        // the normal buffer into the vertexNormal attribute.
        {
            const numComponents = 3;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, vao.normal);
            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexNormal,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                programInfo.attribLocations.vertexNormal);
        }
        let sddf = gl.getUniformLocation(programInfo.program, "normal");
        gl.uniform1i(sddf, true);
        var sarg = gl.getUniformLocation(programInfo.program, "normalfs");
        gl.uniform1i(sarg, true);


    }
    else {
        {
            const numComponents = 3;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, vao.normal);
            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexNormal,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                programInfo.attribLocations.vertexNormal);
        }
        var sdg = gl.getUniformLocation(programInfo.program, "normal");
        gl.uniform1i(sdg, false);
        var sdgsd = gl.getUniformLocation(programInfo.program, "normalfs");
        gl.uniform1i(sdgsd, false);
    }



    if (vao.indices !== -1) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vao.indices);
    }
    gl.activeTexture(gl.TEXTURE0);

    // Bind the texture to texture unit 0
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

    // Tell the shader we bound the texture to texture unit 0
    gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

    {
        const vertexCount = vao.numVertices;
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        if (vao.indices !== -1) {
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        }
        else {
            // console.log('here  ',  vao.vertices.length, vao.color.length, vao.texture.length);
            gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
        }
    }
}


function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}