import {BaseWorker} from 'baseWorker'

class Role_Harveser extends BaseWorker{
    src: Source;
    constructor(creep:Creep, srcID: string){
        super(creep);
        this.src = Game.getObjectById(srcID);
    }

    run(){
        if(!this.creep){return}
        //Try to find container
        if(!this.memory.on_container){
            let container;
            container = this.src.pos.findInRange(FIND_STRUCTURES,1,{filter:(s:Structure)=>
                s.structureType == STRUCTURE_CONTAINER})[0];
            if(!container){this.dig();}
            if(container){this.creep.moveTo(container);}
            if(this.creep.pos.isEqualTo(container.pos)){
                this.memory.on_container = true;
            }
        }
        else{this.dig();}
    }

    dig(){
        if(this.creep.harvest(this.src) == ERR_NOT_IN_RANGE){
            this.moveTo(this.src);
        }
    }
}

class Role_LDH extends BaseWorker{
    dest: Structure;
    workRoom: string;
    srcID: string;

    constructor(creep:Creep, args:{destID, room, srcID}){
        super(creep);
        this.dest = Game.getObjectById(args.destID);
        this.workRoom = args.room;
        this.srcID = args.srcID;
    }

    run(){
        if(!this.creep){return}
        //lay the road
        // if(this.pos.lookFor(LOOK_CONSTRUCTION_SITES).length == 0){
        //     this.pos.createConstructionSite(STRUCTURE_ROAD);
        // }
        this.fullFlip();
        if(this.memory.FULL){
            //go to drop off
            let err;
            err = this.creep.transfer(this.dest, RESOURCE_ENERGY);
            if( err == ERR_NOT_IN_RANGE){
                this.moveTo(this.dest, {visualizePathStyle:{stroke: '#0F0'}});
            }
            else if(err == 0){
                if(this.memory.tripScore){
                    this.memory.tripScore += this.creep.store.getCapacity();
                }
                else{
                    this.memory.tripScore = this.creep.store.getCapacity();
                }
            }
        }
        else{
            //dig
            let src;
            src = Game.getObjectById(this.srcID);
            if(!src){
                //Travel
                this.changeRooms(this.workRoom);
            }
            if(this.creep.harvest(src) == ERR_NOT_IN_RANGE){
                this.creep.moveTo(src, {visualizePathStyle:{stroke: '#f00'}});
            }
        }
    }

}

export {
    Role_Harveser,
    Role_LDH
}
