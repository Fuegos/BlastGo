const MIN_COUNT_ROWS = 5;
const MAX_COUNT_ROWS = 10;
const COUNT_ROWS = Math.floor(
    Math.random() * (MAX_COUNT_ROWS - MIN_COUNT_ROWS + 1)
) + MIN_COUNT_ROWS;

const MIN_COUNT_COLUMNS = 5;
const MAX_COUNT_COLUMNS = 10;
const COUNT_COLUMNS = Math.floor(
    Math.random() * (MAX_COUNT_COLUMNS - MIN_COUNT_COLUMNS + 1)
) + MIN_COUNT_COLUMNS;

const MIN_COUNT_COLORS = 3;
const MAX_COUNT_COLORS = 5;
const COUNT_COLORS = Math.floor(
    Math.random() * (MAX_COUNT_COLORS - MIN_COUNT_COLORS + 1)
) + MIN_COUNT_COLORS;

const COLORS = ['blue', 'red', 'purple', 'yellow', 'green'];

const COLOR_ASSET = {
  "blue": "blockBlue",
  "red": "blockRed",
  "yellow": "blockYellow",
  "purple": "blockPurple",
  "green": "blockGreen",
  "bomb": "bomb"
};

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

export {
    COUNT_ROWS, 
    COUNT_COLUMNS, 
    COUNT_COLORS, 
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
    PRICE_BOMB
};