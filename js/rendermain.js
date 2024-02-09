let y = 100;

let r = document.querySelector(':root');
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

let editing = -1;



let xPan = 0;
let yPan = 0;
let xPanVel = 0;
let yPanVel = 0;

let zoom = 1;

let zoomDelta = 0;

let bgp = document.getElementById('bg');

let ogp = document.getElementById('og');


let fgp = document.getElementById('fg');

let sgp = document.getElementById('sg');


function getWidth() {
    return bgdiv.clientWidth;
}

function getHeight() {
    return bgdiv.clientHeight;
}
function loadFromFile() {
    var file = document.getElementById("fileLoad").files[0];
    if (file) {
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = function (evt) {
            try {
                nodes = objToNodes(JSON.parse(evt.target.result));
            }
            catch {
                alert("File is invalid or damaged")
            }
        }
        reader.onerror = function (evt) {
            alert("Failed to read file");
        }
    }
}

let saveButton;
function download(data, filename, type) {
    var file = new Blob([data], { type: type });
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}

function updateBG() {
    localStorage.setItem('bgColor', backgroundColor);

}

function updateOG() {
    localStorage.setItem('ogColor', outgroundColor);

}

function updateFG() {
    localStorage.setItem('fgColor', foregroundColor);
}

function updateSG() {
    localStorage.setItem('sgColor', specialColor);
}


// The statements in the setup() function
// execute once when the program begins
function setup() {

    bgdiv = document.getElementById("canvas")
    myCanvas = createCanvas(getWidth(), getHeight());

    myCanvas.parent("canvas");



    stroke(255); // Set line drawing color to white
    frameRate(120);
    //nodes.push(new Node(0,0,"Test"));
    //nodes.push(new Node(200,0,"Other Test"));
    //nodes.push(new Node(200,500,"Test 3"));
    //nodes.push(new Node(-300,0,"Another test surprise surprise"));
    //nodes.push(new Node(-301,0,"Another one"));
    //nodes.push(new Node(-302,0,"I like tests"));






    let bg = localStorage.getItem('bgColor');
    let og = localStorage.getItem('ogColor');

    let fg = localStorage.getItem('fgColor');
    let sg = localStorage.getItem('sgColor');

    let z = localStorage.getItem('zoom');
    let xp = localStorage.getItem('xPan');
    let yp = localStorage.getItem('yPan');

    if (bg != null) backgroundColor = bg;
    if (og != null) outgroundColor = og;

    if (fg != null) foregroundColor = fg;
    if (sg != null) specialColor = sg;

    if (z != null) zoom = parseFloat(z);
    if (xp != null) xPan = parseFloat(xp);
    if (yp != null) yPan = parseFloat(yp);



    document.getElementById('fg').value = foregroundColor;
    document.getElementById('og').value = outgroundColor;

    document.getElementById('bg').value = backgroundColor;
    document.getElementById('sg').value = specialColor;


    let s = localStorage.getItem("nodes");



    if (s != null) nodes = objToNodes(JSON.parse(s));



    font = loadFont("fonts/Raleway-Regular.ttf");
    textFont(font);

    setInterval(() => {
        localStorage.setItem("nodes", JSON.stringify(nodesToObj(nodes)));
        localStorage.setItem("zoom", zoom);
        localStorage.setItem("xPan", xPan);
        localStorage.setItem("yPan", yPan);


    }, 2500);


    document.addEventListener('keydown', e => {
        if (e.ctrlKey && e.key === 's') {
            // Prevent the Save dialog to open
            e.preventDefault();
            // Place your code here
            download(JSON.stringify(nodesToObj(nodes)), "Untitled.board", String);
        }
    });
    document.addEventListener('keydown', e => {
        if (e.ctrlKey && e.key === 'o') {
            // Prevent the Save dialog to open
            e.preventDefault();
            // Place your code here
            let fl = document.getElementById('fileLoad');
            fl.click();
        }
    });

}
function radiusClamp(x, y, radius, x2, y2) {
    let nx = x - x2;
    let ny = y - y2;

    let l = Math.sqrt(nx * nx + ny * ny);

    if (l > radius) {
        return {
            'x': (nx / l) * radius + x2,
            'y': (ny / l) * radius + y2
        };
    }
    else return { 'x': x, 'y': y };
}

function objToNodes(array) {
    let n = new Array()
    array.forEach(e => {
        let node = new Node(e['x'], e['y'], e['name']);
        node.sizeMultiplier = e['size'];
        node.size = node.sizeMultiplier;
        node.mode = e['mode'];
        n.push(node);

    });


    return n;
}

function nodesToObj(array) {
    let o = new Array()
    array.forEach(e => {
        o.push({
            'x': e.x,
            'y': e.y,
            'name': e.name,
            'size': e.size,
            'mode': e.mode

        })
    });
    return o;
}

// The statements in draw() are executed until the
// program is stopped. Each statement is executed in
// sequence and after the last line is read, the first
// line is executed again.
function draw() {


    backgroundColor = bgp.value;

    foregroundColor = fgp.value;
    specialColor = sgp.value;

    outgroundColor = ogp.value;

    r.style.setProperty('--foreground', foregroundColor);
    r.style.setProperty('--outground', outgroundColor);

    r.style.setProperty('--background', backgroundColor);
    r.style.setProperty('--special', specialColor);



    if (myCanvas.width != getWidth() || myCanvas.height != getHeight) {
        myCanvas.resize(getWidth(), getHeight());
    }


    pmx = mx;
    pmy = my;

    mx = (mouseX / zoom) - width / 2;
    my = (mouseY / zoom) - height / 2;




    dx = (mouseX - pmouseX) / zoom;
    dy = (mouseY - pmouseY) / zoom;


    fill(outgroundColor);
    stroke(backgroundColor);
    strokeWeight(2);
    rect(0, 0, width, height); // Set the background to black


    fill(backgroundColor);
    stroke(foregroundColor);


    strokeWeight(6 * zoom);
    circle(zoom * width / 2 + xPan, zoom * height / 2 + yPan, 5050 * zoom);



    strokeWeight(10 * zoom);
    circle(zoom * width / 2 + xPan, zoom * height / 2 + yPan, 5000 * zoom);





    fill(foregroundColor);





    if (!hoverUsed && mmb) {

        xPanVel = dx * zoom;
        yPanVel = dy * zoom;
        //createParticleBurst(Math.random() * width - width / 2 - xPan, Math.random() * height - height / 2 - yPan, 0.1, 0.3, 2, 5, Math.random() * 3, 1, 2);



    }
    else {
        xPanVel = lerp(xPanVel, 0, 0.1);
        yPanVel = lerp(yPanVel, 0, 0.1);

    }

    xPan += xPanVel;
    yPan += yPanVel;


    //console.log(mx+", "+my)

    let dxp = (zoom * width / 2) - width / 2;
    let dyp = (zoom * height / 2) - height / 2;

    let newPan = radiusClamp(xPan, yPan, 2450 * zoom, -dxp, -dyp);



    xPan = newPan['x'];
    yPan = newPan['y'];


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


    //drawParticles();
    fill(foregroundColor)
    stroke(foregroundColor)




    nodes.forEach((n) => {
        if (!n.mode) return;
        let nd = n.drawSelf();
        selection = selection || nd;
    });
    fill(foregroundColor);
    stroke(foregroundColor);

    nodes.forEach((n) => {
        if (n.mode) return;
        nodes.forEach((nf) => {
            if (nf != n) n.applyForces(nf);
        });
        let nd = n.drawSelf();
        selection = selection || nd;
    });



    if (!hoverUsed && !selection && (lmb && !plmb) || (rmb && !prmb)) {

        if (editing != -1) {
            editing = -1;
        }
    }




    removalQueue.forEach((i) => {
        nodes.splice(i, 1);
    });



    plmb = lmb;
    prmb = rmb;
    pmmb = mmb;



    if (nodes.length < 1) {
        fill(foregroundColor);
        noStroke();

        textSize(40);
        text("Double-Click to Add Node", 20, height - 20);
    }
}


function mouseWheel(event) {
    let eventUsed = false;
    nodes.forEach((n) => {
        let nh = n.processMouse(event.delta);
        eventUsed = eventUsed || nh;
    });

    if (!eventUsed) {
        let oldzoom = zoom;
        zoom -= (event.delta * zoom) / 1000;
        zoom = Math.max(zoom, 0.25);
        zoom = Math.min(zoom, 2);

        let zd = zoom - oldzoom;

        xPan -= (width / 2) * zd;
        yPan -= (height / 2) * zd;


        let dxp = (zoom * width / 2) - width / 2;
        let dyp = (zoom * height / 2) - height / 2;

        let newPan = radiusClamp(xPan, yPan, 2450 * zoom, -dxp, -dyp);



        xPan = newPan['x'];
        yPan = newPan['y'];

    }
}

function keyPressed() {
    if (keyCode === ENTER || keyCode === ESCAPE) {
        editing = -1;
    }
}

function doubleClicked(event) {
    if (editing != -1) return;
    nodes.push(new Node(mx - xPan / zoom, my - yPan / zoom, "New Note"));
    editing = nodes.length - 1;
    //createParticleBurst(mx - xPan, my - yPan, 1, 5, 5, 10, 10, 0.5, 1);
}

