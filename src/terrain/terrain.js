class Tile 
{
    constructor(val) 
    {
        this.types = [
            {"water":0},
            {"sand": 0.2},
            {"ground": 0.4},
            {"grass": 0.6},
            {"mountain": 0.8}
        ];
    
        let i = 0;
        for(let t of this.types) {
            if(val <= Object.values(t)[0]){
                this.type = Object.keys(t)[0];
            }
            i++;
        }
    }

    toString() {
        return this.type;
    }
}

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
            for(let y = 0; y < this.h; y++) 
            {
                arr.push(new Tile(x, y));
            }
        }
        console.log(arr);
    }    
}

function setup() 
{
    let tg = new TerrainGenerator(100, 100);
    tg.generate();
}