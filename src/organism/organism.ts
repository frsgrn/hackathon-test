class Organism {
    genes: Number[];
    position: {
        x: 0,
        y: 0
    }
    constructor() {
        this.genes = [1,1,1,1]
    }
    // DIR: {x: dir_x, y: dir_y}
    move(dir) {
        this.position.x += dir.x;
        this.position.y += dir.y;
    }
}