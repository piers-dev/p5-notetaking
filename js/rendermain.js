let y = 100;


let myCanvas;
let bgdiv

let nodes = new Array()

let font;

let mx, my, pmx, pmy;

let dx, dy;

let lmb, plmb = false;

let rmb, prmb = false;

let mmb, pmmb = false;

let hoverUsed;

let removalQueue = new Array();

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

    lmb = false;
    rmb = false; 
    mmb = false;

    if (mouseIsPressed) {
        switch (mouseButton) {
            case LEFT:
                lmb = true;
                break;
            case RIGHT:
                rmb = true;
                break;
            case CENTER:
                mmb = true;
                break;
        }
    }

    let selection = false;

    removalQueue = new Array();
    
    

    drawParticles();

    nodes.forEach((n) => {
        nodes.forEach((nf) => {
            if (nf != n) n.applyForces(nf);
        });
        let nd = n.drawSelf();
        selection = selection || nd;
    });

    removalQueue.forEach((i) => {
        nodes.splice(i,1);
    });

    if (!selection && lmb && !plmb) {
        nodes.push(new Node(mx,my,words[Math.floor(Math.random()*words.length)]));
        createParticleBurst(mx,my,1,5,5,10,10,0.5,1);
    }

    plmb = lmb;
    prmb = rmb;
    pmmb = mmb;


}

function keyPressed() {
    nodes.forEach(n)
}

function mouseWheel(event) {
    nodes.forEach((n) => {
        n.processMouse(event.delta);
    });
}


