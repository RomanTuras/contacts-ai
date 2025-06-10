import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "db", "contacts.json");

export default async function handler(req, res) {
    const method = req.method;
    let contacts = JSON.parse(fs.readFileSync(filePath, "utf8"));

    if (method === "GET") {
        return res.status(200).json(contacts);
    }

    if (method === "POST") {
        const { name, phone } = req.body;
        if (!name || !phone) {
            return res.status(400).json({ message: "Missing name or phone" });
        }
        const newContact = { id: Date.now().toString(), name, phone };
        contacts.push(newContact);
        fs.writeFileSync(filePath, JSON.stringify(contacts, null, 2));
        return res.status(201).json(newContact);
    }

    if (method === "PUT") {
        const { id, name, phone } = req.body;
        const index = contacts.findIndex(c => c.id === id);
        if (index === -1) return res.status(404).json({ message: "Contact not found" });
        if (name) contacts[index].name = name;
        if (phone) contacts[index].phone = phone;
        fs.writeFileSync(filePath, JSON.stringify(contacts, null, 2));
        return res.status(200).json(contacts[index]);
    }

    if (method === "DELETE") {
        const { id } = req.query;
        const index = contacts.findIndex(c => c.id === id);
        if (index === -1) return res.status(404).json({ message: "Not found" });
        const removed = contacts.splice(index, 1);
        fs.writeFileSync(filePath, JSON.stringify(contacts, null, 2));
        return res.status(200).json({ deleted: removed[0] });
    }

    res.status(405).json({ message: "Method not allowed" });
}
