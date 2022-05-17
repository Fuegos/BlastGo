import { INIT_COUNT_MONEY } from '../settings/constants'

export class Player {
    constructor() {
        this.countMoney = INIT_COUNT_MONEY;
    }

    pay = (amountOfPayment) => {
        if(amountOfPayment <= this.countMoney) {
            this.countMoney -= amountOfPayment;
            return true;
        } else {
            return false;
        }
    }
    
    getCountMoney = () => this.countMoney;

}