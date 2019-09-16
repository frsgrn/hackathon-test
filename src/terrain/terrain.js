let colorSmoothing;

class Tile
{
    types = [
        {"type":"water", "height":0.36, "color":color(127,127,255)},
        {"type":"sand", "height":0.4, "color":color(218,165,32)},
        {"type":"grass", "height":0.6, "color":color(63, 125, 32)},
        {"type":"ground", "height":0.65, "color":color(47, 74, 44)},
        {"type":"mountain", "height":0.70, "color":color(84, 87, 82)},
        {"type":"snow", "height":1, "color":color(220, 220, 220)},
    ];

    constructor(val)
    {
        
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
    constructor(width, height, xcoord, ycoord)
    {
        this.w = width;
        this.h = height;
        noiseSeed(seed);
        noiseDetail(octaves, falloff);
        this.worldLocationX = (xcoord * this.w);
        this.worldLocationY = (ycoord * this.h);
    }

    draw(xoff, yoff)
    {
      for(let x = 0; x < this.w; x++)
      {
          for(let y = 0; y<this.h; y++)
          {
            let notLast = (x < this.tiles.length - 1 && y < this.tiles[0].length - 1);
            let notFirst = (x > 0 && y > 0);
            let xpos = (x + xoff + this.worldLocationX) * size;
            let ypos = (y + yoff + this.worldLocationY) * size;

              if(notFirst & notLast)
              {
                  this.tiles[x][y].draw(xpos, ypos, size, size, this.tiles[x-1][y], this.tiles[x][y-1], this.tiles[x+1][y], this.tiles[x][y+1]);
              }
              else if(!notFirst && notLast)
              {
                  this.tiles[x][y].draw(xpos, ypos, size, size, this.tiles[x+1][y], this.tiles[x][y+1]);
              }
              else if(!notLast && notFirst)
              {
                  this.tiles[x][y].draw(xpos, ypos, size, size, this.tiles[x-1][y], this.tiles[x][y-1]);
              }else {
                  this.tiles[x][y].draw(xpos, ypos, size, size);
              }
          }
      }
    }

    outline(xoff, yoff)
    {   
        noFill();
        stroke(0);
        rect((this.worldLocationX + xoff) * size, (this.worldLocationY + yoff) * size, this.w * size, this.h * size);
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
                arr[x][y] = new Tile(noise((x+this.worldLocationX)/resolution, (y+this.worldLocationY)/resolution));
            }
        }
        this.tiles = arr;
    }

}

let chunks = [];


let chunkPos;

let chunkSize;
let size = 4;

let camX = 0;
let camY = 0;

let range = 0;

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

let worldSize = 11;
let grid;

function setup()
{
    let container = createDiv();
    let leftCol = createDiv();
    let rightCol = createDiv();
    chunkPos = createVector(floor(worldSize/2), floor(worldSize/2));
    
    seedS = createSlider(0, 255, 101);
    resoS = createSlider(0, 25, 4);
    // sizeS = createSlider(0, 25, 8);
    smoothS = createSlider(0.0, 50.0, 25);
    octavesS = createSlider(0.0, 25.0, 12);
    falloffS = createSlider(0.0, 50.0, 35);
    chunkSizeS = createInput(8, "number");
    input();
    grid = floor(width/chunkSize);

    // camX = -(chunkSize * size)/2;
    // camY = -(chunkSize * size)/2;

    let genB = createButton("Regenerate");

    let regen = function()
    {
        chunks = [];
        for(let a = 0; a< worldSize; a++)
        {
            chunks[a] = [worldSize];
        }

        for(let x = 0; x < worldSize; x++)
        {
            for(let y = 0; y < worldSize; y++)
            {
                let chunk = new TerrainGenerator(chunkSize, chunkSize, chunkPos.x + x, chunkPos.y + y);
                chunk.generate();
                chunks[x][y] = chunk;
            }
        }

        updateIfLayoutChanged();
    };

    genB.mousePressed(()=>{ regen(); });
    regen();

    let canv = createCanvas(512, 512);
    //size = width/chunkSize;

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
    // rightCol.child(createP("Zoom:"));
    // rightCol.child(sizeS);
    rightCol.addClass("list");
    container.child(leftCol);
    container.child(rightCol);

}

function draw()
{
    input();
    frameRate(30);
    clear();
    renderChunks();
    keyCheck();
}

let scrollX = 0;
let scrollY = 0;

function renderChunks() 
{
    let center = floor(worldSize/2);
    for(let x = 0; x<worldSize; x++)
    {
        for(let y = 0; y<worldSize; y++)
        {
            if(abs(x - center) <= range && abs(y - center) <= range || range == 0) 
            {
                chunks[x][y].draw(0 + scrollX, 0 + scrollY);
            }else 
            {
                chunks[x][y].outline(0 + scrollX, 0 + scrollY);
            }
        }
    }
}


function input() {
    seed = seedS.value();
    resolution = Math.PI * resoS.value();
    //size = sizeS.value();
    colorSmoothing = smoothS.value() / 100;
    octaves = octavesS.value();
    falloff = falloffS.value() / 100;
    chunkSize = parseFloat(chunkSizeS.value());
}

function keyCheck() 
{
    if(keyIsDown(65))
    {
        camX ++;
    }
    else if(keyIsDown(68))
    {
        camX --;
    }

    if(keyIsDown(87))
    {
        camY ++;
    }
    else if(keyIsDown(83))
    {
        camY --;
    }

    chunkPos.x = -floor((camX * size / chunkSize));
    chunkPos.y = -floor((camY * size / chunkSize));
    updateIfLayoutChanged();

}

let lastPos;

function updateIfLayoutChanged() 
{
    if(!chunkPos.equals(lastPos)) 
    {
        layout();
    }

    lastPos = chunkPos.copy();
}

function layout()
{
    // chunks = [];
    // for(let a = 0; a< worldSize; a++)
    // {
    //     chunks[a] = [worldSize];
    // }

    for(let x = 0; x < worldSize; x++)
    {
        for(let y = 0; y < worldSize; y++)
        {

            let chunk = new TerrainGenerator(chunkSize, chunkSize, chunkPos.x + x, chunkPos.y + y);
            chunk.generate();
            chunks[x][y] = chunk;
        }
    }

    scrollX = -chunkPos.x * (chunkSize);
    scrollY = -chunkPos.y * (chunkSize);
}