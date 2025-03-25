const m = require('../user/userModul');

exports.getUsers = async (req, res) => {
    try {
        const result = await m.getUsers(req.query);
        
        // Check if result is a structured response or just data
        if (result && result.code) {
            // It's a structured response with status code
            res.status(result.code).json(result);
        } else {
            // It's just data, send as successful response
            res.status(200).json({
                status: 'success',
                code: 200,
                data: result
            });
        }
    } catch (error) {
        res.status(500).json({ 
            status: "failed",
            code: 500,
            message: error.message 
        });
    }
};

exports.getPencapaian = async (req, res) => {
    try {
        const result = await m.getPencapaian(req.query);
        
        // Check if result is a structured response or just data
        if (result && result.code) {
            // It's a structured response with status code
            res.status(result.code).json(result);
        } else {
            // It's just data, send as successful response
            res.status(200).json({
                status: 'success',
                code: 200,
                data: result
            });
        }
    } catch (error) {
        res.status(500).json({ 
            status: "failed",
            code: 500,
            message: error.message 
        });
    }
};