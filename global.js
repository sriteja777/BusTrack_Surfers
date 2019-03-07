const canvas = document.querySelector('#glcanvas');
const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

const COLORS = {
    RED: [255, 0, 0, 1],
    BLUE: [0, 255, 0, 1],
    GREEN: [0, 0, 255, 1],
    BLACK: [0, 0, 0, 0],
    NAVY: [0, 0, 128],
    MAROON: [128,0,0],
    WHITE: [255, 255, 255],
    SILVER: [192,192,192],
    ORANGE_RED: [255, 69, 0],
    DARK_ORANGE: [255, 140, 0],
    CHOCOLATE: [210, 105, 30],
    SKY_BLUE: [135, 206, 235],
    GOLD: [255, 215, 0]
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

