import * as fs from "node:fs/promises";
import path from "node:path";
import { nanoid } from "nanoid";

const contactsPath = path.resolve("db", "contacts.json");

/**
 * Writing contacts to file
 * @param {Array} contacts
 */
const updateContacts = contacts => fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

/**
 * Getting a list of contacts
 *
 * @returns {Promise<Array|null>}
 */
export async function listContacts() {
    const text = await fs.readFile(contactsPath, "utf-8");

    return JSON.parse(text);
}


/**
 * Getting contact by ID
 *
 * @param {string} contactId
 * @returns {Promise<Object|null>}
 */
export async function getContactById(contactId) {
    const contacts = await listContacts();
    const contact = contacts.find(contact => contact.id === contactId);

    return contact || null;
}


/**
 * Removing contact by ID
 *
 * @param {string} contactId
 * @returns {Promise<Object|null>}
 */
export async function removeContact(contactId) {
    const contacts = await listContacts();
    const index = contacts.findIndex( contact => contact.id === contactId);

    if (index === -1) return null;

    const [removedContact] = contacts.splice(index, 1);
    await updateContacts(contacts);

    return removedContact;
}

/**
 * Adding contact
 *
 * @returns {Promise<Object>}
 * @param data
 */
export async function addContact(data) {
    const contacts = await listContacts();
    const contact = {
        "id": nanoid(),
        ...data
    };
    contacts.push(contact);

    await updateContacts(contacts);

    return contact;
}


/**
 * Updating contact
 *
 * @param {string} contactId
 * @param data
 * @returns {Promise<Object> || null}
 */
export async function updateContact(contactId, data) {
    const contacts = await listContacts();
    const index = contacts.findIndex(contact => contact.id === contactId);

    if (index === -1) return null;

    contacts[index] = {...contacts[index], ...data};

    await updateContacts(contacts);

    return contacts[index];
}
