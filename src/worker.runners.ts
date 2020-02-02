import {BaseWorker} from 'baseWorker'

class Role_Runner extends BaseWorker{
    blackList: string[];

    constructor(creep: Creep, depo?: Flag){
        super(creep, depo);
        if(this.memory.blackList){
            this.blackList = this.memory.blackList;
        }
        else{
            this.blackList = [];
        }
    }

    run(){
        if(!this.creep){return}
        this.fullFlip();
        if(this.memory.FULL){
            //find a destination
            this.deilvery_unload();
        }
        else{
            //Find a energy source
            this.delivery_load();
        }
    }

    check_spawn_bins():Boolean{
        return this.room.energyAvailable < this.room.energyCapacityAvailable;
    }

    delivery_load(){
        if(this.check_spawn_bins()){
            this.resupply();
        }
        else{
            //remove storage from list
            let targs = this.resupply_think();
            _.remove(targs,function(s){
                if(s instanceof Structure){
                    return s.structureType==STRUCTURE_STORAGE
                }
                else{
                    return false;
                }
            });
            _.remove(targs,this.blackList);
            this.resupply_act(this.pos.findClosestByPath(targs));
        }
    }

    deilvery_unload(){
        let dest;
        if(this.check_spawn_bins()){
            //Look for spawner
            dest = this.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (s) =>
                (s.structureType == STRUCTURE_SPAWN || 
                s.structureType ==STRUCTURE_EXTENSION) &&
                s.store.getFreeCapacity(RESOURCE_ENERGY) != 0
            });
        }
        else{
            //Look for turrets
            if(!dest){
                dest = this.pos.findClosestByPath(FIND_STRUCTURES, {filter:function(s)
                    {return s.structureType == STRUCTURE_TOWER &&
                    s.store.getFreeCapacity(RESOURCE_ENERGY) !=0}});
            }

            //Look for container
            if(!dest){
                dest = this.room.storage;
            }

            //if still no quit
            if(!dest){
                this.goToDepo();
                return;
            }
        }
        //Dump
        if(this.creep.transfer(dest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
            this.moveTo(dest);
        }
    }
}

class Role_Logistic extends BaseWorker{
    src: Structure;
    dest: Structure

    constructor(creep: Creep, depo?: Flag){
        super(creep);
        this.src = Game.getObjectById(this.memory.srcID);
        this.dest = Game.getObjectById(this.memory.destID);
    }

    run(){
        if(!this.creep){return}
        if(!this.src){return}
        if(!this.dest){return}
    }
}

export {Role_Runner}
