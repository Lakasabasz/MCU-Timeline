function generateSvgLine(sizePerPx, firstNodeCoords, secondNodeCoords, id) {
  var boxSize = {
    "x": 0,
    "y": 0
  }
  boxSize["x"] = secondNodeCoords["x"] - firstNodeCoords["x"];
  boxSize["y"] = secondNodeCoords["y"] - firstNodeCoords["y"];
  var width, height, viewbox;
  if (boxSize["x"] == 0) {
    boxSize["x"] = 0.25;
    width = sizePerPx["x"] * boxSize["x"] - 3.8 + 'px';
    height = sizePerPx["y"] * boxSize["y"] + 'px';
    viewbox = '0 ' + (-1 * boxSize["y"]) / 2 + ' ' + boxSize["x"] + ' ' + boxSize["y"];
  } else if (boxSize["y"] == 0) {
    boxSize["y"] = 0.25;
    width = sizePerPx["x"] * boxSize["x"] - 3.8 + 'px';
    height = sizePerPx["y"] * boxSize["y"] + 'px';
    viewbox = '0 ' + (-1 * boxSize["y"]) / 2 + ' ' + boxSize["x"] + ' ' + boxSize["y"];
  } else {
    width = sizePerPx["x"] * boxSize["x"] - 3.8 + 'px';
    height = sizePerPx["y"] * boxSize["y"] + 'px';
    viewbox = '0 ' + (-1 * boxSize["y"]) / 2 + ' ' + boxSize["x"] + ' ' + boxSize["y"];
  }
  if (boxSize["y"] == 0);
  var normalizedSecond = {
    "x": 0,
    "y": 0
  };
  if (firstNodeCoords["x"] <= secondNodeCoords["x"]) {
    normalizedSecond["x"] = secondNodeCoords["x"] - firstNodeCoords["x"];
    normalizedSecond["y"] = (secondNodeCoords["y"] - firstNodeCoords["y"]);
  } else {
    normalizedSecond["x"] = firstNodeCoords["x"] - secondNodeCoords["x"];
    normalizedSecond["y"] = (firstNodeCoords["y"] - secondNodeCoords["y"]);
  }
  return `<svg preserveAspectRatio="none" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" viewBox="${viewbox}" id="c${id}" class="connect">
    <path d="M 0 0 C 0 0 0 0 ${normalizedSecond["x"] + ' ' + normalizedSecond["y"]}" stroke="#00b5ff" stroke-width="0.035" fill="none" />
    <path d="M 0 0 C 0 0 0 0 ${normalizedSecond["x"] + ' ' + normalizedSecond["y"]}" stroke="#f500ff" stroke-width="0.001" fill="none" />
    <path d="M 0 0 C 0 0 0 0 ${normalizedSecond["x"] + ' ' + normalizedSecond["y"]}" stroke="#9eeeff" stroke-width="0.0125" fill="none" />
  </svg>`;
}

function generateSvgCurve(sizePerPx, firstNodeCoords, secondNodeCoords, id) {
  var boxSize = {
    "x": 0,
    "y": 0
  }
  boxSize["x"] = secondNodeCoords["x"] - firstNodeCoords["x"];
  boxSize["y"] = secondNodeCoords["y"] - firstNodeCoords["y"];
  var width, height, viewbox;
  if (boxSize["x"] == 0) {
    boxSize["x"] = 0.25;
    width = sizePerPx["x"] * boxSize["x"] - 3.8 + 'px';
    height = sizePerPx["y"] * boxSize["y"] + 'px';
    viewbox = '0 ' + (-1 * boxSize["y"]) / 2 + ' ' + boxSize["x"] + ' ' + boxSize["y"];
  } else if (boxSize["y"] == 0) {
    boxSize["y"] = 0.25;
    width = sizePerPx["x"] * boxSize["x"] - 3.8 + 'px';
    height = sizePerPx["y"] * boxSize["y"] + 'px';
    viewbox = '0 ' + (-1 * boxSize["y"]) / 2 + ' ' + boxSize["x"] + ' ' + boxSize["y"];
  } else {
    width = sizePerPx["x"] * boxSize["x"] - 3.8 + 'px';
    height = sizePerPx["y"] * boxSize["y"] + 'px';
    viewbox = '0 ' + (-1 * boxSize["y"]) / 2 + ' ' + boxSize["x"] + ' ' + boxSize["y"];
  }
  if (boxSize["y"] == 0);
  var normalizedSecond = {
    "x": 0,
    "y": 0
  };
  if (firstNodeCoords["x"] <= secondNodeCoords["x"]) {
    normalizedSecond["x"] = secondNodeCoords["x"] - firstNodeCoords["x"];
    normalizedSecond["y"] = (secondNodeCoords["y"] - firstNodeCoords["y"]);
  } else {
    normalizedSecond["x"] = firstNodeCoords["x"] - secondNodeCoords["x"];
    normalizedSecond["y"] = (firstNodeCoords["y"] - secondNodeCoords["y"]);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -1 2 1" id="a${id}" width="${width}" height="${height}">
  <defs>
    <filter id="filter1231">
      <feGaussianBlur stdDeviation="0.0192"></feGaussianBlur>
    </filter>
    <filter style="color-interpolation-filters:sRGB" id="filter1271" x="-0.036" width="1.072" y="-0.072" height="1.144">
      <feGaussianBlur stdDeviation="0.03" id="feGaussianBlur1273"></feGaussianBlur>
    </filter>
    <filter style="color-interpolation-filters:sRGB" id="filter1287" x="-0.009" width="1.018" y="-0.018" height="1.036">
      <feGaussianBlur stdDeviation="0.0075" id="feGaussianBlur1289"></feGaussianBlur>
    </filter>
  </defs>
  <path d="M 0 0 C 0 0 1 0 ${normalizedSecond["x"]} ${normalizedSecond["y"]}" stroke="#00b5ff" stroke-width="0.035" fill="none" style="filter:url(#filter1271);"></path>
  <path d="M 0 0 C 0 0 1 0 ${normalizedSecond["x"]} ${normalizedSecond["y"]}" stroke="#f500ff" stroke-width="0.001" fill="none" style="filter:url(#filter1231)"></path>
  <path d="M 0 0 C 0 0 1 0 ${normalizedSecond["x"]} ${normalizedSecond["y"]}" stroke="#9eeeff" stroke-width="0.0125" fill="none" style="filter:url(#filter1287);"></path>
</svg>`;
}

function drawConnections(connections) {
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
  for (var child of container.children) {
    var x = parseFloat(child.attributes['posx'].value);
    var y = parseFloat(child.attributes['posy'].value);
    child.style.left = (((x / max["x"]) * area["x"]) + offset["x"]) + "px";
    child.style.top = (((y / max["y"]) * area["y"]) + offset["y"]) + "px";
  }
  // Rysowanie łączeń
  var sizePerPx = {
    "x": area["x"] / max["x"],
    "y": area["y"] / max["y"]
  }
  var id = 0;
  for (var conn of connections) {
    if (conn["angle"] === undefined) {
      console.log(conn);
      var fn = document.getElementById(conn["between"][0]);
      var fnc = {
        "x": parseInt(fn.attributes['posx'].value),
        "y": parseInt(fn.attributes['posy'].value)
      };
      var sn = document.getElementById(conn["between"][1]);
      var snc = {
        "x": parseInt(sn.attributes['posx'].value),
        "y": parseInt(sn.attributes['posy'].value)
      };
      var html = generateSvgLine(sizePerPx, fnc, snc, id);
      document.querySelector('#connectContainer').innerHTML += html;
      let cID_styles = document.querySelector(`#c${id}`).style;
      cID_styles.left = `${((fnc["x"] / max["x"]) * area["x"]) + offset["x"] + 4.3}px`;
      cID_styles.top = `${((fnc["y"] / max["y"]) * area["y"]) + offset["y"] - 8.2}px`;
      id += 1;
    } else {
      // Łuki
      console.log(conn);
      var fn = document.getElementById(conn["between"][0]);
      var fnc = {
        "x": parseInt(fn.attributes['posx'].value),
        "y": parseInt(fn.attributes['posy'].value)
      };
      var sn = document.getElementById(conn["between"][1]);
      var snc = {
        "x": parseInt(sn.attributes['posx'].value),
        "y": parseInt(sn.attributes['posy'].value)
      };
      var html = generateSvgCurve(sizePerPx, fnc, snc, id);
      document.querySelector('#connectContainer').innerHTML += html;
      let aID_styles = document.querySelector(`#a${id}`).style;
      aID_styles.left = `${((fnc["x"] / max["x"]) * area["x"]) + offset["x"] + 4.3}px`;
      aID_styles.top = `${((fnc["y"] / max["y"]) * area["y"]) + offset["y"] + 1}px`;

    }
  }
}