const Relative = require('../models/relativeModel.js');

const addNewRelative = async (relative) =>{
    const newRelative = new Relative(relative);

    const relativeAdded = await newRelative.save();
    if(relativeAdded){
        return relativeAdded;
    }
}

const deleteRelativeById = async (id) =>{
    const relativeDeleted =  await Relative.findOneAndDelete({_id : id});
    if(relativeDeleted){
        return relativeDeleted;
    }
}

const getRelativeByRiderId = async (id) =>{
    const results =  await Relative.find({belongsTo : id});
    if(results){
        return results;
    }
}

const updateRelativeById = async (id, updates) =>{
    const relativeUpdated =  await Relative.findOneAndUpdate({_id : id}, updates);
    if(relativeUpdated){
        return relativeUpdated;
    }
}

module.exports.addNewRelative = addNewRelative;
module.exports.deleteRelativeById = deleteRelativeById;
module.exports.getRelativeByRiderId = getRelativeByRiderId;
module.exports.updateRelativeById = updateRelativeById;