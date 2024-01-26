// FUNCTION: clamp ---------------------------------------------- //
function clamp(num, min, max) {
  return num <= min ? min : num >= max ? max : num;
}
// FUNCTION: mtof -------------------------------------------------- //
function mtof(midinote) {
  let freq;
  freq = Math.pow(2, ((midinote - 69) / 12)) * 440;
  return freq;
}
// FUNCTION: ftom -------------------------------------------------- //
function ftom(freq) {
  let midi;
  midi = (Math.log2((freq / 440)) * 12) + 69;
  return midi;
}
// FUNCTION: rrand ------------------------------------------------- //
function rrand(min, max) {
  return Math.random() * (max - min) + min;
}
// FUNCTION: rrandInt ---------------------------------------------- //
function rrandInt(min, max) {
  let tmin = min - 0.4999999;
  let tmax = max + 0.4999999;
  return Math.round(Math.random() * (tmax - tmin) + tmin);
}
// FUNCTION: rrandInt ---------------------------------------------- //
function rrandIntFloor(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
// FUNCTION: rrand ------------------------------------------------- //
function choose(tempSet) {
  let randpick = rrandIntFloor(0, tempSet.length);
  return tempSet[randpick];
}
// FUNCTION: scale -------------------------------------------------- //
const scale = (num, in_min, in_max, out_min, out_max) => {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
// FUNCTION: norm -------------------------------------------------- //
const norm = (num, in_min, in_max) => {
  return (num - in_min) * (1.0 - 0.0) / (in_max - in_min);
}
// FUNCTION: shuffle ------------------------------------------------ //
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
// FUNCTION: chooseWeighted -----------------------------------
function chooseWeighted(items, chances) {
  let sum = chances.reduce((acc, el) => acc + el, 0);
  let acc = 0;
  chances = chances.map(el => (acc = el + acc));
  let rand = Math.random() * sum;
  return items[chances.filter(el => el <= rand).length];
}
// FUNCTION: palindromeTimeContainers -----------------------------------
function palindromeTimeContainers(dur, minval, maxval, pctmin, pctmax) {
  let timeCont = [];
  let currtime = 0;
  let newdur = dur;
  let newminval = minval;
  while (newdur > (dur / 2)) {
    let tc = newminval;
    timeCont.push(currtime);
    currtime = currtime + tc;
    newdur = newdur - tc;
    newminval = Math.min((newminval * (1 + rrand(pctmin, pctmax))), maxval);
  }
  while (newdur >= 0) {
    let tc = newminval;
    timeCont.push(currtime);
    currtime = currtime + tc;
    newdur = newdur - tc;
    newminval = Math.max((newminval * (1 - rrand(pctmin, pctmax))), minval);
  }
  return timeCont;
}
// FUNCTION: array3dtoString -----------------------------------
function array3dtoString(arr) {
  let tempstr = "";
  for (let i = 0; i < arr.length; i++) {
    let tempstr1 = "";
    for (let j = 0; j < arr[i].length; j++) {
      let tempstr2 = "";
      for (let k = 0; k < arr[i][j].length; k++) {
        if (k == 0) {
          tempstr2 = arr[i][j][k].toString();
        } else {
          tempstr2 = tempstr2 + "&" + arr[i][j][k].toString();
        }
      }
      if (j == 0) {
        tempstr1 = tempstr2;
      } else {
        tempstr1 = tempstr1 + ";" + tempstr2;
      }
    }
    if (i == 0) {
      tempstr = tempstr1;
    } else {
      tempstr = tempstr + ":" + tempstr1;
    }
  }
  return tempstr;
}
// FUNCTION: sortFunction2DArray -----------------------------------
//use like this: array.sort(sortFunction2DArray)
function sortFunction2DArray(a, b) {
  if (a[0] === b[0]) {
    return 0;
  } else {
    //change a[0] < b[0] to a[1] < b[1] to sort by second column etc
    return (a[0] < b[0]) ? -1 : 1;
  }
}
// FUNCTION: findIndicesOfMax -----------------------------------
function findIndicesOfMax(inp, count) {
  let outp = [];
  for (let i = 0; i < inp.length; i++) {
    outp.push(i); // add index to output array
    if (outp.length > count) {
      outp.sort(function(a, b) {
        return inp[b] - inp[a];
      }); // descending sort the output array
      outp.pop(); // remove the last index (index of smallest element in output array)
    }
  }
  return outp;
}
// FUNCTION: downloadStrToHD -----------------------------------
// download('the content of the file', 'filename.txt', 'text/plain');
function downloadStrToHD(strData, strFileName, strMimeType) {
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

function scrambleCount(numtocount) {
  let scrambledCt = [];
  for (let i = 0; i < numtocount; i++) {
    scrambledCt.push(i);
  }
  for (let i = scrambledCt.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [scrambledCt[i], scrambledCt[j]] = [scrambledCt[j], scrambledCt[i]];
  }
  return scrambledCt;
}
// FUNCTION: rads ---------------------------------------------------- //
function rads(deg) {
  return (deg * Math.PI) / 180;
}

function roundByStep(value, step) {
  step || (step = 1.0);
  let inv = 1.0 / step;
  return Math.round(value * inv) / inv;
}
//FUNCTION floorByStep --------------------------------------------------------------------- //
function floorByStep(value, step) {
  step || (step = 1.0);
  let inv = 1.0 / step;
  return Math.floor(value * inv) / inv;
}
//FUNCTION plot --------------------------------------------------------------------- //
function midiToSpeed(ogmidi, destmidi) {
  let tspeed = Math.pow(2, (destmidi - ogmidi) * (1.0 / 12.0));
  return tspeed;
}
//FUNCTION plot --------------------------------------------------------------------- //
function limitRange(num, min, max) {
  let tnewval;
  tnewval = Math.min(num, max);
  tnewval = Math.max(tnewval, min);
  return tnewval;
}
//FUNCTION plot --------------------------------------------------------------------- //
function stringTo3DFloatArray(text) {
  let pitchesArray1 = [];
  let t1 = text.split(":");
  for (let i = 0; i < t1.length; i++) {
    let temparr = t1[i].split(';');
    let t3 = [];
    for (let j = 0; j < temparr.length; j++) {
      let temparr2 = temparr[j].split("&");
      let t4 = [];
      for (let k = 0; k < temparr2.length; k++) {
        t4.push(temparr2[k].split(","));
      }
      let tnewFloatArr = [];
      for (let l = 0; l < t4.length; l++) {
        tnewFloatArr.push(parseFloat(t4[l]));
      }
      t3.push(tnewFloatArr);
    }
    pitchesArray1.push(t3);
  }
  return pitchesArray1;
}
//FUNCTION plot --------------------------------------------------------------------- //
function distributeOverRange(min, max, numVals) {
  let trange = max - min;
  let tinc = trange / numVals;
  let tvals = [];
  for (let i = 0; i < numVals; i++) {
    tvals.push(min + rrand((i * tinc), ((i + 1) * tinc)));
  }
  return tvals;
}
//FUNCTION plot --------------------------------------------------------------------- //
function plot(fn, range, width, height) {
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
    tar.y = yGVal;
    first = false;
    tpoints.push(tar);
  }
  return tpoints;
}


//FUNCTION removeDuplicates -------------------------------------------------------- //
function removeDuplicates(arr) {
  let c;
  let len = arr.length;
  let result = [];
  let obj = {};
  for (c = 0; c < len; c++) {
    obj[arr[c]] = 0;
  }
  for (c in obj) {
    result.push(parseInt(c));
  }
  return result;
}
//TIMEDISPLAY ------------------------------------------------------------------------ //
let objToday = new Date(),
  weekday = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
  dayOfWeek = weekday[objToday.getDay()],
  dayNum = objToday.getDay() + 1,
  domEnder = function() {
    let a = objToday;
    if (/1/.test(parseInt((a + "").charAt(0)))) return "th";
    a = parseInt((a + "").charAt(1));
    return 1 == a ? "st" : 2 == a ? "nd" : 3 == a ? "rd" : "th"
  }(),
  dayOfMonth = objToday + (objToday.getDate() < 10) ? '0' + objToday.getDate() + domEnder : objToday.getDate() + domEnder,
  months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'),
  curMonth = months[objToday.getMonth()],
  monthNum = objToday.getMonth() + 1,
  curYear = objToday.getFullYear(),
  curHour = objToday.getHours() > 12 ? objToday.getHours() - 12 : (objToday.getHours() < 10 ? "0" + objToday.getHours() : objToday.getHours()),
  curMinute = objToday.getMinutes() < 10 ? "0" + objToday.getMinutes() : objToday.getMinutes(),
  curSeconds = objToday.getSeconds() < 10 ? "0" + objToday.getSeconds() : objToday.getSeconds(),
  curMeridiem = objToday.getHours() > 12 ? "PM" : "AM";
//FUNCTION pad -------------------------------------------------------------- //
function pad(num, size) {
  let s = "000000000" + num;
  return s.substr(s.length - size);
}
//FUNCTION playsamp ----------------------------------------------------------------- //
function playSamp(audioContext, path, rate) {
  let source = audioContext.createBufferSource();
  let request = new XMLHttpRequest();
  request.open('GET', path, true);
  request.responseType = 'arraybuffer';
  request.onload = function() {
    actx.decodeAudioData(request.response, function(buffer) {
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.loop = false;
      source.playbackRate.value = rate;
      source.start();
    }, function(e) {
      console.log('Audio error! ', e);
    });
  }
  request.send();
}
//sorting numbers
function sortNumArr(arr) {
  arr.sort((a, b) => a - b);
  return arr;
}
// FUNCTION: isNonEmptyArrayLike ----------------------------------------------------- //
function isNonEmptyArrayLike(obj) {
  try { // don't bother with `typeof` - just access `length` and `catch`
    return obj.length > 0 && '0' in Object(obj);
  } catch (e) {
    return false;
  }
}
// FUNCTION: beats2seconds ----------------------------------------------------------- //
function beats2seconds(bpm, numbts) {
  let t_secPerBeat = 1.0 / (bpm / 60.0);
  let t_sec = t_secPerBeat * numbts;
  return t_sec;
}
// FUNCTION: singleTempo ------------------------------------------------------------- //
function singleTempo(tempo, instNum, startTime, endTime, btIncsAr) {
  let t_btIncsAr = btIncsAr.deepCopy();
  t_btIncsAr.unshift(1, 0.25);
  let t_durSec = endTime - startTime;
  let t_durMS = Math.ceil(t_durSec * 1000.0);
  let t_beatNum = 0;
  let t_lastBeatTcSec = 0;
  let t_btsFloat = 0.0;
  let t_btsPerMs = tempo / 60000.0;
  // Initial Events @ 0 /////////////////////////////////////////
  eventSet.push([startTime, instNum, 8, -1]); //inital event marker
  eventSet.push([startTime, instNum, 0, -1]); //inital beat marker
  let t_btIncsTcSec = [];
  let t_numIncs = [];
  let t_incCtr = [];
  if (isNonEmptyArrayLike(t_btIncsAr)) {
    for (let i = 0; i < t_btIncsAr.length; i++) {
      t_btIncsTcSec.push([t_btIncsAr[i],
        []
      ]);
      t_numIncs.push(1);
      t_incCtr.push(0);
    }
  }
  for (let i = 0; i < t_durMS; i++) {
    let t_tcSec = (i / 1000.0) + startTime; //timecode in seconds
    for (let j = 0; j < t_btIncsAr.length; j++) {
      if (t_btIncsAr[j] == 1) {
        t_incCtr[j] = floorByStep(t_btsFloat, t_btIncsAr[j]) - t_numIncs[j];
        if (t_incCtr[j] == 0) {
          t_btIncsTcSec[j][1].push(t_tcSec);
          eventSet.push([t_tcSec, instNum, 0, -1]);
          // if tempo is > 130 then draw half-notes
          if (tempo > 130) {
            if ((t_numIncs[j] % 2) == 0) {
              eventSet.push([t_tcSec, instNum, 7, -1]);
            }
          }
          t_numIncs[j]++;
        }
      } else if (t_btIncsAr[j] == 0.25) {
        t_incCtr[j] = floorByStep(t_btsFloat, t_btIncsAr[j]) - t_numIncs[j];
        if (t_incCtr[j] == 0) {
          t_btIncsTcSec[j][1].push(t_tcSec);
          // if tempo is < 60 then draw 16ths
          if (tempo < 60) {
            //don't draw on the beat just partials 2-4
            if ((t_numIncs[j] % 4) != 0) {
              eventSet.push([t_tcSec, instNum, 6, -1]);
            }
          }
          t_numIncs[j]++;
        }
      } else {
        t_incCtr[j] = floorByStep(t_btsFloat, t_btIncsAr[j]) - t_numIncs[j];
        if (t_incCtr[j] == 0) {
          t_btIncsTcSec[j][1].push(t_tcSec);
          t_numIncs[j]++;
        }
      }
    }
    t_btsFloat = t_btsFloat + t_btsPerMs;
  }
  return t_btIncsTcSec;
}
// FUNCTION: singleTempoGenerator_numBeats ------------------------------------------- //
function singleTempoGenerator_numBeats(tempo, instNum, startTime, numBeats, a_btIncAr) {

  let t_dur = beats2seconds(tempo, numBeats);
  let t_endtime = startTime + t_dur;
  singleTempo(tempo, instNum, startTime, t_endtime, a_btIncAr);
  return t_endtime;
}
// PROBABILITY --------------------------------------
function probability(n) {
  return !!n && Math.random() <= n;
};
// CONSTRAIN --------------------------------------
function constrain(num, min, max) {
  const MIN = min || 1;
  const MAX = max || 20;
  const parsed = parseInt(num)
  return Math.min(Math.max(parsed, MIN), MAX)
}
function clamp(val, min, max) {
    return Math.min(Math.max(min, +val), max);
}
// GET AND PARCE VALUES FROM URL --------------------------------------
function getUrlArgs() {
  let args = {};
  let parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
    args[key] = value;
  });
  return args;
}
// <editor-fold>       <<<< MAKE BUTTON >>>> --------------------- //
function mkButton(canvas, id, w, h, top, left, label, fontSize, action) {
  let btn = document.createElement("BUTTON");
  btn.className = 'btn btn-1';
  btn.id = id;
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
// </editor-fold>      END MAKE BUTTON /////////////////////////////

// <editor-fold>       <<<< MAKE JSPANEL >>>> --------------------- //
function mkPanel(canvas, w, h, title, a_posArr, a_headerSize, a_onwindowresize, a_contentOverflow) {
  let posArr = a_posArr || ['center-top', '0px', '0px', 'none'];
  let onwindowresize = a_onwindowresize || false;
  let headerSize = a_headerSize || 'xs';
  let contentOverflow = a_contentOverflow || 'hidden';
  let tpanel;
  let posString = posArr[0];
  let offsetX = posArr[1];
  let offsetY = posArr[2];
  let autoposition = posArr[3];
  jsPanel.create({
    position: {
      my: posString,
      at: posString,
      offsetX: offsetX,
      offsetY: offsetY,
      autoposition: autoposition
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
    callback: function() {
      tpanel = this;
    }
  });
  return tpanel;
}
// </editor-fold>      END MAKE JSPANEL /////////////////////////////

// <editor-fold>       <<<< MAKE CANVAS DIV >>>> ------------------ //
function mkCanvasDiv(w, h, clr) {
  let t_div = document.createElement("div");
  t_div.style.width = w.toString() + "px";
  t_div.style.height = h.toString() + "px";
  t_div.style.background = clr;
  return t_div;
}
// </editor-fold>      END MAKE CANVAS DIV ///////////////////////////

// <editor-fold>       <<<< MAKE SVG CANVAS >>>> ------------------ //
function mkSVGcanvas(w, h) {
  let tsvgCanvas = document.createElementNS(SVG_NS, "svg");
  tsvgCanvas.setAttributeNS(null, "width", w);
  tsvgCanvas.setAttributeNS(null, "height", h);
  tsvgCanvas.style.backgroundColor = "black";
  return tsvgCanvas;
}
// </editor-fold>      END MAKE SVG CANVAS ///////////////////////////

// <editor-fold>       <<<< MAKE CONTROL PANEL >>>> ------------------ //
function mkCtrlPanel(id, w, h, title, posArr, headerSize) { //posArr=all strings:[ left-top, xOffset, yOffset, autoposition]
  let panelObj = {};
  panelObj['id'] = id;
  panelObj['w'] = w;
  panelObj['h'] = h;
  let canvasID = id + 'canvas';
  let canvas = mkCanvasDiv(canvasID, w, h, 'black');
  panelObj['canvas'] = canvas;
  let panelID = id + 'panel';
  let panel = mkPanel(panelID, canvas, w, h, title, posArr, headerSize);
  panelObj['panel'] = panel;
  return panelObj;
}
// </editor-fold>      END MAKE CONTROL PANEL ///////////////////////////

// <editor-fold>       <<<< MAKE LABEL >>>> --------------------- //
function mkLabel(canvas, id, top, left, text, fontSize, color) {
  let lbl = document.createElement("label");
  lbl.innerHTML = text;
  lbl.style.fontSize = fontSize.toString() + "px";
  lbl.style.color = color;
  lbl.style.fontFamily = "Lato";
  lbl.style.position = 'absolute';
  lbl.style.top = top.toString() + 'px';
  lbl.style.left = left.toString() + 'px';
  canvas.appendChild(lbl);
  return lbl;
}

function mkLabel2(canvas, id, forid, w, h, top, left, text, fontSize, color) {
  let lbl = document.createElement("label");
  lbl.for = 'playerNum';
  lbl.className = 'input__label input__label--yoshiko';
  lbl.innerHTML = text;
  lbl.style.fontSize = fontSize.toString() + "px";
  lbl.style.color = color;
  lbl.style.fontFamily = "Lato";
  lbl.style.position = 'absolute';
  lbl.style.top = top.toString() + 'px';
  lbl.style.left = left.toString() + 'px';
  lbl.style.width = w.toString() + "px";
  lbl.style.height = h.toString() + "px";
  canvas.appendChild(lbl);
  return lbl;
}
// </editor-fold>      END MAKE LABEL /////////////////////////////

//<editor-fold>     <<<< INPUT FIELD >>>> ---------- //
function mkInputField(canvas, id, w, h, top, left, color, fontSize, clickAction, keyupAction) {
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
  inputField.addEventListener("keyup", keyupAction);
  canvas.appendChild(inputField);
  return inputField;
}
// </editor-fold>    END INPUT FIELD ///////////////////



// <editor-fold>       <<<< MAKE MENU >>>> ---------------------- //
function mkMenu(canvas, id, w, h, top, left, listArray) {
  let menuDiv = document.createElement("div");
  let menuDivID = id + 'menuDiv';
  menuDiv.id = menuDivID;
  menuDiv.className = 'dropdown-content';
  menuDiv.style.width = w.toString() + "px";
  menuDiv.style.top = top.toString() + "px";
  menuDiv.style.left = left.toString() + "px";
  menuDiv.style.maxHeight = h.toString() + "px";
  canvas.appendChild(menuDiv);
  //listArray = [[listLabel, action]]
  listArray.forEach(function(it, ix) {
    let tempAtag = document.createElement('a');
    tempAtag.textContent = it[0];
    tempAtag.style.fontFamily = "lato";
    tempAtag.id = id + 'listA' + ix.toString();
    tempAtag.addEventListener("click", it[1]);
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
// </editor-fold>      END MAKE MENU /////////////////////////////

// <editor-fold>       <<<< MAKE SPAN >>>> --------------------- //
function mkSpan(canvas, id, w, h, top, left, text, fontSize, color) {
  let lbl = document.createElement("span");
  lbl.innerHTML = text;
  lbl.style.fontSize = fontSize.toString() + "px";
  lbl.style.color = color;
  lbl.style.fontFamily = "Lato";
  lbl.style.position = 'absolute';
  lbl.style.top = top.toString() + 'px';
  lbl.style.left = left.toString() + 'px';
  canvas.appendChild(lbl);
  return lbl;
}
// </editor-fold>      END MAKE SPAN /////////////////////////////


function mkClockPanel(clockDiv) {
  let tpanel;
  // Clock Panel
  jsPanel.create({
    position: 'right-top',
    id: "clockPanel",
    contentSize: "64 20",
    header: 'auto-show-hide',
    headerControls: {
      minimize: 'remove',
      // smallify: 'remove',
      maximize: 'remove',
      close: 'remove',
      size: 'xs'
    },
    contentOverflow: 'hidden',
    headerTitle: '<small>' + 'Clock' + '</small>',
    theme: "light",
    content: clockDiv,
    resizeit: {
      aspectRatio: 'content',
      resize: function(panel, paneldata, e) {}
    },
    callback: function() {
      tpanel = this;
    }
  });
  return tpanel;
}

function mkNumbers(size, start) {
  let t_start = start || 0;
  let numberArray = [];
  for (let i = 0; i < size; i++) {
    numberArray.push(i + t_start);
  }
  return numberArray;
}

function mkCascadingSet_wTotal(maxAmt, numEvents) {
  let set = [];
  let set1 = [];
  let newMaxAmt = maxAmt;
  let totalAmt = 0;
  for (let i = 0; i < numEvents; i++) {
    let max = newMaxAmt / (numEvents - i);
    let min = newMaxAmt / 4;
    let amt = rrand(min, max);
    totalAmt += amt;
    set1.push(amt);
    newMaxAmt = newMaxAmt - amt;
  }
  set.push(set1);
  set.push(totalAmt);
  return set;
}

function mkCascadingSet(maxAmt, numEvents) {
  let set = [];
  let newMaxAmt = maxAmt;
  for (let i = 0; i < numEvents; i++) {
    let max = newMaxAmt / (numEvents - i);
    let min = newMaxAmt / 4;
    let amt = rrand(min, max);
    set.push(amt);
    newMaxAmt = newMaxAmt - amt;
  }
  return set;
}

function roundSet(set) {
  let roundedSet = [];
  set.forEach((item, i) => {
    roundedSet.push(Math.round(item));
  });
  return roundedSet;
}

function numSort(numArray) {
  numArray.sort(function(a, b) {
    return a - b;
  });
  return numArray;
}

// const deepCopy = (arr) => {
  function deepCopy(arr){
  let copy = [];
  arr.forEach(elem => {
    if(Array.isArray(elem)){
      copy.push(deepCopy(elem))
    }else{
      if (typeof elem === 'object') {
        copy.push(deepCopyObject(elem))
    } else {
        copy.push(elem)
      }
    }
  })
  return copy;
}

// Helper function to deal with Objects

// const deepCopyObject = (obj) => {
function deepCopyObject(obj){
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

//const array2 = deepCopy(array1);


function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  let angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

function describeArc(x, y, radius, startAngle, endAngle){
    let start = polarToCartesian(x, y, radius, endAngle);
    let end = polarToCartesian(x, y, radius, startAngle);
    let arcSweep = endAngle - startAngle <= 180 ? "0" : "1";
    let d = [
        "M", start.x, start.y,
        "A", radius, radius, 0, arcSweep, 0, end.x, end.y,
        // "L", x,y,
        // "L", start.x, start.y
    ].join(" ");
    return d;
}

// document.getElementById("arc1").setAttribute("d", describeArc(200, 400, 100, 0, 220));

function flipCoin(){
  let result = Math.round(Math.random(1));
  return result;
}

function mkPalindromeSet(min,max){
  let palSet = [];
  for (let i = 0; i < max; i++) {
    palSet.push(i);
  }
  for (let i = (max - 2); i >= 0; i--) {
    palSet.push(i);
  }
  return palSet;
}














//
