/*
 * WebGL / Javascript tutorial.
 * Author: Hartmut Schirmacher, hschirmacher.beuth-hochschule.de
 * (C)opyright 2011 by Hartmut Schirmacher, all rights reserved. 
 *
 */



/* 
    Object: DirectionalLight
    
    Sets uniform variables in the shader to define 
    a directional light source.
    
    Parameters to the constructor:
    - direction [3 floats]: direction in which the light is travelling
    - color [3 floats]: light color / intensities (RGB)
    - inEyeSpace [bool]: is the light direction is defined in eye space?
      If not, it is assumed to be defined in model space, and will be 
      transformed by the model-view matrix.
    
    Key Methods:
    - setDirection(), setColor(), setInEyeSpace(): setters
    - setUniforms(): sets uniforms in the shader
*/
    
DirectionalLight = function(direction, color, inEyeSpace) {

    this.direction = direction;
    this.color = color;
    this.inEyeSpace = inEyeSpace;
    
    this.getDirection = function() {
        return this.direction;
    }    
    this.setDirection = function(direction) {
        this.direction = direction;
    }    
    this.setColor = function(color) {
        this.color = color;
    }
    this.setInEyeSpace = function(flag) {
        this.inEyeSpace = flag;
    }
    
    // activate this light by setting the respective uniform variables
    this.setUniforms = function(program, modelViewMatrix) {
    
        // if required, transform direction into eye space
        var dir4 = [this.direction[0], this.direction[1], this.direction[2], 0.0];
        if(this.inEyeSpace == false) {
            dir4 = mat4.multiplyVec4(modelViewMatrix, dir4);
        }
    
        program.setUniform("light.direction", "vec3", [dir4[0], dir4[1], dir4[2]], true);
        program.setUniform("light.color", "vec3", this.color, true);
    }
}

                                     
