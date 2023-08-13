let geoData;
let api = 'https://api.openweathermap.org/data/2.5/weather?q=';
let apiKey = '&appid=71282286da6406175aad998a977bab3a';
let units = '&units=metric';

let X_AXIS = 1;
let c1, c2; // gradient color

let winds = [];

let city = 'Brisbane';
let button;

function setup() {
  createCanvas(360, 600);
  colorMode(RGB);

  let url = api + 'Brisbane' + apiKey + units;
  loadJSON(url, gotData);

  let selX = width / 2 - 70;
  city = createInput('Brisbane');
  city.position(0 + selX, 625);
  city.size(120);
  button = createButton('Submit');
  button.mousePressed(cityAsk);
  button.position(130 + selX, 625);
  button.size(50);

  for (let i = 0; i < 20; i++) {
    winds[i] = new Wind(random(width), random(height));
  }
}

function keyPressed() {
  if (keyCode === ENTER) {
    cityAsk();
  }
}

function cityAsk() {
  let url = api + city.value() + apiKey + units;
  loadJSON(url, gotData);
  print(url); // check url
}

function gotData(data) {
  geoData = data;
}

function draw() {
  background('white');

  // Display color gradient
  if (geoData) {
    let c1Col = {
      h: map(geoData.coord.lat, -60, 85, 0, 255),
      s: map(geoData.main.temp, 0, geoData.main.temp_max, 0, 255),
    };
    let c2Col = {
      h: map(geoData.coord.lon, -180, 180, 0, 255),
      s: map(geoData.main.temp_min, 0, geoData.main.temp_max, 0, 255),
    };

    c1 = color(c1Col.h, c1Col.s, c2Col.s);
    c2 = color(c2Col.h, c2Col.s, c1Col.h);

    setGradient(10, 0, 350, 350, c2, c1, X_AXIS);
  }

  // Display weather information
  if (geoData) {
    textAlign(LEFT, TOP);
    textFont('Roboto');
    textSize(14);
    fill('black');
    stroke ('no')
    
    textStyle(BOLD);
    textSize(48);
    text(geoData.name, 15, 380);
    
    textStyle(NORMAL);
    textSize(14);
    text('Today | ' + geoData.main.temp_min + ' - ' + geoData.main.temp_max + '°C', 15, 430);
    text('Current | ' + geoData.main.temp + '°C', 15, 450);
    text('Feels like | ' + geoData.main.feels_like + '°C', 15, 470);
    text('' + geoData.sys.country, 250, 410);
    text('' + geoData.coord.lat + '°', 250, 430)
    text('' + geoData.coord.lon + '°', 250, 450);
    
  }

  // Drawing wind animation lines
  strokeWeight(2);
  stroke('black');
  line(280, 340, 250, 370);
  line(287, 340, 257, 370);
  line(294, 340, 264, 370);
  line(301, 340, 271, 370);
  line(308, 340, 278, 370);
  line(315, 340, 285, 370);
  line(322, 340, 292, 370);
  line(329, 340, 299, 370);

  // Drawing wind particles
  for (let i = 0; i < winds.length; i++) {
    winds[i].display();
    winds[i].update();
    winds[i].checkEdge();
  }

  // Display date and time
  let time = {
    y: year(),
    mon: month(),
    d: day(),
    h: hour(),
    min: minute(),
    s: second(),
  };
  textSize(14);
  fill('black');
  noStroke();
  text(time.y + ' / ' + time.mon + ' / ' + time.d, 250, 500);
  text(time.h + ' : ' + time.min + ' : ' + time.s, 250, 520);
}

function setGradient(x, y, w, h, c1, c2, axis) {
  noFill();

  if (axis === X_AXIS) {
    // Left to right gradient
    for (let i = x; i <= x + w; i++) {
      let inter = map(i, x, x + w, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(i, y, i, y + h);
    }
  }
}

class Wind {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 1.5;
    this.degreeX = 300;
    this.degreeY = 300;
  }

  display() {
    noFill();
    stroke(0, 0, 255, 20);
    if (this.y > 130) {
      circle(this.x, this.y, 15, 15);
    }
  }

  update() {
    if (geoData) {
      this.degreeX = sin(geoData.wind.deg);
      this.degreeY = cos(geoData.wind.deg);
      this.xspeed = geoData.wind.speed * 2.5;
      this.x += this.speed + this.degreeX;
      this.y += this.speed + this.degreeY;
    }
  }

  checkEdge() {
    if (this.x >= width - this.speed && this.y >= height - this.speed) {
      this.y = 140;
      this.x = random(-20, width);
    }
  }
}
