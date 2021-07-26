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
    console.log('Dupa');
    console.log(offset);
    console.log(area);
    console.log(max);
}
