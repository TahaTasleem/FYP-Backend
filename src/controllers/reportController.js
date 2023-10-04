const express = require('express');
const { getAllReports, deleteReportById, addNewReport, getReportById, updateReportById } = require('../services/reportService.js')
const { getRelativeByRiderId } = require('../services/relativeService.js');
const { getRiderById } = require('../services/riderService.js');
const { raiseNotFoundException, raiseInternalServerException } = require('../utils/exceptionLogger.js');
const result2 = "Some error occurred";
const { notifyRelatives } = require('../utils/sendSMS.js')

const reportCreateController = async (req, res) => {
    try {
        const details = {
            riderId: req.body.riderId,
            city: req.body.city,
            createdAt: Date.now(),
            accidentLocation: req.body.location
        }
        const result = await addNewReport(details);
        if (!result) {
            const exc = await raiseInternalServerException();
            return res.status(404).json({ 'message': result2 });
        } else {
            const relatives = await getRelativeByRiderId(details.riderId);
            const rider = await getRiderById(details.riderId);
            const notificationContent = `Dear ${relatives[0].firstName},\nWe wanted to inform you that ${rider.firstName} has met an accident, and emergency services have been notified. We are closely monitoring the situation and will keep you updated.\n\nBest Regards,\nADRS - Support Team`;
            notifyRelatives(relatives[0].cell, notificationContent);
            return res.status(201).json({ 'message': result });
        }
    } catch (err) {
        res.status(403).send(err);
    }
}

const reportInfoController = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await getReportById(id);
        const riderId = String(result.riderId);
        if (result) {
            const relative = await getRelativeByRiderId(riderId);
            const rider = await getRiderById(riderId);
            // if(relative && rider){
            //     const notificationContent = `Dear ${relative[0].firstName},\nWe wanted to inform you that ${rider.firstName} has met an accident, and emergency services have been notified. We are closely monitoring the situation and will keep you updated.\n\nBest Regards,\nADRS - Support Team`;
            //     notifyRelatives(relative[0].cell, notificationContent)
            // }
            res.status(200).send(result);
        }
        else {
            const exc = await raiseNotFoundException();
            res.status(404).send("Not found!");
        }
    } catch (err) {
        console.log(err);
        const exc = await raiseInternalServerException(err);
        res.status(500).send(err);
    }
}

const reportUpdateController = async (req, res) => {
    try {
        const id = req.params.id;
        const updates = req.body.updates;
        const updated = await updateReportById(id, updates);
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

const getAllReportController = async (req, res) => {
    const result = await getAllReports();
    if (!result) {
        const exc = await raiseNotFoundException();
        return res.status(404).json({ 'message': result2 });
    }
    return res.status(200).json({ 'message': result });
}

const reportDeleteController = async (req, res) => {
    try {
        var filter = req.params.id;

        const deleted = await deleteReportById(filter);
        if (deleted)
            res.sendStatus(200);
        else
            res.sendStatus(204);
    } catch (err) {
        const exc = await raiseInternalServerException(err);
        res.status(500).send(err);
    }
}

module.exports.reportCreateController = reportCreateController;
module.exports.reportInfoController = reportInfoController;
module.exports.reportUpdateController = reportUpdateController;
module.exports.getAllReportController = getAllReportController;
module.exports.reportDeleteController = reportDeleteController;
