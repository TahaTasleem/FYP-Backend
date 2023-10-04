const express = require('express');
const {validateCredentialsRescue, addNewRescueOrganization, updateRescueOrganizationById,
    deleteRescueOrganizationById, getRescueOrganizationById, getAllRescueOrganizations,
    updateRescuePerformanceById} = require('../services/rescueService.js');
const {acceptReportRequest} = require('../services/reportService.js');
const bcrypt = require('bcryptjs');
const { getToken } = require('../utils/jwtToken.js');
const result2 = "Some error occured";

const {raiseNotFoundException, raiseUnauthorizeUserException, raiseInternalServerException} = require('../utils/exceptionLogger.js');

const rescueLoginController = async(req, res) => {
    try{
        const {userName, password} = req.body;
        if(!userName || !password){
            const exc = await raiseUnauthorizeUserException();
            return res.status(401).json({'message':"Please enter email and password both!"});
        }
        const valid = await validateCredentialsRescue(userName, password);
        if(!valid){
            const exc = await raiseUnauthorizeUserException();
            return res.status(401).json({'message':"Please Enter valid Credentials!"});
        } 
        const token = await getToken(valid.credentials.userName);
        
        valid.credentials = undefined;
        return res.status(200).cookie('token', token).json({success: true, valid, token});
    }catch(err){
        const exc = await raiseInternalServerException(err);
        res.status(500).send(err);
    }
}

const rescueLogoutController = async(req, res) => {
    try{
        res.clearCookie('token');
        return res.status(200).json({success: true, message: "Logged out successfully."});
    }catch(err){
        const exc = await raiseInternalServerException(err);
        res.status(500).send(err);
    }
}

const rescueRegisterController = async (req, res) => {
    try{
        const hashedPass = await bcrypt.hash(req.body.password, 10);
        var credentials = {
            userName: req.body.userName,
            password: hashedPass,
        }

        let today = Date.now();

        var rescue = {
            credentials: credentials,
            organizationName: req.body.organizationName,
            createdAt: today,
            cell: req.body.cell
        }

        const result = await addNewRescueOrganization(rescue);
        if(!result){
            const exc = await raiseNotFoundException();
            return res.status(404).json({'message':result2});
        }else
            return res.status(201).json({'message':result});
    }catch(err){
        const exc = await raiseInternalServerException(err);
        res.status(500).send(err);
    }
}

const rescueUpdateController = async (req, res) =>{
    try{
        const updates = req.body.updates;
        var filter = req.params.id

        const updated = await updateRescueOrganizationById(filter, updates)
        if(updated)        
            res.sendStatus(204);
        else{
            const exc = await raiseNotFoundException();
            res.status(404).send("Not found!");
        }
    }catch(err){
        const exc = await raiseInternalServerException(err);
        res.status(500).send(err);
    }
}

const rescueInfoController = async (req, res) =>{        //by objId
    try{
        const id = req.params.id;
        const result = await getRescueOrganizationById(id);
        if(result)        
            res.status(200).send(result);
        else{
            const exc = await raiseNotFoundException();
            res.status(404).send("Not found!");
        }
    }catch(err){
        const exc = await raiseInternalServerException(err);
        res.status(500).send(err);
    }
}

const getAllRescueController = async (req, res) =>{
    try{ 
        const result = await getAllRescueOrganizations();
        if(!result){
            const exc = await raiseNotFoundException();
            return res.status(404).json({'message':result2});
        }
        return res.status(200).json({'message':result});
    }catch(err){
        const exc = await raiseInternalServerException(err);
        res.status(500).send(err);
    }
}

const rescueDeleteController = async (req, res) =>{
    try{
        var filter = req.params.id;

        const deleted = await deleteRescueOrganizationById(filter);
        if(deleted)        
            res.sendStatus(200);
        else
            res.sendStatus(204);
    }catch(err){
        const exc = await raiseInternalServerException(err);
        res.status(500).send(err);
    }
}

const departAmbulance_denyController = async(req, res) =>{
    try{
        var filter = req.params.id;
        var updates = {
            deny: 1
        }
        const updated = await updateRescuePerformanceById(filter, updates);
        if(updated)        
            res.sendStatus(200);
        else
            res.sendStatus(204);
    }catch(err){
        const exc = await raiseInternalServerException(err);
        res.status(500).send(err);
    }
}

const departAmbulance_acceptController = async(req, res) =>{
    try{
        var filter = req.params.id;
        var reportId = req.body.reportId;
        var updates = {
            accept: 1
        }

        var rescuedBy = {
            rescueId: filter,
            organizationName: req.body.organizationName,
            rescuedAt: Date.now()
        }
        const updated = await updateRescuePerformanceById(filter, updates);
        const reportAccepted = await acceptReportRequest(reportId, rescuedBy);
        if(updated && reportAccepted)        
            res.sendStatus(200);
        else
            res.sendStatus(204);
    }catch(err){
        const exc = await raiseInternalServerException(err);
        res.status(500).send(err);
    }
}

const totalServicesController = async (req, res) =>{
    try{
        const id = req.params.id;
        const result = await getRescueOrganizationById(id);
        if(result){
            var result2 = (result.acceptedDeliveries*100) / (result.acceptedDeliveries + result.deniedDeliveries);
            res.status(200).json({'message':result2})
        }else
            res.sendStatus(404);
    }catch(err){
        const exc = await raiseInternalServerException(err);
        res.status(500).send(err);
    }
}

module.exports.rescueLoginController = rescueLoginController;
module.exports.rescueLogoutController = rescueLogoutController;
module.exports.rescueRegisterController = rescueRegisterController;
module.exports.rescueUpdateController = rescueUpdateController;
module.exports.rescueInfoController = rescueInfoController;
module.exports.getAllRescueController = getAllRescueController;
module.exports.rescueDeleteController = rescueDeleteController;
module.exports.departAmbulance_acceptController = departAmbulance_acceptController;
module.exports.departAmbulance_denyController = departAmbulance_denyController;
module.exports.totalServicesController = totalServicesController;
