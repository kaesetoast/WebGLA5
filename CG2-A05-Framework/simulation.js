/*
 * WebGL / Javascript tutorial.
 * Author: Hartmut Schirmacher, hschirmacher.beuth-hochschule.de
 * (C)opyright 2011 by Hartmut Schirmacher, all rights reserved. 
 *
 */

/* 

    Object: Animation

    An animation is an object that is called regularly in order
    to trigger one or multiple simulations. The animation can be
    started and stopped using start() and stop(). The Javascript
    requestAnimationFrame() functionality is used to call 
    Animation.update() whenever an update seems appropriate,
    roughly 60 times/sec.
    
    Use addSimulation() to add one or multiple simulations.
    Each simulation object must provide an update() method
    that will be called from the animation. 
    
    The simulation's update() method takes two parameters.
    The first is the total amount of time elapsed since
    start() was called; the second is the time elapsed 
    since the last animation frame. Both quantitites are
    given in miliseconds.
    
*/

Animation = function(scene) {

    // scene to be redrawn
    this.scene = scene;
    
    // list of simulations to be triggered from this animation 
    this.simulations = new Array();
    
    // flag whether this animation is actually running
    this.isRunning = false;
    
    // add a simulation to the animation loop
    this.addSimulation = function(simulation) {
    
        // add simulation to the list
        this.simulations.push(simulation);
    }
    
    // start the animation with new timer
    this.start = function() {
        this.firstTime = new Date().getTime();
        this.lastTime = 0;
        this.isRunning = true;
        // add to global list of all animations and request callback
        globalAnimationList.push(this);
        requestAnimFrame(globalAnimationLoop); 
    }
    
    // stop the animation
    this.stop = function() {
        this.lastTime = new Date().getTime();
        this.isRunning = false;
        // delete this from global animation list
        var glob = globalAnimationList;
        for(var i=0; i<glob.length; i++) {
            if(glob[i] == this) {
                glob.splice(i,1); // remove that element
                break;
            }
        }
        // cancelRequestAnimFrame(this.animationLoop); 
    }
    
    // loop that is called periodically while the window is visible
    this.update = function() {
    
        if(!this.isRunning) {
            // window.console.log("animation not running.");
            return;
        }

        // calculate elapsed time since last call
        var timeNow = new Date().getTime();
        var elapsed = 0;
        if (this.lastTime == 0) {
            elapsed = timeNow - this.firstTime;
        } else {
            elapsed = timeNow - this.lastTime;
        }
        this.lastTime = timeNow;
        
        // call all simulations with the same time information
        for(var i=0; i<this.simulations.length; i++) {
        
            // update() is called with two times:
            // - the total time elapsed since start of the animation
            // - the time elapsed since the last update() call
            this.simulations[i].update(timeNow-this.firstTime, elapsed);
        }
        
        // trigger redraw of the scene
        this.scene.draw();
    }
    
    // register this with the global list of animations
    globalAnimationList.push(this);
    
}

/*
    global list of animations and global callback
    This is required because animation callbacks 
    can only be global functions.
*/

var globalAnimationList = new Array();
globalAnimationLoop = function() {

    // if the list is empty, do not do anything
    if(globalAnimationList.length < 1) 
        return;
    
    // request the next frame
    requestAnimFrame(globalAnimationLoop); 
    
    // trigger each individual animation
    for(var i=0; i<globalAnimationList.length; i++) 
        globalAnimationList[i].update();

}


/*
    Object: SunlightSimulation
    
    Simulates a sun wandering around the Z axis with 24 hours.
    The update() function is called regularly by an animation
    object.
    
*/
        
SunlightSimulation = function(animation, sunlightNode) {

    // directional light source to be updated
    this.lightSource = sunlightNode;

    // simulation speed, in degrees per second
    this.degreesPerSecond = 5;

    // change simulation speed, in rotation degrees per second
    this.setDegreesPerSecond = function(degPerSec) {
        this.degreesPerSecond = degPerSec;
    }

    // update the simulation results.
    // this callback is triggered by an Animation object
    this.update = function(totalTime, elapsedTime) {
    
        // just use elapsed time since last call, and add 
        // a rotation to the existing light direction
        var angle = this.degreesPerSecond * Math.PI/180 * elapsedTime / 1000;
        var rot = mat4.identity();
        mat4.rotate(rot, angle, [0,0,1], rot);
        var dir = this.lightSource.getDirection();
        mat4.multiplyVec3(rot, dir, dir);
        this.lightSource.setDirection(dir);
        
    }
    
    // add simulation to animation
    animation.addSimulation(this);

}




