// file: webhook.js
const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

app.post('/webhook', async (req, res) => {
    const { message } = req.body; // наприклад: "додай контакт Марія, номер 0671234567"
    if (!message) return res.status(400).send('No message');

    try {
        const result = await handleVoiceCommand(message);
        res.send({ response: result });
    } catch (e) {
        console.error(e);
        res.send({ response: "Вибач, сталася помилка при обробці запиту." });
    }
});

async function handleVoiceCommand(message) {
    const lower = message.toLowerCase();

    // Додати контакт
    const addRegex = /дод(ай|ати) контакт ([а-яa-zіїєёґ\s]+),? номер (\d{7,15})/i;
    const matchAdd = lower.match(addRegex);
    if (matchAdd) {
        const name = matchAdd[2].trim();
        const phone = matchAdd[3].trim();
        await axios.post('https://contacts-ai.vercel.app/api/contacts', { name, phone });
        return `Контакт ${name} додано`;
    }

    // Знайти контакт
    const findRegex = /знайд(и|іть) контакт ([а-яa-zіїєёґ\s]+)/i;
    const matchFind = lower.match(findRegex);
    if (matchFind) {
        const name = matchFind[2].trim();
        const res = await axios.get(`https://contacts-ai.vercel.app/api/contacts?name=${encodeURIComponent(name)}`);
        const contact = res.data;
        return contact ? `Контакт ${name}: ${contact.phone}` : `Контакт ${name} не знайдено`;
    }

    // Редагувати контакт
    const editRegex = /редагуй контакт ([а-яa-z\s]+),? (нов(ий|е) номер|нове ім’я) ([а-яa-z0-9\s]+)/i;
    const matchEdit = lower.match(editRegex);
    if (matchEdit) {
        const name = matchEdit[1].trim();
        const field = matchEdit[3].includes('номер') ? 'phone' : 'name';
        const value = matchEdit[4].trim();
        await axios.put(`https://contacts-ai.vercel.app/api/contacts/${encodeURIComponent(name)}`, { [field]: value });
        return `Контакт ${name} оновлено`;
    }

    // Видалити контакт
    const removeRegex = /видал(и|іть) контакт ([а-яa-z\s]+)/i;
    const matchRemove = lower.match(removeRegex);
    if (matchRemove) {
        const name = matchRemove[2].trim();
        await axios.delete(`https://contacts-ai.vercel.app/api/contacts/${encodeURIComponent(name)}`);
        return `Контакт ${name} видалено`;
    }

    return "Вибач, я не зрозуміла команду.";
}

app.listen(4000, () => console.log('Webhook listening on port 4000'));
