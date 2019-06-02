class App {
    constructor() {
        this.started = false;
        this.completed = false;
        this.nbFrame = -1;
        this.ffmpeg = new FFMpegManager(document.body);
    }
    recordStart(target, drawFunctionName, fps = 60, durationInSeconds = 0) {
        this.drawFunc = drawFunctionName;
        this.captureTarget = target;
        this.isCanvas2D = target.ctx instanceof CanvasRenderingContext2D;
        this.completed = false;
        this.started = true;
        this.nbFrame = 0;
        this.currentFrame = 0;
        if (durationInSeconds >= 0)
            this.nbFrame = Math.ceil(durationInSeconds * fps);
        this.ffmpeg.start(target.ctx.canvas.width, target.ctx.canvas.height, fps);
    }
    recordEnd() {
        this.started = false;
        this.completed = true;
        this.ffmpeg.end();
    }
    update() {
        if (this.completed)
            return;
        if (this.captureTarget && this.started) {
            this.captureTarget[this.drawFunc]();
            if (this.isCanvas2D)
                this.ffmpeg.canvas2dToVideo(this.captureTarget.ctx);
            else
                this.ffmpeg.webglToVideo(this.captureTarget.ctx);
            this.currentFrame++;
            if (!this.completed && this.nbFrame != 0 && this.currentFrame >= this.nbFrame) {
                this.completed = true;
                this.recordEnd();
            }
            return !this.completed;
        }
    }
}
//# sourceMappingURL=App.js.map