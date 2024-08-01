const express = require('express');
const { getAllContacts, getContact, createContact, updateContact, deleteContact } = require('../controllers/contactsController');
const ctrlWrapper = require('../utils/ctrlWrapper');

const router = express.Router();

router.get('/contacts', ctrlWrapper(getAllContacts));
router.get('/contacts/:contactId', ctrlWrapper(getContact));
router.post('/contacts', ctrlWrapper(createContact));
router.patch('/contacts/:contactId', ctrlWrapper(updateContact));
router.delete('/contacts/:contactId', ctrlWrapper(deleteContact));

module.exports = router;