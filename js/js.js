function generateSvgLine(sizePerPx, firstNodeCoords, secondNodeCoords, id){
  var boxSize = {"x": 0, "y": 0}
  boxSize['x'] = secondNodeCoords['x'] - firstNodeCoords['x'];
  if(boxSize['x'] == 0) boxSize['x'] = 0.0375;
  boxSize['y'] = secondNodeCoords['y'] - firstNodeCoords['y'];
  if(boxSize['y'] == 0) boxSize['y'] = 0.0375;
  var ret = '<svg style="width: ' + sizePerPx['x'] * boxSize['x'] + 'px; height: ' + sizePerPx['y'] * boxSize['y'] + 'px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 ' + (-1*boxSize['y']) + ' ' + boxSize['x'] + ' ' + boxSize['y'] + '" id="c' + id + '" class="connect">';
  ret += '<defs>';
  ret += '<filter id="back1" x="-0.02304" width="1.04608" y="-0.04608" height="1.09216">';
  ret += '<feGaussianBlur stdDeviation="0.0192" />';
  ret += '</filter>';
  ret += '<filter id="med1" x="-0.036" width="1.072" y="-0.072" height="1.144">';
  ret += '<feGaussianBlur stdDeviation="0.03" />';
  ret += '</filter>';
  ret += '<filter id="top1" x="-0.009" width="1.018" y="-0.018" height="1.036">';
  ret += '<feGaussianBlur stdDeviation="0.0075" />';
  ret += '</filter>';
  ret += '</defs>';
  var normalizedSecond = {'x': 0, 'y': 0};
  if(firstNodeCoords['x'] <= secondNodeCoords['x']){
    normalizedSecond['x'] = secondNodeCoords['x'] - firstNodeCoords['x'];
    normalizedSecond['y'] = -1*(secondNodeCoords['y'] - firstNodeCoords['y']);
  } else{
    normalizedSecond['x'] = firstNodeCoords['x'] - secondNodeCoords['x'];
    normalizedSecond['y'] = -1*(firstNodeCoords['y'] - secondNodeCoords['y']);
  }
  ret += '<path d="M 0 0 C 0 0 0 0 ' + normalizedSecond['x'] + ' ' + normalizedSecond['y'] + '" stroke="#00b5ff" stroke-width="0.075" fill="none"';
  ret += 'style="filter:url(#med1);" />';
  ret += '<path d="M 0 0 C 0 0 0 0 ' + normalizedSecond['x'] + ' ' + normalizedSecond['y'] + '" stroke="#f500ff" stroke-width="0.05" fill="none"';
  ret += 'style="filter:url(#back1);" />';
  ret += '<path d="M 0 0 C 0 0 0 0 ' + normalizedSecond['x'] + ' ' + normalizedSecond['y'] + '" stroke="#9eeeff" stroke-width="0.025" fill="none"';
  ret += 'style="filter:url(#top1);" />';
  ret += '</svg>';
  return ret;
}

function drawConnections(connections){
    var container = document.getElementsByClassName('timeline')[0];
    var offset = {
      "x": container.getBoundingClientRect().left - document.body.getBoundingClientRect().left,
      "y": container.getBoundingClientRect().top - document.body.getBoundingClientRect().top
    }
    var area = {
      "x": container.getBoundingClientRect().width,
      "y": container.getBoundingClientRect().height
    }
    var max = {
      "x": parseFloat(container.attributes["posmx"].value),
      "y": parseInt(container.attributes["posmy"].value)
    }
    for(var child of container.children){
      var x = parseFloat(child.attributes['posx'].value);
      var y = parseFloat(child.attributes['posy'].value);
      child.style.left = ((x/max["x"])*area["x"]) + offset['x'] + "px";
      child.style.top = ((y/max["y"])*area["y"]) + offset['y'] + "px";
    }
    // Rysowanie łączeń
    var sizePerPx = {'x': area['x']/max['x'], 'y': area['y']/max['y']}
    var id = 0;
    for(var conn of connections){
      if(conn["angle"] === undefined){
        console.log(conn);
        var fn = document.getElementById(conn["between"][0]);
        var fnc = {'x': parseInt(fn.attributes['posx'].value), 'y': parseInt(fn.attributes['posy'].value)};
        var sn = document.getElementById(conn["between"][1]);
        var snc = {'x': parseInt(sn.attributes['posx'].value), 'y': parseInt(sn.attributes['posy'].value)};
        var html = generateSvgLine(sizePerPx, fnc, snc, id);
        document.getElementById('connectContainer').innerHTML += html;
        document.getElementById('c' + id).style.left = ((fnc['x']/max["x"])*area["x"]) + offset['x'] + "px";
        document.getElementById('c' + id).style.top = ((fnc['y']/max["y"])*area["y"]) + offset['y'] + "px";
        id += 1;
      } else {
        // Łuki
      }
    }
}
