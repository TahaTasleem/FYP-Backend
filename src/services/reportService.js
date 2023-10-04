const Report = require('../models/reportModel.js');

const getAllReports = async () =>{
    const reports =  await Report.find();
    if(reports){
        return reports;
    }
}

const deleteReportById = async (id) =>{
    const reportDeleted =  await Report.findOneAndDelete({_id : id});
    if(reportDeleted){
        return reportDeleted;
    }
}

const addNewReport = async(details) =>{
    const newReport = new Report(details);

    const reportAdded = await newReport.save();
    if(reportAdded){
        return reportAdded;
    }
}

const acceptReportRequest = async(reportId, rescuedBy) =>{
    const reportUpdated =  await Report.findOneAndUpdate({_id : reportId},  {$push: {rescuedBy: rescuedBy}, status:"active"});
    if(reportUpdated){
        return reportUpdated;
    }
}

const getReportById = async(id) => {
    const result =  await Report.findOne({_id : id});
    if(result){
        return result;
    }
}

const updateReportById = async(id, updates) =>{
    const reportUpdated =  await Report.findOneAndUpdate({_id : id}, updates);
    if(reportUpdated){
        return reportUpdated;
    }
}

module.exports.getReportById = getReportById;
module.exports.acceptReportRequest = acceptReportRequest;
module.exports.addNewReport = addNewReport;
module.exports.getAllReports = getAllReports;
module.exports.deleteReportById = deleteReportById;
module.exports.updateReportById = updateReportById;