/***********************************************************************
 *
 * Fightly - Web Game Engine
 * http://fightly.com
 *
 * License: see LICENSE.txt
 *
 **********************************************************************/


var sys = require('sys') ;
var rules_ = require('lib/rules/rules.js') ;

exports['load'] = function (test) {
    var r = new rules_.Rules(null) ;
    r.load('rules.json') ;
    test.done() ;
};

exports['configureFactories'] = function (test) {
	
	test.done() ;
}

