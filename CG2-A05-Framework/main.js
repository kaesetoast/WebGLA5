/*
 * WebGL / Javascript tutorial.
 * Author: Hartmut Schirmacher, hschirmacher.beuth-hochschule.de
 * (C)opyright 2011 by Hartmut Schirmacher, all rights reserved. 
 *
 */

/* 

   The "Main" Function is an event handler that is called 
   whenever the HTML document is loaded/refreshed
*/

window.onload = function() {

    // initialize WebGL and compile shader program
    var canvas = window.document.getElementById("webgl_canvas");
    var gl = initWebGL("webgl_canvas"); 
    var vs = getShaderSource("vert_shader");
    var fs = getShaderSource("frag_shader");
    var prog = new Program(gl, vs, fs);
    
    // create a scene with a custom initScene() and drawScene() method 
    // (see below this function)
    theScene = new CustomScene(prog, [0.0 ,0.0, 0.0, 1.0], initScene, drawScene);

    // set the camera's viewpoint and viewing direction
    theScene.camera.lookAt([0,1.2,0], [0,0,0], [0,0,1]);
        
    // create simulation to make the sunlight wander around the earth
    theAnimation = new Animation(theScene);
    theSunSimulation = new SunlightSimulation(theAnimation, theScene.sunlight);
    
    // use the values in the HTML form to initialize camera and animation parameters
    updateCameraParams(); 
    updateAnimationParams(); 
    startStopSunAnimation();
    
    // the SceneExporer handles events to manipulate the scene
    theExplorer = new SceneExplorer(canvas,true,theScene);    
    
    // draw the scene
    theScene.draw();

};

/*
    initScene() 
    
    This function becomes a method of the scene object, and is called 
    only once to initialize the objects used in the scene. 
    
    Your objects can be member variables of the scene object, so
    that they can be used by later calls of the drawScene() method.
    ("this" refers to the scene object in these functions)
*/

initScene = function() {

    // shortcut to program and WebGL context for this scene
    var program = this.getProgram();
    var gl = this.getGL();
    
    // this texture will be loaded automatically through the UI
    this.daylightTexture = new Texture2D(gl, "textures/test_world_texture.gif", this);
        
    // directional sunlight, defined in world coordinates
    // this object will be manipulated directly by a simulation object
    this.sunlight = new DirectionalLight([0,-1,0], [1.8,1.8,1.8], false);

    // torus to symbolize the equator
    this.equatorRing = new Torus(gl, 0.55, 0.005, 10, 160, [1,0,0], [0,1,0]);
    this.showEquator = true;
    
    // material for the equator ring
    this.equatorMaterial = new Material([0.4, 0.4, 0.4], [0.6, 0.0, 0.0], [0.4, 0.4, 0.4], 200);
    
    // TODO: create the world sphere!
}
    
/*
    drawScene() 
    
    This function becomes a method of the scene object, and is called 
    for every frame to be drawn. 
    
    It can use member variables that have been defined in initScene().
*/

drawScene = function() {
    
    // shortcut to program and WebGL context for this scene
    var program = this.getProgram();
    var gl = this.getGL();
    
    // use the correct Program; uniforms have to be set *after* this
    program.use();
        
    // clear the color buffer and the depth buffer; enable depth testing
    gl.clearColor(this.bgColor[0], this.bgColor[1], 
                  this.bgColor[2], this.bgColor[3]);                        
    gl.enable(gl.DEPTH_TEST);  
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);  
    checkGLError(gl);

    // set projection matrix uniform shader variable
    program.setUniform("projectionMatrix", "mat4", this.camera.eyeToClip(), true);
        
    // calculate and set model-view matrix uniform shader variable
    var mv = mat4.create(this.camera.modelToEye()); 
    mv = mat4.multiply(mv, this.worldTransform);
    program.setUniform("modelViewMatrix", "mat4", mv, true);

    // calculate and set normal matrix uniform shader variable
    var norm =  mat4.toInverseMat3(mv);
    mat3.transpose(norm,norm);
    program.setUniform("normalMatrix", "mat3", norm, true);
                        
    // set ambient light
    program.setUniform("ambientLight", "vec3", [0.5,0.5,0.7], true);

    // set sunlight to its current value (as defined by the simulation)
    this.sunlight.setUniforms(program, mv);
    
    // activate the material for rendering the equator
    this.equatorMaterial.setUniforms(program, mv);
    
    // draw the equator
    if(this.showEquator) 
        this.equatorRing.shape.draw(program);
        
    // TODO: draw some more things!
        
}

/*
    Event handler called whenever sunlight animation
    needs to be started or stopped.
*/
     
startStopSunAnimation = function() {

    var f = document.forms["animationParameters"];
    
    if(!f) {
        window.console.log("ERROR: Could not find HTML form named 'animationParameters'.");
        return;
    }
    
    // check whether to start or stop animation
    if(f.elements["animateSun"].checked == true) {
        window.console.log("Starting sunlight animation.");
        theAnimation.start();
    } else {
        window.console.log("Stopping sunlight animation.");
        theAnimation.stop();
    }
    
}

/*
    Event handler called whenever values in the 
    "animationParameters" form have been updated.
*/
     
updateAnimationParams = function() {

    var f = document.forms["animationParameters"];
    
    if(!f) {
        window.console.log("ERROR: Could not find HTML form named 'animationParameters'.");
        return;
    }
    
    // show equator ring?
    theScene.showEquator = f.elements["renderRing"].checked == true;
    
    // use lights at night? 
    theScene.showLights = f.elements["showLights"].checked == true;
    
    // use clouds? 
    theScene.showClouds = f.elements["showClouds"].checked == true;
    
    // sunlight simulation speed 
    var sunSpeed = parseInt(f.elements["sunSpeed"].value);
    theSunSimulation.setDegreesPerSecond(sunSpeed);
    
    // do a redraw 
    theScene.draw();
    
}

/*
    Event handler called whenever a month is selected.
*/
     
updateMonth = function() {

    var f = document.forms["animationParameters"];
    
    if(!f) {
        window.console.log("ERROR: Could not find HTML form named 'animationParameters'.");
        return;
    }
    // read month ("01", "02", "03", ... "12") 
    var monthId = f.elements["month"].value;
    
    theScene.daylightTexture= new Texture2D(theScene.getGL(), 
                                             "textures/month"+monthId+".jpg", 
                                             theScene                        );
    // TODO: shouldn't we release the existing texture first? 
}
    
    


/*
    Event handler called whenever values in the 
    "cameraParameters" form have been updated.
    
    The function simply reads values from the HTML form
    and calls the respective functions of the scene's 
    camera object.
*/
     
updateCameraParams = function() {

    var f = document.forms["cameraParameters"];
    var cam = theScene.camera;
    
    if(!f) {
        window.console.log("ERROR: Could not find HTML form named 'projectionParameters'.");
        return;
    }
    
    // check which projection type to use (0 = perspective; 1 = ortho)
    if(f.elements["projection_type"][0].checked == true) {
    
        // perspective projection: fovy, aspect, near, far
        if(!cam)
            alert("Cannot find camera object!!!");

        // update camera - set up perspective projection
        cam.perspective(parseFloat(f.elements["fovy"].value), 
                        1.0, // aspect
                        parseFloat(f.elements["znear"].value),
                        parseFloat(f.elements["zfar"].value)   );
        theScene.draw();
        
    } else {

        // update camera - set up orthographic projection
        cam.orthographic(parseFloat(f.elements["left"].value),  parseFloat(f.elements["right"].value),
                         parseFloat(f.elements["bot"].value),   parseFloat(f.elements["top"].value),
                         parseFloat(f.elements["front"].value), parseFloat(f.elements["back"].value)  );
        theScene.draw();
    }
  
}


