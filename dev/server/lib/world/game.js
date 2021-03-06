/* *********************************************************************
 *
 * Fightly - Web Game Engine
 * http://fightly.com
 *
 * License: see LICENSE.txt
 *
 **********************************************************************/

var util = require("util");

/**
 * Class Game
 * @author Youness HAMRI - youness.hamri@gmail.com / Van Duc NGUYEN - ducnguyen272@yahoo.com
 * @constructor
 */
function Game() {

    this.id = null;
    this.map = null;
    this.players = [];
    this.state = "waiting";

    this.mapFactory = null;
    this.playerFactory = null;
    this.unitFactory = null;

    // Configuration
    this.nbMaxPlayers = null;
    this.nbMaxTurns = null;
    this.turnDuration = null;


    //play in turn
    this.currentPlayer = null;
    this.interval = null;
    this.currentTurn = null;
};

Game.prototype = {

    toJSON: function() {
        return {
            "id":               this.id,
            "players":          this.players,
            "map":              this.map,
            "state":            this.state,
            "nbMaxTurns":       this.nbMaxTurns,
            "turnDuration":     this.turnDuration,
            "currentTurn":      this.currentTurn,
            "currentPlayer":    (this.currentPlayer == null) ? null : this.currentPlayer.id,
        };
    },

    /**
     * Adds a new player to current game from an user .
     * @param user.
     * @return player.
     */
    addPlayer: function(user) {
        util.log("Game.addPlayer");

        var player = this.playerFactory.createFromUser(user, this.map.allocStartPoint());
        util.log(player.startPoint);
        player.addObserver(this);

        this.players.push(player);
        this.notify({game: this, object: "Game", modified: "players", instance: this});

        this.checkState();
        return player;
    },

    /**
     * Set to false a play attribute of player.
     * @param PlayerId (a player identity)
     */
    removePlayer: function(playerId) {
        for (var i=0 ; i<this.players.length ; i++) {
            if(this.players[i].id == playerId) {
                this.players[i].play = false;
                break;
            }
        }
    },

    /**
     * Get a game list of players identities.
     * @return PlayersIds
     */
    getPlayersIds: function() {

        var playersIds = [];
        for (i=0 ; i<this.players.length ; i++) {
                playersIds[i] = this.players[i].id;
        }
        return playersIds;
    },

    /**
     * Launchs the game when a maximum number of players is reached
     * @return this
     */
    checkState: function() {
        if (this.nbMaxPlayers == this.players.length) {
            this.state = "playing";
            this.startPlaying();
            this.notify({game: this, object: "Game", modified: "state", instance: this});
        }
        return this;
    },

    /**
     * Downloads one map from a data map file
     * @param file
     */
    downloadMapFromFile: function(file) {
        this.map = mapFactory.createFromFile(file);
    },

    //--->play in turn

    /**
     * Get a player by attribute "turn"
     * @param turn Turn of player
     * @return player
     */
    getPlayerByTurn: function(turn) {
        var player = null;
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].turn == turn) {
                player = this.players[i];
                break;
            }
        }

        return player;
    },


    /**
     * Get player who has next turn
     * @param currentTurn Turn of current player
     * @return player
     */
    getNextPlayer: function(currentTurn) {
        var nextPlayer = null;
        do {
            currentTurn++;
            if(currentTurn >= this.nbMaxPlayers) {
                currentTurn = 0;
            }

            nextPlayer = this.getPlayerByTurn(currentTurn);
        }
        while(nextPlayer.play == false);

        return nextPlayer;
    },


    /**
     * Change turn to the next player (according to Timer)
     */
    nextTurn: function() {
        var nextPlayer = this.getNextPlayer(this.currentPlayer.turn);
        if(nextPlayer.turn <= this.currentPlayer.turn) {
            this.currentTurn++;
            if(this.currentTurn > this.nbMaxTurns) {
                this.stopPlaying();
                return;
            }
        }
        this.currentPlayer = nextPlayer;
        this.currentPlayer.resetUnits();

        this.notify({game: this, object: "Game", modified: "currentPlayer", instance: this});
        this.notify({game: this, object: "Game", modified: "currentTurn", instance: this});

        util.log("This is turn of player " + this.currentPlayer.turn + ": " + this.currentPlayer.id);

        //Start timer for next player
        this.startTimer();
    },


    /**
     * Start Timer for playing in turn
     * (in miliseconds)
     */
    startTimer: function() {
        this.interval = setInterval(function() {
            this.changeTurn();
        }.bind(this), this.turnDuration * 1000);
    },

    /**
     * Change turn to the next player (immediately)
     */
    changeTurn: function() {
        clearInterval(this.interval);
        this.nextTurn();
    },


    /**
     * Set the turn order for each player.
     * @return this.
     */
    orderPlayers: function() {
        var i = 0,
            l = this.players.length;

        for (; i < l; i++) {
            this.players[i].turn = i;
        }
        return this;
    },


    /**
     * Start playing in turn
     * Player whose turn is 0 will be the first
     */
    startPlaying: function() {
        this.currentTurn = 0;

        this.orderPlayers();

        this.currentPlayer = this.getPlayerByTurn(0);
        util.log("This is turn of player 0: " + this.currentPlayer);

        this.notify({game: this, object: "Game", modified: "*", instance: this});

        this.startTimer();
    },


    /**
     * Stop playing
     *
     */
    stopPlaying: function() {
        clearInterval(this.interval);
        this.currentPlayer = null;
    },


    /**
     * Get a player by attribute "id"
     * @param id Id of player
     * @return player
     */
    getPlayerById: function(id) {
        var player = null;
        for (var i=0 ; i<this.players.length ; i++) {
            if(this.players[i].id == id) {
                player = this.players[i];
                break;
            }
        }

        return player;
    },


    /**
     * Alias for getPlayerById
     * @see getPlayerById
     */
    getPlayer: function(id) {
        return this.getPlayerById(id);
    },


    /**
     * Get a unit in game by attribute "id"
     * @param id Id of unit
     * @return unit
     */
    getUnitById: function(id) {
        for (var i = 0; i < this.players.length; i++) {
            var player = this.players[i];
            for (var j = 0; j < player.units.length; j++) {
                var unit = player.units[j];
                if (unit.id == id) {
                    return unit;
                }
            }
        }

        return null;
    },

    /**
     * Get a unit in game by attribute "cell"
     * @param cell Cell represents position of unit
     * @return unit
     */
    getUnitByCell: function(cell) {
        for (var i = 0; i < this.players.length; i++) {
            var player = this.players[i];
            for (var j = 0; j < player.units.length; j++) {
                var unit = player.units[j];
                if (unit.cell == cell) {
                    return unit;
                }
            }
        }
        return null;
    },

    /**
     * Alias for getUnitById
     * @see getUnitById
     */
    getUnit: function(id) {
        return this.getUnitById(id);
    },


    /**
     * Get a cell by coodinates x and y
     * @param x Coordinate x of this cell
     * @param y Coordinate y of this cell
     * @return cell
     */
    getCell: function(x, y) {
        return this.map.getCell(x, y);
    },

    onUpdate: function(context) {
        context.game = this;
        this.notify(context);
    },

};

module.exports = Game;
