class FFmpegCommand {
    constructor(config) {
        this.values = [];
        var width, height, fps, encoderType, fileName, inputPath, durationInSeconds;
        if (config.width)
            this.width = width = config.width;
        else
            this.width = width = 1920;
        if (config.height)
            this.height = height = config.height;
        else
            this.height = height = 1080;
        if (config.fps)
            fps = config.fps;
        else
            fps = config.fps;
        if (config.durationInSeconds)
            durationInSeconds = config.durationInSeconds;
        else
            durationInSeconds = 1;
        if (config.encoderType)
            this.encoderType = encoderType = config.encoderType;
        else
            encoderType = "h264_nvenc";
        if (config.fileName)
            fileName = config.fileName;
        else
            fileName = "output.mp4";
        if (config.inputPath)
            inputPath = config.inputPath;
        else
            inputPath = null;
        let vflip = "";
        if (config.verticalFlip)
            vflip = "-vf vflip";
        this.nbFrameTotal = Math.ceil(fps * durationInSeconds);
        if (encoderType == "libx264") {
            this.values = ("-hwaccel cuvid -y -f rawvideo -r " + fps + " -s " + width + "x" + height + " -pix_fmt rgb0 -i - -c:v libx264 " + vflip + " -pix_fmt yuv420p -profile:v baseline -preset slow " + fileName).split("  ").join(" ").split(" ");
        }
        else if (encoderType == "libx265") {
            this.values = ("-hwaccel cuvid -y -f rawvideo -r " + fps + " -s " + width + "x" + height + " -pix_fmt rgb0 -i - -c:v libx265 " + vflip + " -pix_fmt yuv420p -profile:v main -preset slow -crf 22 " + fileName).split("  ").join(" ").split(" ");
        }
        else if (encoderType == "h264_nvenc") {
            this.values = ("-hwaccel cuvid -y -f rawvideo -r " + fps + " -s " + width + "x" + height + " -pix_fmt rgb0 -i - -c:v h264_nvenc " + vflip + " -pixel_format yuv420p -rc constqp -preset slow -profile:v baseline -crf 22 " + fileName).split("  ").join(" ").split(" ");
        }
        else if (encoderType == "png") {
            this.values = ("-hwaccel cuvid -y -f rawvideo -r " + fps + " -s " + width + "x" + height + " -pix_fmt rgb0 -i - " + vflip + " " + fileName).split("  ").join(" ").split(" ");
        }
        else if (encoderType == "pngToMp4") {
            this.values = ("-hwaccel cuvid -y -r " + fps + " -i " + inputPath + " " + vflip + " -c:v h264_nvenc -pixel_format yuv420p -rc constqp -preset slow -profile:v baseline -crf 22 " + fileName).split("  ").join(" ").split(" ");
        }
        console.log(this.values);
    }
}
//# sourceMappingURL=FFMpegCommand.js.map