import {BaseWorker} from 'baseWorker'

class Role_Fixer extends BaseWorker{
    constructor(creep:Creep){
        super(creep);
    }

    run(){
        if(!this.creep){return}
        this.fullFlip();
        if (this.memory.FULL) {
            let closestDamagedStructure = this.creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) =>
                ((structure.structureType != STRUCTURE_WALL) &&
                    (structure.structureType != STRUCTURE_RAMPART) &&
                    (structure.hits < structure.hitsMax))});

            if (!closestDamagedStructure) {
                this.goToDepo();
                return
            }

            if (this.creep.repair(closestDamagedStructure) == ERR_NOT_IN_RANGE) {
                this.moveTo(closestDamagedStructure);
            }
        }
        else {
            this.resupply();
        }
    }
}

class Role_Builder extends BaseWorker{
    constructor(creep: Creep){
        super(creep);
    }

    run(){
        if(!this.creep){return}
        this.fullFlip();
        if (this.memory.FULL) {
            //Look for low ramparts
            let targs;
            let targ;
            targs = this.room.find(FIND_STRUCTURES, {filter: (s)=>
                s.structureType == STRUCTURE_RAMPART &&
                s.hits < 1200});
            targ = this.pos.findClosestByPath(targs);
            if(!targ){
                //Find smallest construction
                targs = this.room.find(FIND_CONSTRUCTION_SITES);
                targs.sort((a:ConstructionSite, b:ConstructionSite) =>
                    a.progressTotal - b.progressTotal);
                targ = this.pos.findClosestByPath(targs);

                if (!targ) {
                    this.goToDepo();
                    return;
                }
            }
            
            let err;
            if(targ instanceof StructureRampart){
                err = this.creep.repair(targ)
            }
            else{
                err = this.creep.build(targ);
            }
            if(err == ERR_NOT_IN_RANGE){
                this.moveTo(targ);
            }
        }
        else {
            this.resupply();
        }
    }
}

class Role_WallBuiler extends BaseWorker{
    constructor(creep: Creep){
        super(creep);
    }

    run(){
        if(!this.creep){return}
        this.fullFlip();
        if(this.memory.FULL){
            let targ;
            targ = Game.getObjectById(this.memory.targID);
            if(!targ){
                this.memory.FULL = false;
                return;
            }
            if(this.creep.repair(targ) == ERR_NOT_IN_RANGE){
                this.moveTo(targ, {visualizePathStyle: {lineStyle: 'dashed'}});
            }
        }
        else{this.resupply();}
    }

    fullFlip(){
        if(!this.creep){return}
        if(this.creep.memory.FULL && this.creep.store.getUsedCapacity() == 0){
            this.creep.memory.FULL = false;
        }
        else if(!this.creep.memory.FULL && this.creep.store.getFreeCapacity() == 0){
            this.creep.memory.FULL = true;

            //find wall
            let walls = this.room.find(FIND_STRUCTURES, {filter: (s) =>
                s.structureType == STRUCTURE_WALL ||
                    s.structureType == STRUCTURE_RAMPART});
            walls.sort((a,b) => a.hits - b.hits);
            this.memory.targID = walls[0].id;
        }
    }
}

export {
    Role_Fixer,
    Role_Builder,
    Role_WallBuiler
}
