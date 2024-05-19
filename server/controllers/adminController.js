const LostObject = require('../models/lostObject');

const registerLostObject = async (req, res) => {
    const { size, color, material, brand } = req.body;
    try {
        const newObject = new LostObject({ size, color, material, brand });
        await newObject.save();
        res.json({ msg: 'Objeto registrado correctamente' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const listLostObjects = async (req, res) => {
    try {
        const objects = await LostObject.find().sort({ date: -1 });
        res.json(objects);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

module.exports = { registerLostObject, listLostObjects };
