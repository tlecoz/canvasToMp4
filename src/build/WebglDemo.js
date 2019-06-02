class WebglDemo {
    constructor(w, h) {
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("experimental-webgl");
        this.canvas.width = w;
        this.canvas.height = h;
    }
    draw() {
        var gl = this.ctx;
        gl.clearColor(Math.random(), Math.random(), Math.random(), 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
}
//# sourceMappingURL=WebglDemo.js.map