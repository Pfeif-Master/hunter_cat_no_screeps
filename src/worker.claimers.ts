import {BaseWorker} from 'baseWorker'

class Role_Upgrader extends BaseWorker{
    constructor(creep:Creep, depo:Flag){
        super(creep, depo);
    }

    run(){
        if(!this.creep){return}
        this.fullFlip();
        if (this.memory.FULL) {
            if (!this.room.controller) {
                this.creep.say("can't Find Controller");
                return;
            }
            if (this.creep.upgradeController(this.room.controller) == ERR_NOT_IN_RANGE) {
                this.moveTo(this.room.controller);
            }
        }
        else {
            this.resupply();
        }
    }
}

class Role_Scout extends BaseWorker{
    targRoom: Room;

    constructor(creep: Creep){
        super(creep);
        this.targRoom = Game.rooms[this.memory.roomName];
    }

    run(){
        if(this.room != this.targRoom){
            this.changeRooms(this.memory.roomName);
            return;
        }
        if(this.pos.x==0){
            this.creep.move(RIGHT);
        }
        if(this.pos.x==49){
            this.creep.move(LEFT);
        }
        if(this.pos.y==0){
            this.creep.move(BOTTOM);
        }
        if(this.pos.y==49){
            this.creep.move(TOP);
        }
    }

    
}


class Role_Claimer extends Role_Scout{

    constructor(creep: Creep, depo?:Flag){
        super(creep);
    }

    run(){
        let err = this.creep.claimController(this.targRoom.controller);
        this.log(this.targRoom);
        this.log(err);
        if( err == ERR_NOT_IN_RANGE){
            this.moveTo(this.targRoom.controller);
        }
    }
}

    export {
        Role_Upgrader,
        Role_Claimer,
        Role_Scout
    }
