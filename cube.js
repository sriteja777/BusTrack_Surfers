"use strict";

var cubeRotation = 0.0;
var track = [];
var rect_track = [];
var brick_wall = [];
var coins = [];
var band_pass_barriers = [];
var high_pass_barriers = [];
var low_pass_barriers = [];
var left_track;
var right_track;
var center_track;
var right_wall;
var left_wall;
var ground;
var trains = [];
var flying_boosters = [];
let switcher = 0;

var speed = 0.1;

var mario;

let gray = false;
let start = false;

var down_obst;
main();

var rect;
var rect2;
var cuboid;
var textureCuboid;



// window.addEventListener('keyup', function(event) { console.log('key pressed') }, false);

//
// Start here
//
function main() {

    Mousetrap.bind('left', () => mario.move_left());
    Mousetrap.bind('right', () => mario.move_right());
    Mousetrap.bind('up', () => mario.move_up());
    Mousetrap.bind('down', () => mario.move_back());
    Mousetrap.bind('g', () => { gray = !gray});
    Mousetrap.bind('r', () => {cam_pos[2] -= 10});
    Mousetrap.bind('f', () => {start = !start});

    // If we don't have a GL context, give up now

    if (!gl) {
        alert('Unable to initialize WebGL. Your browser or machine may not support it.');
        return;
    }

    // window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

    // Vertex shader program

    const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uMVPMatrix;

    varying lowp vec4 vColor;

    void main(void) {
      gl_Position = uMVPMatrix * aVertexPosition;
      vColor = aVertexColor;
    }
  `;

    const vsSrc2 = `
        attribute vec4 aVertexPosition;
        attribute vec2 aTextureCoord;
        
        uniform mat4 uMVPMatrix;
        
        varying highp vec2 vTextureCoord;
        
        void main(void) {
            gl_Position = uMVPMatrix * aVertexPosition;
            vTextureCoord = aTextureCoord;
        }
    `;

    const vsSrcBoth = `
        attribute vec4 aVertexPosition;
        attribute vec2 aTextureCoord;
        attribute vec4 aVertexColor;
        
        uniform mat4 uMVPMatrix;
        
        varying lowp vec4 vColor;
        varying highp vec2 vTextureCoord;
        
        void main(void) {
            gl_Position = uMVPMatrix * aVertexPosition;
            vTextureCoord = aTextureCoord;
            vColor = aVertexColor;
            }
    `;

    const vsSrcFlash = `
        attribute vec4 aVertexPosition;
        attribute vec3 aVertexNormal;
        attribute vec2 aTextureCoord;
        attribute vec4 aVertexColor;
        
        uniform mat4 uMVPMatrix;
        uniform mat4 uNormalMatrix;
        uniform bool start;
        uniform bool normal;
        
        varying lowp vec4 vColor;
        varying highp vec2 vTextureCoord;
        varying highp vec3 vLighting;
        
        void main(void) {
            gl_Position = uMVPMatrix * aVertexPosition;
            vTextureCoord = aTextureCoord;
            vColor = aVertexColor;
            
            // Lighting
            if (normal) {
            highp vec3 ambientLight = vec3(0.7, 0.7, 0.7);
            // highp vec3 directionalLightColor = vec3(0.9960, 0.8398, 0);
            highp vec3 directionalLightColor = vec3(0.96875, 0.96875, 0.96875);
            highp vec3 directionalLightColor2 = vec3(0, 0.4, 0);
            // highp vec3 directionalLightColor = vec3(1,1,1);
            // highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));
            highp vec3 directionalVector = normalize(vec3(-1, 0, 0));
            highp vec3 directionalVector2 = normalize(vec3(1, 0, 0));
            
            
            highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);
            
            highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
            highp float directional2 = max(dot(transformedNormal.xyz, directionalVector2), 0.0);
            if (start) {
            vLighting =  ambientLight + (directionalLightColor * directional) + (directionalLightColor2 * directional2);
           
            } else {
            vLighting =  ambientLight; //+ (directionalLightColor * directional);
          
            }
            
            }
            }
    `;




    // Fragment shader program

    const fsSource = `
    varying lowp vec4 vColor;

    void main(void) {
      gl_FragColor = vColor;
    }
  `;


    const fsSrc2 = `
        varying highp vec2 vTextureCoord;
        
        uniform sampler2D uSampler;
        void main(void) {
            gl_FragColor = texture2D(uSampler, vTextureCoord);
        }
    `;

    const fsSrcboth = `
        varying highp vec2 vTextureCoord;
        varying lowp vec4 vColor;
        uniform sampler2D uSampler;
        
    void main(void) {
      gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor;
    }
    `;


    const fsSrcGray = `
        varying highp vec2 vTextureCoord;
        varying lowp vec4 vColor;
        uniform sampler2D uSampler;
        uniform bool uGray;
        
    void main(void) {
        if (uGray)
        {
            highp vec4 texelColor = texture2D(uSampler, vTextureCoord).rgba;
            highp float grayScale = dot(texelColor.rgb, vec3(0.199, 0.587, 0.114));
            highp vec3 grayImage = vec3(grayScale, grayScale, grayScale);
            gl_FragColor = vec4(grayImage, texelColor.a);
        }
        else 
        {
            gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor;
        }
    }
    `;

    const fsSrcFlash = `
        varying highp vec2 vTextureCoord;
        varying lowp vec4 vColor;
        varying highp vec3 vLighting;
        
        uniform sampler2D uSampler;
        uniform bool uGray;
        uniform bool normalfs;
        
    void main(void) {
        if (uGray)
        {
            highp vec4 texelColor = texture2D(uSampler, vTextureCoord).rgba;
            highp float grayScale = dot(texelColor.rgb, vec3(0.199, 0.587, 0.114));
            highp vec3 grayImage = vec3(grayScale, grayScale, grayScale);
            gl_FragColor = vec4(grayImage, texelColor.a);
        }
        else 
        {
            if (normalfs) {
            highp vec4 texelColor = texture2D(uSampler, vTextureCoord) *vColor;
            // gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor;
            gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
            }
            else {
                gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor;
            }
        }
    }
    `;

    // Initialize a shader program; this is where all the lighting
    // for the vertices and so forth is established.
    // const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
    const shaderProgram = initShaderProgram(gl, vsSrcFlash, fsSrcFlash  );
    // const shaderProgramColors = initShaderProgram(gl, vsSource, fsSource);

    // Collect all the info needed to use the shader program.
    // Look up which attributes our shader program is using
    // for aVertexPosition, aVevrtexColor and also
    // look up uniform locations.

    // const programInfo = {
    //     program: shaderProgram,
    //     attribLocations: {
    //         vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
    //         vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
    //     },
    //     uniformLocations: {
    //         MVPMatrix: gl.getUniformLocation(shaderProgram, 'uMVPMatrix'),
    //         // modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
    //     },
    // };

    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
            vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
            textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
        },
        uniformLocations: {
            MVPMatrix: gl.getUniformLocation(shaderProgram, 'uMVPMatrix'),
            uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
            normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix')
            // modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
        },
    };

    // Here's where we call the routine that builds all the
    // objects we'll be drawing.
    const buffers = initBuffers(gl);

    var then = 0;

    // Draw the scene repeatedly
    function render(now) {
        now *= 0.001;  // convert to seconds
        const deltaTime = now - then;
        then = now;

        drawScene(gl, programInfo, buffers, deltaTime);
        tick();

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}


function tick() {
    // cam_pos[2] -= speed;
    // mario.move_forward(speed);
    mario.tick(speed);

    for (let i=0;i<coins.length;i++) {
        coins[i].rotate(1, Y_AXIS, ORIGIN)
    }
    // flying_boosters.forEach((v,i,a) => a[i].tick());

    flying_boosters.forEach((v,i,a) =>  {
        // alert('mario -> ' + mario.position.toString() + ' booster -> ' + a[i].position.toString() + 'dist' + vec3.distance(a[i].position, mario.position).toString());
        if (!a[i].taken) {
            if (vec3.distance(a[i].position, mario.position) < 0.68) {
                // alert('ok')
                a[i].taken = true;
                mario.move_in_circle([a[i].position[0], a[i].position[1], a[i].position[2] - 50], 50)

            }
        }
    });



}

//
// initBuffers
//
// Initialize the buffers we'll need. For this demo, we just
// have one object -- a simple three-dimensional cube.
//
function initBuffers(gl) {

    // Create a buffer for the cube's vertex positions.

    // const positionBuffer = gl.createBuffer();

    // Select the positionBuffer as the one to apply buffer
    // operations to from here out.

    // gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Now create an array of positions for the cube.

    // const positions = [
    //     // Front face
    //     -1.0, -1.0,  1.0,
    //     1.0, -1.0,  1.0,
    //     1.0,  1.0,  1.0,
    //     -1.0,  1.0,  1.0,
    // ];

    // Now pass the list of positions into WebGL to build the
    // shape. We do this by creating a Float32Array from the
    // JavaScript array, then use it to fill the current buffer.

    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // Now set up the colors for the faces. We'll use solid colors
    // for each face.

    // const faceColors = [
    //     [1.0,  0.0,  1.0,  1.0],    // Left face: purple
    // ];
    // rect  = new Rectangle(2,2, new vec3.fromValues(4,5,6));
    // let temp_Vec = new vec3.fromValues(1,2,3);
    // temp_Vec[2] = 1;
    // console.log(temp_Vec);
    //
    // // Convert the array of colors into a table for all the vertices.
    // console.log(faceColors);
    // var colors = [];
    //
    // for (var j = 0; j < faceColors.length; ++j) {
    //     const c = faceColors[j];
    //
    //     // Repeat each color four times for the four vertices of the face
    //     colors = colors.concat(c, c, c, c);
    // }
    // console.log(colors);


    // const colorBuffer = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    // Build the element array buffer; this specifies the indices
    // into the vertex arrays for each face's vertices.

    // const indexBuffer = gl.createBuffer();
    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    // This array defines each face as two triangles, using the
    // indices into the vertex array to specify each triangle's
    // position.
    //
    // const indices = [
    //     0,  1,  2,      0,  2,  3,    // front
    // ];

    // rect = new Rectangle(2,2, new vec3.fromValues(0,1,1), );
    // rect2 = new Rectangle(2,2, new vec3.fromValues(-1, 0, 0));
    // cuboid = new Cuboid(new vec3.fromValues(-5, -1, 0), 2,2,2, '');
    // textureCuboid = new cuboidWithTexture(new vec3.fromValues(0,-2.5,4), 2,2,2);
    // for (let i=0;i<50;i++) {
        // track.push(new cuboidWithTexture(new vec3.fromValues(0,-2.5,4-2*i), 2,2,2));
        // track.push(new cuboidWithTexture(new vec3.fromValues(-3,-2.5,4-2*i), 2,2,2));
        // track.push(new cuboidWithTexture(new vec3.fromValues(3,-2.5,4-2*i), 2,2,2))

    // }

    let temp_mat = mat2.fromValues(1,2,3,4);
    console.log(temp_mat);
    let tran = mat2.create();
    mat2.transpose(tran, temp_mat);
    mat4.sub(temp_mat, temp_mat, mat2.fromValues(1,1,0,1));
    mat4.sub(tran, tran, mat2.fromValues(1,1,0,1));

    console.log(temp_mat);
    console.log(tran);
    // sleep(500);

    ground = new Rectangle(1000, 1000, [0,-2.5,0], -1, -1, COLORS_0_1.SANDY_BROWN);
    ground.rotate(-90, X_AXIS, ORIGIN);
    let ground_y = -2.5;
    // let img = 'rail8.jpg';
    // for (let i=0;i<100;i++) {
    //     rect_track.push(new Rectangle(2,2, new vec3.fromValues(0, -2.5, 4-2*i), img));
    //     rect_track[rect_track.length - 1].rotate(-90, X_AXIS, ORIGIN);
    //     rect_track.push(new Rectangle(2,2, new vec3.fromValues(-3, -2.5, 4-2*i), img));
    //     rect_track[rect_track.length-1].rotate(-90, X_AXIS, ORIGIN);
    //     rect_track.push(new Rectangle(2,2, new vec3.fromValues(3, -2.5, 4-2*i), img));
    //     rect_track[rect_track.length-1].rotate(-90, X_AXIS, ORIGIN);
    // }
    let img = 'rail10.jpg';
    left_track = new Rectangle(200,2, vec3.fromValues(-3, -2.5, -100), img, {s: gl.CLAMP_TO_EDGE, t:gl.REPEAT}, ground.color);
    left_track.rotate(-90, X_AXIS, ORIGIN);
    right_track = new Rectangle(200,2, vec3.fromValues(3, -2.5, -100), img, {s: gl.CLAMP_TO_EDGE, t:gl.REPEAT}, ground.color);
    right_track.rotate(-90, X_AXIS, ORIGIN);
    center_track = new Rectangle(200,2, vec3.fromValues(0, -2.5, -100), img, {s: gl.CLAMP_TO_EDGE, t:gl.REPEAT}, ground.color);
    center_track.rotate(-90, X_AXIS, ORIGIN);
    img = 'wall4.jpg';
    // for (let i=0;i<100;i++) {
    //     // brick_wall.push(new Rectangle(2,2, new vec3.fromValues(6,-0.7,4-2*i), img));
    //     // brick_wall[brick_wall.length-1].rotate(-90, Y_AXIS, ORIGIN);
    //     // brick_wall.push(new Rectangle(2,2, new vec3.fromValues(-4,-0.7,4-2*i), img));
    //     // brick_wall[brick_wall.length-1].rotate(-90, Y_AXIS, ORIGIN)
    //
    //     brick_wall.push(new Cuboid(vec3.fromValues(6,-0.7,4-2*i), 1,1,1, '', img));
    //     brick_wall.push(new Cuboid(vec3.fromValues(-6,-0.7,4-2*i),1,1, 1, '',img));
    // }

    // cuboid = new Cuboid(vec3.fromValues(1,1,-1),2,2, 'sd');
    right_wall = new Cuboid(vec3.fromValues(6,-0.5,-100), 1,2,200,'', 'wall9.jpg', {s:gl.REPEAT, t:gl.REPEAT}, true, true);
    left_wall = new Cuboid(vec3.fromValues(-6,-0.5,-100), 1,2,200,'', 'wall9.jpg', {s:gl.REPEAT, t:gl.REPEAT}, true, true);
    mario = new Player([0,0,1]);
    for (let i=0;i<10;i++) {
        coins.push(new Circle(vec3.fromValues(0, -1, -15 -2*i), 0.4, COLORS_0_1.GOLD));
        coins[i].rotate(Math.floor((Math.random() * 50) + 1), Y_AXIS, ORIGIN)
    }

    // down_obst = new Barrier(vec3.fromValues(left_track.position[0], ground_y + 2, -20), 1, 0.1, );
    high_pass_barriers.push(new HighPassBarrier(vec3.fromValues(right_track.position[0], ground_y + 1, -20)));
    high_pass_barriers.push(new HighPassBarrier(vec3.fromValues(right_track.position[0], ground_y + 1, -60)));

    low_pass_barriers.push(new LowPassBarrier(vec3.fromValues(left_track.position[0], ground_y + 3, -20)));
    low_pass_barriers.push(new LowPassBarrier(vec3.fromValues(left_track.position[0], ground_y + 3, -60)));
    band_pass_barriers.push(new BandPassBarrier(vec3.fromValues(center_track.position[0], ground_y + 2, -20)));

    trains.push(new Train(vec3.fromValues(left_track.position[0], ground_y + 3.2, -25)));
    trains.push(new Train(vec3.fromValues(right_track.position[0], ground_y + 3.2, -25)));
    trains.push(new Train(vec3.fromValues(center_track.position[0], ground_y + 3.2, -54)));


    flying_boosters.push(new FlyingBoost([center_track.position[0], ground_y + 1.83, -15]));

    for (let i=0;i<flying_boosters.length;i++) {

        let start_angle = 30;
        while(start_angle < 150) {
            let angle = start_angle*PI/180;
            let pos = [flying_boosters[i].position[0], 0, 0];
            pos[1] = flying_boosters[i].position[1] + 20 * Math.sin(angle);
            pos[2] = (flying_boosters[i].position[2]-50) + 50 * Math.cos(angle);
            coins.push(new Circle(pos, 0.4, COLORS_0_1.GOLD));

            start_angle += 5;
        }
    }

    // right_wall.rotate(90, Z_AXIS, ORIGIN)



    // let pos = new vec3.fromValues(1,2,-40);
    // rect_track.push(new Rectangle(2,2, pos))
    // Now send the element array to GL

    // gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
    //     new Uint16Array(indices), gl.STATIC_DRAW);
    //
    // return {
    //     position: positionBuffer,
    //     color: colorBuffer,
    //     indices: indexBuffer,
    // };
}

//
// Draw the scene.
//
function drawScene(gl, programInfo, buffers, deltaTime) {
    resize();
    let backgroundColor = COLORS_0_1.SKY_BLUE;
    gl.clearColor(backgroundColor[0], backgroundColor[1], backgroundColor[2], 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

    // Clear the canvas before we start drawing on it.

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Create a perspective matrix, a special matrix that is
    // used to simulate the distortion of perspective in a camera.
    // Our field of view is 45 degrees, with a width/height
    // ratio that matches the display size of the canvas
    // and we only want to see objects between 0.1 units
    // and 100 units away from the camera.

    const fieldOfView = 45 * Math.PI / 180;   // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 50.0;
    // const projectionMatrix = mat4.create();

    // note: glmatrix.js always has the first argument
    // as the destination to receive the result.
    mat4.perspective(projectionMatrix,
        fieldOfView,
        aspect,
        zNear,
        zFar);

    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    const modelViewMatrix = mat4.create();
    const viewMatrix = mat4.create();
    // temp_vector = vec3.create();
    // console.log(temp)

    // Now move the drawing position a bit to where we want to
    // start drawing the square.

    mat4.lookAt(viewMatrix, cam_pos, mario.position.slice(), vec3.fromValues(0,1,0));
    // mat4.lookAt(viewMatrix, cam_pos, vec3.fromValues(cam_pos[0],-2,cam_pos[2]-10), vec3.fromValues(0,1,0));
    // mat4.translate(modelViewMatrix,     // destination matrix
    //     modelViewMatrix,     // matrix to translate
    //     [-0.0, 1.0, -9.0]);  // amount to translate

    const VP = mat4.create();
    mat4.multiply(VP, projectionMatrix, viewMatrix);
    //Write your code to Rotate the cube here//

    gl.useProgram(programInfo.program);
    // rect.draw(programInfo, VP);
    // rect2.draw(programInfo, VP);
    // cuboid.draw(programInfo, VP);
    // textureCuboid.draw(programInfo, VP);
    // for (let i=0;i<track.length;i++) {
    //     // track[i].draw(programInfo, VP);
    // }
    // for (let i=0;i<rect_track.length;i++) {
    //     // rect_track[i].draw(programInfo, VP);
    // }
    // for (let i=0;i<brick_wall.length; i++) {
    //     // console.log('came');
    //     brick_wall[i].draw(programInfo, VP)
    // }


    for (let i=0;i<coins.length;i++) {
        coins[i].draw(programInfo, VP)
    }
    for (let i=0;i<high_pass_barriers.length;i++) {
        high_pass_barriers[i].draw(programInfo, VP);
    }
    for (let i=0;i<low_pass_barriers.length;i++) {
        low_pass_barriers[i].draw(programInfo, VP);
    }
    for (let i=0;i<band_pass_barriers.length;i++) {
        band_pass_barriers[i].draw(programInfo, VP);
    }


    // cuboid.draw(programInfo, VP);
    left_wall.draw(programInfo, VP);
    right_wall.draw(programInfo, VP);

    left_track.draw(programInfo, VP);
    right_track.draw(programInfo, VP);
    center_track.draw(programInfo, VP);
    ground.draw(programInfo, VP);
    mario.draw(programInfo, VP);
    for(let i=0;i<trains.length;i++) {
        trains[i].draw(programInfo, VP);
    }
    flying_boosters.forEach((v,i,a) => {a[i].draw(programInfo, VP)});

    switcher += 1;
    var GrayBuffer = gl.getUniformLocation(programInfo.program, "uGray");
    gl.uniform1i(GrayBuffer, gray);
    if (switcher%50 === 0)
        start = !start;
    var sdg = gl.getUniformLocation(programInfo.program, "start");
    gl.uniform1i(sdg, start);


    // down_obst.draw(programInfo, VP);
    // coin.draw(programInfo, VP);
    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute
    // {
    //     const numComponents = 3;
    //     const type = gl.FLOAT;
    //     const normalize = false;
    //     const stride = 0;
    //     const offset = 0;
    //     gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    //     gl.vertexAttribPointer(
    //         programInfo.attribLocations.vertexPosition,
    //         numComponents,
    //         type,
    //         normalize,
    //         stride,
    //         offset);
    //     gl.enableVertexAttribArray(
    //         programInfo.attribLocations.vertexPosition);
    // }
    //
    // // Tell WebGL how to pull out the colors from the color buffer
    // // into the vertexColor attribute.
    // {
    //     const numComponents = 4;
    //     const type = gl.FLOAT;
    //     const normalize = false;
    //     const stride = 0;
    //     const offset = 0;
    //     gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    //     gl.vertexAttribPointer(
    //         programInfo.attribLocations.vertexColor,
    //         numComponents,
    //         type,
    //         normalize,
    //         stride,
    //         offset);
    //     gl.enableVertexAttribArray(
    //         programInfo.attribLocations.vertexColor);
    // }
    //
    // // Tell WebGL which indices to use to index the vertices
    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
    //
    // // Tell WebGL to use our program when drawing
    //
    // // gl.useProgram(programInfo.program);
    //
    // // Set the shader uniforms
    //
    // gl.uniformMatrix4fv(
    //     programInfo.uniformLocations.MVPMatrix,
    //     false,
    //     MVPMatrix);
    // gl.uniformMatrix4fv(
    //     programInfo.uniformLocations.modelViewMatrix,
    //     false,
    //     modelViewMatrix);
    //
    // {
    //     const vertexCount = 6;
    //     const type = gl.UNSIGNED_SHORT;
    //     const offset = 0;
    //     gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    // }

    // Update the rotation for the next draw

    cubeRotation += deltaTime;
}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    // Create the shader program

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed, alert

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
    const shader = gl.createShader(type);

    // Send the source to the shader object

    gl.shaderSource(shader, source);

    // Compile the shader program

    gl.compileShader(shader);

    // See if it compiled successfully

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}
