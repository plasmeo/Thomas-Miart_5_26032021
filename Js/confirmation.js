shoppingCart = localStorage;
let orderId;
let orderedIds = [];

/*
        Classe pour stocker le produit en tant qu'objet
        Stock également la variation selectionnée
*/

class ProductModel {
    constructor(objectID, picUrl, title, price, description){
        this.ID = objectID;
        this.picUrl = picUrl;
        this.title = title;
        this.price = price;
        this.description = description;
    }
}

/*
        Classe pour stocker les infos de contact
*/

class contact {
    constructor (firstName, lastName, address, city, email){
        this.firstName = firstName;
        this.lastName = lastName;
        this.address = address;
        this.city = city;
        this.email = email;
    }
}

/*
        Charge les données depuis l'API et les retourne
*/

const loadData = async () => {
    const dataFromApi = await fetch("http://localhost:3000/api/teddies/")
    const dataJson = await dataFromApi.json();
    // console.log(dataJson);
    return dataJson.map( (item)=> new ProductModel (item._id, item.imageUrl, item.name, item.price, item.colors))
}

/*
        Crée une balise titre pour le texte de commande ou l'absence de commande et retourne la balise.
*/

const buildInfos = (price, orderNumber) =>{
    const newInfo = document.createElement('p');
    newInfo.style.fontSize= '1.2em';
    newInfo.style.margin='20px';
    if (orderedIds.length > 0){
        newInfo.textContent = 'Votre commande numéro ' + orderNumber + ' au prix de ' + price/100 + '€ a bien été enregistrée';  
    } else{
        newInfo.textContent = 'Le panier est vide';
    }

    return newInfo;
}

/*
        Cycle dans les produits stockés en local pour en faire la somme et stocker les ID dans un tableau orderedIds puis retourne la somme
*/

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
return sum
}

/*
        Retourne l'item stocké en local en fonction de l'index fourni
*/

const getID = async (itemInCartNumber) =>{
    let productNumber = shoppingCart.key(itemInCartNumber);
    let productDetail = shoppingCart.getItem(productNumber);
    //console.log(productDetail);
    const obj = await JSON.parse(productDetail);
    return obj;
}

/*
        Envoi les données à l'API et retourne ce qui est renvoyé
*/

const sendData = async (data) => {
    return fetch("http://localhost:3000/api/teddies/order", {
        method: "POST",
        body: JSON.stringify(data),
        headers:{
            'Content-Type':'application/json'
        }
    })
    .then(response => response.json())
    .then(json => {
        console.log(json.orderId);
        orderId = json.orderId;
        shoppingCart.setItem('OrderId', JSON.stringify(json.orderId))
    })
    .catch(err => console.log('error getting response from order'));
}

/*
        Récupère les infos de contact du localstorage
*/

const getContact = () => {
    let infos = shoppingCart.getItem('contact');
    let contactInfos = JSON.parse(infos);
    return contactInfos;
}

/*
        Gère les fonctions de la page
*/

const init = async () => {

let contactInfos = getContact();

const sum = await listCart();  
        await sendData({
            contact : contactInfos,
            products : orderedIds
        });
        shoppingCart.clear();
        const categoryList = document.getElementById("infos");
        let orderText = buildInfos(sum, orderId);
        categoryList.appendChild(orderText);
        console.log(JSON.stringify(orderedIds));
}

init();