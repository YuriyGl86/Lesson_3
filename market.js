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