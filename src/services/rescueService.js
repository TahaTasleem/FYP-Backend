const Rescue = require('../models/rescueModel.js');
const bcrypt = require('bcryptjs');

const addNewRescueOrganization = async (rescue) =>{
    const newRescue = new Rescue(rescue);

    const rescueAdded = await newRescue.save();
    if(rescueAdded){
        return rescueAdded;
    }
}

const updateRescueOrganizationById = async (id, updates) =>{
    const rescueupdated =  await Rescue.findOneAndUpdate({_id : id}, updates);
    if(rescueupdated){
        return rescueupdated;
    }
}

const deleteRescueOrganizationById = async (id) =>{
    const rescueDeleted =  await Rescue.findOneAndDelete({_id : id});
    if(rescueDeleted){
        return rescueDeleted;
    }
}

const getRescueOrganizationById = async (id) =>{
    const result =  await Rescue.findOne({_id : id});
    if(result){
        return result;
    }
}

const getAllRescueOrganizations = async () =>{
    const organizations =  await Rescue.find();
    if(organizations){
        return organizations;
    }
}

const validateCredentialsRescue = async (user, password) => {
    const rescue = await Rescue.findOne({'credentials.userName' : user}).select("+credentials.password");
    if(rescue){
        const check = bcrypt.compareSync(password, rescue.credentials.password);
        if(check)
            return rescue;
    } 
}

const updateRescuePerformanceById = async (id, updates) =>{
    const toBeUpdated = await Rescue.findOne({_id : id});
    var updated;
    if(updates.accept!=undefined){
        toBeUpdated.acceptedDeliveries+= 1;
        updated = await Rescue.findOneAndUpdate({_id : id}, toBeUpdated);
    }else if(updates.deny!=undefined){
        toBeUpdated.deniedDeliveries+= 1;
        updated = await Rescue.findOneAndUpdate({_id : id}, toBeUpdated);
    }
    if(updated){
        return updated;
    } 
}

module.exports.addNewRescueOrganization = addNewRescueOrganization;
module.exports.updateRescueOrganizationById = updateRescueOrganizationById;
module.exports.getAllRescueOrganizations = getAllRescueOrganizations;
module.exports.getRescueOrganizationById = getRescueOrganizationById;
module.exports.deleteRescueOrganizationById = deleteRescueOrganizationById;
module.exports.validateCredentialsRescue = validateCredentialsRescue;
module.exports.updateRescuePerformanceById = updateRescuePerformanceById;