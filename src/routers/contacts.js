import { Router } from "express";
import { getAllContactController, getContactByIdController } from "../controllers/contacts.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";

 const router = Router();

 router.get('/', ctrlWrapper(getAllContactController));

  router.get('/:contactId', ctrlWrapper(getContactByIdController));

  export default router;