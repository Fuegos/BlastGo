// for game field
const MIN_COUNT_ROWS = 5;
const MAX_COUNT_ROWS = 10;

const MIN_COUNT_COLUMNS = 5;
const MAX_COUNT_COLUMNS = 10;

const MIN_COUNT_COLORS = 3;
const MAX_COUNT_COLORS = 5;

const COLORS = ['blue', 'red', 'purple', 'yellow', 'green'];

const COLOR_ASSET = {
  "blue": "blockBlue",
  "red": "blockRed",
  "yellow": "blockYellow",
  "purple": "blockPurple",
  "green": "blockGreen",
  "bomb": "bomb"
};

// for game sesssion
const GOAL_COUNT_MOVE = 20;
const GOAL_COUNT_SCORE = 5000;  
const INIT_COUNT_MONEY = 15;
const MAX_COUNT_SHAKE = 5;
const MIN_GROUP = 3;
const LEN_GROUP_BOMB = 7;
const RADIUS_BOMB = 1;
const SCORE_ONE_TILE = 10; 
const SCORE_ONE_MOVE = 10;
const PRICE_BOMB = 5;

// for drawing game field
const PADDING_GAME_FIELD_X = 0.02;
const PADDING_GAME_FIELD_Y = 0.02;

export {
    MAX_COUNT_COLORS,
    MIN_COUNT_COLORS,
    MAX_COUNT_ROWS,
    MIN_COUNT_ROWS,
    MAX_COUNT_COLUMNS,
    MIN_COUNT_COLUMNS,
    COLORS, 
    COLOR_ASSET,
    GOAL_COUNT_MOVE,
    GOAL_COUNT_SCORE,
    INIT_COUNT_MONEY,
    MAX_COUNT_SHAKE,
    MIN_GROUP,
    LEN_GROUP_BOMB,
    RADIUS_BOMB,
    SCORE_ONE_TILE,
    SCORE_ONE_MOVE,
    PRICE_BOMB,
    PADDING_GAME_FIELD_X,
    PADDING_GAME_FIELD_Y
};