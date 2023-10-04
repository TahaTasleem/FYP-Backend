const express = require("express");
const {addRiderController, riderDeleteController, forgetPasswordController,
    getAllRiderController, riderInfoController, riderUpdateController,
    addDiseaseToRiderController, removeDiseaseFromRiderController,
    loginUserController, logoutUserController, updatePasswordController} = require('../controllers/riderController.js');
const {isAuthenticUser} = require('../middlewares/authentication.js');

const router = express.Router();

router.post('/login', loginUserController);
router.post('/add', addRiderController);
router.post('/forget-password', forgetPasswordController);
router.put('/updatePassword/:token', updatePasswordController)
router.get('/', isAuthenticUser, getAllRiderController);
router.get('/specific/:id', isAuthenticUser, riderInfoController);
router.put('/update/:id', isAuthenticUser, riderUpdateController);
router.delete('/delete/:id', isAuthenticUser, riderDeleteController);
router.put('/disease/add/:id', isAuthenticUser, addDiseaseToRiderController);
router.put('/disease/remove/:id', isAuthenticUser, removeDiseaseFromRiderController);
router.get('/logout', isAuthenticUser, logoutUserController);

module.exports = router;