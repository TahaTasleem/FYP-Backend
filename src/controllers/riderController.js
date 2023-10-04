const express = require('express');
const { validateCredentialsRider, getRiderByEmail, isAuthenticRider, updateRiderPassword, addDiseasesToRider, removeDiseasesFromRider, addNewRider, updateRiderById, getRiderById, deleteRiderById, getAllRiders } = require('../services/riderService.js');
const { getRelativeByRiderId } = require('../services/relativeService.js')
const bcrypt = require('bcryptjs');
const { sendEmail } = require('../utils/sendEmail.js')
const { getToken } = require('../utils/jwtToken.js');
const result2 = "Some error occurred";

const { raiseNotFoundException, raiseUnauthorizeUserException, raiseInternalServerException } = require('../utils/exceptionLogger.js');

const riderInfoController = async (req, res) => {        //by objId
    try {
        const id = req.params.id;
        const result = await getRiderById(id)
        if (result)
            res.status(200).send(result);
        else {
            const exc = await raiseNotFoundException();
            res.status(404).send("Not found!");
        }
    } catch (err) {
        const exc = await raiseInternalServerException(err);
        res.status(500).send(err);
    }
}

const riderUpdateController = async (req, res) => {      //everything updates except diseases
    try {
        const id = req.params.id;
        const updates = req.body.updates
        const updated = await updateRiderById(id, updates);
        if (updated)
            res.sendStatus(204);
        else {
            const exc = await raiseNotFoundException();
            res.status(404).send("Not found!");
        }
    } catch (err) {
        const exc = await raiseInternalServerException(err);
        res.status(500).send(err);
    }
}

const addRiderController = async (req, res) => {
    try {
        const hashedPass = await bcrypt.hash(req.body.password, 10);
        var credentials = {
            userName: req.body.userName,
            password: hashedPass,
        }
        let today = Date.now();

        var rider = {
            email: req.body.email,
            credentials: credentials,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            address: req.body.address,
            vehicleRegistrationNumber: req.body.vehicleRegistrationNumber,
            vehicleType: req.body.vehicleType,
            createdAt: today,
            NIC: req.body.NIC,
            cell: req.body.cell
        }

        const result = await addNewRider(rider);
        if (!result) {
            const exc = await raiseNotFoundException();
            return res.status(404).json({ 'message': result2 });
        } else
            return res.status(201).json({ 'message': result });
    } catch (err) {
        const exc = await raiseInternalServerException(err);
        res.status(500).send(err);
    }
}

const loginUserController = async (req, res) => {
    try {
        const { userName, password } = req.body;
        if (!userName || !password) {
            const exc = await raiseUnauthorizeUserException();
            return res.status(401).json({ 'message': "Please enter email and password both!" });
        }
        const valid = await validateCredentialsRider(userName, password);
        const validRelatives = await getRelativeByRiderId(valid._id);
        const validObj = {
            _id: valid._id,
            firstName: valid.firstName,
            lastName: valid.lastName,
            address: valid.address,
            vehicleRegistrationNumber: valid.vehicleRegistrationNumber,
            vehicleType: valid.vehicleType,
            createdAt: valid.createdAt,
            NIC: valid.NIC,
            cell: valid.cell,
            diseases: valid.diseases,
            relatives: validRelatives
        }
        if (!valid) {
            const exc = await raiseUnauthorizeUserException();
            return res.status(401).json({ 'message': "Please Enter valid Credentials!" });
        }
        const token = await getToken(valid.credentials.userName);
        valid.credentials = undefined;
        return res.status(200).cookie('token', token).json({ success: true, validObj, token });
    } catch (err) {
        const exc = await raiseInternalServerException(err);
        res.status(500).send(err);
    }
}

const logoutUserController = async (req, res) => {
    try {
        res.clearCookie('token');
        return res.status(200).json({ success: true, message: "Logged out successfully." });
    } catch (err) {
        const exc = await raiseInternalServerException(err);
        res.status(500).send(err);
    }
}

const getAllRiderController = async (req, res) => {
    try {
        const result = await getAllRiders();
        if (!result) {
            const exc = await raiseNotFoundException();
            return res.status(404).json({ 'message': result2 });
        }
        return res.status(200).json({ 'message': result });
    } catch (err) {
        const exc = await raiseInternalServerException(err);
        res.status(500).send(err);
    }
}

const riderDeleteController = async (req, res) => {
    try {
        var filter = req.params.id

        const deleted = await deleteRiderById(filter);
        if (deleted)
            res.sendStatus(200);
        else
            res.sendStatus(204);
    } catch (err) {
        const exc = await raiseInternalServerException(err);
        res.status(500).send(err);
    }
}

const addDiseaseToRiderController = async (req, res) => {
    try {
        const disease = req.body.disease;
        const riderId = req.params.id;

        const result = await addDiseasesToRider(riderId, disease);
        if (!result) {
            const exc = await raiseNotFoundException();
            return res.status(404).json({ 'message': result2 });
        }
        return res.status(200).json({ 'message': result });
    } catch (err) {
        const exc = await raiseInternalServerException(err);
        res.status(500).send(err);
    }
}

const removeDiseaseFromRiderController = async (req, res) => {
    try {
        const disease = req.body.name;     //name of disease
        const riderId = req.params.id;

        const result = await removeDiseasesFromRider(riderId, disease);
        if (result)
            return res.status(200).json({ 'message': result });
        return res.status(204).json({ 'message': result2 });
    } catch (err) {
        const exc = await raiseInternalServerException(err);
        res.status(500).send(err);
    }
}

const forgetPasswordController = async (req, res) => {
    try {
        const rider = await getRiderByEmail(req.body.email);
        if (rider) {
            const resetPasswordToken = await getToken(req.body.email);
            const updates = {
                resetPasswordToken: resetPasswordToken
            }
            const updatedUser = await updateRiderById(rider._id, updates);
            if (!updatedUser) {
                return res.status(500).json({ 'message': result2 });
            }

            //this url will be the url of front-end change password page:
            let url = `${req.protocol}://${req.get("host")}/api/rider/updatePassword/${resetPasswordToken}`;
            //`http://localhost:PORT#/api/rider/updatePassword/${resetPasswordToken}` (backend-api url)

            sendEmail(url, updatedUser.email);
            return res.status(200).json({ 'message': "Mail sent!" });
        }
        const exc = await raiseNotFoundException();
        return res.status(404).json({ 'message': result2 });
    } catch (err) {
        console.log(err);
    }
}

const updatePasswordController = async (req, res) => {
    try {
        const newPass = req.body.password;
        const confirmNewPass = req.body.confirmPassword;
        const token = req.params.token;
        if (confirmNewPass == newPass) {
            const password = await bcrypt.hash(newPass, 10);
            const authenticRider = await isAuthenticRider(token);
            if (authenticRider) {
                const updated = await updateRiderPassword(authenticRider._id, password);
                if (updated)
                    res.sendStatus(204);
                else {
                    const exc = await raiseNotFoundException();
                    res.status(404).send("Not found!");
                }
            }
        }
    } catch (err) {
        const exc = await raiseInternalServerException(err);
        res.status(500).send(err);
    }
}

module.exports.addRiderController = addRiderController;
module.exports.riderInfoController = riderInfoController;
module.exports.riderUpdateController = riderUpdateController;
module.exports.forgetPasswordController = forgetPasswordController;
module.exports.updatePasswordController = updatePasswordController;
module.exports.getAllRiderController = getAllRiderController;
module.exports.riderDeleteController = riderDeleteController;
module.exports.removeDiseaseFromRiderController = removeDiseaseFromRiderController;
module.exports.addDiseaseToRiderController = addDiseaseToRiderController;
module.exports.logoutUserController = logoutUserController;
module.exports.loginUserController = loginUserController;