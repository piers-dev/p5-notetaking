let backgroundColor = "#202029";
let foregroundColor = "#e6176a";


function checkBounds(x,y,lowx,highx,lowy,highy) {
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

    }

    processKeyCode(keyCode) {

    }

    processMouse(delta) {
        if (this.isHovered) {
            this.sizeMultiplier -= (delta * this.sizeMultiplier) / 1000;
            this.sizeMultiplier = Math.max(this.sizeMultiplier, 0.5);
            this.sizeMultiplier = Math.min(this.sizeMultiplier, 5);
        }
    }




    drawSelf() {
        let editingSelf = editing == nodes.indexOf(this);

        let editingOther = !editingSelf && (editing != -1)


        let mouseOver = ((pmx < this.x - 10 + this.width / 2 && pmx > this.x - 10 - this.width / 2)
        && (pmy < this.y + this.height / 2 && pmy > this.y - this.height / 2));

        this.isHovered = ((mouseOver && !hoverUsed) || this.isSelected) && editing == -1;


        if (this.isHovered) hoverUsed = true;




        let targetSize = this.sizeMultiplier;



        textSize(40 * this.size);

        this.width = textWidth(this.name) + 20;
        this.height = 50 * this.sizeMultiplier;


        if (editingSelf) {
            if (this.input == null) {
                this.input = createInput(this.name);
                this.input.class('ui')
                //this.input.style('text-align','center');
                //this.input.style('font-family','Raleway');
                //this.input.style('stroke','none');
                //this.input.style('outline','none');
                //this.input.style('border-radius','15px');
                //this.input.style('border-style','solid');
                this.input.style('border-color',foregroundColor);
                this.input.style('background-color',backgroundColor);
                this.input.style('color',foregroundColor);
                //this.input.style('border-width','6px');
                this.input.elt.setSelectionRange(this.name.length-1,this.name.length-1);
                this.input.attribute('maxlength', 20);
            }

            mouseOver = ((pmx < this.x - 10 + this.width && pmx > this.x - 10 - this.width)
                && (pmy < this.y + this.height && pmy > this.y - this.height));
            
            if (mouseOver) targetSize += 0.5;
            
            this.name = this.input.value();



            
            this.width = textWidth(this.name) + 20;

            this.height = 50;

            this.input.position((this.x+width/2)-this.width/2,(this.y+height/2)-this.height);

            this.input.size(this.width,this.height*2);
            this.input.style('font-size',`${40*this.size}px`);
            this.isSelected = mouseOver;


        }
        else if (this.input != null) {
            this.input.remove();
            this.input = null;
        }

        this.xVel -= (this.x) * this.sizeMultiplier;
        this.yVel -= (this.y) * this.sizeMultiplier;

        //this.x = Math.min(Math.max(this.x,-width/2),width/2);
        //this.y = Math.min(Math.max(this.y,-height/2),height/2);

        this.xVel = lerp(this.xVel, 0, 0.65);
        this.yVel = lerp(this.yVel, 0, 0.65);

        if (this.isSelected || editingSelf) {
            this.xVel = 0;
            this.yVel = 0;

        }

        this.x += this.xVel / 30;
        this.y += this.yVel / 30;


        if (Math.abs(this.xVel) + Math.abs(this.yVel) > 200) {
            createParticleBurst(this.x, this.y, 1, 5, 2, 5, 1, 0.2, 1);
        }



        fill(foregroundColor);

        if (!editingSelf) {

            if (Date.now() - this.lastClicked < 200 && plmb && !lmb) {
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


            if ((this.isHovered && rmb && !prmb) || this.name == "") {
                removalQueue.push(nodes.indexOf(this));
                createParticleBurst(this.x, this.y, 1, 3, 5, 10, 20, 0.1, .5);

            }


            if (this.isHovered && !(lmb && !this.isSelected)) {
                targetSize += 0.5;

                if (this.isSelected) {
                    this.x += dx;
                    this.y += dy;
                    targetSize += 1.5;
                }
                fill(this.isSelected ? foregroundColor : backgroundColor);
                stroke(foregroundColor);
                strokeWeight(this.isSelected ? 0 : 3);
                rect((this.x - 10) - this.width / 2, this.y - 25 * this.size, this.width, 50 * this.size, 15)


                fill(this.isSelected ? backgroundColor : foregroundColor);

            }
            noStroke();

            //this.input.position(((this.x) - this.width / 2)+width/2, ((this.y) + 15)+height/2);

            text(this.name, (this.x) - this.width / 2, (this.y) + 15 * this.size);
        }
        



        if (editingSelf) targetSize = 2;

        this.size = lerp(this.size, targetSize, 0.2);

        return this.isSelected;
    }


    applyForces(node) {


        let cw = ((node.width + this.width) / this.size) * (this.size / 2) + 200;
        let ch = (node.height + this.height) / 2 + 150;
        let woh = (cw / ch);


        let nxv = -(this.x - node.x);
        let nyv = -(this.y - node.y) * woh;

        nyv += 40 * Math.sign(nyv);

        let l = Math.sqrt(nxv * nxv + nyv * nyv);


        nxv /= l;

        nyv /= l;




        l -= cw;

        l *= node.size / this.size + node.size;

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


        this.xVel += nxv;
        this.yVel += nyv;

    }
}