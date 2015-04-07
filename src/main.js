import {Dog} from './dog';

let jamie = new Dog('Jamie');
jamie.woof();

if (jamie.alive) {
    jamie.kill();
}

console.log('Is Jamie alive? ... ' + (jamie.alive ? 'YES!' : 'No ... ;('));
