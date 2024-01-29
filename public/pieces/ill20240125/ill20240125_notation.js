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
  updateSquares();
  // updateLoops();
}
//#endef Animation Engine

//#ef INIT
function init() {
  calcScrollingCsrs();
  calcSquareTimes();
  console.log(barsTiming);
  // calcLoopsData();
  // calcLoopsFrameArray();
  makeCanvas();
  mkStaffRects();
  drawBars();

  // makeLoopBrackets();
  // makeLoopCursors();

  makeScrollingCursors();

  mkSquares();
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
  td['accel'] = tAccel;
  // Calculate total number of frames from acceleration and distance
  // t = sqrRoot( (2L/a) ) ; L is total pixels
  let totalDurFrames;
  if (tAccel == 0) {
    totalDurFrames = Math.round(TOTAL_NUM_PX_IN_SCORE / iTempoPxPerFrame);
  } else {
    totalDurFrames = Math.round((fTempoPxPerFrame - iTempoPxPerFrame) / tAccel);
  }
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
let barY = 3;
let barH = 25;
let bars = [];
const BAR_CLRS = [clr_limeGreen, clr_mustard, clr_brightBlue, clr_neonMagenta];

let barsTiming = [{
  startbt: 5,
  endbt: 7.5,
  motivenum: 0
//} , {
//   startbt: 9,
//   endbt: 10,
//   motivenum: 1
// }, {
//   startbt: 13,
//   endbt: 16.29,
//   motivenum: 2
// }, {
//   startbt: 18,
//   endbt: 24.5,
//   motivenum: 3
}];
let barsConst = []; //tx ty tw
function makeBars() {
  barsTiming.forEach((barObj, barIx) => {
    //find line number for start and end
    let tleftXAbs = barObj.startbt * PX_PER_BEAT;
    let tleftX = Math.round(tleftXAbs) % Math.round(NOTATION_LINE_LENGTH_PX);
    let tleftLineNum = Math.floor(tleftXAbs / NOTATION_LINE_LENGTH_PX);
    let trightXAbs = barObj.endbt * PX_PER_BEAT;
    let trightX = Math.round(trightXAbs) % Math.round(NOTATION_LINE_LENGTH_PX);
    let trightLineNum = Math.floor(trightXAbs / NOTATION_LINE_LENGTH_PX);

    barsTiming[barIx]['absXStart'] = tleftXAbs;
    barsTiming[barIx]['absXEnd'] = trightXAbs;
    //if linenums are not equal start at x=0 to right beat
    if (tleftLineNum == trightLineNum) {
      let tx = tleftX;
      let tw = trightX - tleftX;
      let ty = barY + ((NOTATION_H + GAP_BTWN_NOTATION_LINES) * tleftLineNum);

    } else { //if bar spills to next line
      let tx1 = tleftX;
      let tw1 = WORLD_W - tleftX;
      let ty1 = barY + ((NOTATION_H + GAP_BTWN_NOTATION_LINES) * tleftLineNum);

      let tx2 = 0;
      let tw2 = trightX;
      let ty2 = barY + ((NOTATION_H + GAP_BTWN_NOTATION_LINES) * trightLineNum);

    }
  });
}

function drawBars() {
  tbr = [];

  let tBar = mkSvgRect({
    svgContainer: canvas.svg,
    x: tx,
    y: ty,
    w: tw,
    h: barH,
    fill: BAR_CLRS[barObj.motivenum],
    stroke: 'none',
    strokeW: 0,
    roundR: 0
  });
  tBar.setAttributeNS(null, 'display', 'yes');
  tbr.push(tBar);
  bars.push(tbr);
  let tBar1 = mkSvgRect({
    svgContainer: canvas.svg,
    x: tx1,
    y: ty1,
    w: tw1,
    h: barH,
    fill: BAR_CLRS[barObj.motivenum],
    stroke: 'none',
    strokeW: 0,
    roundR: 0
  });
  tBar1.setAttributeNS(null, 'display', 'yes');
  tbr.push(tBar1);
  let tBar2 = mkSvgRect({
    svgContainer: canvas.svg,
    x: tx2,
    y: ty2,
    w: tw2,
    h: barH,
    fill: BAR_CLRS[barObj.motivenum],
    stroke: 'none',
    strokeW: 0,
    roundR: 0
  });
  tBar2.setAttributeNS(null, 'display', 'yes');
  tbr.push(tBar2);
  bars.push(tbr);
}

function moveBars() {
  let tx = (FRAMECOUNT * -PX_PER_FRAME) + LEADIN_PX;
  bars.forEach((tBar) => {
    tBar.setAttributeNS(null, 'transform', "translate(" + tx.toString() + ",0)");
  });
}
//#endef Bars

//#ef Squares
let squareTimingFramesPerTempo = [];
let sqrH = 15;
let squares = [];

function calcSquareTimes() {
  tempoConsts.forEach((tempoObj, tempoIx) => { //run for each tempo
    let frameArray = [];
    let tNumFrames = tempoObj.totalDurFrames;
    //populate framearray with x=bottom
    for (var i = 0; i < tNumFrames; i++) {
      let tmotiveAr = [];
      for (var j = 0; j < 4; j++) {
        let td = {};
        td['y'] = NOTATION_H - (sqrH * (j + 1)) - 2;
        td['h'] = sqrH;
        tmotiveAr.push(td);
      }
      frameArray.push(tmotiveAr);
    }
    //every bar find frame for startx and end x
    barsTiming.forEach((barObj, barIx) => {
      let tStartX = barObj.absXStart;
      console.log(tStartX);
      let tEndX = barObj.absXEnd;
      let tMotiveNum = barObj.motivenum;
      let tStartFrm, tEndFrm;
      for (var frmIx = 1; frmIx < tempoObj.frameArray.length; frmIx++) {
        let tThisFrmX = tempoObj.frameArray[frmIx].absX;
        let tLastFrmX = tempoObj.frameArray[frmIx - 1].absX;
        //troubleshoot here
        // console.log(tStartX + ' '+tThisFrmX+ ' '+tLastFrmX);
        if (tStartX <= tThisFrmX && tStartX >= tLastFrmX) {
          tStartFrm = frmIx;
        }
        if (tEndX <= tThisFrmX && tEndX >= tLastFrmX) {
          tEndFrm = frmIx;
        }
      }
      let tNumFrmsThisBar = tEndFrm - tStartFrm;
      let tSqrInc = sqrH / tNumFrmsThisBar;
      for (var i = 0; i < tNumFrmsThisBar; i++) {
        let tiy = tempoObj.frameArray[i + tStartFrm].y +  NOTATION_H - (sqrH * (i + 1)) - 2;
        frameArray[i + tStartFrm][tMotiveNum]['h'] = tSqrInc * i;
        frameArray[i + tStartFrm][tMotiveNum]['y'] = tiy + (tSqrInc * i);
      }
    });
    squareTimingFramesPerTempo.push(frameArray);
  });
}

function mkSquares() {
  for (var j = 0; j < tempos.length; j++) {
    let tsqar = [];
    for (var i = 0; i < 4; i++) {
      let td = {};
      let tRect = mkSvgRect({
        svgContainer: canvas.svg,
        x: -sqrH,
        y: NOTATION_H - (sqrH * (i + 1)) - 2,
        w: sqrH,
        h: sqrH,
        fill: BAR_CLRS[i],
        stroke: BAR_CLRS[i],
        strokeW: 2,
        roundR: 0
      });
      let tOutline = mkSvgRect({
        svgContainer: canvas.svg,
        x: -sqrH,
        y: NOTATION_H - (sqrH * (i + 1)) - 2,
        w: sqrH,
        h: sqrH,
        fill: 'none',
        stroke: BAR_CLRS[i],
        strokeW: 2,
        roundR: 0
      });
      td['sqr'] = tRect;
      td['ol'] = tOutline;
      tsqar.push(td);
    }
    squares.push(tsqar);
  }
}

function updateSquares() {
  totalNumFramesPerTempo.forEach((numFrames, tempoIx) => {
    let currFrame = FRAMECOUNT % numFrames;
    let tx = tempoConsts[tempoIx].frameArray[currFrame].x - sqrH;
    for (var i = 0; i < 4; i++) {
      let ty = squareTimingFramesPerTempo[tempoIx][currFrame][i].y; //trouble shoot here
      let th = squareTimingFramesPerTempo[tempoIx][currFrame][i].h;
      squares[tempoIx][i].sqr.setAttributeNS(null, 'x', tx);
      squares[tempoIx][i].sqr.setAttributeNS(null, 'y', ty);
      squares[tempoIx][i].sqr.setAttributeNS(null, 'h', th);
      squares[tempoIx][i].ol.setAttributeNS(null, 'x', tx);
      squares[tempoIx][i].ol.setAttributeNS(null, 'y', ty);
      squares[tempoIx][i].ol.setAttributeNS(null, 'h', th);
    }
  });
}
//#endef Squares








//
