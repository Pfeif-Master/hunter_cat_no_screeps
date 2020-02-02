// example declaration file - remove these and add your own custom typings

// memory extension samples
interface CreepMemory { [key: string]: any }

interface RoomMemory {
    jobs:{
        Harvesters:{
            [id: string]:{
                creepName: string;
                body: BodyManifest;
            };
        };
        Runners:{
            blackList: string[];
            job: Job;
        };
        Upgraders:Job;
        Builders:Job;
        AwayBuilders:{
            roomName:string;
            job:Job;
        };
        WallBuilders:Job;
        Fixers:Job;
    };
    Claim:string;
    Scouts:string[];
}

interface Memory { 
    // activeCreeps: {[key: string]: any};
    // activeCreeps: string[];
    activeCreeps: Set<string>;
    [key: string]: any }

interface BodyManifest{
    move?: number;
    carry?: number;
    work?: number;
    claim?: number;
}

interface Job{
    qnt: number;
    body: BodyManifest;
}

// `global` extension samples
declare namespace NodeJS {
    interface Global {
        log: any;
    }
}

// interface Roster {
//     [forceName: string]: {
//         qnt: number;
//         body: {
//             move?: number;
//             work?: number;
//             carry?: number;
//             attack?: number;
//             ranged_attack?:number;
//             heal?: number;
//             claim?: number;
//             tough?: number;
//         };
//         role: string;
//         args?: any;
//     }
// }

