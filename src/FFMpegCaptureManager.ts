var child_process = require("child_process");
class FFMpegCaptureManager extends EventDispatcher {

  public static FFMPEG_ENCODER_START:string = "ENCODE_START";
  public static FRAME_CAPTURED:string = "FRAME_CAPTURED";
  public static FRAME_ENCODED:string = "FRAME_ENCODED";
  public static FILE_CREATION_COMPLETED:string = "FILE_CREATED";
  public static LOG:string = "LOG";

  protected logs:string;
  protected lastLog:string;

  protected frameTotal:number;
  protected frameCaptured:number;
  protected frameEncoded:number;

  private uint8array:Uint8Array;
  protected process:any;


  private started:boolean = false;
  private completed:boolean = false;



  public data:any;
  private captureMode:boolean = true;

  private command:FFmpegCommand;

  constructor(command:FFmpegCommand){
    super();
    this.init(command);
  }

  public init(command:FFmpegCommand):void{

    this.command = command;

    var w = command.width;
    var h = command.height;
    var encoderType = command.encoderType;

    this.captureMode = encoderType != "pngToMp4" && encoderType != "swfToMp4";

    if(!this.uint8array || this.uint8array.length != (w * h * 4) ) this.uint8array = new Uint8Array(w*h*4);
    //console.log("init ",w,h)
    var th = this;
    this.process = child_process.spawn("ffmpeg",command.values);
    this.process.stderr.on('data',function(data){
      var dataStr = ""+data;
      var type = dataStr.split(" ")[0];
      console.log(dataStr)
      switch(type){
        case "ffmpeg":
          th.data = dataStr;
          th.dispatchEvent(FFMpegCaptureManager.FFMPEG_ENCODER_START);
          break;
        case "frame=":
          th.data = th.parseFrameObject(dataStr);
          th.frameEncoded = th.data.frame;
          th.dispatchEvent(FFMpegCaptureManager.FRAME_ENCODED);
          th.captureFrame();

          if(encoderType == "h264_nvenc"){
            if( th.data.speed.lastIndexOf("subtitle:") != -1){
              th.dispatchEvent(FFMpegCaptureManager.FILE_CREATION_COMPLETED)
            }
          }
          break;
        case "[libx264":
          th.dispatchEvent(FFMpegCaptureManager.FILE_CREATION_COMPLETED)
          break;

      }

      th.lastLog = dataStr +"\n";
      th.logs += th.lastLog;
      th.dispatchEvent(FFMpegCaptureManager.LOG);
    })

  }


  private nextFrame:string;
  private dif:number = 40;
  private target:{ctx:CanvasRenderingContext2D|WebGLRenderingContext};
  private targetContext:CanvasRenderingContext2D|WebGLRenderingContext;


  private captureFrame():void{
    if(this.frameCaptured == this.frameTotal) this.end();
    else if(this.frameCaptured - this.frameEncoded < this.dif){
      if(this.captureMode) this.target[this.nextFrame](this.frameCaptured / this.frameTotal);
      this.capture(this.targetContext);
    }
  }



  public start(target:{ctx:CanvasRenderingContext2D|WebGLRenderingContext},updateFunctionName:string){
    this.frameTotal = this.command.nbFrameTotal;
    this.frameCaptured = this.frameEncoded = 0;
    this.nextFrame = updateFunctionName;
    this.targetContext = target.ctx;
    this.target = target;

    this.captureFrame();
  }

  private parseFrameObject(data:string):{ speed:string , bitrate:string , size:string , q:string , fps:string , frame:number }{
    var o:any = {};
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

  public get captureProgress():number{
    if(this.frameTotal>0) return this.frameCaptured / this.frameTotal;
    return 0;
  }
  public get encodingProgress():number{ return this.frameEncoded / this.frameTotal; }
  public end():void{  this.process.stdin.end(); }


  public capture(ctx:CanvasRenderingContext2D|WebGLRenderingContext):boolean{
    if(!this.process ) return;
    if(this.captureMode == false){
      this.frameCaptured++;
      this.dispatchEvent(FFMpegCaptureManager.FRAME_CAPTURED);
      return;
    }

    if(ctx instanceof CanvasRenderingContext2D){
      this.process.stdin.write(new Buffer( new Uint8Array( ctx.getImageData(0,0,ctx.canvas.width,ctx.canvas.height).data.buffer)      ,"binary"));
    }else{
      ctx.readPixels(0, 0, ctx.canvas.width, ctx.canvas.height, ctx.RGBA, ctx.UNSIGNED_BYTE, this.uint8array);
      this.process.stdin.write(new Buffer(this.uint8array,"binary"));
    }

    this.frameCaptured++;

    this.dispatchEvent(FFMpegCaptureManager.FRAME_CAPTURED);
    this.captureFrame();

    return true;

  }






}
