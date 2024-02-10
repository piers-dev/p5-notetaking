let backgroundColor = "#08081b";
let outgroundColor = "#0e0d11";

let foregroundColor = "#ffffff";
let specialColor = "#e6176a";

//2bc7ff

function checkBounds(x, y, lowx, highx, lowy, highy) {
    return ((x < highx && x > lowx)
        && (y < highy && y > lowy));
}



class Node {

    constructor(x, y, name) {
        this.x = x;
        this.y = y;
        this.name = name;
        this.isSelected = false;
        this.xVel = 0;
        this.yVel = 0;
        this.width = textWidth(this.name) + 20;
        this.height = 50;



        //this.input = createInput(name);
        //this.input.input(() => {
        //    this.name = inp.value();
        // });



        this.size = 0.2;

        this.sizeMultiplier = 1;

        this.lastClicked = 0;

        this.isHovered = false;

        this.input = null;

        this.repulsionForce = 1;
        this.attractionForce = 0;

        this.mode = false;

    }

    processKeyCode(keyCode) {

    }

    processMouse(delta) {
        if (this.isHovered) {
            this.sizeMultiplier -= (delta * this.sizeMultiplier) / 1000;
            this.sizeMultiplier = Math.max(this.sizeMultiplier, 0.5);
            this.sizeMultiplier = Math.min(this.sizeMultiplier, 2.5);
        }

        return this.isHovered;
    }




    drawSelf() {
        let editingSelf = editing == nodes.indexOf(this);

        let editingOther = !editingSelf && (editing != -1)


        let mouseOver = ((pmx - xPan / zoom < this.x - 10 + this.width / 2 && pmx - xPan / zoom > this.x - 10 - this.width / 2)
            && (pmy - yPan / zoom < this.y + this.height / 2 && pmy - yPan / zoom > this.y - this.height / 2));

        this.isHovered = ((mouseOver && !hoverUsed) || this.isSelected) && editing == -1;

        this.attractionForce = this.mode ? 2 : 0.1;

        this.repulsionForce = this.mode ? 2 : 1;


        if (this.isHovered) hoverUsed = true;



        let targetSize = this.sizeMultiplier;



        textSize(40 * this.size);


        this.width = textWidth(this.name) + 20;
        this.height = 50 * this.sizeMultiplier;

        let color = this.mode ? specialColor : foregroundColor;

        if (editingSelf) {
            if (this.input == null) {
                this.input = createInput(this.name);
                this.input.class('ui')
                //this.input.style('text-align','center');
                //this.input.style('font-family','Raleway');
                //this.input.style('stroke','none');
                //this.input.style('outline','none');
                this.input.style('border-radius', `${15 * zoom}px`);
                //this.input.style('border-style','solid');
                this.input.style('border-color', color);
                this.input.style('background-color', backgroundColor);
                this.input.style('color', color);
                this.input.style('user-select', 'text');

                this.input.style('border-width', `${6 * zoom}px`);
                this.input.attribute('maxlength', 30);
                this.input.elt.focus();
                this.input.elt.select();
                //else this.input.elt.select(this.name.length,this.name.length);

            }
            this.name = this.input.value();

            this.width = textWidth(this.name) + 20;

            this.height = 50 * this.size / 2;
            mouseOver = ((pmx - xPan / zoom < this.x + this.width / 2 && pmx - xPan / zoom > this.x - 10 - this.width / 2)
                && (pmy - yPan / zoom < this.y + this.height / 2 && pmy - yPan / zoom > this.y - this.height / 2));

            if (mouseOver) targetSize += 0.5;







            this.input.position(((this.x * zoom + width * zoom / 2) - this.width * zoom / 2) + xPan - 12 * zoom, ((this.y * zoom + height * zoom / 2) - this.height * zoom) + yPan - 6 * zoom);

            this.input.size((this.width * zoom - 12 * zoom), (this.height * zoom * 2 - 12 * zoom));
            this.input.style('font-size', `${40 * this.size * zoom}px`);
            this.isSelected = mouseOver;


        }
        else if (this.input != null) {
            this.input.remove();
            this.input = null;
        }

        //this.xVel -= (this.x) * this.sizeMultiplier;
        //this.yVel -= (this.y) * this.sizeMultiplier;

        //this.x = Math.min(Math.max(this.x,-width/2),width/2);
        //this.y = Math.min(Math.max(this.y,-height/2),height/2);






        this.xVel = lerp(this.xVel, 0, 0.65);
        this.yVel = lerp(this.yVel, 0, 0.65);

        if (this.isSelected || editingSelf || this.mode) {
            this.xVel = 0;
            this.yVel = 0;

        }

        let vx = -this.x;
        let vy = -this.y;

        let vl = Math.sqrt(this.x * this.x + this.y * this.y);

        if (vl > 2400) {
            vx /= vl;
            vy /= vl;

            vl -= 2000;
            vl = Math.max(vl, 0);

            this.xVel += vx * vl;
            this.yVel += vy * vl;
        }

        this.x += this.xVel / 30;
        this.y += this.yVel / 30;


        //if (Math.abs(this.xVel) + Math.abs(this.yVel) > 200) {
        //    createParticleBurst(this.x, this.y, 1, 5, 2, 5, 1, 0.2, 1);
        //}


        if (this.mode) {
            //createParticleBurst(this.x,this.y,0.5*this.size,2*this.size,1,3,1,1,5,true);
            fill(color + "05");
            strokeWeight(this.isHovered ? 3.5 * zoom : 1.5 * zoom);
            stroke(specialColor);
            circle(this.x * zoom + width * zoom / 2 + xPan - 10 * zoom, this.y * zoom + height * zoom / 2 + yPan, lerp(this.size * this.size, this.sizeMultiplier * this.sizeMultiplier, 0.5) * 1000 * zoom);
        }




        if (!editingSelf) {

            if (Date.now() - this.lastClicked < 200 && plmb && !lmb) {

                if (keyIsDown(ALT)) {
                    let n = new Node(this.x, this.y-this.height*1.5,this.name);
                    n.sizeMultiplier = this.sizeMultiplier;
                    n.mode = this.mode;

                    nodes.push(n);
                    editing = nodes.length-1;
                    return false;
                }


                editing = nodes.indexOf(this);
                editingSelf = true;
                return true;


            }
            if (this.isHovered && !plmb && lmb) {
                this.isSelected = true;
                this.lastClicked = Date.now();

            }
            if (!lmb) {
                this.isSelected = false;
            }

            if (this.isHovered && pmmb) {
                targetSize *= 0.9;
                if (!mmb) {
                    this.mode = !this.mode;
                    this.size *= 0.9;
                }
            }


            if (this.isHovered && rmb) {
                targetSize *= 0.7;
            }
            if ((this.isHovered && !rmb && prmb) || this.name == "") {
                removalQueue.push(nodes.indexOf(this));
                //createParticleBurst(this.x, this.y, 1, 3, 5, 10, 20, 0.1, .5);

            }

            if (this.isHovered && !(lmb && !this.isSelected)) {
                targetSize *= this.mode ? 1.05 : 1.1;

                if (this.isSelected) {
                    this.x += dx;
                    this.y += dy;
                    targetSize *= this.mode ? 1.1 : 1.3;
                    this.attractionForce *= 2;
                    document.documentElement.style.cursor = 'move';

                }
                fill(this.isSelected ? color : backgroundColor);
                strokeWeight(this.isSelected ? 0 : 3 * zoom);
                stroke(color);

                rect((((this.x * zoom + width * zoom / 2) - 10 * zoom) - this.width * zoom / 2) + xPan, ((this.y * zoom + height * zoom / 2) - 25 * this.size * zoom) + yPan, this.width * zoom, 50 * this.size * zoom, 15)



            }






            strokeWeight(this.isSelected ? 0 : 6 * zoom);
            stroke(backgroundColor);
            fill(this.isSelected ? backgroundColor : color);


            //this.input.position(((this.x) - this.width / 2)+width/2, ((this.y) + 15)+height/2);


            let strike = (this.name[0] == '-' && this.name[this.name.length - 1] == '-');

            textSize(40 * this.size * zoom)

            text(this.name, ((this.x * zoom + width * zoom / 2) - this.width * zoom / 2) + xPan, ((this.y * zoom + height * zoom / 2) + 15 * this.size * zoom) + yPan);

            stroke(color);

            strokeWeight(this.size * zoom * 4);

            if (strike) line(this.x * zoom - this.width * zoom / 2 + xPan + width * zoom / 2, this.y * zoom + height * zoom / 2 + 4 * this.size * zoom + yPan, this.x * zoom + this.width * zoom / 2 + xPan + width * zoom / 2 - 20, this.y * zoom + height * zoom / 2 + 4 * this.size * zoom + yPan);
        }




        if (editingSelf) targetSize = Math.min(this.sizeMultiplier, 3.5);

        this.size = lerp(this.size, targetSize, 0.2);

        return this.isSelected;
    }



    applyForces(node) {


        let cw = ((node.width + this.width) / this.size) / 2 * (this.size / 2) + 200;
        let ch = (node.height + this.height) / 4 + 150;
        let woh = (cw / ch);


        let nxv = -(this.x - node.x);
        let nyv = -(this.y - node.y) * woh;

        nyv += 40 * Math.sign(nyv);

        let l = Math.sqrt(nxv * nxv + nyv * nyv);


        nxv /= l;

        nyv /= l;




        l -= cw;

        l *= node.mode ? 2 : node.size / this.size + node.size;

        //l *= lerp(node.size/this.size,1,0.7);

        l = Math.min(l, 0);

        l *= 2;

        nxv *= l;
        nyv *= l;


        //nxv /= l;
        //nyv /= l;

        //l -= ((this.width+node.width)/2)*2;

        //l = Math.min(l,0);

        //l *= 100*lerp(node.width/this.width,1,0.5);

        //nxv *= l;
        //nyv *= l;
        //
        //nyv /= woh;

        //nxv *= 0.5;
        //nyv *= 0.5;


        this.xVel += nxv * node.repulsionForce;
        this.yVel += nyv * node.repulsionForce;


        let range = lerp(node.size * node.size, node.sizeMultiplier * node.sizeMultiplier, 0.5) * 500;

        if (!node.mode) range *= 0.05;
        nxv = this.x - node.x;
        nyv = this.y - node.y;

        let inRange = (nxv * nxv + nyv * nyv) < range * range;

        nxv /= range;
        nyv /= range;

        nxv *= lerp(1 - Math.abs(nxv), 1, 0.5);
        nyv *= lerp(1 - Math.abs(nyv), 1, 0.5);


        nxv *= range;

        nyv *= range;


        if (inRange) {
            this.xVel -= nxv * node.attractionForce * this.size;
            this.yVel -= nyv * node.attractionForce * this.size;


            if (node.mode) {
                fill(specialColor + "50");

                noStroke();

                let lx = lerp(this.x, node.x, 0.3) * zoom;
                let ly = lerp(this.y, node.y, 0.3) * zoom;
                circle(lx + xPan + width * zoom / 2, ly + yPan + height * zoom / 2, 6 * zoom);

                strokeWeight(5 * zoom);
                stroke(specialColor + "22");



                line(lx + xPan + width * zoom / 2, ly + yPan + height * zoom / 2, node.x * zoom + xPan + width * zoom / 2, node.y * zoom + yPan + height * zoom / 2);
            }
        }


        
    }

    drawRelationship(node) {
        if (this.name == node.name && nodes.indexOf(this) < nodes.indexOf(node)) {
            strokeWeight(5 * zoom);
            stroke((this.mode && node.mode ? specialColor : foregroundColor) + "22");

            line(this.x*zoom + xPan + width * zoom / 2, this.y*zoom + yPan + height * zoom / 2, node.x * zoom + xPan + width * zoom / 2, node.y * zoom + yPan + height * zoom / 2);
        }
    }
}