var all_metros = [];
var orbitControlEnable;
var angle = 0;
var sizeChange = 0;
var changeAmount = 0.08;
var val;
var slider;


function preload() {
  table = loadTable("metros.csv", "csv", "header");
  Aqum = loadFont('Aqum.otf');
}

function setup() {
  createCanvas(800, 600, WEBGL);
  colorMode(HSL);
  allMetroData();
  // 3D
  camera(0, 0, 960, 0, 0, 0, 0, 1, 0);
  // Toggle default light
  // orbitControlCheck = createCheckbox("Enable Orbit Control", true);
  // orbitControlCheck.position(20, 60);
  // orbitControlCheck.changed(() => {
  //   orbitControlEnable = !orbitControlEnable;
  // });
  slider = createSlider(0, all_metros.length, 0, 1); // length include all position
  slider.position(25, 580);
  slider.style("width", "750px");
  
  textFont(Aqum);
  textSize(width / 10);
  textAlign(CENTER, CENTER);
}

function draw() {
  if(sizeChange>4||sizeChange<0){
    modeChange();
  }
  sizeChange+=changeAmount;
  // -1: the first value is for all instead of for the 1st index
  val = slider.value() - 1;
  noStroke();
  background(20);
  //Create Box
  push();
  noFill();
  stroke(255);
  strokeWeight(0.4);
  box(570, 580, 570);
  pop();
  // For each metro
  for (let m = 0; m < all_metros.length; m++) {
    // For each metro's colors
    for (let i = 0; i < all_metros[m].colors.length; i++) {
      push();
      h = int(all_metros[m].colors[i][0]);
      s = int(all_metros[m].colors[i][1]);
      l = int(all_metros[m].colors[i][2]);
      let xt = (h-180)**2*0.016-255;
      let yt = (l-40)**2*-0.35+280;
      let zt = s * 5.2 - 263;
      translate(xt, yt, zt);
      stroke(h,s+10,l+10,0.5)
      strokeWeight(0.4)
      noFill()
      ellipse(0,0,20)
      pop();
    }
  }
  if (val == -1) {
    for (let m = 0; m < all_metros.length; m++) {
      // For each metro's colors
      for (let i = 0; i < all_metros[m].colors.length; i++) {
        push();
        h = int(all_metros[m].colors[i][0]);
        s = int(all_metros[m].colors[i][1]);
        l = int(all_metros[m].colors[i][2]);
        fill(h, s, l);
        let xt = (h-180)**2*0.016-255;
        let yt = (l-40)**2*-0.35+280;
        let zt = s * 5.2 - 263;
        translate(xt, yt, zt);
        sphere(10);
        pop();
      }
    }
  } else {
    // TODO: Fix this below (line 94)
    // Rendering the lines-dots
    for (let i = 0; i < all_metros[val].colors.length; i++) {
      push();
      h = int(all_metros[val].colors[i][0]);
      s = int(all_metros[val].colors[i][1]);
      l = int(all_metros[val].colors[i][2]);
      fill(h, s, l);
      stroke(255)
      strokeWeight(3)
      // TODO: These xt, yt, zt values are not being 
      // set correctly for me functions
      let xt = (h-180)**2*0.016-255;
      let yt = (l-40)**2*-0.35+280;
      let zt = s * 5.2 - 263;
      translate(xt, yt, zt);
      ellipse(0,0,25+sizeChange);
      fill(255)
      textSize(16)
      text(all_metros[val].lines[i],0,-30)
      pop();
    }
  }
  
  // 3D
  if (!orbitControlEnable && mouseY<540) {
    // Enable orbit control
    orbitControl(3,3,0.06);
  }
  if (val!=-1){
      fill(255)
      textSize(64)
      text(all_metros[val].city,0,0)
      textSize(26)
      text(all_metros[val].name,0,-50)
  }
}

function modeChange(){
  changeAmount=changeAmount*-1
}

// Collecting all metro stuff
function allMetroData() {
  for (let row = 0; row < table.getRowCount(); row += 2) {
    // Each two row -> City&Colors; Name&Lines
    // Collect colors
    let colors = [];
    let lines = [];
    // Each column -> [0]:City/Name [1:-1]Colors/Lines
    for (let col = 0; col < table.getColumnCount(); col++) {
      element_1 = table.getString(row, col); // element in line 1
      element_2 = table.getString(row + 1, col); // in line 2
      if (element_1 != "") {
        if (col == 0) {
          // City/Name
          cityname = element_1;
          subname = element_2;
        } else {
          append(colors, element_1);
          append(lines, element_2);
        }
      }
    }
    append(all_metros, new Metro(cityname, subname, colors, lines));
    // Each Row Loop Ends Here
  }

}

class Metro {
  // Parsing the stuff
  constructor(city, name, colors, lines) {
    this.city = city;
    this.name = name;
    this.colors = [];
    this.h = [];
    this.s = [];
    this.l = [];
    for (let i = 0; i < colors.length; i++) {
      let hsl = colors[i].split(", ");
      append(this.colors, hsl);
      append(this.h, hsl[0]);
      append(this.s, hsl[1]);
      append(this.l, hsl[2]);
    }
    this.lines = lines;
    // this.dict = {city:this.city};
  }

  // show() {}
}