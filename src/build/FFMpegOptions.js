class FFmpegOptions {
    constructor(width, height, fps = 60, fileName = "video.mp4") {
        this.values = [];
        this.values.push("-y");
        this.values.push("-f");
        this.values.push("rawvideo");
        this.values.push("-s");
        this.values.push(width + "x" + height);
        this.values.push("-pix_fmt");
        this.values.push("rgb0");
        this.values.push("-r");
        this.values.push("" + fps);
        this.values.push("-i");
        this.values.push("-");
        this.values.push("-an");
        this.values.push(fileName);
    }
}
//# sourceMappingURL=FFMpegOptions.js.map