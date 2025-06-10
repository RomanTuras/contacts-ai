import express from "express";
import contactsController from "../controllers/contactsControllers.js";
import validateBody from "../helpers/validateBody.js";
import {createContactSchema, updateContactSchema} from "../schemas/contactsSchemas.js";

const contactsRouter = express.Router();

contactsRouter.get("/", contactsController.listContacts);

contactsRouter.get("/:id", contactsController.getContactById);

contactsRouter.delete("/:id", contactsController.removeContact);

contactsRouter.post("/", validateBody(createContactSchema), contactsController.createContact);

contactsRouter.put("/:id", validateBody(updateContactSchema), contactsController.updateContact);

export default contactsRouter;
