//#ef NOTES
/*
Draw bars like loops
*/
//#endef NOTES

//#ef General Variables
const TEMPO_COLORS = [clr_limeGreen, clr_mustard, clr_brightBlue, clr_brightOrange, clr_lavander, clr_darkRed2, clr_brightGreen, clr_lightGrey, clr_neonMagenta, clr_plum, clr_blueGrey, clr_lightGrey, clr_lightGreen];
//Dimensions
const NOTATION_H = 100;
const GAP_BTWN_NOTATION_LINES = 3;
const VERT_DISTANCE_BETWEEN_LINES = NOTATION_H + GAP_BTWN_NOTATION_LINES;
const NUM_NOTATION_LINES = 5;
let WORLD_W = 945;
let WORLD_H = (NOTATION_H * NUM_NOTATION_LINES) + (GAP_BTWN_NOTATION_LINES * (NUM_NOTATION_LINES - 1));
const NOTATION_LINE_LENGTH_PX = WORLD_W;
//Timing
let FRAMECOUNT = 0;
const FRAMERATE = 60;
const MS_PER_FRAME = 1000.0 / FRAMERATE;
const PX_PER_BEAT = 40;
const PX_PER_SEC = 50;
const TOTAL_NUM_PX_IN_SCORE = NOTATION_LINE_LENGTH_PX * NUM_NOTATION_LINES;
const BEATS_PER_LINE = WORLD_W / PX_PER_BEAT;
const LEADIN_SEC = 5;
const LEADIN_PX = LEADIN_SEC * PX_PER_SEC;
const LEADIN_FRAMES = Math.round(LEADIN_SEC * FRAMERATE);
let animationIsGo = false;
//SVG Notation
const NOTATION_FILE_NAME_PATH = '/pieces/ill20240125/notationSVGs/';
//Timesync
const TS = timesync.create({
  server: '/timesync',
  interval: 1000
});
//#endef General Variables

//#ef Animation Engine
let cumulativeChangeBtwnFrames_MS = 0;
let epochTimeOfLastFrame_MS;

function animationEngine(timestamp) {
  let ts_Date = new Date(TS.now());
  let tsNowEpochTime_MS = ts_Date.getTime();
  cumulativeChangeBtwnFrames_MS += tsNowEpochTime_MS - epochTimeOfLastFrame_MS;
  epochTimeOfLastFrame_MS = tsNowEpochTime_MS;
  while (cumulativeChangeBtwnFrames_MS >= MS_PER_FRAME) {
    if (cumulativeChangeBtwnFrames_MS > (MS_PER_FRAME * FRAMERATE)) cumulativeChangeBtwnFrames_MS = MS_PER_FRAME;
    update();
    FRAMECOUNT++;
    cumulativeChangeBtwnFrames_MS -= MS_PER_FRAME;
  }
  if (animationIsGo) {
    requestAnimationFrame(animationEngine);
  }
}

function update() {
  updateScrollingCsrs();
  // updateLoops();
}
//#endef Animation Engine

//#ef INIT
function init() {
  calcScrollingCsrs();
  // calcLoopsData();
  // calcLoopsFrameArray();
  makeCanvas();
  mkStaffRects();
  // makeLoopBrackets();
  // makeLoopCursors();
  makeScrollingCursors();
  let ts_Date = new Date(TS.now());
  let tsNowEpochTime_MS = ts_Date.getTime();
  epochTimeOfLastFrame_MS = tsNowEpochTime_MS;
  requestAnimationFrame(animationEngine);
}
//#endef INIT

//#ef Canvas
let canvas = {};
let panelTitle = "Interactive Looping Line 20240112";
const staffRects = [];

function makeCanvas() {
  let tPanel = mkPanel({
    w: WORLD_W,
    h: WORLD_H,
    title: panelTitle,
    onwindowresize: true,
    clr: 'none',
    ipos: 'center-top',
  });
  tPanel.content.addEventListener('click', function() {
    document.documentElement.webkitRequestFullScreen({
      navigationUI: 'hide'
    });
    animationIsGo = true;
    requestAnimationFrame(animationEngine);
  });
  canvas['panel'] = tPanel;
  canvas['div'] = tPanel.content;
  let tSvg = mkSVGcontainer({
    canvas: tPanel.content,
    w: WORLD_W,
    h: WORLD_H,
    x: 0,
    y: 0,
  });
  //Change Background Color of svg container tSvg.style.backgroundColor = clr_mustard
  tSvg.style.backgroundColor = 'white';
  canvas['svg'] = tSvg;
}

function mkStaffRects() {
  for (var i = 0; i < NUM_NOTATION_LINES; i++) {
    let tRect = mkSvgRect({
      svgContainer: canvas.svg,
      x: 0,
      y: VERT_DISTANCE_BETWEEN_LINES * i,
      w: WORLD_W,
      h: NOTATION_H,
      fill: 'black',
      stroke: 'yellow',
      strokeW: 0,
      roundR: 0
    });
    staffRects.push(tRect);
  }
}
//#endef Canvas

//#ef Scrolling Cursors
let scrollingCursors = [];
let scrCsrText = [];
let scrollingCsrY1 = 0;
let scrollingCsrH = NOTATION_H;
let scrollingCsrClrs = [];
let tempos = [ //initialTempo, finalTempo, text to include on cursor
  [60, 60, ''],
  [53, 53, ''],
  [111.43, 111.43, ''],
  [37.14, 37.14, ''],
  [113, 31, 'd'],
  [63, 131, 'a'],
  [47, 152, 'a'],
  [96.92, 96.92, '']
];
let totalNumFramesPerTempo = [];
let tempoConsts = [];
tempos.forEach((tempo, tix) => {
  scrollingCsrClrs.push(TEMPO_COLORS[tix % TEMPO_COLORS.length]);
});
tempos.forEach((tempoArr, i) => {
  let td = {};
  //convert initial and final tempi from bpm to pixelsPerFrame
  let iTempo = tempoArr[0]; //bpm
  let fTempo = tempoArr[1]; //bpm
  td['iTempoBPM'] = iTempo;
  td['fTempoBPM'] = fTempo;
  // convert bpm to pxPerFrame: pxPerMinute = iTempo * PX_PER_BEAT; pxPerSec = pxPerMinute/60; pxPerFrame = pxPerSec/FRAMERATE
  let iTempoPxPerFrame = ((iTempo * PX_PER_BEAT) / 60) / FRAMERATE;
  let fTempoPxPerFrame = ((fTempo * PX_PER_BEAT) / 60) / FRAMERATE;
  td['iTempoPxPerFrame'] = iTempoPxPerFrame;
  td['fTempoPxPerFrame'] = fTempoPxPerFrame;
  //calc acceleration from initial tempo and final tempo
  // a = (v2 - u2) / 2s ; v=finalVelocity, u=initialVelocity, s=totalDistance
  let tAccel = (Math.pow(fTempoPxPerFrame, 2) - Math.pow(iTempoPxPerFrame, 2)) / (2 * TOTAL_NUM_PX_IN_SCORE);
  // console.log('tempo ' + i + ' acceleration: ' + tAccel);
  td['accel'] = tAccel;
  // Calculate total number of frames from acceleration and distance
  // t = sqrRoot( (2L/a) ) ; L is total pixels
  let totalDurFrames;
  if (tAccel == 0) {
    totalDurFrames = Math.round(TOTAL_NUM_PX_IN_SCORE / iTempoPxPerFrame);
  } else {
    totalDurFrames = Math.round((fTempoPxPerFrame - iTempoPxPerFrame) / tAccel);
  }
  // console.log('Total Frames, tempo ' + i + ' : ' + totalDurFrames);
  td['totalDurFrames'] = totalDurFrames;
  tempoConsts.push(td);
});

function calcScrollingCsrs() {
  tempoConsts.forEach((tempoObj, tempoIx) => { //run for each tempo
    let frameArray = [];
    let tNumFrames = Math.round(tempoObj.totalDurFrames); //create an array with and index for each frame in the piece per tempo
    for (var frmIx = 0; frmIx < tNumFrames; frmIx++) { //loop for each frame in the piece
      let td = {}; //dictionary to hold position values
      //Calculate x
      let tCurPx = Math.round((tempoObj.iTempoPxPerFrame * frmIx) + ((tempoObj.accel * Math.pow(frmIx, 2)) / 2));
      td['absX'] = tCurPx;
      let tx = tCurPx % NOTATION_LINE_LENGTH_PX; //calculate cursor x location at each frame for this tempo
      td['x'] = tx;
      //Calc Y pos
      let tLineNum = Math.floor(tCurPx / NOTATION_LINE_LENGTH_PX)
      let ty = scrollingCsrY1 + ((NOTATION_H + GAP_BTWN_NOTATION_LINES) * tLineNum);
      td['y'] = ty;
      frameArray.push(td);
    }
    tempoConsts[tempoIx]['frameArray'] = frameArray;
    totalNumFramesPerTempo.push(frameArray.length);
  });
}

function makeScrollingCursors() {
  for (var i = 0; i < tempos.length; i++) {
    let tCsr = mkSvgLine({
      svgContainer: canvas.svg,
      x1: 0,
      y1: scrollingCsrY1,
      x2: 0,
      y2: scrollingCsrY1 + scrollingCsrH,
      stroke: scrollingCsrClrs[i],
      strokeW: 2
    });
    tCsr.setAttributeNS(null, 'stroke-linecap', 'round');
    tCsr.setAttributeNS(null, 'display', 'yes');
    scrollingCursors.push(tCsr);
    //Cursor Text
    let tTxt = mkSvgText({
      svgContainer: canvas.svg,
      x: 0,
      y: (scrollingCsrY1 - 130),
      fill: scrollingCsrClrs[i],
      stroke: scrollingCsrClrs[i],
      strokeW: 1,
      justifyH: 'start',
      justifyV: 'auto',
      fontSz: 18,
      fontFamily: 'lato',
      txt: tempos[i][2]
    });
    scrCsrText.push(tTxt);
  }
}

function updateScrollingCsrs() {
  totalNumFramesPerTempo.forEach((numFrames, tempoIx) => {
    let currFrame = FRAMECOUNT % numFrames;
    let tx = tempoConsts[tempoIx].frameArray[currFrame].x;
    let ty = tempoConsts[tempoIx].frameArray[currFrame].y;
    scrollingCursors[tempoIx].setAttributeNS(null, 'x1', tx);
    scrollingCursors[tempoIx].setAttributeNS(null, 'x2', tx);
    scrollingCursors[tempoIx].setAttributeNS(null, 'y1', ty);
    scrollingCursors[tempoIx].setAttributeNS(null, 'y2', ty + scrollingCsrH);
    scrCsrText[tempoIx].setAttributeNS(null, 'x', tx - 11);
    scrCsrText[tempoIx].setAttributeNS(null, 'y', ty + scrollingCsrH - 3);
  });
}
//#endef Scrolling Cursors

//#ef Loops
//Loops
let totalNumFramesPerLoop = [];
let loops = [{
  beatA: 6.1,
  beatB: 10.7,
  tempoIx: 6
}, {
  beatA: 16,
  beatB: 23.1,
  tempoIx: 1
}, {
  beatA: 28.5,
  beatB: 39,
  tempoIx: 3
}, {
  beatA: 47.4,
  beatB: 56.3,
  tempoIx: 5
}, {
  beatA: 70.9,
  beatB: 78,
  tempoIx: 1
}, {
  beatA: 97,
  beatB: 106,
  tempoIx: 2
}];
loops.forEach((loopObj, loopIx) => {
  let tLenPx = (loopObj.beatB - loopObj.beatA) * PX_PER_BEAT;
  loops[loopIx]['lenPx'] = tLenPx;
  let tpixa = (loopObj.beatA % BEATS_PER_LINE) * PX_PER_BEAT;
  loops[loopIx]['beatApxX'] = tpixa;
});
let loopCursors = [];
let loopsFrameArray = [];
let loopClr = 'yellow';
let loopCrvFollowers = [];

function calcLoopsData() {
  for (let loopIx = 0; loopIx < loops.length; loopIx++) {
    let tLoopObj = loops[loopIx];
    //Which pixel does the first beat of loop occur on?
    let tBeatApx = tLoopObj.beatA * PX_PER_BEAT;
    let tBeatBpx = tLoopObj.beatB * PX_PER_BEAT;
    // find the frame this pixel is in for the assigned tempo
    let tB1Frame, tB2Frame;
    for (let frmIx = 1; frmIx < tempoConsts[tLoopObj.tempoIx].frameArray.length; frmIx++) {
      let tThisX = tempoConsts[tLoopObj.tempoIx].frameArray[frmIx].absX;
      let tLastX = tempoConsts[tLoopObj.tempoIx].frameArray[frmIx - 1].absX;
      if (tBeatApx >= tLastX && tBeatApx < tThisX) {
        tB1Frame = frmIx - 1;
        loops[loopIx]['frameA'] = tB1Frame;
      }
      if (tBeatBpx >= tLastX && tBeatBpx < tThisX) {
        tB2Frame = frmIx - 1;
        loops[loopIx]['frameB'] = tB2Frame;
      }
    }
    let tNumFramesInLoop = tB2Frame - tB1Frame;
    loops[loopIx]['numFrames'] = tNumFramesInLoop;
    totalNumFramesPerLoop.push(tNumFramesInLoop);
  }

}

function calcLoopsFrameArray() {
  loops.forEach((lpObj, lpIx) => {
    let tempoFrameArray = tempoConsts[lpObj.tempoIx].frameArray;
    let tNumFrames = lpObj.numFrames;
    let tfrmArray = [];
    for (var frmIx = 0; frmIx < tNumFrames; frmIx++) {
      let td = {};
      let tIx = frmIx + lpObj.frameA;
      td['x'] = tempoFrameArray[tIx].x;
      td['y'] = tempoFrameArray[tIx].y;
      td['crvY'] = curveCoordsByFramePerTempo[lpObj.tempoIx][tIx].y;
      tfrmArray.push(td);
    }
    loopsFrameArray.push(tfrmArray);
  });
}

function makeLoopCursors() {
  for (var i = 0; i < loops.length; i++) {
    let tCsr = mkSvgLine({
      svgContainer: canvas.svg,
      x1: 0,
      y1: scrollingCsrY1,
      x2: 0,
      y2: scrollingCsrY1 + scrollingCsrH,
      stroke: loopClr,
      strokeW: 3
    });
    tCsr.setAttributeNS(null, 'stroke-linecap', 'round');
    tCsr.setAttributeNS(null, 'display', 'yes');
    loopCursors.push(tCsr);
  }
}

function makeLoopBrackets() {
  loopsFrameArray.forEach((loopObj, loopIx) => {
    let ty1 = loopObj[0].y;
    let tx1 = loopObj[0].x;
    let tSvgImage = document.createElementNS(SVG_NS, "image");
    tSvgImage.setAttributeNS(XLINK_NS, 'xlink:href', NOTATION_FILE_NAME_PATH + 'leftBracket_white.svg');
    tSvgImage.setAttributeNS(null, "y", ty1);
    tSvgImage.setAttributeNS(null, "x", tx1);
    tSvgImage.setAttributeNS(null, "visibility", 'visible');
    tSvgImage.setAttributeNS(null, "display", 'yes');
    canvas.svg.appendChild(tSvgImage);
    let ty2 = loopObj[loopObj.length - 1].y;
    let tx2 = loopObj[loopObj.length - 1].x;
    let tSvgImageR = document.createElementNS(SVG_NS, "image");
    tSvgImageR.setAttributeNS(XLINK_NS, 'xlink:href', NOTATION_FILE_NAME_PATH + 'rightBracket_white.svg');
    tSvgImageR.setAttributeNS(null, "y", ty2);
    tSvgImageR.setAttributeNS(null, "x", tx2);
    tSvgImageR.setAttributeNS(null, "visibility", 'visible');
    tSvgImageR.setAttributeNS(null, "display", 'yes');
    canvas.svg.appendChild(tSvgImageR);
  });
}

function mkLoopCrvFollower() {
  for (var i = 0; i < loops.length; i++) {
    let tCrvF = mkSvgCircle({
      svgContainer: canvas.svg,
      cx: 0,
      cy: 0,
      r: CRVFOLLOW_R,
      fill: loopClr,
      stroke: 'none',
      strokeW: 0
    });
    tCrvF.setAttributeNS(null, 'display', 'yes');
    loopCrvFollowers.push(tCrvF);
  }
}

function updateLoops() {
  totalNumFramesPerLoop.forEach((numFrames, loopIx) => {
    let currFrame = FRAMECOUNT % numFrames;
    let tx = loopsFrameArray[loopIx][currFrame].x;
    let ty = loopsFrameArray[loopIx][currFrame].y;
    let tcfy = loopsFrameArray[loopIx][currFrame].crvY;
    loopCursors[loopIx].setAttributeNS(null, 'x1', tx);
    loopCursors[loopIx].setAttributeNS(null, 'x2', tx);
    loopCursors[loopIx].setAttributeNS(null, 'y1', ty);
    loopCursors[loopIx].setAttributeNS(null, 'y2', ty + scrollingCsrH);
    //loop crv follow
    loopCrvFollowers[loopIx].setAttributeNS(null, 'cx', tx);
    loopCrvFollowers[loopIx].setAttributeNS(null, 'cy', tcfy);
  });
}
//#endef Loops

//#ef Bars
let barY = 35;
let barH = 50;
let bars = [];
const BAR_CLRS = [clr_limeGreen, clr_mustard, clr_brightBlue, clr_neonMagenta];

let barsTiming = [{
  startbt: 5,
  endbt: 7.5,
  motivenum: 0
}, {
  startbt: 9,
  endbt: 10,
  motivenum: 1
}, {
  startbt: 13,
  endbt: 16.29,
  motivenum: 2
}, {
  startbt: 18,
  endbt: 118.5,
  motivenum: 3
}];

function drawBars() {
  barsTiming.forEach((barObj, barIx) => {
    tbr = [];
    //find line number for start and end
    let tleftXAbs = barObj.startbt * PX_PER_BEAT;
    let tleftX = Math.round(tleftXAbs) % Math.round(NOTATION_LINE_LENGTH_PX);
    let tleftLineNum = Math.floor(tleftXAbs / NOTATION_LINE_LENGTH_PX);
    let trightXAbs = barObj.startbt * PX_PER_BEAT;
    let trightX = Math.round(trightXAbs) % Math.round(NOTATION_LINE_LENGTH_PX);
    let trightLineNum = Math.floor(trightXAbs / NOTATION_LINE_LENGTH_PX);
    //if linenums are not equal start at x=0 to right beat
    let ty, tx1, tw;
    if (tleftLineNum == trightLineNum) {
      tx1 = tleftX;
      tw = trightX - tleftX;
      ty = barY + ((NOTATION_H + GAP_BTWN_NOTATION_LINES) * tleftLineNum);
      let tBar = mkSvgRect({
        svgContainer: canvas.svg,
        x: tx1,
        y: ty,
        w: barLen,
        h: barH,
        fill: BAR_CLRS[barObj.motivenum],
        stroke: 'none',
        strokeW: 0,
        roundR: 0
      });
      tBar.setAttributeNS(null, 'display', 'yes');
      tbr.push tBar;
      bars.push(tbr);
    } else {
      tx1 = tleftX;
      tw = trightX - tleftX;
      ty = barY + ((NOTATION_H + GAP_BTWN_NOTATION_LINES) * tleftLineNum);
      let tBar = mkSvgRect({
        svgContainer: canvas.svg,
        x: tx1,
        y: ty,
        w: barLen,
        h: barH,
        fill: BAR_CLRS[barObj.motivenum],
        stroke: 'none',
        strokeW: 0,
        roundR: 0
      });
      tBar.setAttributeNS(null, 'display', 'yes');
      tbr.push tBar;
      bars.push(tbr);
    }
  });
}

function moveBars() {
  let tx = (FRAMECOUNT * -PX_PER_FRAME) + LEADIN_PX;
  bars.forEach((tBar) => {
    tBar.setAttributeNS(null, 'transform', "translate(" + tx.toString() + ",0)");
  });
}
//#endef Bars

//#ef Pie
function calcPieTimes() {
  barsTimingFrames.forEach((barAr, bix) => {
    let tBarFrms = barAr[0];
    let tRestFrms = barAr[1];
    let degPerFrame = 360 / tBarFrms;
    for (var i = 0; i < tBarFrms; i++) {
      let td = {};
      td['clr'] = TEMPO_COLORS[bix % TEMPO_COLORS.length];
      td['deg'] = degPerFrame * i;
      pieTimingPerFrame.push(td);
    }
    for (var i = 0; i < tRestFrms; i++) {
      let td = {};
      td['clr'] = TEMPO_COLORS[bix % TEMPO_COLORS.length];
      td['deg'] = 0;
      pieTimingPerFrame.push(td);
    }
  });
}

function makePie() {
  pie = mkSvgArc({
    svgContainer: canvas.svg,
    x: PIEX,
    y: PIEY,
    radius: PIERAD,
    startAngle: 0,
    endAngle: 359,
    fill: TEMPO_COLORS[0],
    stroke: 'none',
    strokeW: 0,
    strokeCap: 'round' //square;round;butt
  });
  pie.setAttributeNS(null, 'display', 'yes');
  pieOutline = mkSvgArc({
    svgContainer: canvas.svg,
    x: PIEX,
    y: PIEY,
    radius: PIERAD,
    startAngle: 0,
    endAngle: 359,
    fill: 'none',
    stroke: clr_neonMagenta,
    strokeW: 2,
    strokeCap: 'round' //square;round;butt
  });
  pieOutline.setAttributeNS(null, 'display', 'yes');
}

function movePie() {
  let pieClock = FRAMECOUNT - LEADIN_FRAMES;
  if (pieClock >= 0) {
    let endAngle = pieTimingPerFrame[pieClock].deg;
    let tClr = pieTimingPerFrame[pieClock].clr
    let startAngle = 0;
    let start = polarToCartesian(PIEX, PIEY, PIERAD, endAngle);
    let end = polarToCartesian(PIEX, PIEY, PIERAD, startAngle);
    let arcSweep = endAngle - startAngle <= 180 ? "0" : "1";
    let d = [
      "M", start.x, start.y,
      "A", PIERAD, PIERAD, 0, arcSweep, 0, end.x, end.y,
      "L", PIEX, PIEY,
      "L", start.x, start.y
    ].join(" ");
    pie.setAttributeNS(null, "d", d); //describeArc makes 12'0clock =0degrees
    pie.setAttributeNS(null, "fill", tClr);
  }
}
//#endef Pie








//
