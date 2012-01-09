/*
 * WebGL / Javascript tutorial.
 * Author: Hartmut Schirmacher, hschirmacher.beuth-hochschule.de
 * (C)opyright 2011 by Hartmut Schirmacher, all rights reserved. 
 *
 */

/*

    Object: CustomScene
    
    An "empty" scene that is filled with life by providing a custom initialization
    method as well as a custom draw method.
    
    Parameters to the constructor:
    - program [Program] is the WebGL program to be used for shaders
    - backgroundColor [4 floats] specifies the values for gl.clearColor()
    - initialization method (called once)
    - draw method (called for every frame to be rendered) 

*/

CustomScene = function(program, backgroundColor, initMethod, drawMethod) {

    // remember the program to be used
    this.program = program; 
    
    // remember the background color
    this.bgColor = backgroundColor;
    
    // a camera used to define the transformation to clip space
    this.camera = new Camera();
    
    // a "global" transformation applied to the entire scene
    // it is ok to manipulate this matrix directly (sorry, needs to be improved!) 
    this.worldTransform = mat4.identity();
    
    // for the draw() method, simply use the provided function
    this.draw = drawMethod;
    this.init = initMethod;
    
    // get the associated WebGL context object
    this.getGL = function() {
        return this.program.gl;
    }
    
    // get the associated WebGL program
    this.getProgram = function() {
        return this.program;
    }
    
    // now call the init() function once
    this.init();
}    


