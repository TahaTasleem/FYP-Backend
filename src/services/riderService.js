const Rider = require('../models/riderModel.js');
const bcrypt = require('bcryptjs');

const addNewRider = async (rider) => {
    const newRider = new Rider(rider);

    const riderAdded = await newRider.save();
    if (riderAdded) {
        return riderAdded;
    }
}

const updateRiderById = async (id, updates) => {
    const riderUpdated = await Rider.findOneAndUpdate({ _id: id }, updates);
    if (riderUpdated) {
        return riderUpdated;
    }
}

const updateRiderPassword = async (id, password) => {
    const authenticRider = await Rider.findOne({_id:id}).select("+credentials.password +resetPasswordToken");
    if (authenticRider.resetPasswordToken) {
        authenticRider.credentials.password = password;
        authenticRider.resetPasswordToken = undefined;
        const riderUpdated = authenticRider.save();
        if (riderUpdated) {
            return riderUpdated;
        }
    }
}

const getAllRiders = async () => {
    const riders = await Rider.find();
    if (riders) {
        return riders;
    }
}

const deleteRiderById = async (id) => {
    const riderDeleted = await Rider.findOneAndDelete({ _id: id });
    if (riderDeleted) {
        return riderDeleted;
    }
}

const getRiderById = async (id) => {
    const result = await Rider.findOne({ _id: id });
    if (result) {
        return result;
    }
}

const getRiderByEmail = async (email) => {
    const validRider = await Rider.findOne({ email });
    if (validRider) {
        return validRider;
    }
}

const addDiseasesToRider = async (id, disease) => {
    const rider = await Rider.findOneAndUpdate({ _id: id }, { $push: { diseases: disease } }, { new: true });
    if (rider) {
        return rider;
    }
}

const removeDiseasesFromRider = async (id, disease) => {
    const rider = await Rider.findOneAndUpdate({ _id: id }, { $pull: { diseases: { name: disease } } }, { new: true });
    if (rider) {
        return rider;
    }
}

const validateCredentialsRider = async (user, password) => {
    const rider = await Rider.findOne({ 'credentials.userName': user }).select("+credentials.password");
    if (rider) {
        const check = bcrypt.compareSync(password, rider.credentials.password);
        if (check) {
            return rider;
        }
    }
}

const isAuthenticRider = async (resetPasswordToken) => {
    const rider = await Rider.findOne({ resetPasswordToken });
    if (rider) {
        return rider;
    }
}

module.exports.isAuthenticRider = isAuthenticRider;
module.exports.addNewRider = addNewRider;
module.exports.updateRiderById = updateRiderById;
module.exports.updateRiderPassword = updateRiderPassword;
module.exports.getAllRiders = getAllRiders;
module.exports.getRiderById = getRiderById;
module.exports.getRiderByEmail = getRiderByEmail;
module.exports.deleteRiderById = deleteRiderById;
module.exports.addDiseasesToRider = addDiseasesToRider;
module.exports.removeDiseasesFromRider = removeDiseasesFromRider;
module.exports.validateCredentialsRider = validateCredentialsRider;
