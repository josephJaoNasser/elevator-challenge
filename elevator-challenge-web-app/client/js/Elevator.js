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
    this.currentFloor = 0
    this.stops = 0
    this.floorsTraversed = 0
    this.requests = []
    this.riders = []
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

  dispatch(){
    this.callEvent('elevatorDispatched')
    this.requests.forEach(request => {
      if(this.riders.length || this.requests.length){
        this.goToFloor(request)
      }
    })
    this.callEvent('done')
  }

  goToFloor(person){  
    //pickup person
    while(this.currentFloor !== person.currentFloor){
      if(person.currentFloor > this.currentFloor){
        this.moveUp()
      }
      else{
        this.moveDown()
      }
    }

    //drop off people
    this.riders.forEach(rider => {
      while(this.currentFloor !== rider.dropOffFloor && this.riders.length > 0){
        if(rider.dropOffFloor > this.currentFloor){
          this.moveUp()
        }
        else{
          this.moveDown()
        }
      }
    })

    //check if the elevator should return to the loby
    this.checkReturnToLoby() && this.returnToLoby()
  }

  moveUp(){
    this.currentFloor++
    this.callEvent('floorChanged')
    this.floorsTraversed++
    if(this.hasStop()){
      this.stops++
    }   
  }

  moveDown(){
    if(this.currentFloor > 0){    
      this.currentFloor--
      this.callEvent('floorChanged')
      this.floorsTraversed++
      if(this.hasStop()){
        this.callEvent('stop')
        this.stops++
      }
    }
  }

  hasStop(){
    return (this.hasPickup() || this.hasDropoff()) && (this.floorsTraversed > 0) && this.callEvent('stop')
  }

  hasPickup(){
    const pickups = this.requests.filter(request => request.currentFloor === this.currentFloor)
    const hasPickup = pickups.length ? true : false

    this.requests = this.requests.filter(request => request.currentFloor !== this.currentFloor)
    pickups.forEach(pickup => this.riders.push(pickup))

    this.callEvent('riderEntered', pickups)
    return hasPickup
  }

  hasDropoff(){
    const dropOffs = this.riders.filter(rider => rider.dropOffFloor === this.currentFloor)
    const hasDropoff = dropOffs.length ? true : false

    this.riders = this.riders.filter(rider => rider.dropOffFloor !== this.currentFloor)

    this.callEvent('riderExit', dropOffs)
    return hasDropoff
  }

  checkReturnToLoby(){
    if(new Date().getHours() < 12 && !this.riders.length){  
      return true
    }

    return false
  }

  returnToLoby(){
    while(this.currentFloor > 0){
      this.moveDown()
    }
  }

  reset(){
    this.currentFloor = 0
    this.stops = 0
    this.floorsTraversed = 0
    this.riders = []
  }
}
