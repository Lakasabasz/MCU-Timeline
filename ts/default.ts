import {vertShader, fragShader, shaderInfo} from './shaders/simpleshader.js';
import {TimelineType} from './timelinetypes.js';
import {SetupData} from './webglscene.js';

const setupdata: SetupData = {
  shaders: [
    {vCode: vertShader, fCode: fragShader, info: shaderInfo, name: "simple"}
  ],
  timelines:[
    {
      description: {
        type: TimelineType.COMPLEX,
        shader: "simple",
        selected: false,
        width: 4/200,
        subnodes: [
          {x: -1.0, msg: 'Punkt A'},
          {x: 0.0, msg: 'Punkt B'}
        ],
        name: "test"
      },
      completefunction: [
        {x: -2.0, y: 0.0, d: 0.0},
        {type: "linear"},
        {x: -1.0, y: 0.0, d: 0.0},
        {type: "bezier"},
        {x: 0.5, y: 1.0, d: 1.0},
        {type: "linear"},
        {x: 2.5, y: 3.0, d: 1.0}
      ]
    }
  ]
};

export default setupdata;
