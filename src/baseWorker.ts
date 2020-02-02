import {Finders} from 'finders'

interface IBaseWorker{
    new (creep: Creep, depo?: Flag): BaseWorker;
}

class BaseWorker{
    creep: Creep;
    memory;
    room: Room;
    pos: RoomPosition;
    depo: Flag;
    // dest: Structure|Source|ConstructionSite|Flag|Resource;
    run(): void{
        if(!this.creep){return}}

    constructor(creep: Creep, depo?:Flag){
        if(creep){
            this.creep = creep;
            this.memory = creep.memory;
            this.room = creep.room;
            this.pos = creep.pos;
            if(this.memory.FULL == undefined){this.memory.FULL = false;}
            this.depo = depo
        }
    }

    moveTo(dest, opts?: any){
        if(this.creep.moveTo(dest, opts) == ERR_TIRED){
            this.creep.say('TIRED')
        }
    }

    changeRooms(newRoom: string|Room){
        let exitD;
        exitD = this.room.findExitTo(newRoom);
        this.moveTo(this.pos.findClosestByPath(exitD), {visualizePathStyle:{stroke: '#0F0'}});
    }

    goToDepo(){
        this.creep.say('NOOP');
        this.creep.moveTo(this.depo);
    }

    fullFlip(){
        if(!this.creep){return}
        if(this.creep.memory.FULL && this.creep.store.getUsedCapacity() == 0){
            this.creep.memory.FULL = false;
        }
        else if(!this.creep.memory.FULL && this.creep.store.getFreeCapacity() == 0){
            this.creep.memory.FULL = true;
        }
    }

    //Allow child class to replace each step in proccess
    resupply(){
        this.resupply_act(this.resupply_decide(this.resupply_think()));
    }

    resupply_think(): (Resource | StructureContainer | StructureStorage)[]{
        //find energy
        let targs: any[] = [];
        let ground = Finders.find_closet_heap(this.creep);
        if(ground){targs.push(ground);}
        let box = Finders.find_closet_full_container(this.creep);
        if(box){targs.push(box);}
        if(this.room.storage){
            if(this.room.storage.store.getUsedCapacity(RESOURCE_ENERGY) >
                this.creep.store.getCapacity()){

                targs.push(this.room.storage);
            }
        }
        return targs;
    }

    resupply_decide(targs: any[]):Resource | StructureContainer | StructureStorage{
        return this.pos.findClosestByPath(targs);
    }

    resupply_act(targ: Resource | StructureContainer | StructureStorage){
        let err;
        //Try to pull
        if(!targ){
            this.creep.say('No fill');
            this.creep.moveTo(Game.flags['Depo'])
            return;
        }
        else if(targ instanceof Resource){
            err = this.creep.pickup(targ); 
        }
        else{
            err = this.creep.withdraw(targ, RESOURCE_ENERGY);
        }
        //if fail move
        if(err == ERR_NOT_IN_RANGE){
            this.moveTo(targ, {visualizePathStyle:{stroke: '#0F0'}});
        }
    }

    log(msg){
        console.log(this.room.name+'> '+this.creep.name+': '+msg);
    }
}

export {BaseWorker, IBaseWorker}
