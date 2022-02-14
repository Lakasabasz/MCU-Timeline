import {MCUTimeline} from './mcutimeline.js';
import * as simpleShader from './shaders/simpleshader.js';
import {TimelineType} from './timelinetypes.js';
import { SetupData } from './webglscene.js';
import {endpoint} from './settings.env.js';

let mcutimeline: MCUTimeline;

function loadfromendpoint(){
  fetch(endpoint, {mode: 'no-cors'}).then(resp => {
    if(!resp.ok) {
      console.log(resp);
      throw new Error("Load from endpoint failed");
    }
    return resp.json();
  }).then(setupdata =>{
    mcutimeline = new MCUTimeline("canvas", setupdata);
  }).catch(error => {
    console.error("Load from endpoint failed, loading from defaults");
    console.warn(error);
    loadfromdefaults();
  })
  return null;
}

function loadfromdefaults(){
  import('./default.js').then((x)=>{
    mcutimeline = new MCUTimeline("canvas", x.default);
  });
}

function load(){
  loadfromendpoint() || loadfromdefaults();
}

window.onload=load;
