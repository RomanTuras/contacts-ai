// import fs from "fs";
// import path from "path";
// import * as contactsService from "../../services/contactsServices";
// import HttpError from "../../helpers/HttpError";
//
// const filePath = path.join(process.cwd(), "db", "contacts.json");
//
// export default async function handler(req, res) {
//     const { name } = req.query;
//
//     if (req.method === "GET") {
//         const result = await contactsService.getContactByName(name);
//
//         if (!result) {
//             res.status(404).json({ message: "Contact not found" });
//         }
//
//         res.status(200).json(result);
//         // res.status(200).json({ message: `Contact with name ${name}` });
//     } else {
//         res.status(405).json({ message: "Method not allowed" });
//     }
// }
