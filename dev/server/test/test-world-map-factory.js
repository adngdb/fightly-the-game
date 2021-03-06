/***********************************************************************
 *
 * Fightly - Web Game Engine
 * http://fightly.com
 *
 * License: see LICENSE.txt
 *
 **********************************************************************/

var mapfactory_ = require("../lib/world/map-factory.js");
var cellFactory_ = require("../lib/world/cell-factory.js");

/*exports["test-world-map-factory-create"] = function(test) {

        var createdMap = new mapfactory_.MapFactory.prototype.create(3,2);

        for (i=0;i<2;i++) {
            for (j=0;j<3;j++) {
                test.equal(createdMap.cells[i][j].type,"plains");
                test.equal(createdMap.cells[i][j].x,i);
                test.equal(createdMap.cells[i][j].y,j);
            }
        }

        test.done();
}*/

exports["test-world-map-factory-createFromFile"] = function(test) {

        var obj = new mapfactory_.MapFactory();
        obj.cellFactory = new cellFactory_.CellFactory();
        var map = obj.createFromFile("./data/maps/sample-map.json");

        test.equal(map.height , 10);
        test.equal(map.width , 10);
        test.equal(map.cells[2][3].x , 2);
        test.equal(map.cells[2][3].y , 3);
        test.equal(map.cells[2][3].type , "swamp");
        test.done();
}
