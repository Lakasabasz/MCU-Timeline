import {CompleteFunction} from './completefunction.js';

export class Timeline{

  /**
  * @param {Object} description
  * @param {int} description.type
  * @param {Object} description.shader Skompilowany shader
  * @param {string} description.name Nazwa timeline
  * @param {Object[]} description.subnodes Lista node z informacjami
  * @param {float} description.width Szerokość linii (Domyślnie 0.1)
  * @param {bool} description.selected Domyślnie false
  * @param {Object[]} functionScratch
  **/
  constructor(description, functionScratch){
    this.description = this.validateDescription(description.type,
                                          description.shader,
                                          description.name,
                                          description.subnodes);
    this.func = new CompleteFunction(functionScratch);
  }

  validateDescription(type, shader, name, subnodes, width=0.1, selected=false){
    if(!Number.isInteger(type) || type < 0 || type > 2){
      throw new TypeError("type is invalid");
    }
    if(shader == null){
      throw new TypeError("shader is null");
    }
    if(name === ""){
      throw new TypeError("name of timeline cannot be empty");
    }
    if(!Array.isArray(subnodes)){
      throw new TypeError("subnodes have to be list");
    }
    width = parseFloat(width);
    if(selected !== false && selected !== true){
      throw new TypeError("selected have to be bool");
    }

    return {type: type, shader: shader, name: name, subnodes: subnodes, width: width, selected: selected};
  }
}
