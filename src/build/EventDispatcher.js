class EventDispatcher {
    constructor(eventEmitter = null) {
        this.autoCleanEventData = true;
        if (eventEmitter == null)
            this._eventTarget = this;
        else
            this._eventTarget = eventEmitter;
        this.dispatcherNames = [];
        this.nbDispatcher = 0;
        this.dispatcherActifById = [];
        this.dispatcherFunctionById = [];
    }
    hasEventListener(eventName) {
        return this.dispatcherNames.lastIndexOf(eventName) != -1;
    }
    get eventTarget() {
        return this._eventTarget;
    }
    addEventListener(name, func, overrideExistingEventIfExists = false) {
        if (name == undefined || func == undefined)
            return;
        var nameId = this.dispatcherNames.indexOf(name);
        if (nameId == -1) {
            this.dispatcherActifById[this.nbDispatcher] = false;
            this.dispatcherFunctionById[this.nbDispatcher] = [];
            nameId = this.nbDispatcher;
            this.dispatcherNames[this.nbDispatcher++] = name;
        }
        if (overrideExistingEventIfExists)
            this.dispatcherFunctionById[nameId] = [func];
        else
            this.dispatcherFunctionById[nameId].push(func);
    }
    setEventTarget(target) {
        this._eventTarget = target;
    }
    clearEvents() {
        this.dispatcherNames = [];
        this.nbDispatcher = 0;
        this.dispatcherActifById = [];
        this.dispatcherFunctionById = [];
    }
    removeEventListener(name, func = null) {
        var id = this.dispatcherNames.indexOf(name);
        if (id == -1)
            return;
        if (!func) {
            this.dispatcherFunctionById[id] = [];
            return;
        }
        var functions = this.dispatcherFunctionById[id];
        var id2 = functions.indexOf(func);
        if (id2 == -1)
            return;
        functions.splice(id2, 1);
    }
    applyEvents(object = null) {
        var len = this.dispatcherNames.length;
        if (0 == len)
            return;
        var i, j, len2;
        var funcs;
        for (i = 0; i < len; i++) {
            if (this.dispatcherActifById[i] == true) {
                this.dispatcherActifById[i] = false;
                funcs = this.dispatcherFunctionById[i];
                if (funcs) {
                    len2 = funcs.length;
                    for (j = 0; j < len2; j++)
                        funcs[j](this, object, this.dispatcherNames[i]);
                }
                else {
                    console.warn("EventDispatcher.applyEvents bug ? -> ", this.dispatcherNames[i]);
                }
            }
        }
    }
    dispatchEvent(eventName, object = null, applyEvents = true) {
        var th = this;
        if (!th.dispatcherNames)
            return;
        if (this._eventTarget instanceof EventDispatcher)
            th = this._eventTarget;
        if (!object)
            object = this;
        var id = th.dispatcherNames.indexOf(eventName);
        if (id == -1)
            return;
        th.dispatcherActifById[id] = true;
        if (applyEvents)
            th.applyEvents(object);
        if (this.eventData && this.autoCleanEventData)
            this.eventData = null;
    }
}
EventDispatcher.ENTER = 13;
EventDispatcher.ESCAPE = 27;
EventDispatcher.DEL = 46;
//# sourceMappingURL=EventDispatcher.js.map