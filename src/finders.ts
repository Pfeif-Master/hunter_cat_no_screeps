let Finders = {
    find_closet_heap: function (creep:Creep):Resource|null{
        return creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES,
            {filter:function(h){return h.resourceType == RESOURCE_ENERGY &&
                                h.amount > creep.store.getFreeCapacity()}});
    },

    find_closet_full_container: function(creep:Creep):StructureContainer|null{
        let targ = creep.pos.findClosestByPath(FIND_STRUCTURES,
            {filter:function(s){
                return (s.structureType == STRUCTURE_CONTAINER &&
                    s.store[RESOURCE_ENERGY] > creep.store.getFreeCapacity())}
            });
        if(targ instanceof StructureContainer){return targ;}
        else{return null}
    }
}

export {Finders}
