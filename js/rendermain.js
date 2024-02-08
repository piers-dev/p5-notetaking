let y = 100;


let myCanvas;
let bgdiv

let nodes = new Array()

let font;

let mx, my, pmx, pmy;

let dx, dy;

let mouseWasPressed;

let hoverUsed;

function getWidth() {
    return bgdiv.clientWidth;
}

function getHeight() {
    return bgdiv.clientHeight;
}



// The statements in the setup() function
// execute once when the program begins
function setup() {

    bgdiv = document.getElementById("canvas")
    myCanvas = createCanvas(getWidth(), getHeight(), WEBGL);

    myCanvas.parent("canvas");

    stroke(255); // Set line drawing color to white
    //frameRate(30);
    //nodes.push(new Node(0,0,"Test"));
    //nodes.push(new Node(200,0,"Other Test"));
    //nodes.push(new Node(200,500,"Test 3"));
    //nodes.push(new Node(-300,0,"Another test surprise surprise"));
    //nodes.push(new Node(-301,0,"Another one"));
    //nodes.push(new Node(-302,0,"I like tests"));
    






    
    font = loadFont("fonts/Raleway-Regular.ttf");
    textFont(font);


}
// The statements in draw() are executed until the
// program is stopped. Each statement is executed in
// sequence and after the last line is read, the first
// line is executed again.
function draw() {

    

    if (myCanvas.width != getWidth() || myCanvas.height != getHeight) {
        myCanvas.resize(getWidth(), getHeight());
    }


    mx = mouseX-width/2;
    my = mouseY-height/2;

    pmx = pmouseX-width/2;
    pmy = pmouseY-height/2;
    

    dx = mouseX - pmouseX;
    dy = mouseY - pmouseY;


    background(backgroundColor); // Set the background to black
    fill(backgroundColor);
    noStroke();
    
    hoverUsed = false;

    let selection = false;
    nodes.forEach((n) => {
        nodes.forEach((nf) => {
            if (nf != n) n.applyForces(nf);
        });
        let nd = n.drawSelf();
        selection = selection || nd;
    });
    if (!selection && mouseIsPressed) nodes.push(new Node(mx,my,words[Math.floor(Math.random()*words.length)]));

    mouseWasPressed = mouseIsPressed;
}



