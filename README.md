# canvasToMp4


Put the file of your project inside the folder "src" , look at src/index.html to see how to use it.

if your computer have no GPU , use "libx264" as encoderType ; if you have a graphic card, prefer "h264_nvec" instead - the encoding will be much faster -

I'm not sure why but webgl-capture produce a vertical flip of the output by default, then you need to apply a vertical flip in the ffmpeg command in order to get the expected result.

You can use these encoders :
- libx264 : to create a mp4 without gpu
- libx265 : to create a mp4 with a resolution higher than 4096x2048 (8192 x 4096 max)
- h264_nvenc : to create a mp4 using the gpu to encode the frames faster
- png : to create a png sequence instead of a mp4. The filename should be something like "myPng_%04d.png".
        %04d means that the name of each png will be based on a value composed by 4 number (from myPng_0000.png to myPng_9999.png)

- pngToMp4 : to create a mp4 from a sequence of png.
             (you need to set the property "inputPath" with the path to the folder containing the pngs
             in the config object of the FFmpegCommand)




  How to use :
  ```
  var demo = document.createElement("canvas");
  demo.width = 1920;
  demo.height = 1080;
  demo.ctx = demo.getContext("2d");

  //|-->IMPORTANT : you need to create a property "ctx" containing a context2d or a webgl-context

  demo.nextFrame = function(captureProgress){   
    this.ctx.clearRect(0,0,demo.width,demo.height)
    this.ctx.beginPath();
    this.ctx.fillStyle = "#ff0000";
    this.ctx.fillRect(demo.width*captureProgress,demo.height*captureProgress,100,100);
  }


  var config = {
    width:demo.width,
    height:demo.height,
    fps:60,
    durationInSeconds:1,
    fileName:"videos/output.mp4",
    encoderType:"libx264",
    verticalFlip:false
  }

  encoder = new FFMpegCaptureManager(new FFmpegCommand(config));
  encoder.addEventListener(FFMpegCaptureManager.FILE_CREATION_COMPLETED,function(e){ console.log("FILE CREATED") })
  encoder.addEventListener(FFMpegCaptureManager.FRAME_ENCODED,function(e){ console.log("encodingProgress = ",encoder.encodingProgress)})

  encoder.start(demo,"nextFrame")

  //the object "demo" must contains a property "ctx" containing the reference of a context2d or a webgl-context;
  // here, "nextFrame" is the name of the function that update the demo
  // before each capture
  // target[updateFunctionName] is called
  // where target = demo  and updateFunctionNampe = "nextFrame"  
```

Launch canvasToMp4.exe to start the app , then press F12 to open the console


- Thanks to my teammate Shane Djafaraly who gave me a basic template using nwjs & ffmpeg as start point -
