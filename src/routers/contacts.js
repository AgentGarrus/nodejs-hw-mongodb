const express = require('express');
const { getAllContacts, getContact, createContact, updateContact, deleteContact } = require('../controllers/contactsController');
const { validateBody, createContactSchema, updateContactSchema } = require('../middlewares/validateBody');
const isValidId = require('../middlewares/isValidId');
const ctrlWrapper = require('../utils/ctrlWrapper');

const router = express.Router();

router.get('/', ctrlWrapper(getAllContacts));
router.get('/:contactId', isValidId, ctrlWrapper(getContact));
router.post('/', validateBody(createContactSchema), ctrlWrapper(createContact));
router.patch('/:contactId', isValidId, validateBody(updateContactSchema), ctrlWrapper(updateContact));
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContact));

module.exports = router;