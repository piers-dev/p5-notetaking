let backgroundColor = "#202029";
let foregroundColor = "#e6176a";
let specialColor = "#2bc7ff";



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


        let mouseOver = ((pmx-xPan < this.x - 10 + this.width / 2 && pmx-xPan > this.x - 10 - this.width / 2)
        && (pmy-yPan < this.y + this.height / 2 && pmy-yPan > this.y - this.height / 2));

        this.isHovered = ((mouseOver && !hoverUsed) || this.isSelected) && editing == -1;

        this.attractionForce = this.mode ? 2 : 0.01;

        this.repulsionForce = this.mode ? 2 : 1;


        if (this.isHovered) hoverUsed = true;


        let color = this.mode ? specialColor : foregroundColor;

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
                this.input.style('border-color',color);
                this.input.style('background-color',backgroundColor);
                this.input.style('color',color);
                this.input.style('user-select','text');

                //this.input.style('border-width','6px');
                this.input.attribute('maxlength', 30);
            }
            this.name = this.input.value();

            this.width = textWidth(this.name) + 20;

            this.height = 50*this.size/2;
            mouseOver = ((pmx-xPan < this.x  + this.width/2 && pmx-xPan > this.x - 10 - this.width/2)
                && (pmy-yPan < this.y + this.height/2 && pmy-yPan > this.y - this.height/2));
            
            if (mouseOver) targetSize += 0.5;
            



            
            

            this.input.position(((this.x+width/2)-this.width/2)+xPan-12,((this.y+height/2)-this.height)+yPan-6);

            this.input.size(this.width-12,this.height*2-12);
            this.input.style('font-size',`${40*this.size}px`);
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

        this.x += this.xVel / 30;
        this.y += this.yVel / 30;


        //if (Math.abs(this.xVel) + Math.abs(this.yVel) > 200) {
        //    createParticleBurst(this.x, this.y, 1, 5, 2, 5, 1, 0.2, 1);
        //}
        

        if (this.mode) {
            //createParticleBurst(this.x,this.y,0.5*this.size,2*this.size,1,3,1,1,5,true);
            fill(color+"05");
            strokeWeight(this.isHovered ? 3.5 : 1.5);
            stroke(color);
            circle(this.x+width/2+xPan-10,this.y+height/2+yPan,lerp(this.size*this.size,this.sizeMultiplier*this.sizeMultiplier,0.5)*1000);
        }
        fill(color);

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
            if ((this.isHovered && !rmb && prmb) || this.name == "" || this.name == "New Note") {
                removalQueue.push(nodes.indexOf(this));
                //createParticleBurst(this.x, this.y, 1, 3, 5, 10, 20, 0.1, .5);

            }
            
            if (this.isHovered && !(lmb && !this.isSelected)) {
                targetSize *= this.mode ? 1.05 : 1.1;

                if (this.isSelected) {
                    this.x += dx;
                    this.y += dy;
                    targetSize *= 1.3;
                }
                fill(this.isSelected ? color : backgroundColor);
                stroke(color);
                strokeWeight(this.isSelected ? 0 : 3);
                rect((((this.x+width/2) - 10) - this.width / 2)+xPan, ((this.y+height/2) - 25 * this.size)+yPan, this.width, 50 * this.size, 15)



            }

            
            
            


            strokeWeight(this.isSelected ? 0 : 3 * this.size);
            stroke(backgroundColor);
            fill(this.isSelected ? backgroundColor : color);


            //this.input.position(((this.x) - this.width / 2)+width/2, ((this.y) + 15)+height/2);

            
            let strike = (this.name[0] == '-' && this.name[this.name.length-1] == '-');

            text(this.name, ((this.x+width/2) - this.width / 2)+xPan, ((this.y+height/2) + 15 * this.size)+yPan);

            stroke(color);
            
            if (strike) line(this.x-this.width/2+xPan+width/2,this.y+height/2+4,this.x+this.width/2+xPan+width/2-20,this.y+height/2+4);
        }
        



        if (editingSelf) targetSize = Math.min(this.sizeMultiplier,3.5);

        this.size = lerp(this.size, targetSize, 0.2);

        return this.isSelected;
    }


    applyForces(node) {


        let cw = ((node.width + this.width) / this.size)/2 * (this.size / 2) + 200;
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


        this.xVel += nxv*node.repulsionForce;
        this.yVel += nyv*node.repulsionForce;


        let range = lerp(node.size*node.size,node.sizeMultiplier*node.sizeMultiplier,0.5)*500;

        nxv = this.x - node.x;
        nyv = this.y - node.y;

        let inRange = (nxv*nxv+nyv*nyv) < range*range;

        nxv /= range;
        nyv /= range;

        nxv *= lerp(1-Math.abs(nxv),1,0.5);
        nyv *= lerp(1-Math.abs(nyv),1,0.5);


        nxv *= range;

        nyv *= range;


        if (inRange) {
            this.xVel -= nxv*node.attractionForce*this.size;
            this.yVel -= nyv*node.attractionForce*this.size;


            if (node.mode) {
                fill(specialColor+"50");
                
                noStroke();

                let lx = lerp(this.x,node.x,0.3);
                let ly = lerp(this.y,node.y,0.3);
                circle(lx+xPan+width/2,ly+yPan+height/2,6);

                strokeWeight(5);
                stroke(specialColor+"22");



                line(lx+xPan+width/2,ly+yPan+height/2,node.x+xPan+width/2,node.y+yPan+height/2);
            }
        }

    }
}