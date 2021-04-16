shoppingCart = localStorage;


class ProductModel {
    constructor(objectID, picUrl, title, price, description){
        this.ID = objectID;
        this.picUrl = picUrl;
        this.title = title;
        this.price = price;
        this.description = description;
    }
}

const loadData = async () => {
    const dataFromApi = await fetch("http://localhost:3000/api/teddies/")
    const dataJson = await dataFromApi.json();
    // console.log(dataJson);
    return dataJson.map( (item)=> new ProductModel (item._id, item.imageUrl, item.name, item.price, item.colors))
}

const buildInfos = (price, orderNumber) =>{
    const newInfo = document.createElement('h3');
    newInfo.textContent = 'Votre commande numéro ' + orderNumber + ' au prix de ' + price/100 + '€ a bien été enregistrée';
    return newInfo;
}

const listCart = async () => {
    let sum = 0;
    for (let itemsInCartNumber = 0; itemsInCartNumber < shoppingCart.length; itemsInCartNumber++){
        const productInfos = getID(itemsInCartNumber);
        const data = await loadData();

        for (let product of data){
           if (product.ID == productInfos.ID){
               sum += product.price;               
           }
   
       }
   }
   const categoryList = document.getElementById("infos");
   let orderText = buildInfos(sum, 01);
   categoryList.appendChild(orderText);
   

}

const getID = (itemInCartNumber) =>{
    let productNumber = shoppingCart.key(itemInCartNumber);
    let productDetail = shoppingCart.getItem(productNumber);
    const obj = JSON.parse(productDetail);
    return obj;
}


const init = async() => {
    listCart();
}

init();