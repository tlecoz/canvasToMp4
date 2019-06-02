/**
 * Created by Thomas on 04/10/2016.
 */
class EventDispatcher {

    private _eventTarget:any;
    public dispatcherNames:string[];
    public nbDispatcher:number;
    public dispatcherActifById:boolean[];
    public dispatcherFunctionById:Array<Array<Function>>;
    public debug:string;

    public eventData:any;   // Ajouter par Shane le 05/03/2019, permet de stocker des valeurs pendant un event

    public static ENTER:number = 13;    // Ajouter par shane
    public static ESCAPE:number = 27;
    public static DEL:number = 46;

    public autoCleanEventData:boolean = true;

    constructor(eventEmitter:EventDispatcher=null){
        if(eventEmitter==null) this._eventTarget = this;
        else this._eventTarget = eventEmitter;

        /*
        if(eventEmitter != null){
            //////////////////////////////////console.log("EVENT EMITTER :")
            //////////////////////////////////console.log(this);
        }
        */

        this.dispatcherNames = [];
        this.nbDispatcher = 0;
        this.dispatcherActifById = [];
        this.dispatcherFunctionById = [];


    }

    public hasEventListener(eventName:string):boolean{
      return this.dispatcherNames.lastIndexOf(eventName) != -1;
    }


    public get eventTarget():any{
        return this._eventTarget;
    }

    public addEventListener(name:string,func:Function,overrideExistingEventIfExists:boolean=false){
        if(name == undefined || func == undefined) return;

        var nameId = this.dispatcherNames.indexOf(name);
        if(nameId == -1){
            this.dispatcherActifById[this.nbDispatcher] = false;
            this.dispatcherFunctionById[this.nbDispatcher] = [];
            nameId = this.nbDispatcher;
            this.dispatcherNames[this.nbDispatcher++] = name;
        }

        if(overrideExistingEventIfExists) this.dispatcherFunctionById[nameId] = [func];
        else this.dispatcherFunctionById[nameId].push(func);

    }
    public setEventTarget(target:any){
        this._eventTarget = target;
    }
    public clearEvents():void{
        this.dispatcherNames = [];
        this.nbDispatcher = 0;
        this.dispatcherActifById = [];
        this.dispatcherFunctionById = [];

    }

    public removeEventListener(name:string,func:Function=null){
        //A REVOIR
        var id = this.dispatcherNames.indexOf(name);
        if(id == -1) return;


        if(!func){
           this.dispatcherFunctionById[id] = [];
           return;
        }

        var functions:Array<Function> = this.dispatcherFunctionById[id]
        var id2:number = functions.indexOf(func);
        if(id2 == -1) return;
        functions.splice(id2,1);
    }


    public applyEvents(object:any=null){
        var len:number = this.dispatcherNames.length;
        if(0 == len) return;

        var i:number, j:number,len2:number;
        var funcs:Array<Function>;
        for(i=0;i<len;i++){

            if(this.dispatcherActifById[i] == true){

                this.dispatcherActifById[i] = false;
                funcs = this.dispatcherFunctionById[i];
                if(funcs){
                  len2 = funcs.length;
                  for(j=0;j<len2;j++) funcs[j](this,object,this.dispatcherNames[i]);
                }else{
                  console.warn("EventDispatcher.applyEvents bug ? -> ",this.dispatcherNames[i])
                }
            }

        }
    }

    public dispatchEvent(eventName:string,object:any=null,applyEvents:boolean=true){
        var th:EventDispatcher = this;
        if(!th.dispatcherNames) return;

        if(this._eventTarget instanceof EventDispatcher) th = this._eventTarget;

        if(!object) object = this;

        var id:number = th.dispatcherNames.indexOf(eventName);
        if(id == -1) return;
        th.dispatcherActifById[id] = true;
        if(applyEvents) th.applyEvents(object);
        if (this.eventData && this.autoCleanEventData) this.eventData = null;
    }
}
