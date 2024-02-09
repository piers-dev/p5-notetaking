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



    let s = localStorage.getItem("nodes");

    if (s != null) nodes = objToNodes(JSON.parse(s));



    font = loadFont("fonts/Raleway-Regular.ttf");
    textFont(font);

    setInterval(() => {
        localStorage.setItem("nodes", JSON.stringify(nodesToObj(nodes)));

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


function objToNodes(array) {
    let n = new Array()
    array.forEach(e => {
        let node = new Node(e['x'], e['y'], e['name']);
        node.sizeMultiplier = e['size'];
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
            'size': e.size

        })
    });
    return o;
}

// The statements in draw() are executed until the
// program is stopped. Each statement is executed in
// sequence and after the last line is read, the first
// line is executed again.
function draw() {

    r.style.setProperty('--foreground', foregroundColor);
    r.style.setProperty('--background', backgroundColor);


    if (myCanvas.width != getWidth() || myCanvas.height != getHeight) {
        myCanvas.resize(getWidth(), getHeight());
    }


    mx = mouseX - width / 2;
    my = mouseY - height / 2;

    pmx = pmouseX - width / 2;
    pmy = pmouseY - height / 2;


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
        nodes.splice(i, 1);
    });

    if (!selection && lmb && !plmb) {

        if (editing != -1) editing = -1;
        else {
            nodes.push(new Node(mx, my, "New Note"));
            editing = nodes.length - 1;
            createParticleBurst(mx, my, 1, 5, 5, 10, 10, 0.5, 1);
        }
    }

    plmb = lmb;
    prmb = rmb;
    pmmb = mmb;


}


function mouseWheel(event) {
    nodes.forEach((n) => {
        n.processMouse(event.delta);
    });
}

function keyPressed() {
    if (keyCode === ENTER || keyCode === ESCAPE) {
        editing = -1;
    }
}

