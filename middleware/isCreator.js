const Set = require("../models/Set.model")

module.exports = (req, res, next) => {
    const { id } = req.params;
    console.log(req.session.currentUser.username);
    Set.findById(id)
    .populate('creators')
    .then(foundSet => {
        console.log(foundSet.creators);
        if (req.session.currentUser.username === foundSet.creators.username) {
            res.locals.isUser;
            next();
        } else {
            res.redirect(`/set/info/${id}`)
        }
    })
    .catch(err => next(err));
}