const LostObject = require('../models/lostObject');

const searchLostObject = async (req, res) => {
    const { size, color, material, brand } = req.body;
    try {
        const objects = await LostObject.find({ size, color, material, brand });
        if (objects.length > 0) {
            res.json({ msg: 'Objeto encontrado, ve a la oficina de objetos perdidos' });
        } else {
            res.json({ msg: 'Objeto no encontrado' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

module.exports = { searchLostObject };
