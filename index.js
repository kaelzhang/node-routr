'use strict';

module.exports = router;

router.Route = require('./lib/route');
router.Router = Router;

function router (options) {
    return new Router(options);
}


function Router (options) {
    
}