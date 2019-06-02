var child_process = require("child_process");
class FFMpegCaptureManager extends EventDispatcher {
    constructor(command) {
        super();
        this.started = false;
        this.completed = false;
        this.captureMode = true;
        this.dif = 40;
        this.init(command);
    }
    init(command) {
        this.command = command;
        var w = command.width;
        var h = command.height;
        var encoderType = command.encoderType;
        this.captureMode = encoderType != "pngToMp4" && encoderType != "swfToMp4";
        if (!this.uint8array || this.uint8array.length != (w * h * 4))
            this.uint8array = new Uint8Array(w * h * 4);
        var th = this;
        this.process = child_process.spawn("ffmpeg", command.values);
        this.process.stderr.on('data', function (data) {
            var dataStr = "" + data;
            var type = dataStr.split(" ")[0];
            console.log(dataStr);
            switch (type) {
                case "ffmpeg":
                    th.data = dataStr;
                    th.dispatchEvent(FFMpegCaptureManager.FFMPEG_ENCODER_START);
                    break;
                case "frame=":
                    th.data = th.parseFrameObject(dataStr);
                    th.frameEncoded = th.data.frame;
                    th.dispatchEvent(FFMpegCaptureManager.FRAME_ENCODED);
                    th.captureFrame();
                    if (encoderType == "h264_nvenc") {
                        if (th.data.speed.lastIndexOf("subtitle:") != -1) {
                            th.dispatchEvent(FFMpegCaptureManager.FILE_CREATION_COMPLETED);
                        }
                    }
                    break;
                case "[libx264":
                    th.dispatchEvent(FFMpegCaptureManager.FILE_CREATION_COMPLETED);
                    break;
            }
            th.lastLog = dataStr + "\n";
            th.logs += th.lastLog;
            th.dispatchEvent(FFMpegCaptureManager.LOG);
        });
    }
    captureFrame() {
        if (this.frameCaptured == this.frameTotal)
            this.end();
        else if (this.frameCaptured - this.frameEncoded < this.dif) {
            if (this.captureMode)
                this.target[this.nextFrame](this.frameCaptured / this.frameTotal);
            this.capture(this.targetContext);
        }
    }
    start(target, updateFunctionName) {
        this.frameTotal = this.command.nbFrameTotal;
        this.frameCaptured = this.frameEncoded = 0;
        this.nextFrame = updateFunctionName;
        this.targetContext = target.ctx;
        this.target = target;
        this.captureFrame();
    }
    parseFrameObject(data) {
        var o = {};
        var t2;
        var t = data.split("speed=");
        o.speed = t[1];
        t2 = t[0].split("bitrate=");
        o.bitrate = t2[1];
        t = t2[0].split("time=");
        o.time = t[1];
        t2 = t[0].split("size=");
        o.size = Number(t2[1].split("kB")[0]);
        t = t2[0].split("q=");
        o.q = t[1];
        t2 = t[0].split("fps=");
        o.fps = t2[1];
        t = t2[0].split("frame=");
        o.frame = Number(t[1]);
        return o;
    }
    get captureProgress() {
        if (this.frameTotal > 0)
            return this.frameCaptured / this.frameTotal;
        return 0;
    }
    get encodingProgress() { return this.frameEncoded / this.frameTotal; }
    end() { this.process.stdin.end(); }
    capture(ctx) {
        if (!this.process)
            return;
        if (this.captureMode == false) {
            this.frameCaptured++;
            this.dispatchEvent(FFMpegCaptureManager.FRAME_CAPTURED);
            return;
        }
        if (ctx instanceof CanvasRenderingContext2D) {
            this.process.stdin.write(new Buffer(new Uint8Array(ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height).data.buffer), "binary"));
        }
        else {
            ctx.readPixels(0, 0, ctx.canvas.width, ctx.canvas.height, ctx.RGBA, ctx.UNSIGNED_BYTE, this.uint8array);
            this.process.stdin.write(new Buffer(this.uint8array, "binary"));
        }
        this.frameCaptured++;
        this.dispatchEvent(FFMpegCaptureManager.FRAME_CAPTURED);
        this.captureFrame();
        return true;
    }
}
FFMpegCaptureManager.FFMPEG_ENCODER_START = "ENCODE_START";
FFMpegCaptureManager.FRAME_CAPTURED = "FRAME_CAPTURED";
FFMpegCaptureManager.FRAME_ENCODED = "FRAME_ENCODED";
FFMpegCaptureManager.FILE_CREATION_COMPLETED = "FILE_CREATED";
FFMpegCaptureManager.LOG = "LOG";
//# sourceMappingURL=FFMpegCaptureManager.js.map