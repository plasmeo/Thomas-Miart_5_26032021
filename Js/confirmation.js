shoppingCart = localStorage;
let orderId;
let orderedIds = [];

class ProductModel {
    constructor(objectID, picUrl, title, price, description){
        this.ID = objectID;
        this.picUrl = picUrl;
        this.title = title;
        this.price = price;
        this.description = description;
    }
}

class contact {
    constructor (firstName, lastName, address, city, email){
        this.firstName = firstName;
        this.lastName = lastName;
        this.address = address;
        this.city = city;
        this.email = email;
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
        const productInfos = await getID(itemsInCartNumber);
        const data = await loadData();

        for (let product of data){
           if (product.ID == productInfos.ID){
               sum += product.price;  
               let tempID = String(productInfos.ID)
               orderedIds.push(tempID);   
               break;
           }
        }
   }
   const categoryList = document.getElementById("infos");
   let orderText = buildInfos(sum, orderId);
   categoryList.appendChild(orderText);
   

}

const getID = async (itemInCartNumber) =>{
    let productNumber = shoppingCart.key(itemInCartNumber);
    let productDetail = shoppingCart.getItem(productNumber);
    //console.log(productDetail);
    const obj = await JSON.parse(productDetail);
    return obj;
}

const sendData = (data) => {
    fetch("http://localhost:3000/api/teddies/order", {
        method: "POST",
        body: JSON.stringify(data),
        headers:{
            'Content-Type':'application/json'
        }
    })
    .then(response => response.json())
    .then(json => {
       // console.log(json.orderId);
        orderId = json.orderId;
        shoppingCart.setItem('OrderId', JSON.stringify(json.orderId))
    })
    .catch(err => console.log('error getting response from order'));
}

const getContact = () => {
    let infos = shoppingCart.getItem('contact');
    let contactInfos = JSON.parse(infos);
    return contactInfos;
}

const init = async () => {
    await listCart();
let contactInfos = getContact();

        sendData({
            contact : contactInfos,
            products : orderedIds
        });


}

init();