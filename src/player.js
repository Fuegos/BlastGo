import { Scorer } from "./scorer";
import { INIT_COUNT_MONEY } from './constants'

export class Player {
    constructor() {
        this.scorer = new Scorer();
        this.countMoney = INIT_COUNT_MONEY;
    }

    pay = (amountOfPayment) => {
        this.countMoney -= amountOfPayment;
    }
    
    getCountMoney = () => this.countMoney;

    getScorer = () => this.scorer;
}