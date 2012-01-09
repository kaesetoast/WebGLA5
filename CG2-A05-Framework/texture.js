/*
 * WebGL / Javascript tutorial.
 * Author: Hartmut Schirmacher, hschirmacher.beuth-hochschule.de
 * (C)opyright 2011 by Hartmut Schirmacher, all rights reserved. 
 *
 */



/* 

    Object: 2D Texture
    
    Parameters to the constructor:
    - gl: WebGL context object
    - filename: name of the image file holding the texture 
    - scene: (optional) scene for which to call draw() after loading
    
*/ 


Texture2D = function(gl, filename, scene) {

    // for triggering redraw after texture has been loaded
    this.scene = scene;
    
    // WebGL context and texture object
    this.gl = gl;
    this.gltex = gl.createTexture();
    
    // the image object including the file name
    this.image = new Image();
    this.image.src = filename;
    
    // event handler to set up the texture once it is loaded
    this.image.onload = function() {
      this.handleLoadedImage();
    }
    
    // flag indicating whether loading has been completed
    this.image.isLoaded = false;
    
    // hook from the image back to the texture!
    this.image.texture = this; 

    // function called once the image has been loaded;
    //   it configures the texture and uploads it onto the GPU
    this.image.handleLoadedImage = function() {
    
        // "this" refers to the image object in this method
        var tex = this.texture;
        var gl = tex.gl;
        
        // mark texture as loaded
        tex.isLoaded = true;
        window.console.log("texture " + this.src + " loaded.");

        // assign image data 
        gl.bindTexture(gl.TEXTURE_2D, tex.gltex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, this);

        // default configuration
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        // trigger redraw if desired
        if(tex.scene != undefined) 
            tex.scene.draw();
    }

    
    // make this texture active and bind it to the given sampler name
    this.makeActive = function(program, samplerName, textureUnit, warning) {

        if(!this.isLoaded) {
            window.console.log("image file for sampler "+samplerName+" not loaded yet, please try again.");
            return;
        }

        // check whether desired texture unit is within allowed range
        if(textureUnit < 0 || textureUnit >= gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS) {
            window.console.log("ERROR: texture unit must be in the range 0 ... " + 
                                l.MAX_COMBINED_TEXTURE_IMAGE_UNITS-1);
            return;
        }
        
        // find location of texture's uniform "sampler" variable
        var location = program.gl.getUniformLocation(program.glProgram, samplerName);
        if(location == null) {
            if(warning != undefined && warning==true) {
                window.console.log("Warning: uniform sampler " + samplerName + " not used in shader.");
            }
            return;
        }
        
        // window.console.log("using texture unit "+textureUnit+" for sampler "+samplerName);

        // bind the texture unit to the sampler's location/name
        gl.uniform1i(location, textureUnit);
        checkGLError(gl);

        // activate the right texture unit
        gl.activeTexture(gl.TEXTURE0 + textureUnit);
        checkGLError(gl);
        
        // bind the actual texture object to the texture unit
        gl.bindTexture(gl.TEXTURE_2D, this.gltex);
        checkGLError(gl);
       
      
    }

}

         
            

