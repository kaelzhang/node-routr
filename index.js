'use strict';

module.exports = router;

router.Rule = require('./lib/rule');
router.Router = Router;

function router (options) {
    return new Router(options);
}


function Router (options) {
    
}