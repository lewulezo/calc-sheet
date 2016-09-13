type EventHandler = (event:ObjectEvent, ...args:any[])=>any;

export class Observable{
  private listeners:{[eventName:string]:EventHandler[]};
  public fire:(eventName:string, ...args:any[])=>void;
  public on:(eventName:string, handler:EventHandler)=>Observable;
  public un:(eventName:string, handler:EventHandler)=>Observable;

  constructor(){
    const self = this;
    self.listeners = {};
    self.fire = self.dispatchEvent.bind(self);
    self.un = self.removeEventListener.bind(self);
    self.on = self.addEventListener.bind(self);
  }

  private addEventListener(eventName:string, handler:EventHandler): Observable{
    const self = this;
    let handlers = self.listeners[eventName];
    if (handlers){
      handlers.push(handler);
    } else {
      handlers = [handler];
      self.listeners[eventName] = handlers;
    }
    return this;
  }

  private removeEventListener(eventName, handler:EventHandler): Observable{
    const self = this;
    const handlers = self.listeners[eventName];
    if (handlers){
      let index = handlers.indexOf(handler);
      if (index > -1){
        handlers.splice(index, 1);
      }
    }
    return self;
  }

  private dispatchEvent(eventName:string, ...args:any[]):void{
    const self = this;
    const handlers = self.listeners[eventName];
    let evt = new ObjectEvent(eventName);
    if (handlers){
      handlers.some(func=>{
        try {
          let dispatchArgs = [evt].concat(args);
          func.apply(self, dispatchArgs);
          if (evt.stop){
            return true;
          }
        } catch (error){
          console.log(`Error in dispatchEvent ${eventName}...${error.message}`);
          if (evt.stopWhenError){
            return true;
          }
        }
      });
    }
  }

}

class ObjectEvent{
  name:string;
  stop:boolean;
  stopWhenError:boolean;

  constructor(name){
    this.name = name;
    this.stop = false;
    this.stopWhenError = true;
  }
}