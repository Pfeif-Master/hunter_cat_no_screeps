// example declaration file - remove these and add your own custom typings

// memory extension samples
interface CreepMemory { [key: string]: any }

interface RoomMemory {roster: {force}}

interface Memory { [key: string]: any }

interface Roster {
    [forceName: string]: {
        qnt: Number;
        body: {
            move?: Number;
            work?: Number;
            carry?: Number;
            attack?: Number;
            ranged_attack?:Number;
            heal?: Number;
            claim?: Number;
            tough?: Number;
        };
        role: string;
        args?: any;
    }
}

// `global` extension samples
declare namespace NodeJS {
    interface Global {
        log: any;
    }
}
