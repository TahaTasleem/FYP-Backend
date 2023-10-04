const express = require('express');
const {addNewRelative, deleteRelativeById, getRelativeByRiderId, updateRelativeById} = require('../services/relativeService.js')
const {raiseNotFoundException, raiseInternalServerException} = require('../utils/exceptionLogger.js');

const relativeAddController = async (req, res) =>{
    try{
        const relative = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            cell: req.body.cell,
            alternativeCell: req.body.alternativeCell,
            belongsTo: req.params.id,
            relation: req.body.relation
        }

        const relativeAdded = await addNewRelative(relative);
        if(!relativeAdded){
            const exc = await raiseNotFoundException();
            return res.status(404).json({'message':'Not found'});
        }else
            return res.status(201).json({'message':relativeAdded});
    }catch(err){
        const exc = await raiseInternalServerException(err);
        res.status(500).send(err);
    }
}

const relativeDeleteController = async (req, res) =>{
    try{
        var filter = req.params.id;

        const deleted = await deleteRelativeById(filter);
        if(deleted)        
            res.sendStatus(200);
        else
            res.sendStatus(204);
    }catch(err){
        const exc = await raiseInternalServerException(err);
        res.status(500).send(err);
    }
}

const specificRiderRelativeInfoController = async (req, res) =>{
    try{
        var filter = req.params.id;

        const result = await getRelativeByRiderId(filter);
        if(result)        
            res.status(200).json({'message': result});
        else{
            const exc = await raiseNotFoundException();
            res.status(404).json({'message':'Not found'});
        }
    }catch(err){
        const exc = await raiseInternalServerException(err);
        res.status(500).send(err);
    }
}

const relativeUpdateController = async (req, res) =>{
    try{
        const updates = req.body.updates;
        var filter = req.params.id

        const updated = await updateRelativeById(filter, updates);
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

module.exports.relativeAddController = relativeAddController;
module.exports.specificRiderRelativeInfoController = specificRiderRelativeInfoController;
module.exports.relativeDeleteController = relativeDeleteController;
module.exports.relativeUpdateController = relativeUpdateController;