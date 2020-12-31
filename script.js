/*

global textSize, createCapture, ml5, VIDEO, loadTable, createCanvas, classifier, background, image, stroke, fill, strokeWeight, width, height, text, random, frameRate, loadSound,
map, noLoop, loadFont, textFont,noCanvas, loadImage

*/

/*
 --------------------------------------------------------
 Plan: 
 - Score Keeper
 - Web Server (2 computers talking to each other)
 - Machine Learning Classification using Webcam
 - JSON loaded with random household object
 --------------------------------------------------------
*/

let vid;
let currentObj = "";
let score = 0;
let answer = "";
let table;
let servedItem = "";
let rand;
let classifier;
let item = "";
let gameOver = false;
let timer;
let correct, next;
let rounds;
let myfont, overImg;

function preload() {
  table = loadTable(
    "https://cdn.glitch.com/a9fb2650-1e38-4b9b-8d26-64a1a2beebba%2Frandomobj2.csv?v=1596031300438"
  );

  correct = loadSound(
    "https://cdn.glitch.com/a9fb2650-1e38-4b9b-8d26-64a1a2beebba%2F243701__ertfelda__correct.wav?v=1595720864352"
  );
  next = loadSound(
    "https://cdn.glitch.com/a9fb2650-1e38-4b9b-8d26-64a1a2beebba%2F476178__unadamlar__correct-choice.wav?v=1595721277618"
  );

  myfont = loadFont(
    "https://cdn.glitch.com/a9fb2650-1e38-4b9b-8d26-64a1a2beebba%2FRowdies-Light.ttf?v=1595781989659"
  );

  overImg = loadImage(
    "https://cdn.glitch.com/a9fb2650-1e38-4b9b-8d26-64a1a2beebba%2FCopy%20of%20scavirtual%20hunt%20logo%20(4).png?v=1595784148564"
  );
}

function setup() {
  createCanvas(650, 580);

  vid = createCapture(VIDEO);
  vid.hide();
  classifier = ml5.imageClassifier("MobileNet", vid, modelReady);

  // console.log(table.getRowCount());
  //adjust timer
  timer = 1000;
  rounds = 0;
  serveNewItem();
}

function modelReady(error, result) {
  console.log("Model is ready!");
  classifier.classify(gotResult);
}

function gotResult(error, result) {
  if (error) {
    console.error(error);
  } else {
    //console.log(result)
    currentObj = result[0].label;
    // console.log(currentObj.toUpperCase());
    // answer = result[0].label;
    classifier.classify(gotResult);
  }
}

function draw() {
  background(255);
  image(vid, 0, 0, width, height - 100);

  displayCurrentObj();
  displayNewItem();
  trackTime();
  keepScore();
  gameIsOver();
}

function displayCurrentObj() {
  textSize(32);
  // stroke(5);
  // fill(0);
  stroke(44, 64, 137);
  fill(44, 64, 137);
  textFont(myfont);
  text("Showing a " + currentObj, 30, height - 20);
}

function serveNewItem() {
  rounds++;
  next.play();
  timer = 1000;
  rand = Math.floor(random(0, table.getRowCount()));
  // console.log(table.getString(rand, 0));
  item = table.getString(rand, 0);
}

function displayNewItem() {
  // stroke("blue");
  // fill("blue");
  servedItem = item;
  stroke(44, 64, 137);
  fill(44, 64, 137);
  textFont(myfont);
  text("Find a " + item, 30, height - 60);
}

function keepScore() {
  text("Score: " + score, 10, 30);

  // currentObj = currentObj.replaceAll("\\s", "");
  // servedItem = servedItem.replaceAll("\\s", "");
  if (currentObj.toUpperCase().includes(servedItem.toUpperCase())) {
    score += Math.floor(map(timer, 1, 2000, 1, 100));
    correct.play();
    serveNewItem();
  }
}

function mouseIsClicked() {
  // serveNewItem();
  // console.log("HELLLLOOOOOOOO!!!!!!!!!!!")
}

function trackTime() {
  if (timer > 0) {
    timer = timer - 1;
  } else if (timer === 0) {
    serveNewItem();
    // timer = 1500;
  }

  stroke(44, 64, 137);
  fill(44, 64, 137);
  textFont(myfont);
  text("Timer: " + timer, width - 200, 30);
}

function gameIsOver() {
  if (rounds === 6) {
    gameOver = true;
    noLoop();
    stroke(44, 64, 137);
    fill(44, 64, 137);
    textSize(100);
    textFont(myfont);
    // noCanvas();
    image(overImg, 0, 0, width, height);
    text("Game Over!", width / 2 - 250, height / 2 - 200);
    textSize(50);
    text("Final Score: " + score, width / 2 - 150, height / 2 - 125);
  }
}
