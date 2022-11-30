let socket;
let address = 'http://localhost:3000'

let cam;
let mySound, amp;
let video;

//poseNet
let poseNet;
let aPose;
let aSkeleton;

// callbacks for PoseNet
function modelLoaded() {
  console.log("postNet ready");
}

function getPoses(poses) {
  //console.log(poses);
  if (poses.length > 0) {
    aPose = poses[0].pose;
    aSkeleton = poses[0].skeleton;
  }
}
//end of poseNet loading

function preload() {
  soundFormats('mp3', 'ogg');
  mySound = loadSound('simple.mp3');
}

function setup() {
  createCanvas(400*2, 300*2);
  pixelDensity(1);
  cam = createCapture(VIDEO);
  cam.size(400*2,300*2);
  cam.hide();
  fft = new p5.FFT();
  // mic = new p5.AudioIn();
  // mic.start();
  mySound.play();  
  amp = new p5.Amplitude();
  
  // loading PostNet pre-trained model
  poseNet = ml5.poseNet(cam,'multiple', modelLoaded);
  poseNet.on("pose", getPoses);
}

function draw() {
  push();
  translate(width,0);
  scale(-1, 1);
  background("black");
  //image(cam,0,0);
  let spectrum = amp.getLevel();
  // let soundInput = mic.getLevel();
  // console.log(soundInput);
  cam.loadPixels();
      //console.log(spectrum);
  let pixelSize = int(map(spectrum,0,1,2,50));
  let pixelColor = int(map(spectrum,0,1,1,255));
  let pixelFrac =  pixelColor / 90;
  // console.log(pixelFrac);
    if (aPose) {
    console.log('pose detected');
    let k = aPose.keypoints;
    let nose = k[0].position;
    let leftEar = k[3].position;
    let rightEar = k[4].position;
    let faced = dist(leftEar.x, leftEar.y, rightEar.x, rightEar.y);
    // draw the face
     fill(255);
    ellipse(nose.x, nose.y, faced, faced);
      

    // draw the skeleton
        strokeWeight(10);
        stroke(100);
    for (let i = 0; i < aSkeleton.length; i++) {
      let a = aSkeleton[i][0];
      let b = aSkeleton[i][1];
      line(a.position.x, a.position.y, b.position.x, b.position.y);
          
    }
  }
  
  for(let x=0; x < cam.width; x+=pixelSize){
  for(let y=0; y<cam.height; y+=pixelSize){  
    let index = (x+y*cam.width)*4; // convert x&y to index //index = position in the array

    // get the color of the pixel position
    // draw a rect at the corresponding x and y pixel
    let r = cam.pixels[index]; 
    let g = cam.pixels[index+1];
    let b = cam.pixels[index+2];
    let col = color((r * pixelFrac) * random(0.8, 1),(g * pixelFrac) * random(0.8, 1),(b * pixelFrac) *  random(0.8, 1));
    // console.log(r * pixelFrac);
    let bright = brightness(col); 
    // bright is a value between 0 and 255
    // if(bright > 60){
    //    fill(255);
    //    }
    // else{
    //  //colorMode(HSB);
    //    // fill(random(100,200),255,255);
    //   fill(col);
    // }    
    noStroke();
    fill(col);
    ellipse(x,y,pixelSize,pixelSize);
    }
  }
//     if (aPose) {
//     console.log('pose detected');
//     let k = aPose.keypoints;
//    let nose = k[0].position;
//    let leftEar = k[3].position;
//    let rightEar = k[4].position;
//    let faced = dist(leftEar.x, leftEar.y, rightEar.x, rightEar.y);
//    // draw the face
//     fill(255);
//    ellipse(nose.x, nose.y, faced, faced);

//    // draw the skeleton
//    for (let i = 0; i < aSkeleton.length; i++) {
//      let a = aSkeleton[i][0];
//      let b = aSkeleton[i][1];
//      line(a.position.x, a.position.y, b.position.x, b.position.y);
//    }
//   }
}


