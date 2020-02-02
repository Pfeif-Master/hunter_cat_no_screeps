// import {expand_job, spawn} from 'spawner'
import {BaseWorker, IBaseWorker} from 'baseWorker'
import {Role_Harvester} from 'worker.harvesters'
import {Role_Runner} from 'worker.runners'
import {Role_Upgrader,Role_Scout, Role_Claimer} from 'worker.claimers'
import {Role_Builder, Role_Fixer, Role_WallBuilder} from "worker.builders"

class RoomMind {
    room: Room;
    mem: RoomMemory;

    depo: Flag;
    spawn: StructureSpawn;
    // resupplyPoints;

    constructor(roomName: string, depo?:Flag){
        this.room = Game.rooms[roomName];
        this.mem = this.room.memory;
        this.spawn = this.room.find(FIND_MY_SPAWNS)[0];
        this.depo = depo;
    }

    tick(){
        this.run_towers();
        if(!this.mem.jobs){
            return;
        }
        if(!this.spawn){return}
        //in reverse spawn order
        this.run_scouts();
        this.run_away_builders();
        this.run_builders();
        this.run_wallBuilders();
        this.run_fixers();
        this.run_upgraders();
        this.run_harvesters();
        this.run_runners();
        this.run_claimers();
    }

    run_harvesters(){
        if(!this.mem.jobs.Harvesters){
            return;
        }
        let i = 0;
        for(let asrcID in this.mem.jobs.Harvesters){
            // this.log(asrcID);
            let job = this.mem.jobs.Harvesters[asrcID];
            let creep = Game.creeps[job.creepName];
            // console.log(creep);

            if(creep instanceof Creep){
                //run creep
                new Role_Harvester(creep, this.depo).run();
            }
            else{
                //spawn creep
                job.creepName = 'HRV_'+i+'_'+this.room.name;
                this.spawnCreep(job.body, job.creepName, {srcID: asrcID});
            }
            //add to active list
            i++
            Memory.activeCreeps.add(job.creepName);
        }
    }

    run_runners(){
        if(!this.mem.jobs.Runners){
            return;
        }
        this.run_role(this.mem.jobs.Runners.job, 'RUN', Role_Runner);
    }

    run_upgraders(){
        if(!this.mem.jobs.Upgraders){
            return;
        }
        this.run_role(this.mem.jobs.Upgraders, 'UGD', Role_Upgrader);
    }

    run_away_builders(){
        if(!this.mem.jobs.AwayBuilders){
            return;
        }
        this.run_role(this.mem.jobs.AwayBuilders.job, 'ABD', Role_Builder,
            {roomName: this.mem.jobs.AwayBuilders.roomName});
    }

    run_builders(){
        if(!this.mem.jobs.Builders){
            return;
        }
        this.run_role(this.mem.jobs.Builders, 'BLD', Role_Builder);
    }

    run_wallBuilders(){
        if(!this.mem.jobs.WallBuilders){
            return;
        }
        this.run_role(this.mem.jobs.WallBuilders, 'WLL', Role_WallBuilder);
    }

    run_fixers(){
        if(!this.mem.jobs.Fixers){
            return;
        }
        this.run_role(this.mem.jobs.Fixers, 'FIX', Role_Fixer);
    }

    run_scouts(){
        if(!this.mem.Scouts){
            return;
        }
        for(let rn of this.mem.Scouts){
            let creepName = this.room.name+'**'+rn;
            let creep = Game.creeps[creepName];

            if(creep instanceof Creep){
                //Run Creep
                new Role_Scout(creep).run();
            }
            else{
                //spawn creep
                this.spawnCreep({move:1}, creepName, {roomName: rn});
            }
            Memory.activeCreeps.add(creepName);
        }
    }

    run_claimers(){
        if(!this.mem.Claim){
            return;
        }
        let creepName = this.room.name+'$$'+this.mem.Claim;
        let creep = Game.creeps[creepName];
        if(creep instanceof Creep){
            new Role_Claimer(creep).run();
        }
        else{
            //spawn creep
            this.spawnCreep({claim:1, move:1}, creepName, {roomName: this.mem.Claim});
        }
        Memory.activeCreeps.add(creepName);
    }

    run_towers(){
        for(let tower of this.room.find(FIND_MY_STRUCTURES,{filter: (s)=>
            s.structureType==STRUCTURE_TOWER})){
            if(tower instanceof StructureTower){
                tower.attack(tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS));
            }
        }
    }


    //===============================================================

    expand_bodyManifest(bm:BodyManifest):BodyPartConstant[]{
        let body: BodyPartConstant[] = [];
        for(let part in bm){
            for(let i = bm[part]; i > 0; i--){
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
                    case 'claim':
                        body.push(CLAIM);
                        break;
                }
            }
        }
        return body;
    }

    spawnCreep(body:BodyManifest, name: string, mem:any){
        if(this.spawn.spawning){
            //skip if spawn busy
            this.log('Need to spawn> ' + name);
        }
        else{
            this.log('Spawning> '+name);
            let err = this.spawn.spawnCreep(this.expand_bodyManifest(body), name,
                {memory: mem});
            if(err != OK){
                this.log("SPAWN ERROR: "+err+": "+this.expand_bodyManifest(body));
            }
        }

    }

    run_role(job:Job, prefex: string, role: IBaseWorker, mem?:any){
        for(let i = 0 ; i < job.qnt; i++){
            let creepName = prefex+'_'+i+'_'+this.room.name;
            let creep = Game.creeps[creepName];

            if(creep instanceof Creep){
                //run creep
                new role(creep, this.depo).run();
            }
            else{
                //spawn creep
                this.spawnCreep(job.body, creepName, mem);
            }
            Memory.activeCreeps.add(creepName);
        }
    }

    log(msg:string){
        console.log(this.room.name+': '+msg);
    }
}

export {RoomMind}
