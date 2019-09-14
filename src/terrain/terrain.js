class Tile 
{
    this.type;
    this.texture;
    constructor(type, tex) 
    {
        this.type = type;
        this.texture = tex;
    }
}

class TerrainGenerator 
{
    constructor(width, height)
    {
        this.w = width;
        this.h = height;
    }

    this.generate = function()
    {
        let arr = [];
        for(let x = 0; x < this.w; x++) 
        {
            for(let y = 0; y < this.h; y++) 
            {
                arr.push(perlin(x, y));
            }
        }

        console.log(arr);
    }    
}


let tg = new TerrainGenerator(100, 100);
tg.generate();