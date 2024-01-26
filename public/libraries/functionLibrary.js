const SVG_NS = "http://www.w3.org/2000/svg";
const XLINK_NS = 'http://www.w3.org/1999/xlink';

// #ef Colors
let clr_brightOrange = 'rgba(240,75,0,255)';
let clr_brightOrange2 = '#ea4607';
let clr_brightBlue = 'rgba(56,126,211,255)';
let clr_mustard = 'rgba(244,182,0,255)';
let clr_brightRed = 'rgba(229,42,25,255)';
let clr_brightRed2 = '#dc3f3d';
let clr_darkRed2 = '#9a0504';
let clr_darkRed = '#a60701';
let clr_green = 'rgba(0,147,92,255)';
let clr_limeGreen = 'rgb(153,255,0)';
let clr_brightGreen = '#31d196';
let clr_navyBlue = 'rgba(28,72,121,255)';
let clr_plum = 'rgba(82,44,85,255)';
let clr_lavander = 'rgba(162,126,198,255)';
let clr_lightGrey = '#adadb7';
let clr_blueGrey = '#708090';
let clr_lightGreen = '#85b068';
let clr_yellow = 'rgba(254,213,0,255)';
let clr_neonMagenta = "rgb(255, 21, 160)";
// #endef END Colors

// #ef mkDivCanvas
let mkDivCanvas = function({
  w = 200,
  h = 200,
  top = 0,
  left = 0,
  clr = 'black'
} = {
  w: 200,
  h: 200,
  clr: 'black',
  top: 0,
  left: 0
}) {
  let t_div = document.createElement("div");
  t_div.style.width = w.toString() + "px";
  t_div.style.height = h.toString() + "px";
  t_div.style.backgroundColor = clr;
  t_div.style.position = 'absolute';
  t_div.style.top = top.toString() + 'px';
  t_div.style.left = left.toString() + 'px';
  return t_div;
}
// #endef END MAKE CANVAS DIV

// #ef mkSVGcanvas
let mkSVGcanvas = function({
  w = 200,
  h = 200,
  clr = 'black'
} = {
  w: 200,
  h: 200,
  clr: 'black'
}) {
  let tsvgCanvas = document.createElementNS(SVG_NS, "svg");
  tsvgCanvas.setAttributeNS(null, "width", w);
  tsvgCanvas.setAttributeNS(null, "height", h);
  tsvgCanvas.style.backgroundColor = clr;
  return tsvgCanvas;
}
// #endef END MAKE SVG CANVAS

// #ef mkPanel
let mkPanel = function({
  canvasType = 0,
  w = 200,
  h = 200,
  title = 'panel',
  ipos = 'center-top',
  offsetX = '0px',
  offsetY = '0px',
  autopos = 'none',
  headerSize = 'xs',
  onwindowresize = false,
  contentOverflow = 'hidden',
  clr = 'black',
  onsmallified = function() {},
  onunsmallified = function() {},
  canresize = false
} = {
  canvasType: 0, // 0=div;1=svg
  w: 200,
  h: 200,
  title: 'panel',
  ipos: 'center-top',
  offsetX: '0px',
  offsetY: '0px',
  autopos: 'none',
  headerSize: 'xs',
  onwindowresize: false,
  contentOverflow: 'hidden',
  clr: 'black',
  onsmallified: function() {},
  onunsmallified: function() {},
  canresize: false
}) {
  let tempPanel;
  let canvas;
  switch (canvasType) {
    case 0: //div
      canvas = mkDivCanvas({
        w: w,
        h: h,
        clr: clr
      });
      break;
    case 1: //SVG
      canvas = mkSVGcanvas({
        w: w,
        h: h,
        clr: clr
      });
      break;
  }

  jsPanel.create({
    position: {
      my: ipos,
      at: ipos,
      offsetX: offsetX,
      offsetY: offsetY,
      autoposition: autopos
    },
    contentSize: w.toString() + " " + h.toString(),
    header: 'auto-show-hide',
    headerControls: {
      size: headerSize,
      minimize: 'remove',
      maximize: 'remove',
      close: 'remove'
    },
    contentOverflow: contentOverflow,
    headerTitle: title,
    theme: "light",
    content: canvas, //svg canvas lives here
    resizeit: {
      aspectRatio: 'content',
      resize: function(panel, paneldata, e) {}
    },
    onwindowresize: onwindowresize,
    onsmallified: onsmallified,
    onunsmallified: onunsmallified,
    resizeit: {
      disable: !canresize
    },
    callback: function() {
      tempPanel = this;
    }
  });
  return tempPanel;

}

// #endef END mkPanel

// #ef mkSpan

let mkSpan = function({
  canvas,
  top = 0,
  left = 0,
  text = 'welcome to the thunderdome',
  fontSize = 14,
  color = 'green',
  bgClr = 'black'
} = {
  canvas,
  top: 0,
  left: 0,
  text: 'welcome to the thunderdome',
  fontSize: 14,
  color: 'green',
  bgClr: 'black'
}) {
  let lbl = document.createElement("span");
  lbl.innerHTML = text;
  lbl.style.fontSize = fontSize.toString() + "px";
  lbl.style.color = color;
  lbl.style.fontFamily = "Lato";
  lbl.style.position = 'absolute';
  lbl.style.top = top.toString() + 'px';
  lbl.style.left = left.toString() + 'px';
  lbl.style.backgroundColor = bgClr;
  lbl.style.padding = '0px';
  lbl.style.margin = '0px';
  lbl.style.borderWidth = '0px';
  canvas.appendChild(lbl);
  return lbl;
}
// #endef END mkSpan

// #ef mkDiv
let mkDiv = function({
  canvas,
  w = 50,
  h = 20,
  top = 0,
  left = 0,
  bgClr = clr_limeGreen
} = {
  canvas,
  w: 50,
  h: 20,
  top: 0,
  left: 0,
  bgClr: clr_limeGreen
}) {
  let tDiv = document.createElement("div");
  tDiv.style.position = 'absolute';
  tDiv.style.width = w.toString() + "px";
  tDiv.style.height = h.toString() + "px";
  tDiv.style.top = top.toString() + 'px';
  tDiv.style.left = left.toString() + 'px';
  tDiv.style.backgroundColor = bgClr;
  canvas.appendChild(tDiv);
  return tDiv;
}
// #endef END mkDiv

// #ef mkSVGcontainer
let mkSVGcontainer = function({
  canvas,
  w = 200,
  h = 200,
  x = 50,
  y = 50
} = {
  canvas,
  w: 200,
  h: 200,
  x: 50,
  y: 50
}) {
  let tSvgCont = document.createElementNS(SVG_NS, "svg");
  tSvgCont.setAttributeNS(null, "width", w);
  tSvgCont.setAttributeNS(null, "height", h);
  tSvgCont.setAttributeNS(null, "x", x);
  tSvgCont.setAttributeNS(null, "y", y);
  canvas.appendChild(tSvgCont);
  return tSvgCont;
}
// #endef END mkSVGcontainer

//#ef mkInputField
function mkInputField({
  canvas,
  id = 'inputField',
  w = 50,
  h = 20,
  top = 0,
  left = 0,
  color = 'black',
  fontSize = 11,
  clickAction = function() {},
  keyUpAction = function() {}
} = {
  canvas,
  id: 'inputField',
  w: 50,
  h: 20,
  top: 0,
  left: 0,
  color: 'black',
  fontSize: 11,
  clickAction: function() {},
  keyUpAction: function() {}
}) {
  let inputField = document.createElement("input");
  inputField.type = 'text';
  inputField.className = 'input__field--yoshiko';
  inputField.id = id;
  inputField.style.width = w.toString() + "px";
  inputField.style.height = h.toString() + "px";
  inputField.style.top = top.toString() + "px";
  inputField.style.left = left.toString() + "px";
  inputField.style.fontSize = fontSize.toString() + "px";
  inputField.style.color = color;
  inputField.addEventListener("click", clickAction);
  inputField.addEventListener("keyup", keyUpAction);
  canvas.appendChild(inputField);
  return inputField;
}
// #endef END mkInputField

// #ef mkCheckboxesHoriz
let mkCheckboxesHoriz = function({
  canvas,
  numBoxes = 3,
  boxSz = 18,
  gap = 7,
  top = 0,
  left = 0,
  lblArray = ['0', '1', '2', '3'],
  lblClr = 'rgb(153,255,0)',
  lblFontSz = 18
} = {
  canvas,
  numBoxes: 3,
  boxSz: 18,
  gap: 7,
  top: 0,
  left: 0,
  lblArray: ['0', '1', '2', '3'],
  lblClr: 'rgb(153,255,0)',
  lblFontSz: 18
}) {
  let cbArray = [];
  // Make Checkboxes
  for (let cbix = 0; cbix < numBoxes; cbix++) {
    let cbDict = {};
    var cb = document.createElement("input");
    cb.type = 'checkbox';
    cb.value = '0';
    cb.style.width = boxSz.toString() + 'px';
    cb.style.height = boxSz.toString() + 'px';
    cb.style.position = 'absolute';
    cb.style.top = top.toString() + 'px';
    let boxL = left + (gap * cbix) + (boxSz * cbix);
    cb.style.left = boxL.toString() + 'px';
    cb.style.padding = '0px';
    cb.style.margin = '0px';
    cb.style.borderWidth = '0px';
    canvas.appendChild(cb);
    cbDict['cb'] = cb;


    // Make Labels
    let lTop = top + boxSz;
    let cbLbl = mkSpan({
      canvas: canvas,
      top: lTop,
      text: lblArray[cbix],
      fontSize: lblFontSz,
      color: 'rgb(153,255,0)'
    });
    let lblW = cbLbl.getBoundingClientRect().width;
    let cbW = cb.getBoundingClientRect().width;
    let half_LabelCbWidthDifference = (lblW - cbW) / 2;
    let lblL = boxL - half_LabelCbWidthDifference;
    cbLbl.style.left = lblL.toString() + 'px';
    cbDict['lbl'] = cbLbl;
    cbArray.push(cbDict);
  }
  return cbArray;
}
// #endef END mkCheckBoxesHoriz

// #ef mkCheckboxesVert
let mkCheckboxesVert = function({
  canvas,
  numBoxes = 3,
  boxSz = 18,
  gap = 7,
  top = 0,
  left = 0,
  lblArray = ['0', '1', '2', '3'],
  lblClr = 'rgb(153,255,0)',
  lblFontSz = 18
} = {
  canvas,
  numBoxes: 3,
  boxSz: 18,
  gap: 7,
  top: 0,
  left: 0,
  lblArray: ['0', '1', '2', '3'],
  lblClr: 'rgb(153,255,0)',
  lblFontSz: 18
}) {
  let cbArray = [];
  // Make Checkboxes
  for (let cbix = 0; cbix < numBoxes; cbix++) {
    let cbDict = {};
    var cb = document.createElement("input");
    cb.type = 'checkbox';
    cb.value = '0';
    cb.style.width = boxSz.toString() + 'px';
    cb.style.height = boxSz.toString() + 'px';
    cb.style.position = 'absolute';
    let boxT = top + (gap * cbix) + (boxSz * cbix);
    cb.style.top = boxT.toString() + 'px';
    cb.style.left = left.toString() + 'px';
    cb.style.padding = '0px';
    cb.style.margin = '0px';
    cb.style.borderWidth = '0px';
    canvas.appendChild(cb);
    cbDict['cb'] = cb;


    // Make Labels
    let lLeft = left + boxSz + 5;
    let cbLbl = mkSpan({
      canvas: canvas,
      top: top,
      left: lLeft,
      text: lblArray[cbix],
      fontSize: lblFontSz,
      color: 'rgb(153,255,0)'
    });
    let lblH = cbLbl.getBoundingClientRect().height;
    let cbH = cb.getBoundingClientRect().height;
    let half_LabelCbHeightDifference = (lblH - cbH) / 2;
    let lblTop = boxT - half_LabelCbHeightDifference;
    cbLbl.style.top = lblTop.toString() + 'px';
    cbDict['lbl'] = cbLbl;
    cbArray.push(cbDict);
  }
  return cbArray;
}
// #endef END mkCheckboxesVert

// #ef mkMenu
function mkMenu({
  canvas,
  w = 200,
  h = 100,
  top = 15,
  left = 15,
  menuLbl_ActionArray = [{
    label: 'one',
    action: function() {
      console.log('one');
    },
    label: 'two',
    action: function() {
      console.log('two');
    }
  }]
} = {
  canvas,
  w: 200,
  h: 100,
  top: 15,
  left: 15,
  menuLbl_ActionArray: [{
    label: one,
    action: function() {
      console.log('one');
    },
    label: two,
    action: function() {
      console.log('two');
    }
  }]
}) {
  let menuDiv = document.createElement("div");
  menuDiv.className = 'dropdown-content';
  menuDiv.style.width = w.toString() + "px";
  menuDiv.style.top = top.toString() + "px";
  menuDiv.style.left = left.toString() + "px";
  menuDiv.style.maxHeight = h.toString() + "px";
  // menuDiv.style.minHeight = h.toString() + "px";
  canvas.appendChild(menuDiv);
  //menuLbl_ActionArray = [{label:, action:}]
  menuLbl_ActionArray.forEach((labelActionArray) => {
    let tempAtag = document.createElement('a');
    tempAtag.textContent = labelActionArray.label;
    tempAtag.style.fontFamily = "lato";
    tempAtag.addEventListener("click", labelActionArray.action);
    menuDiv.appendChild(tempAtag);
  });
  // Close the dropdown menu if the user clicks outside of it
  window.onclick = function(event) {
    if (!event.target.matches('.btn')) {
      let dropdowns = document.getElementsByClassName("dropdown-content");
      let i;
      for (i = 0; i < dropdowns.length; i++) {
        let openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }

  return menuDiv;
}
// #endef END mkMenu

// #ef mkButton
function mkButton({
  canvas,
  w = 50,
  h = 50,
  top = 15,
  left = 15,
  label = 'Press Me Hard',
  fontSize = 13,
  action = {}
} = {
  canvas,
  w: 50,
  h: 50,
  top: 15,
  left: 15,
  label: 'Press Me Hard',
  fontSize: 13,
  action: {}
}) {
  let btn = document.createElement("BUTTON");
  btn.className = 'btn btn-1';
  btn.innerText = label;
  btn.style.width = w.toString() + "px";
  btn.style.height = h.toString() + "px";
  btn.style.top = top.toString() + "px";
  btn.style.left = left.toString() + "px";
  btn.style.fontSize = fontSize.toString() + "px";
  btn.addEventListener("click", action);
  canvas.appendChild(btn);
  return btn;
}
// #endefEND mkButton

// #ef getUrlArgs
function getUrlArgs() {
  let args = {};
  let parts = window.location.href.replace(
    /[?&]+([^=&]+)=([^&]*)/gi,
    function(m, key, value) {
      args[key] = value;
    });
  return args;
}
// #endef END getUrlArgs()

// #ef rrand
function rrand(min, max) {
  return Math.random() * (max - min) + min;
}
// #endef END rrand

// #ef rrandInt
let rrandInt = function(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}
// #endef END rrandInt

// #ef choose

let choose = function(choicesArr) {
  let t_theThingToReturn;
  if (choicesArr.length != 0) {
    let randpick = rrandInt(0, choicesArr.length - 1);
    t_theThingToReturn = choicesArr[randpick];
  }

  return t_theThingToReturn;

}

// #endef END choose

// #ef chooseIndex

let chooseIndex = function(choicesArr) {

  let randpick = rrandInt(0, choicesArr.length - 1);

  return randpick;

}

// #endef END chooseIndex

// #ef generateFileNameWdate
let generateFileNameWdate = function(name) {
  let t_now = new Date();
  let month = t_now.getMonth() + 1;
  let fileName = name + '-' + t_now.getFullYear() + "-" + month + "-" + t_now.getUTCDate() + "-" + t_now.getHours() + "-" + t_now.getMinutes() + "-" + t_now.getSeconds() + '.txt';
  return fileName
}
// #endef END generateFileNameWdate

// #ef downloadStrToHD
// download('the content of the file', 'filename.txt', 'text/plain');
let downloadStrToHD = function(strData, strFileName, strMimeType) {
  let D = document,
    A = arguments,
    a = D.createElement("a"),
    d = A[0],
    n = A[1],
    t = A[2] || "text/plain";

  //build download link:
  a.href = "data:" + strMimeType + "charset=utf-8," + escape(strData);

  if (window.MSBlobBuilder) { // IE10
    let bb = new MSBlobBuilder();
    bb.append(strData);
    return navigator.msSaveBlob(bb, strFileName);
  } /* end if(window.MSBlobBuilder) */

  if ('download' in a) { //FF20, CH19
    a.setAttribute("download", n);
    a.innerHTML = "downloading...";
    D.body.appendChild(a);
    setTimeout(function() {
      let e = D.createEvent("MouseEvents");
      e.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      a.dispatchEvent(e);
      D.body.removeChild(a);
    }, 66);
    return true;
  }; /* end if('download' in a) */

  //do iframe dataURL download: (older W3)
  let f = D.createElement("iframe");
  D.body.appendChild(f);
  f.src = "data:" + (A[2] ? A[2] : "application/octet-stream") + (window.btoa ? ";base64" : "") + "," + (window.btoa ? window.btoa : escape)(strData);
  setTimeout(function() {
    D.body.removeChild(f);
  }, 333);
  return true;
}
// #endef END downloadStrToHD

// #ef retrieveFileFromPath
// USAGE: let data = await retrieveFileFromPath(path)
// Every line after await will execute after file is retrived or the Promise is resolved
// Text will be available as data.fileData
function retrieveFileFromPath(path) {
  return new Promise((resolve, reject) => {
    let request = new XMLHttpRequest();
    request.open('GET', path, true);
    request.responseType = 'text';
    request.onload = () => resolve({
      fileData: request.response
    });
    request.onerror = reject;
    request.send();
  })
}
// #endef END retrieveFileFromPath

// #ef retrieveFileFromFinder
let retrieveFileFromFinder = async function() {
  return new Promise((resolve, reject) => {
    let input = document.createElement('input');
    input.type = 'file';
    input.onchange = e => {
      let file = e.target.files[0];
      let reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      reader.onload = readerEvent => {
        let content = readerEvent.target.result;
        resolve(content);
      }
    }
    input.click();
  })
}

// #endef END retrieveFileFromFinder

// #ef rads
function rads(deg) {
  return (deg * Math.PI) / 180;
}
// #endef END rads

// #ef mkSvgCircle

let mkSvgCircle = function({
  svgContainer,
  cx = 25,
  cy = 25,
  r = 10,
  fill = 'green',
  stroke = 'yellow',
  strokeW = 3
} = {
  svgContainer,
  cx: 25,
  cy: 25,
  r: 10,
  fill: 'green',
  stroke: 'yellow',
  strokeW: 3
}) {

  var bbCircle = document.createElementNS(SVG_NS, "circle");
  bbCircle.setAttributeNS(null, "cx", cx);
  bbCircle.setAttributeNS(null, "cy", cy);
  bbCircle.setAttributeNS(null, "r", r);
  bbCircle.setAttributeNS(null, "fill", fill);
  bbCircle.setAttributeNS(null, "stroke", stroke);
  bbCircle.setAttributeNS(null, "stroke-width", strokeW);
  svgContainer.appendChild(bbCircle);
  return bbCircle;
}

// #endef END mkSvgCircle

// #ef mkSvgLine

let mkSvgLine = function({
  svgContainer,
  x1 = 25,
  y1 = 25,
  x2 = 25,
  y2 = 25,
  stroke = 'yellow',
  strokeW = 3
} = {
  svgContainer,
  x1: 25,
  y1: 25,
  x2: 25,
  y2: 25,
  stroke: 'yellow',
  strokeW: 3
}) {

  var svgLine = document.createElementNS(SVG_NS, "line");
  svgLine.setAttributeNS(null, "x1", x1);
  svgLine.setAttributeNS(null, "y1", y1);
  svgLine.setAttributeNS(null, "x2", x2);
  svgLine.setAttributeNS(null, "y2", y2);
  svgLine.setAttributeNS(null, "stroke", stroke);
  svgLine.setAttributeNS(null, "stroke-width", strokeW);
  svgContainer.appendChild(svgLine);

  return svgLine;
}

// Usage Example:
// let svgLine = mkSvgLine({
//   svgContainer: bbSet[bbIx].svgCont,
//   x1: 0,
//   y1: BB_H - HALF_BB_BOUNCE_WEIGHT,
//   x2: BB_W,
//   y2: BB_H - HALF_BB_BOUNCE_WEIGHT,
//   stroke: 'black',
//   strokeW: BB_BOUNCE_WEIGHT
// });

// #endef END mkSvgLine

// #ef mkSvgRect

let mkSvgRect = function({
  svgContainer,
  x = 25,
  y = 25,
  w = 10,
  h = 10,
  fill = 'green',
  stroke = 'yellow',
  strokeW = 0,
  roundR = 0
} = {
  svgContainer,
  x: 25,
  y: 25,
  w: 10,
  h: 10,
  fill: 'green',
  stroke: 'yellow',
  strokeW: 0,
  roundR: 0
}) {

  let svgRect = document.createElementNS(SVG_NS, "rect");
  svgRect.setAttributeNS(null, "x", x);
  svgRect.setAttributeNS(null, "y", y);
  svgRect.setAttributeNS(null, "width", w);
  svgRect.setAttributeNS(null, "height", h);
  svgRect.setAttributeNS(null, "fill", fill);
  svgRect.setAttributeNS(null, "stroke", stroke);
  svgRect.setAttributeNS(null, "stroke-width", strokeW);
  svgRect.setAttributeNS(null, "rx", roundR);
  svgContainer.appendChild(svgRect);
  return svgRect;
}

// #endef END mkSvgRect

// #ef describeArc

let polarToCartesian = function(centerX, centerY, radius, angleInDegrees) {
  let angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

function describeArc(x, y, radius, startAngle, endAngle) {
  let start = polarToCartesian(x, y, radius, endAngle);
  let end = polarToCartesian(x, y, radius, startAngle);
  let arcSweep = endAngle - startAngle <= 180 ? "0" : "1";
  let d = [
    "M", start.x, start.y,
    "A", radius, radius, 0, arcSweep, 0, end.x, end.y,
    "L", x, y,
    "L", start.x, start.y
  ].join(" ");
  return d;
}

// #endef END describeArc

// #ef mkSvgArc

let mkSvgArc = function({
  svgContainer,
  x = 0,
  y = 0,
  radius = 10,
  startAngle = 45,
  endAngle = 180,
  fill = 'green',
  stroke = 'yellow',
  strokeW = 3,
  strokeCap = 'round' //square;round;butt
} = {
  svgContainer,
  x: 0,
  y: 0,
  radius: 10,
  startAngle: 45,
  endAngle: 180,
  fill: 'green',
  stroke: 'yellow',
  strokeW: 3,
  strokeCap: 'round' //square;round;butt
}) {

  let start = polarToCartesian(x, y, radius, endAngle);
  let end = polarToCartesian(x, y, radius, startAngle);
  let arcSweep = endAngle - startAngle <= 180 ? "0" : "1";
  let d = [
    "M", start.x, start.y,
    "A", radius, radius, 0, arcSweep, 0, end.x, end.y,
    "L", x, y,
    "L", start.x, start.y
  ].join(" ");

  // << << ARCS PROPER -------------------- >
  let arc = document.createElementNS(SVG_NS, "path");
  arc.setAttributeNS(null, "d", d); //describeArc makes 12'0clock =0degrees
  arc.setAttributeNS(null, "stroke-width", strokeW);
  arc.setAttributeNS(null, "stroke", stroke);
  arc.setAttributeNS(null, "fill", fill);
  arc.setAttributeNS(null, "stroke-linecap", strokeCap);
  svgContainer.appendChild(arc);

  return arc;
}

// #endef END mkSvgArc

// #ef mkSvgTriangle

let mkSvgTriangle = function({
  svgContainer,
  cx = 25,
  cy = 25,
  h = 10,
  w = 10,
  fill = 'green',
  stroke = 'black',
  strokeW = 3
} = {
  svgContainer,
  cx: 25,
  cy: 25,
  h: 10,
  w: 10,
  fill: 'green',
  stroke: 'black',
  strokeW: 3
}) {

  let x1, x2, x3, y1, y2, y3;
  let halfH = h / 2;
  let halfW = w / 2;
  x1 = cx;
  y1 = cy - halfH;
  x2 = cx + halfW;
  y2 = cy + halfH;
  x3 = cx - halfW;
  y3 = cy + halfH;

  let pointsString = x1.toString() + ',' + y1.toString() + ' ' + x2.toString() + ',' + y2.toString() + ' ' + x3.toString() + ',' + y3.toString();

  var svgTriangle = document.createElementNS(SVG_NS, "polygon");
  svgTriangle.setAttributeNS(null, "points", pointsString);
  svgTriangle.setAttributeNS(null, "fill", fill);
  svgTriangle.setAttributeNS(null, "stroke", stroke);
  svgTriangle.setAttributeNS(null, "stroke-width", strokeW);
  svgContainer.appendChild(svgTriangle);
  return svgTriangle;
}


let mkSvgTriangle2 = function({
  svgContainer,
  cx = 25,
  cy = 25,
  h = 10,
  w = 10,
  fill = 'green',
  stroke = 'black',
  strokeW = 3
} = {
  svgContainer,
  cx: 25,
  cy: 25,
  h: 10,
  w: 10,
  fill: 'green',
  stroke: 'black',
  strokeW: 3
}) {

  let x1, x2, x3, y1, y2, y3;
  let halfH = h / 2;
  let halfW = w / 2;

  x3 = cx;
  y1 = cy - halfH;
  x2 = cx + halfW;
  y2 = cy - halfH;
  x1 = cx - halfW;
  y3 = cy + halfH;

  let pointsString = x1.toString() + ',' + y1.toString() + ' ' + x2.toString() + ',' + y2.toString() + ' ' + x3.toString() + ',' + y3.toString();

  var svgTriangle = document.createElementNS(SVG_NS, "polygon");
  svgTriangle.setAttributeNS(null, "points", pointsString);
  svgTriangle.setAttributeNS(null, "fill", fill);
  svgTriangle.setAttributeNS(null, "stroke", stroke);
  svgTriangle.setAttributeNS(null, "stroke-width", strokeW);
  svgContainer.appendChild(svgTriangle);
  return svgTriangle;
}

// #endef END mkSvgTriangle

// #ef mkSvgText

let mkSvgText = function({
  svgContainer,
  x = 0,
  y = 0,
  fill = 'black',
  stroke = 'white',
  strokeW = 0,
  justifyH = 'start',
  justifyV = 'auto',
  fontSz = 18,
  fontFamily = 'lato',
  txt = '007'
} = {
  svgContainer,
  x: 25,
  y: 25,
  fill: 'black',
  stroke: 'white',
  strokeW: 0,
  justifyH: 'start',
  justifyV: 'auto',
  fontSz: 18,
  fontFamily: 'lato',
  txt: '007'
}) {

  let svgText = document.createElementNS(SVG_NS, "text");
  svgText.setAttributeNS(null, "x", x);
  svgText.setAttributeNS(null, "y", y);
  svgText.setAttributeNS(null, "fill", fill);
  svgText.setAttributeNS(null, "stroke", stroke);
  svgText.setAttributeNS(null, "stroke-width", strokeW);
  svgText.setAttributeNS(null, "text-anchor", justifyH); //start;middle;end
  svgText.setAttributeNS(null, "font-size", fontSz);
  svgText.setAttributeNS(null, "font-family", strokeW);
  // auto | baseline | before-edge | text-before-edge | middle | central | after-edge | text-after-edge | ideographic | alphabetic | hanging | mathematical | inherit
  svgText.setAttributeNS(null, "alignment-baseline", justifyV);
  svgText.textContent = txt;
  svgContainer.appendChild(svgText);
  return svgText;
}
//Usage
// let tTxt = mkSvgText({
//   svgContainer: canvas.svg,
//   x: 25,
//   y: 25,
//   fill: 'black',
//   stroke: 'white',
//   strokeW: 0,
//   justifyH: 'start',
//   justifyV: 'auto',
//   fontSz: 18,
//   fontFamily: 'lato',
//   txt: '007'
// });
// #endef END mkSvgText

// #ef mkSvgDiamond

let mkSvgDiamond = function({
  svgContainer,
  cx = 25,
  cy = 25,
  h = 10,
  w = 10,
  fill = 'green',
  stroke = 'black',
  strokeW = 3
} = {
  svgContainer,
  cx: 25,
  cy: 25,
  h: 10,
  w: 10,
  fill: 'green',
  stroke: 'black',
  strokeW: 3
}) {

  let x1, x2, x3, y1, y2, y3, x4, y4;
  let halfH = h / 2;
  let halfW = w / 2;
  x1 = cx;
  y1 = cy - halfH;
  x2 = cx + halfW;
  y2 = cy;
  x3 = cx;
  y3 = cy + halfH;
  x4 = cx - halfW;
  y4 = cy;

  let pointsString = x1.toString() + ',' + y1.toString() + ' ' + x2.toString() + ',' + y2.toString() + ' ' + x3.toString() + ',' + y3.toString() + ' ' + x4.toString() + ',' + y4.toString();

  var svgDiamond = document.createElementNS(SVG_NS, "polygon");
  svgDiamond.setAttributeNS(null, "points", pointsString);
  svgDiamond.setAttributeNS(null, "fill", fill);
  svgDiamond.setAttributeNS(null, "stroke", stroke);
  svgDiamond.setAttributeNS(null, "stroke-width", strokeW);
  svgContainer.appendChild(svgDiamond);
  return svgDiamond;
}

// #endef END mkSvgDiamond

// #ef getImage (async)
async function getImage(url) {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}
// Wrapper to deal with asynchronous process
function run_getImage(path) {
  return getImage(path);
}
// #endef END getImage (async)

// #ef generatePalindromeTimeContainers

let generatePalindromeTimeContainers = function({

  numContainersOneWay = 4,
  startCont_minMax = [90, 110],
  pctChg_minMax = [-0.25, -0.31]
} = {
  numContainersOneWay: 4,
  startCont_minMax: [90, 110],
  pctChg_minMax: [-0.25, -0.31]
}) {

  let timeContainers = [];
  let firstTimeContDur = rrand(startCont_minMax[0], startCont_minMax[1]);
  timeContainers.push(firstTimeContDur);

  for (let contIx = 1; contIx < numContainersOneWay; contIx++) { //make first half of palindrome

    let tPctChg = 1 + rrand(pctChg_minMax[0], pctChg_minMax[1]);
    let previousTime = timeContainers[contIx - 1];
    let newTime = previousTime * tPctChg;
    timeContainers.push(newTime);

  }

  for (let contIx = timeContainers.length - 2; contIx >= 0; contIx--) { //mirror
    timeContainers.push(timeContainers[contIx]);
  }

  return timeContainers;

}

// #endef END generatePalindromeTimeContainers

// #ef plot

function plot(fn, range, width, height, yAdd) {

  let tpoints = [];
  let widthScale = (width / (range[1] - range[0]));
  let heightScale = (height / (range[3] - range[2]));
  let first = true;

  for (let x = 0; x < width; x++) {

    let xFnVal = (x / widthScale) - range[0];
    let yGVal = (fn(xFnVal) - range[2]) * heightScale;
    yGVal = height - yGVal; // 0,0 is top-left
    let tar = {};
    tar.x = x;
    tar.y = yGVal + yAdd;
    first = false;
    tpoints.push(tar);

  }

  return tpoints;

}

// USAGE
/*
plot( function(x){return y of x}, [xmin, xmax, ymin, ymax], crvWidth, crvHeight )

var coords = plot( function(x) {
  return Math.pow(x, 2.4);
}, [0, 1, 0, 1], CRV_W, CRV_H);

let plotEx = plot(function(x) { //see Function library; exponential curve
  return Math.pow(x, 5); // factor: <1 greater change in the beginning, less at the end; >1 less change at start, more at end
}, [0, 1, 1, 0], 1000, 1000, 0); // [0, 1, 0, 1], xRange, yRange, yAdd);
// [0, 1, 1, 0] - x: 0-xRange, y: yAdd - yRange+yAdd
// [0, 1, 0, 1] - x: 0-xRange, y: yRange+yAdd - yAdd
console.log(plotEx);

*/

// #endef END plot

// #ef deepCopy - array and object

// Helper function to deal with Objects
const deepCopyObject = (obj) => {
  let tempObj = {};
  for (let [key, value] of Object.entries(obj)) {
    if (Array.isArray(value)) {
      tempObj[key] = deepCopy(value);
    } else {
      if (typeof value === 'object') {
        tempObj[key] = deepCopyObject(value);
      } else {
        tempObj[key] = value
      }
    }
  }
  return tempObj;
}

const deepCopy = (arr) => {
  let copy = [];
  arr.forEach(elem => {
    if (Array.isArray(elem)) {
      copy.push(deepCopy(elem))
    } else {
      if (typeof elem === 'object') {
        copy.push(deepCopyObject(elem))
      } else {
        copy.push(elem)
      }
    }
  })
  return copy;
}
//USAGE:
//const array2 = deepCopy(array1/obj1);

// #endef END deepCopy - array and object

// #ef playerTokens

let unisonTokenSize = 27;
let mkPlrTkns = function(svgCanvas, type) {

  let playerTokenObj = {};
  let yAdjSvg = 0;
  let yAdjTxt = 0;

  switch (type) {

    case 0:

      yAdjSvg = 13;
      yAdjTxt = 13;

      let tCirc = mkSvgCircle({
        svgContainer: svgCanvas,
        cx: 0,
        cy: -yAdjSvg,
        r: 9,
        fill: 'none',
        stroke: clr_neonMagenta,
        strokeW: 3
      });

      playerTokenObj['svg'] = tCirc;

      let tCircText = mkSvgText({
        svgContainer: svgCanvas,
        x: 0,
        y: -yAdjTxt,
        justifyH: 'middle',
        justifyV: 'central',
        fontSz: 13,
        txt: '1'
      });

      playerTokenObj['txt'] = tCircText;

      break;

    case 1:

      yAdjSvg = 17;
      yAdjTxt = 13;

      let tTri = mkSvgTriangle({
        svgContainer: svgCanvas,
        cx: 0,
        cy: -yAdjSvg,
        h: 23,
        w: 23,
        fill: 'none',
        stroke: clr_neonMagenta,
        strokeW: 3
      });

      playerTokenObj['svg'] = tTri;

      let tTriText = mkSvgText({
        svgContainer: svgCanvas,
        x: 0,
        y: -yAdjTxt,
        justifyH: 'middle',
        justifyV: 'central',
        fontSz: 13,
        txt: '2'
      });

      playerTokenObj['txt'] = tTriText;

      break;

    case 2:

      yAdjSvg = 15;
      yAdjTxt = 15;

      let tDia = mkSvgDiamond({
        svgContainer: svgCanvas,
        cx: 0,
        cy: -yAdjSvg,
        h: 21,
        w: 21,
        fill: 'none',
        stroke: clr_neonMagenta,
        strokeW: 3
      });

      playerTokenObj['svg'] = tDia;

      let tDiaText = mkSvgText({
        svgContainer: svgCanvas,
        x: 0,
        y: -yAdjTxt,
        justifyH: 'middle',
        justifyV: 'central',
        fontSz: 13,
        txt: '3'
      });

      playerTokenObj['txt'] = tDiaText;

      break;

    case 3:

      yAdjSvg = 20;
      yAdjTxt = 12;

      let tArc = mkSvgArc({
        svgContainer: svgCanvas,
        x: 0,
        y: -yAdjSvg,
        radius: 15,
        startAngle: 90,
        endAngle: 270,
        fill: 'none',
        stroke: clr_neonMagenta,
        strokeW: 3,
        strokeCap: 'round'
      });

      playerTokenObj['svg'] = tArc;

      let tArcText = mkSvgText({
        svgContainer: svgCanvas,
        x: 0,
        y: -yAdjTxt,
        justifyH: 'middle',
        justifyV: 'central',
        fontSz: 13,
        txt: '4'
      });

      playerTokenObj['txt'] = tArcText;

      break;

    case 4:

      yAdjSvg = 23;
      yAdjTxt = 13;

      let tSqr = mkSvgRect({
        svgContainer: svgCanvas,
        x: -9,
        y: -yAdjSvg,
        w: 18,
        h: 18,
        fill: 'none',
        stroke: clr_neonMagenta,
        strokeW: 3
      });

      playerTokenObj['svg'] = tSqr;

      let tSqrText = mkSvgText({
        svgContainer: svgCanvas,
        x: 0,
        y: -yAdjTxt,
        justifyH: 'middle',
        justifyV: 'central',
        fontSz: 13,
        txt: '5'
      });

      playerTokenObj['txt'] = tSqrText;

      break;

    case 5:

      yAdjSvg = 20;
      yAdjTxt = 25;

      let tTri2 = mkSvgTriangle2({
        svgContainer: svgCanvas,
        cx: 0,
        cy: -yAdjSvg,
        h: unisonTokenSize,
        w: unisonTokenSize,
        fill: clr_neonMagenta,
        stroke: clr_neonMagenta,
        strokeW: 3
      });

      playerTokenObj['svg'] = tTri2;

      let tCircText2 = mkSvgText({
        svgContainer: svgCanvas,
        x: 0,
        y: -yAdjTxt,
        justifyH: 'middle',
        justifyV: 'central',
        fontSz: 23,
        txt: 'U'
      });

      tCircText2.setAttributeNS(null, 'font-weight', 'bolder');
      tCircText2.setAttributeNS(null, 'fill', clr_yellow);
      playerTokenObj['txt'] = tCircText2;

      break;

  } //switch (type) end

  playerTokenObj.svg.setAttributeNS(null, "display", 'none');
  playerTokenObj.txt.setAttributeNS(null, "display", 'none');

  playerTokenObj['move'] = function(aX, aY) {
    playerTokenObj.svg.setAttributeNS(null, "transform", "translate(" + aX.toString() + "," + aY.toString() + ")");
    playerTokenObj.txt.setAttributeNS(null, "transform", "translate(" + aX.toString() + "," + aY.toString() + ")");
  } // playerTokenObj['move'] = function(mvBaseX, mvBaseY) END

  return playerTokenObj;

} //function makePlayerTokens() end

// #endef END playerTokens

//#ef chooseAndCycle

let chooseAndCycle = function({
  loopSet = [0, 1, 2, 3],
  num = 99
} = {
  loopSet: [0, 1, 2, 3],
  num: 99
}) {

  let setToReturn = [];
  let tSet = deepCopy(loopSet);

  for (let i = 0; i < num; i++) {
    if (tSet.length == 0) tSet = deepCopy(loopSet);
    let newIx = chooseIndex(tSet); //select the index number from the remaining tempo set
    setToReturn.push(tSet[newIx]);
    tSet.splice(newIx, 1); //remove this tempo from set
  }

  return setToReturn

}

//#endef choooseAndCycle

//#ef numberedSetFromSize

let numberedSetFromSize = function({
  sz = 10
} = {
  sz: 10
}) {

  let setToReturn = [];
  for (let i = 0; i < sz; i++) {
    setToReturn.push(i);
  }
  return setToReturn;

}

//#endef numberedSetFromSize

//#ef shuffle

let shuffle = function(array) {
  var currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]
    ];
  }

  return array;
}

//#endef shuffle

//#ef Cycle Through Set Functions

let cycleThroughSet_inOrder = function(ogSet, numCycles) {

  let setToReturn = [];
  let numIterations = ogSet.length * numCycles;
  for (let i = 0; i < numIterations; i++) {
    setToReturn.push(ogSet[i % ogSet.length]);
  }

  return setToReturn;

}


let cycleThroughSet_random = function(ogSet, numCycles) {

  let ogSetClone = deepCopy(ogSet);
  let setToReturn = [];
  let numIterations = ogSet.length * numCycles;

  for (let i = 0; i < numIterations; i++) {
    if (ogSetClone.length == 0) ogSetClone = deepCopy(ogSet); //when all used up replenish
    let thisChoice = chooseIndex(ogSetClone); //select the index number from the remaining set
    setToReturn.push(ogSetClone[thisChoice]);
    ogSetClone.splice(thisChoice, 1); //remove this choice from the set
  }

  return setToReturn;

}


let cycleThroughSet_mirror = function(ogSet, numCycles) {

  let setToReturn = [];
  let numIterations = ogSet.length * (numCycles * 2);
  for (let i = 0; i < numCycles; i++) {
    for (let j = 0; j < ogSet.length; j++) {
      setToReturn.push(ogSet[j]);
    }
    for (let k = ogSet.length - 1; k >= 0; k--) {
      setToReturn.push(ogSet[k]);
    }
  }

  return setToReturn;

}

let cycleThroughSet_palindrome = function(ogSet, numCycles) {

  let setToReturn = [];
  let numIterations = ogSet.length * (numCycles * 2);

  for (let i = 0; i < numCycles; i++) {

    for (let j = 0; j < ogSet.length; j++) {
      setToReturn.push(ogSet[j]);
    }
    for (let k = ogSet.length - 2; k >= 1; k--) {
      setToReturn.push(ogSet[k]);
    }

  } // for (let i = 0; i < numCycles; i++)

  return setToReturn;

}


//#endef Cycle Through Set Functions

//#ef conditionalChoose
let conditionalChoose = function(cSet, condition) {

  let setToReturn = [];

  for (let i = 0; i < cSet.length; i++) {
    if (cSet[i] == condition) {
      setToReturn.push(cSet[i]);
    }
  }

  return setToReturn;
}
//#endef conditionalChoose

//#ef pad
let pad = function(num, size) {
  let s = "000000000" + num;
  return s.substr(s.length - size);
}
//#endef pad

// #ef mkSvgCrv
let mkSvgCrv = function({
  svgContainer,
  w = 200,
  h = 200,
  x = 0,
  y = 0,
  pointsArray,
  fill = 'none',
  stroke = 'yellow',
  strokeW = 3,
  strokeCap = 'round' //square;round;butt
} = {
  svgContainer,
  w: 200,
  h: 200,
  x: 0,
  y: 0,
  pointsArray,
  fill: 'none',
  stroke: 'yellow',
  strokeW: 3,
  strokeCap: 'round' //square;round;butt
}) {
  let tix = x + (pointsArray[0].x * w);
  let tiy = y + (pointsArray[0].y * h);
  let d = ["M", tix, tiy];
  pointsArray.forEach((ptObj, ptIx) => {
    d.push("L");
    let tx =  x + (ptObj.x * w);
    let ty =  y + (ptObj.y * h);
    d.push(tx);
    d.push(ty);
  });
  // d.push("Z")
  d = d.join(" ");
  let crv = document.createElementNS(SVG_NS, "path");
  crv.setAttributeNS(null, "d", d);
  crv.setAttributeNS(null, "stroke-width", strokeW);
  crv.setAttributeNS(null, "stroke", stroke);
  crv.setAttributeNS(null, "fill", fill);
  crv.setAttributeNS(null, "stroke-linecap", strokeCap);
  svgContainer.appendChild(crv);
  return crv;
}
// #endef mkSvgCrv









// #ef
// #endef END
