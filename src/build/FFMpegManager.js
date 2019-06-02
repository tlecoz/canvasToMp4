var child_process = require("child_process");
class FFMpegManager extends EventDispatcher {
    constructor(logDiv = null) {
        super();
        this.logs = "";
        this.logDiv = logDiv;
    }
    start(width, height, fps, filename = "video.mp4") {
        var th = this;
        this.process = child_process.spawn("ffmpeg", new FFmpegOptions(width, height, fps, filename).values);
        this.process.stderr.on('data', function (data) {
            th.lastLog = 'ffmpeg stderr data = ' + data + "\n";
            th.logs += this.lastLog;
            if (th.logDiv)
                th.logDiv.innerText += th.lastLog;
            th.dispatchEvent(FFMpegManager.ON_LOG);
        });
    }
    end() { this.process.stdin.end(); }
    canvas2dToVideo(ctx) {
        if (ctx && this.process) {
            var w = ctx.canvas.width;
            var h = ctx.canvas.height;
            var input = ctx.getImageData(0, 0, w, h).data;
            var pixels = new Uint8Array(w * h * 4);
            let i, len = pixels.length;
            for (i = 0; i < len; i++)
                pixels[i] = input[i];
            this.process.stdin.write(new Buffer(pixels, "binary"));
        }
    }
    webglToVideo(ctx) {
        if (ctx && this.process) {
            var w = ctx.canvas.width;
            var h = ctx.canvas.height;
            var pixels = new Uint8Array(w * h * 4);
            ctx.readPixels(0, 0, w, h, ctx.RGBA, ctx.UNSIGNED_BYTE, pixels);
            this.process.stdin.write(new Buffer(pixels, "binary"));
        }
    }
}
//# sourceMappingURL=FFMpegManager.js.map