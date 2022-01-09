/**
* @abstract
**/
export class MonolitFunction{
  constructor(){
    const prototype = Object.getPrototypeOf(this);
    if(prototype.getSpline === undefined || prototype.getSpline.length != 0){
      throw Error("getSpline is not implemented");
    }
  }
}
