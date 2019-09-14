let maxVal = 0;
class Tile 
{
    constructor(val) 
    {
        if(val > maxVal) {
            maxVal = val;
        }
        this.types = [
            {"type":"water", "height":0.36, "color":color(127,127,255)},
            {"type":"sand", "height":0.4, "color":color(218,165,32)},
            {"type":"grass", "height":0.6, "color":color(63, 125, 32)},
            {"type":"ground", "height":0.70, "color":color(117, 67, 32)},
            {"type":"mountain", "height":1, "color":color(84, 87, 82)},
        ];
    
        let i = 0;
        for(let t of this.types) 
        {
            if(val <= t.height)
            {
                this.type = t.type;
                this.color = t.color;                
                return this;
            }
        }
        this.type = this.types[0].type;
        this.color = this.types[0].color;   
    }

    draw(x, y, w, h, west, north, east, south)
    {
        console.log("full lerp")
        noStroke();
        let xCol = lerpColor(west.color, east.color, 0.5);
        let yCol = lerpColor(south.color, north.color, 0.5);
        let avgCol = lerpColor(xCol, yCol, 0.5);
        fill(lerpColor(this.color, avgCol, 0.36));
        rect(x, y, w, h);
    }

    draw(x, y, w, h, a, b)
    {
        console.log("half lerp")
        noStroke();
        let avgCol = lerpColor(a.color, b.color, 0.66);
        fill(lerpColor(this.color, avgCol, 0.66));
        rect(x, y, w, h);
    }
    draw(x, y, w, h)
    {
        noStroke();
        fill(this.color);
        rect(x, y, w, h);
    }

    toString() {
        return this.type;
    }
}
let resolution = Math.PI * 4;

class TerrainGenerator 
{
    constructor(width, height)
    {
        this.w = width;
        this.h = height;
    }

    generate()
    {
        let arr = [];
        
        for(let x = 0; x < this.w; x++) 
        {
            arr[x] = []
            for(let y = 0; y < this.h; y++) 
            {
                arr[x][y] = 0;
            }
        }
        
        for(let x = 0; x < this.w; x++) 
        {
            for(let y = 0; y < this.h; y++) 
            {
                arr[x][y] = new Tile(noise(x/resolution, y/resolution));
            }
        }
        return arr;
    }    
}

let terrain = [];
let size = 8;
function setup() 
{
    colorMode(RGB);
    createCanvas(600, 600);
    let tg = new TerrainGenerator(150, 150);
    terrain = tg.generate();
}

function draw() 
{
    frameRate(30);
    clear();
    for(let x = 0; x<terrain.length; x++) 
    {
        for(let y = 0; y<terrain[0].length; y++) 
        {
            let notLast = (x < terrain.length - 1 && y < terrain[0].length - 1);
            let notFirst = (x > 0 && y > 0);
            if(notFirst & notLast) 
            {
                console.log("full lerp")
                terrain[x][y].draw(camX + x * size, camY + y * size, size, size, terrain[x-1][y], terrain[x][y-1], terrain[x+1][y], terrain[x][y+1]);
            }
            else if(!notFirst && notLast) 
            {
                terrain[x][y].draw(camX + x * size, camY + y * size, size, size, terrain[x+1][y], terrain[x][y+1]);
            }
            else if(!notLast && notFirst)
            {
                terrain[x][y].draw(camX + x * size, camY + y * size, size, size, terrain[x-1][y], terrain[x][y-1]);
            }else {
                terrain[x][y].draw(camX + x * size, camY + y * size, size, size);
            }
        }
    }
    keyCheck();
}

let camX = 0;
let camY = 0;

function keyCheck() {
    

    if(keyIsDown(65)){
        camX += size;
    }
    if(keyIsDown(68)){
        camX -= size;
    }

    if(keyIsDown(87)){
        camY += size;
    }
    if(keyIsDown(83)){
        camY -= size;
    }

}