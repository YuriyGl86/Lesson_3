"use strict";

class Good {
    constructor(id, name, description, sizes, price, available){
        this.id = id;
        this.name = name;
        this.description = description;
        this.sizes = sizes;
        this.price = price;
        this.available = Boolean(available);
    }

    setAvailable(value){
        this.available = Boolean(value);
    }
}

class GoodsList {
    #goods;

    constructor(filter, sortPrice, sortDir){
        this.#goods = [];
        this.filter = filter;
        this.sortPrice = sortPrice;
        this.sortDir = sortDir;
    }

    get list(){
        let res = this.#goods.filter((good) => this.filter.test(good.name)); // возможно потеряется контекст в стрелке, проверить
        if(this.sortPrice){
            res.sort((a, b) => a.price - b.price);
            if(this.sortDir){
                res.reverse();
            }  
        }
        return res
    }

    add(good){
        this.#goods.push(good);
    }

    remove(id){
        idx = this.#goods.findIndex(good => good.id == id);
        if(idx != -1){
            let delItem = this.#goods.splice(idx,1)
            console.log(`был удален элемент c id ${delItem.id} - ${delItem.name}`)
        } else console.log('ТАкого элемента нет в каталоге')
    }
}

class BasketGood extends Good{
    constructor(good, amount){
        super(good.id, good.name, good.description, good.sizes, good.price, good.available);
        this.amount = amount;
    }
}

class Basket {
    constructor(){
        this.goods = [];
    }

    add(good, amount){
        let alreadyInBasket = false;
        for(let i=0; i<this.goods.length; i++){
            if(good.id == this.goods[i].id){
                this.goods[i].amount += amount;
                alreadyInBasket = true;
                break;
            };
        };

        if(!alreadyInBasket){
            this.goods.push(new BasketGood(good, amount));
        };
    }

    remove(good, amount){
        let idxItem = this.findIndex(item => item.id == good.id);
        let resultAmount = this.goods[idxItem].amount - amount;
        if(resultAmount > 0){
            this.goods[idxItem].amount = resultAmount;
        } else {this.goods.splice(idxItem, 1)}
    }

    clear(){
        this.goods.splice(0, this.goods.length);
    }

    removeUnavailable(){
        this.goods = this.goods.filter(good => good.available)
    }

    get totalAmount(){
        let res = this.goods.reduce((sum, current) => sum + current.amount, 0)
        return res
    }

    get totalSum(){
        let res = this.goods.reduce((sum, current) => sum + current.amount * current.price, 0)
        return res
    }

}

let good1 = new Good(1, 'штаны красные', "штаны красные обыкновенные", ['m','l','xl'], 1000, true);
let good2 = new Good(2, 'штаны синие', "штаны синие обыкновенные", ['l','xl'], 1100, true);
let good3 = new Good(3, 'штаны зеленые', "штаны зеленые обыкновенные", ['m','l','xl'], 1200, false);
let good4 = new Good(4, 'носки красные', "носки красные обыкновенные", ['l','xl'], 200, true);
let good5 = new Good(5, 'носки зеленые', "носки зеленые обыкновенные", ['m','l','xl'], 210, true);
let good6 = new Good(6, 'шапка меховая', "шапка меховая обыкновенная", ['xl'], 500, true);
let good7 = new Good(7, 'шапка вязаная', "шапка вязаная обыкновенная", ['xl'], 300, false);
console.log(good1,good2,good3,good4,good5,good6,good7)

good3.setAvailable(false)
console.log('штаны зеленые стали доступны: ', good3)



