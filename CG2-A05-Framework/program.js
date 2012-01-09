/*
 * WebGL / Javascript tutorial.
 * Author: Hartmut Schirmacher, hschirmacher.beuth-hochschule.de
 * (C)opyright 2011 by Hartmut Schirmacher, all rights reserved. 
 *
 */



/* 

    Object: Program
    The program holds a set of shaders. During rendering of a scene,
    it is possible to switch between programs by calling their
    respective use() methods.
   
    Parameters to the constructor:
    - gl is a WebGL rendering context created via initWebGL()
    - vertexShaderSource is a string containing the GLSL source code
      of the vertex shader. 
    - fragmentShaderSource is a string containing the GLSL source code
      of the fragment shader. 
     
    Key Methods:
    - use() activates this program
    - setUniform() allows to set the value of a uniform shader variable
   
*/ 

Program = function(gl, vertexShaderSource, fragmentShaderSource) {

    /* 
       Internal Method: check shader compilation status and log error.
       Return values: true (ok), false (error)
    */
    this.checkCompilationStatus = function(shader, name) {
        var gl = this.gl;
        var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!compiled) {
            // Something went wrong during compilation; get the error
            var error = gl.getShaderInfoLog(shader);
            window.console.log("*** Error compiling shader '"
                            +name+"':"+error);
            gl.deleteShader(shader);
            return false;
        }
        return true
    }

    // remember the name and WebGL rendering context
    this.gl = gl;

    // create a new WebGL program object
    this.glProgram = gl.createProgram();
    
    // compile and attach vertex shader
    vshader = this.gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vshader, vertexShaderSource);
    gl.compileShader(vshader);
    this.checkCompilationStatus(vshader,"vertex shader");
    gl.attachShader(this.glProgram, vshader);

    // compile and attach fragment shader
    fshader = this.gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fshader, fragmentShaderSource);
    gl.compileShader(fshader);
    this.checkCompilationStatus(fshader,"fragment shader");
    gl.attachShader(this.glProgram, fshader);

    // link the program so it can be used
    this.gl.linkProgram(this.glProgram);
    
    /* 
       Method: Activate this shader program. 
       Allows to switch between multiple programs.
    */
    this.use = function() {

        this.gl.useProgram(this.glProgram);
    }
    
    /*
        Method: Set the value of a uniform variable in a WebGL shader.
   
        Parameters:
        - name [string]: the name of the uniform variable as it appears
          in the shader source code
        - type [string]: "float", "vec3", "vec4", "mat3", "mat4"
        - value [any type]: the actual value of the variable, with a type
          matching the respective WebGL type
     
        Return Value:
        - true if the uniform was set successfully, else false.
    */

    this.setUniform = function(name, type, value, warning) {

        var location = this.gl.getUniformLocation(this.glProgram, name);
        if(location == null) {
            if(warning != undefined && warning==true) {
                window.console.log("Warning: uniform variable " + name + " not used in shader.");
            }
        } else {
            switch(type) {
            case "mat4":
                this.gl.uniformMatrix4fv(location, false, value);
                return true;
            case "mat3":
                this.gl.uniformMatrix3fv(location, false, value);
                return true;
            case "mat2":
                this.gl.uniformMatrix2fv(location, false, value);
                return true;
            case "vec4":
                this.gl.uniform4fv(location, value);
                return true;
            case "vec3":
                this.gl.uniform3fv(location, value);
                return true;
            case "vec2":
                this.gl.uniform2fv(location, value);
                return true;
            case "float":
                this.gl.uniform1f(location, value);
                return true;
            case "int":
                this.gl.uniform1i(location, value);
                return true;
            case "bool": // bool is transferred as integer!
                this.gl.uniform1i(location, value);
                return true;
            default: 
                window.console.log("ERROR: unknown uniform type '"+type+"'");
            }
        }
    
        return false;
        
    } // end of method setUniform()

} // end of object Program




            