let backgroundColor = "#202029";
let foregroundColor = "#e6176a";




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

        this.size = 0.05;

        this.widthMultiplier = 1;
        this.heightMultiplier = 1;

        this.lastClicked = 0;
    }



    drawSelf() {

        let targetSize = 1;

        textSize(40*this.size);

        this.width = textWidth(this.name) + 20;

        


        this.xVel -= (this.x);
        this.yVel -= (this.y);

        this.x = Math.min(Math.max(this.x,-width/2),width/2);
        this.y = Math.min(Math.max(this.y,-height/2),height/2);

        this.xVel = lerp(this.xVel, 0, 0.5);
        this.yVel = lerp(this.yVel, 0, 0.5);

        if (this.isSelected) {
            this.xVel = 0;
            this.yVel = 0;

        }

        this.x += this.xVel / 30;
        this.y += this.yVel / 30;

        let isHovered = ((pmx < this.x-10 + this.width / 2 && pmx > this.x - 10 - this.width / 2)
            && (pmy < this.y + this.height / 2 && pmy > this.y - this.height / 2))




        fill(foregroundColor);


        if (isHovered && !mouseWasPressed && mouseIsPressed && !hoverUsed) {
            this.isSelected = true;
            hoverUsed = true;

            if (Date.now() - this.lastClicked < 500) {
                let newName = prompt("Input text:");
                if (newName) this.name = newName;
                this.isSelected = false;

            }

            this.lastClicked = Date.now();

        }
        if (!mouseIsPressed) {
            this.isSelected = false;
        }




        if (isHovered && !(mouseIsPressed && !this.isSelected)) {
            if (this.isSelected) {
                this.x += dx;
                this.y += dy;
            }
            fill(this.isSelected ? foregroundColor : backgroundColor);
            stroke(foregroundColor);
            strokeWeight(this.isSelected ? 0 : 3);
            targetSize = 1.5;
            rect((this.x - 10) - this.width / 2, this.y - 25*this.size, this.width, 50*this.size, 15)


            fill(this.isSelected ? backgroundColor : foregroundColor);

            hoverUsed = true;
        }
        noStroke();

        text(this.name, (this.x) - this.width / 2, (this.y) + 15);
        
        
        this.size = lerp(this.size,targetSize,0.2);

        return this.isSelected;
    }


    applyForces(node) {


        let cw = (node.width*node.widthMultiplier + this.width*this.widthMultiplier)+150;
        let ch = (node.height*node.size + this.height*this.size)+50;
        let woh = (cw / ch);


        let nxv = -(this.x - node.x);
        let nyv = -(this.y - node.y)*woh;

        let l = Math.sqrt(nxv * nxv + nyv * nyv);


        nxv /= l;

        nyv /= l;
        



        l -=  cw;

        l *= lerp(node.width/this.width,1,0.7);

        l *= (node.size/this.size);

        l = Math.min(l,0);

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