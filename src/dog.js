class Entity {
    health = 100;

    get alive() {
        return this.health > 0;
    }
}

class Dog extends Entity {
    name = '';

    constructor(name) {
        super();
        this.name = name;
    }

    woof() {
        console.log(`Woof! I\'m ${this.name}.`);
    }

    kill() {
        this.health = 0;
    }
}

export {Dog};
