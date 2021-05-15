//console.log(window.localStorage);
shoppingCart = localStorage;

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
        Classe les données depuis l'API
*/

const loadData = async () => {
    const dataFromApi = await fetch("http://localhost:3000/api/teddies/")
    const dataJson = await dataFromApi.json();
    // console.log(dataJson);
    return dataJson.map( (item)=> new ProductModel (item._id, item.imageUrl, item.name, item.price, item.colors))
}

/*
        Crée une balise div avec une classe et la retourne
*/

const buildNewDiv = (divClassName) =>{
    const newDiv = document.createElement('div');
    newDiv.style.backgroundColor= 'white';
    newDiv.style.padding = '10px';
    newDiv.classList.add(divClassName);
    return newDiv;    
}

/*
        Crée une balise titre avec une classe et la retourne
*/

const buildObjectTitle = (data, objectTitleClass) =>{
    const newTitle = document.createElement('p');
    newTitle.classList.add(objectTitleClass);
    newTitle.textContent = "Produit : " + data;
    newTitle.style.fontSize = '1.7rem';
    return newTitle;
}

/*
        Crée une balise image avec une classe et la retourne
*/

const buildObjectImg = (data, objectImgClass) =>{
    const newImg = document.createElement('img');
    newImg.classList.add(objectImgClass);
    newImg.setAttribute('src', data.picUrl);
    newImg.setAttribute('alt', 'photo01');
    newImg.style.maxWidth = '100px';
    newImg.style.maxHeight = '100px';
    newImg.style.objectFit = 'cover';
    newImg.style.borderRadius = "10px";
    return newImg;
}

/*
        Crée une balise text avec une classe et la retourne
*/

const buildObjectDetail = (data, objectDetailClass) => {
    const newDetail = document.createElement('p');
    newDetail.classList.add(objectDetailClass);
    newDetail.textContent = "Couleur : " + data;
    newDetail.style.fontSize = '1.5rem';
    return newDetail;
}

/*
        Crée un bouton qui permet d'effacer l'item du localstorage auquel le bouton est parenté
*/

const buildEraseButton = (productInfos) => {
    const newEraseButton = document.createElement('a');
    newEraseButton.classList.add('eraseButton');
    newEraseButton.textContent = 'Supprimer';
    newEraseButton.style.textDecoration = 'underline';
    newEraseButton.href="javascript:window.location.reload(true)"

    newEraseButton.addEventListener('click', function() {
        console.log(productInfos.ID + ' de couleur ' + productInfos.description + ' Supprimé')

        for (let itemInCartNumber = 0; itemInCartNumber < shoppingCart.length; itemInCartNumber++){
            let productNumber = shoppingCart.key(itemInCartNumber);
            let productDetail = shoppingCart.getItem(productNumber);
            const product = JSON.parse(productDetail);

            if (product.ID = productInfos.ID && product.description == productInfos.description)
            {
                //console.log(productNumber);
                shoppingCart.removeItem(productNumber);
            }
        }
    })

    return newEraseButton;
    
}

/*
        Affiche l'objet dont les infos sont passées.
        Appelle les fonctions correspondantes
*/

const buildObject = (productInfos) => {    
    const newDiv = buildNewDiv('objet');
    newDiv.style.margin = '20px';
    const categoryList = document.getElementById("shoppingCartList");
    categoryList.appendChild(newDiv);

    const infoDiv = buildNewDiv('infoDiv');
    newDiv.appendChild(infoDiv);
    infoDiv.style.display = 'Flex';

    const newObjectImg = buildObjectImg(productInfos, 'objectImg');
    infoDiv.appendChild(newObjectImg);

    const infoDiv2 = buildNewDiv('infoDiv2');
    infoDiv.appendChild(infoDiv2);

    const newObjectTitle = buildObjectTitle(productInfos.title, 'objectTitle');
    infoDiv2.appendChild(newObjectTitle);
    const newObjectDetail = buildObjectDetail(productInfos.description, 'objectDetail');
    infoDiv2.appendChild(newObjectDetail);

    const eraseButton = buildEraseButton(productInfos);
    newDiv.appendChild(eraseButton);

}
   
/*
        Crée un bouton qui permet d'effacer tout le panier
*/

const addClearButton = () => {
    const clearBtn = document.getElementById("clearButton");
    clearBtn.addEventListener('click', function() {
        shoppingCart.clear();
    })
}

/*
        retourne un objet à partir de l'index grâce à la variable passée
*/

const getID = (itemInCartNumber) =>{
    let productNumber = shoppingCart.key(itemInCartNumber);
    let productDetail = shoppingCart.getItem(productNumber);
    const obj = JSON.parse(productDetail);
    return obj
} 

/*
        cycle dans le panier et appelle buildObject une fois qu'on a vérifié que l'item est bien un item produit
*/

const listCart = async () => {
    const data = await loadData();
    for (let itemsInCartNumber = 0; itemsInCartNumber < shoppingCart.length; itemsInCartNumber++){
        const productInfos = getID(itemsInCartNumber);


         for (let product of data){
            if (product.ID == productInfos.ID){
                buildObject(productInfos);
            }
    
        }
    }
}

/*
        Stock les variables de contact dans un objet puis le passe au localstorage
*/

const validate = () => {
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const address = document.getElementById('address');
    const city = document.getElementById('city');
    const email = document.getElementById('email');
        let buyerContacts = new contact (firstName.value, lastName.value, address.value, city.value, email.value);
        shoppingCart.setItem("contact", JSON.stringify(buyerContacts));
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
        console.log(json.orderId);
        shoppingCart.setItem('OrderId', json.orderId)
    })
    .catch(err => console.log('error getting response from order'));
}

/*
        Gère les fonctions de la page
*/

const init = () => {
    addClearButton();
    const categoryList = document.getElementById("shoppingCartList");
    categoryList.style.display = "Flex";
    categoryList.style.flexDirection = "column";
    categoryList.style.justifyContent = 'space-around';  
    listCart();

}

init();