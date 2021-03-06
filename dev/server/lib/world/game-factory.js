/* *********************************************************************
 *
 * Fightly - Web Game Engine
 * http://fightly.com
 *
 * License: see LICENSE.txt
 *
 **********************************************************************/

var Game = require("./game.js"),
    Legacy = require("../util/legacy.js"),
    Observer = require("../util/observer.js"),
    Subject = require("../util/subject.js");

var legacy = new Legacy();

/**
 * Class GameFactory
 *
 * @constructor
 */
function GameFactory(gameEngine) {
    this.gameEngine = gameEngine;

    this.playerFactory = null;
    this.mapFactory = null;
    this.cellFactory = null;
    this.unitFactory = null;
    this.config = {
        "nbMaxPlayers": 3,
        "nbMaxTurns" : 4,
        "turnDuration" : 5, //second
    };
}

GameFactory.prototype = {

    /**
     * Create a new game.
     * @param id. A game's identity.
     * @return myGame.  The created game.
     */
    create: function(id) {

        var myGame = new Game();

        myGame.id = id;
        myGame.map = this.mapFactory.create();
        myGame.playerFactory = this.playerFactory;
        myGame.mapFactory = this.mapFactory;
        myGame.unitFactory = this.unitFactory;

        myGame.nbMaxPlayers = this.config.nbMaxPlayers;
        myGame.nbMaxTurns = this.config.nbMaxTurns;
        myGame.turnDuration = this.config.turnDuration;

        legacy.inherits(new Subject(), myGame);
        legacy.inherits(new Observer(), myGame);
        myGame.addObserver(this.gameEngine);

        // test if the maximum number if players of the map is equals to the game one

        if(myGame.nbMaxPlayers == myGame.map.nbMaxPlayers ) {
            return myGame;
        }
        else {
            console.log("Erreur : contradiction pour le nombre maximum de joueurs");
        }
    },

    /**
     * Set the game's configuration.
     * @param nbMaxPlayers. A maximum number of game players .
     * @param nbMaxTurns. A maximum number of game turns. Note that we
     * consider that one games'turn is done if each player has
     * passed his turn.
     * @param nbMaxTurns. A turn duration of each player's turn.
     */
    setConfig : function(nbMaxPlayers, nbMaxTurns, turnDuration) {

        this.config.nbMaxPlayers = nbMaxPlayers;
        this.config.nbMaxTurns = nbMaxTurns;
        this.config.turnDuration = turnDuration;

    },

}

module.exports = GameFactory;
