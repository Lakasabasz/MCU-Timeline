/**
* @param {int} type TimelineType
* @param {Object} shader Skompilowany shader
* @param {string} name Nazwa timeline
* @param {Object[]} subnodes Lista node z informacjami
* @param {float} width Szerokość linii (Domyślnie 0.1)
* @param {bool} selected Domyślnie false
**/
export function createDescription(type, shader, name, subnodes, width=0.1, selected=false){
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
