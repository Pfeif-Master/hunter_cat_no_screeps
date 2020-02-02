import { ErrorMapper } from "utils/ErrorMapper";
// import {run_roster, recycle} from "roster"
import {RoomMind} from 'RoomMind'

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
    Memory.activeCreeps = new Set();

    new RoomMind('W1S33', Game.flags['Depo']).tick();
    new RoomMind('W2S33', Game.flags['Depo2']).tick();

    for(let creepName in Game.creeps){
        if(!Memory.activeCreeps.has(creepName)){
            let spawner = Game.creeps[creepName].pos.findClosestByPath(FIND_MY_SPAWNS);
            if(!spawner){
                console.log("Can't kill zombi: "+creepName);
                continue;
            }
            console.log("Found Zombi: "+creepName);
            let creep = Game.creeps[creepName]
            creep.moveTo(spawner);
            if(!spawner.spawning){
                spawner.recycleCreep(creep);
            }
        }
    }

});
