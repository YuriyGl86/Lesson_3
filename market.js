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
        let res = this.#goods.filter((good) => this.filter.test(good.name));
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
        let idx = this.#goods.findIndex(good => good.id == id);
        if(idx != -1){
            let delItem = this.#goods.splice(idx,1)
            console.log(`был удален элемент c id ${delItem[0].id} - ${delItem[0].name}`)
        } else console.log('ТАкого элемента нет в каталоге')
    }
}

class BasketGood extends Good{
    constructor(good){
        super(good.id, good.name, good.description, good.sizes, good.price, good.available);
        this.amount = 0;
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
            let newBasketGood = new BasketGood(good);
            newBasketGood.amount = amount;
            this.goods.push(newBasketGood);
        };
    }

    remove(good, amount){
        let idxItem = this.goods.findIndex(item => item.id == good.id);
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

let good1 = new Good(1, 'штаны красные', "штаны красные обыкновенные", ['m','l','xl'], 1300, true);
let good2 = new Good(2, 'штаны синие', "штаны синие обыкновенные", ['l','xl'], 1100, true);
let good3 = new Good(3, 'штаны зеленые', "штаны зеленые обыкновенные", ['m','l','xl'], 1200, false);
let good4 = new Good(4, 'носки красные', "носки красные обыкновенные", ['l','xl'], 200, true);
let good5 = new Good(5, 'носки зеленые', "носки зеленые обыкновенные", ['m','l','xl'], 210, true);
let good6 = new Good(6, 'шапка меховая', "шапка меховая обыкновенная", ['xl'], 500, true);
let good7 = new Good(7, 'шапка вязаная', "шапка вязаная обыкновенная", ['xl'], 300, false);

good3.setAvailable(true)
good4.setAvailable(false)

let catalog = new GoodsList(/штаны\w*/, true, false)
catalog.add(good1)
catalog.add(good2)
catalog.add(good3)
catalog.add(good4)
catalog.add(good5)
catalog.add(good6)
catalog.add(good7)

catalog.remove(5)
catalog.list


console.log("фильтруем каталог по слову 'штаны' и сортируем по цене:")
console.log(catalog.list)
console.log("______фильтруем по 'красные' и обратная сортировка по цене_____________")
catalog.filter = /\w*красные\w*/
catalog.sortDir = true
console.log(catalog.list)

let basket = new Basket()
basket.add(new BasketGood(good1), 2)
basket.add(new BasketGood(good2), 1)
basket.add(new BasketGood(good4), 4)  // недоступный товар
basket.add(new BasketGood(good7), 3)
basket.add(new BasketGood(good2), 1)  // товар который уже есть, увеличивается amount

console.log("Добавили товары в корзину:")
console.log(basket.totalAmount)
console.log(basket.totalSum)

basket.remove(good7, 3)  // удаляем полностью
basket.remove(good1, 1)  // удаляем не полностью

console.log("После удаления товаров из корзины:")
console.log(basket.totalAmount)
console.log(basket.totalSum)

basket.removeUnavailable()
console.log("После удаления недоступных товаров:")
console.log(basket.totalAmount)
console.log(basket.totalSum)


basket.clear()

console.log("После очистки корзины:")
console.log(basket.totalAmount)
console.log(basket.totalSum)