const express = require("express");
const {relativeAddController, relativeUpdateController, relativeDeleteController, specificRiderRelativeInfoController} = require('../controllers/relativeController.js');
const {isAuthenticUser} = require('../middlewares/authentication.js');

const router = express.Router();

router.post('/add/:id', isAuthenticUser, relativeAddController);
router.get('/all/:id', isAuthenticUser, specificRiderRelativeInfoController);
router.put('/update/:id', isAuthenticUser, relativeUpdateController);
router.delete('/delete/:id', isAuthenticUser, relativeDeleteController);

module.exports = router;