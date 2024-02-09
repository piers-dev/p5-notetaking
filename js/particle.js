
let particles = new Array();

function drawParticles() {
    return;
    let particleDeathQueue = new Array();
    particles.forEach((p) => {
        p.drawSelf();

        if (p.time > p.lifetime) {
            particleDeathQueue.push(particles.indexOf(p));
        }
    });

    particleDeathQueue.forEach((i) => {
        particles.splice(i,1);
    })
}

function createParticleBurst(x,y,speedMin,speedMax,sizeMin,sizeMax,count,lifeMin,lifeMax,accent=false) {
    for (let i = 0; i < count; i++) {
        let angle = Math.random()*3.14159*2;
        let sp = lerp(speedMin,speedMax,Math.random());
        let si = lerp(sizeMin,sizeMax,Math.random());
        
        let xv = Math.cos(angle)*sp;

        let yv = Math.sin(angle)*sp;

        let li = lerp(lifeMin,lifeMax,Math.random());

        particles.push(new Particle(x,y,si,xv,yv,li,accent))
    }
}

class Particle {
    constructor(x,y,radius,xVel,yVel,lifetime,accent) {
        this.x = x;
        this.y = y;
        this.xVel = xVel;
        this.yVel = yVel;
        this.radius = radius;
        this.lifetime = lifetime;
        this.startTime = Date.now();
        this.time = 0;
        this.accent = accent;
    }


    drawSelf() {

        this.time = (Date.now()-this.startTime)/1000;

        this.x += this.xVel;
        this.y += this.yVel;

        fill(this.accent ? specialColor : foregroundColor);

        let r = this.radius*(1-this.time/this.lifetime);

        circle((this.x+width/2)+xPan,(this.y+height/2)+yPan,Math.max(r,0));

        
    }
}