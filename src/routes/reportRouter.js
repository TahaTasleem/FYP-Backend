const express = require("express");
const {reportCreateController, reportDeleteController, reportUpdateController, getAllReportController, reportInfoController} = require('../controllers/reportController');
const {isAuthenticUser} = require('../middlewares/authentication.js');

const router = express.Router();

router.post('/create', isAuthenticUser, reportCreateController);
router.get('/', isAuthenticUser, getAllReportController);
router.get('/specific/:id', isAuthenticUser, reportInfoController);
router.put('/update/:id', isAuthenticUser, reportUpdateController);
router.delete('/delete/:id', isAuthenticUser, reportDeleteController);

module.exports = router;