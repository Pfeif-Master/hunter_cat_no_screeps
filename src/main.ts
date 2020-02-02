import { ErrorMapper } from "utils/ErrorMapper";
import {run_roster, recycle} from "roster"

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
    console.log(`Current game tick is ${Game.time}`);

    // Automatically delete memory of missing creeps
    for (const name in Memory.creeps) {
        if (!(name in Game.creeps)) {
            delete Memory.creeps[name];
        }
    }

    let spawn: StructureSpawn = Game.getObjectById('5e24c58dbe0a852ccdecda34');
    let room = spawn.room
    let s0 = room.find(FIND_SOURCES)[0];
    let s1 = room.find(FIND_SOURCES)[1];
    // let tower:StructureTower = Game.getObjectById('5e27c9366e043f4b459bde1e');
    let roster = Memory.rooms[room.name].roster;

    run_roster(roster, spawn);
    recycle(spawn);

    for(let tower of room.find(FIND_MY_STRUCTURES,{filter: (s)=>
        s.structureType==STRUCTURE_TOWER})){
        if(tower instanceof StructureTower){
            tower.attack(tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS));
        }
    }
});
