const express = require("express");
const {rescueRegisterController, rescueLoginController, rescueInfoController,
    rescueUpdateController, getAllRescueController, rescueDeleteController,
    rescueLogoutController, departAmbulance_denyController, departAmbulance_acceptController,
    totalServicesController} = require('../controllers/rescueController');
const {isAuthenticUser} = require('../middlewares/authentication.js');

const router = express.Router();

router.post('/login', rescueLoginController);
router.get('/', getAllRescueController);
router.post('/add', rescueRegisterController);
router.get('/specific/:id', isAuthenticUser, rescueInfoController);
router.put('/update/:id', isAuthenticUser, rescueUpdateController);
router.delete('/delete/:id', isAuthenticUser, rescueDeleteController);
router.get('/logout', isAuthenticUser, rescueLogoutController);
router.put('/accept-delivery/:id', isAuthenticUser, departAmbulance_acceptController);
router.put('/deny-delivery/:id', isAuthenticUser, departAmbulance_denyController);
router.get('/total-service/:id', isAuthenticUser, totalServicesController);     //returns %

module.exports = router;
