class WebglDemo {

    public canvas:HTMLCanvasElement;
    public ctx:WebGLRenderingContext

    constructor(w:number,h:number){
      this.canvas = document.createElement("canvas");
      this.ctx = this.canvas.getContext("experimental-webgl");
      this.canvas.width = w;
      this.canvas.height = h;
    }

    public draw() {
        var gl = this.ctx;
        gl.clearColor(Math.random(), Math.random(),Math.random(), 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

}
