import {Role_Runner} from 'worker.runners'
import {Role_Upgrader, Role_Claimer} from 'worker.claimers'
import {Role_Harveser, Role_LDH} from 'worker.harvesters'
import {Role_Builder, Role_WallBuiler, Role_Fixer} from 'worker.builders'

let spawn = Game.spawns['Spawn1'];
let room = spawn.room
let s0 = Game.getObjectById('5bbcacd69099fc012e6364ae');
let s1 = Game.getObjectById('5bbcacd69099fc012e6364b0');
let container1 = <StructureContainer> Game.getObjectById('5e254ab93e6bf266f30774e3');

function run_roster(roster: Roster, spawner: StructureSpawn){
    Memory.activeCreeps = new Set();
    for(let forceName in roster){
        let force = roster[forceName];
        for(let i = 0; i < force.qnt; i++){
            let creepName = forceName+'-'+i;
            Memory.activeCreeps.add(creepName)
            //spawnCreep
            if(!Game.creeps[creepName]){
                console.log('Need to spawn: '+creepName);

                let body: BodyPartConstant[] = [];
                for(let part in force.body){
                    for(let i = force.body[part]; i > 0; i--){
                        switch(part){
                            case 'move':
                                body.push(MOVE);
                                break;
                            case 'work':
                                body.push(WORK);
                                break;
                            case 'carry':
                                body.push(CARRY);
                                break;
                        }
                    }
                }

                spawner.spawnCreep(body, creepName);
            }
            //assign role
            let creep = Game.creeps[creepName];
            switch(force.role){
                case 'Upgrader':{new Role_Upgrader(creep).run();break;}
                case 'Builder':{new Role_Builder(creep).run();break;}
                case 'WallBuilder':{new Role_WallBuiler(creep).run();break;}
                case 'Fixer':{new Role_Fixer(creep).run();break;}
                case 'Harvester':{new Role_Harveser(creep, force.args).run();break;}
                case 'LDH':{new Role_LDH(creep, force.args).run();break;}
                case 'Runner':{new Role_Runner(creep).run();break;}
                case 'Claimer':{new Role_Claimer(creep, force.args).run();break;}
                case 'None':break;
                default:{console.log('ERR: BAD ROSTER: '+force.role+' : '+creepName);break;}
            }
        }
    }
    if(spawner.spawning){
        console.log("SPAWNING: "+spawner.spawning.name);
    }
}

function recycle(spawner: StructureSpawn){
    for(let creepName in Game.creeps){
        if(!Memory.activeCreeps.has(creepName)){
            console.log("Found Zombi: "+creepName);
            let creep = Game.creeps[creepName]
            creep.moveTo(spawner);
            spawner.recycleCreep(creep);
        }
    }
}

export {run_roster, recycle}
