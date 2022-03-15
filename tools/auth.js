const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
	//on récupère le Bearer token
    const authHeader = req.headers.authorization;

    if (authHeader) {
    	//on ne prends que le token
        const token = authHeader.split(' ')[1];

        //on vérifie si le token à bien été signé avec le secret et qu'il est toujours valide
        jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
            if (err) {
            	//on retourne une erreur de permission si invalide
                return res.sendStatus(403);
            }
            //on ajoute à la requete le user du token
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

module.exports = authenticateJWT;