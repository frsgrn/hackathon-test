let colorSmoothing;

class Tile 
{
    constructor(val) 
    {
        this.types = [
            {"type":"water", "height":0.36, "color":color(127,127,255)},
            {"type":"sand", "height":0.4, "color":color(218,165,32)},
            {"type":"grass", "height":0.6, "color":color(63, 125, 32)},
            {"type":"ground", "height":0.65, "color":color(47, 74, 44)},
            {"type":"mountain", "height":0.70, "color":color(84, 87, 82)},
            {"type":"snow", "height":1, "color":color(220, 220, 220)},
        ];
        this.newColor;
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
        noStroke();
        if(this.newColor)
        {
            fill(this.newColor);
        }
        else if(west, north, east, south) 
        {
            let xCol = lerpColor(west.color, east.color, colorSmoothing);
            let yCol = lerpColor(south.color, north.color, colorSmoothing);
            let avgCol = lerpColor(xCol, yCol, colorSmoothing);
            this.newColor = (lerpColor(this.color, avgCol, colorSmoothing));
            fill(this.newColor);
        }
        else if(west, north) 
        {
            let avgCol = lerpColor(west.color, north.color, colorSmoothing);
            this.newColor = (lerpColor(this.color, avgCol, colorSmoothing));
            fill(this.newColor);
        }
        else {
            fill(this.color);
        }
        rect(x, y, w, h);
    }

    toString() {
        return this.type;
    }
}
let resolution;
let seed;
let falloff;
let octaves;

class TerrainGenerator 
{
    constructor(width, height)
    {
        this.w = width;
        this.h = height;
        noiseSeed(seed);
        noiseDetail(octaves, falloff);
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

let chunkSize;
let size;

let camX;
let camY;

// SLIDERS
let chunkSizeS;
let sizeS;
let resoS;
let seedS;
let smoothS;
let widthS;
let heightS;
let octavesS;
let falloffS;


function setup() 
{
    let container = createDiv();
    let leftCol = createDiv();
    let rightCol = createDiv();
    
    seedS = createSlider(0, 255, 101);
    resoS = createSlider(0, 25, 4);
    sizeS = createSlider(0, 25, 8);
    smoothS = createSlider(0.0, 50.0, 25);
    octavesS = createSlider(0.0, 25.0, 12);
    falloffS = createSlider(0.0, 50.0, 35);
    chunkSizeS = createInput(100, "number");
    
    input();

    camX = -(chunkSize * size)/2;
    camY = -(chunkSize * size)/2;

    let tg = new TerrainGenerator(chunkSize, chunkSize);
    terrain = tg.generate();
    let genB = createButton("Regenerate");
    genB.mousePressed(()=>{
        tg = new TerrainGenerator(chunkSize, chunkSize);
        terrain = tg.generate();
        console.log("abc")
    });
    let canv = createCanvas(600, 600);

    leftCol.child(canv);

    rightCol.child(createP("Chunk Size:"));
    rightCol.child(chunkSizeS);
    rightCol.child(createP("Seed:"));
    rightCol.child(seedS);
    rightCol.child(createP("Resolution:"));
    rightCol.child(resoS);
    rightCol.child(createP("Color Smoothing:"));
    rightCol.child(smoothS);
    rightCol.child(createP("Octaves:"));
    rightCol.child(octavesS);
    rightCol.child(createP("Falloff:"));
    rightCol.child(falloffS);
    rightCol.child(createP("<br>"));
    rightCol.child(genB);
    rightCol.child(createP("<br>"));
    rightCol.child(createP("Zoom:"));
    rightCol.child(sizeS);
    rightCol.addClass("list");
    container.child(leftCol);
    container.child(rightCol);

}

function draw() 
{
    input();
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



function input() {
    seed = seedS.value();
    resolution = Math.PI * resoS.value();
    size = sizeS.value();
    colorSmoothing = smoothS.value() / 100;
    octaves = octavesS.value();
    falloff = falloffS.value() / 100;
    chunkSize = chunkSizeS.value();
    
}

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