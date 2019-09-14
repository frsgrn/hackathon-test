/*

GENE

[
    Attractivness,
    Weight,
    Sight
]

*/

class Organism {
    genes;
    position = {
        x: 0,
        y: 0
    }
    constructor() {
        this.populateGene()
    }

    populateGene() {
        this.genes = [Math.random(), Math.random(), Math.random()]
    }

    // DIR: {x: dir_x, y: dir_y}
    move(dir) {
        this.position.x += dir.x;
        this.position.y += dir.y;
    }
}