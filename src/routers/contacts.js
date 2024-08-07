const express = require('express');
const { getAllContacts, getContact, createContact, updateContact, deleteContact } = require('../controllers/contactsController');
const { validateCreateBody, validateUpdateBody } = require('../middlewares/validateBody');
const isValidId = require('../middlewares/isValidId');
const ctrlWrapper = require('../utils/ctrlWrapper');

const router = express.Router();

router.get('/contacts', ctrlWrapper(getAllContacts));
router.get('/contacts/:contactId', isValidId, ctrlWrapper(getContact));
router.post('/contacts', validateCreateBody, ctrlWrapper(createContact));
router.patch('/contacts/:contactId', isValidId, validateUpdateBody, ctrlWrapper(updateContact));
router.delete('/contacts/:contactId', isValidId, ctrlWrapper(deleteContact));

module.exports = router;