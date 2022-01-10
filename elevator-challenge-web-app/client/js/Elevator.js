/*
Call these events in your function to trigger the animation on the front end.
THE ANIMATIONS WILL NOT PLAY IF YOU DO NOT CALL THE EVENTS
example: 
{
  ... your code ...

  this.callEvent('event_Name', parameters) or this.callEvent('event_Name')
}

Events and what they do:
'elevatorDispatched' = call when user clicks 'Dispatch elevator'
'done' = called when elevator squence is done
'floorChanged' = call when elevator floor is changed.
'stop' = call when elevator stops/should stop on a floor
'riderEntered' = call when a rider has entered. Requires an array of Person
'riderExit' = call when a rider leaves the elevator. Requires an array of Person

*/

class Elevator {
  constructor() {
    this._events = []
  }

  on(name, listener){
    if (!this._events[name]) {
      this._events[name] = [];
    }

    this._events[name].push(listener);
  }

  callEvent(name, params){
    if (!this._events[name]) {
      return
    }

    this._events[name][0](params)    
  }

  //add all your functions below
  // ...

  
}
