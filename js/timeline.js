import {createDescription} from './timelinedescription.js';

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
    this.description = createDescription(description.type,
                                          description.shader,
                                          description.name,
                                          description.subnodes);
  }
}
