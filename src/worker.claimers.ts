import {BaseWorker} from 'baseWorker'

class Role_Upgrader extends BaseWorker{
    constructor(creep:Creep){
        super(creep);
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

class Role_Claimer extends BaseWorker{
    newRoomName: string;

    constructor(creep: Creep, args:{roomName:string}){
        super(creep);
        this.newRoomName = args.roomName;
    }

    claim(){
        if(this.creep.room.name != this.newRoomName){
            //change rooms
            this.changeRooms(this.newRoomName);
            return;
        }
        else{
            //cliam control
            if(this.creep.claimController(this.room.controller) == ERR_NOT_IN_RANGE){
                this.moveTo(this.room.controller);
            }
        }
    }
}

export {
    Role_Upgrader,
    Role_Claimer
}
