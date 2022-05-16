import { INIT_COUNT_MONEY } from './constants'

export class Player {
    constructor() {
        this.countMoney = INIT_COUNT_MONEY;
    }

    pay = (amountOfPayment) => {
        this.countMoney -= amountOfPayment;
    }
    
    getCountMoney = () => this.countMoney;

}