/*
 * WebGL / Javascript tutorial.
 * Author: Hartmut Schirmacher, hschirmacher.beuth-hochschule.de
 * (C)opyright 2011 by Hartmut Schirmacher, all rights reserved. 
 *
 */


/* 

    Object: Material
    Holds material coefficients for the Phong / Blinn-Phong illumination model.
    
    Parameters to the constructor:
    - kAmbient  [3 floats]: ambient reflection coefficient
    - kDiffuse  [3 floats]: diffuse reflection coefficient
    - kSpecular [3 floats]: specular reflection coefficient
    - shininess [float]: Phong exponent
    
    Methods:
    - setUniforms: sets the respective uniform variables in the shader 
    
*/ 


Material = function(kAmbient, kDiffuse, kSpecular, shininess) {

    this.kAmbient = kAmbient;
    this.kDiffuse = kDiffuse;
    this.kSpecular = kSpecular;
    this.shininess = shininess;

    // set all uniforms required to render this material
    this.setUniforms = function(program, modelViewMatrix) {
    
        program.setUniform( "material.kAmbient",       "vec3", this.kAmbient);
        program.setUniform( "material.kDiffuse",       "vec3", this.kDiffuse);
        program.setUniform( "material.kSpecular",      "vec3", this.kSpecular);
        program.setUniform( "material.shininess",      "float", this.shininess);

    }
}


