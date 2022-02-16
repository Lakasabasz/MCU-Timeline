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
        width: 4/200,
        selected: false,
        subnodes: [
          {t: 0.0, msg: 'Punkt A'},
          {t: 1.6, msg: 'Punkt B'}
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
    },
    {
      description: {
        type: TimelineType.COMPLEX,
        shader: "simple",
        selected: false,
        width: 8/200,
        subnodes:[
          {t: 0.0, msg: "C"},
          {t: 1.3, msg: "A"},
          {t: 2.0, msg: "B"},
        ],
        name: "Secondary"
      },
      completefunction:[
        {x: -3.0, y: -2.0, d: 1.0},
        {type: "linear"},
        {x: -1.5, y: -0.5, d: 1.0},
        {type: "bezier"},
        {x: 0.0, y: 0.0, d: 0.0},
        {type: "linear"},
        {x: 2.0, y: 0.0, d: 0.0}
      ]
    }
  ]
};

export default setupdata;
