import {BaseWorker} from 'baseWorker'

// enum E_delivery_state{LOAD, UNLOAD}
// enum E_spawern_state{GREE, RED}

class Role_Runner extends BaseWorker{
    spawn_bins: StructureSpawn[] | StructureExtension[];
    towers: StructureTower[];
    roleMem;


    //Role vars
    // delivery_source;
    // delivery_dest;
    // logistic_path;
    // delivery_state: E_delivery_state;
    // spawner_state: E_spawern_state;

    constructor(creep: Creep, depo?: Flag){
        super(creep, depo);

        //load
        //this.roleMem = this.memory.roleMem;
        //if(this.roleMem == undefined){
        //    //FIXME
        //}


        // if(this.logistic_source == undefined){}
        // if(this.logistic_dest == undefined){}
        // if(this.logistic_path == undefined){}
        // if(this.delivery_state == undefined){
        //     this.delivery_state=E_delivery_state.LOAD
        // }
        // if(this.spawner_state == undefined){
        // }
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
        // this.save();
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

            //Look for container
            // if(!dest){
            //     dest = creep.pos.findClosestByPath(FIND_STRUCTURES,{filter:(s)=>
            //         s.structureType == STRUCTURE_CONTAINER &&
            //         s.store[RESOURCE_ENERGY] < 2000});
            // }

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

    // save(){this.memory.roleMem = this.roleMem;}
}

export {Role_Runner}
