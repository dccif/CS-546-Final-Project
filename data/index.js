const user = require('./users');
// const review = require('./reviews');
const log = require('./logs');
// const comment = require('./comments');
const plan = require('./plans');
// const reply = require('./replies');
const planGenerator = require('./planGenerator')
// const airport IATA
const cityQuery = require('./cityQuery')

module.exports = {
    users: user,
    // reviews = review,
    logs: log,
    // comments = comment,
    plans: plan,
    // replies = reply
    planGenerator: planGenerator,
    // airports
    cityQuery: cityQuery
};