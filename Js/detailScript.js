
/*
        Classe pour stocker le produit en tant qu'objet
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

shoppingCart = localStorage;

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
        Récupère l'ID du produit qui doit être affiché dans l'URL et la retourne
*/

const getID = (urlParameter) =>{
    let productID = new URLSearchParams(window.location.search);
    return productID.get(urlParameter);
} 

/*
        Crée une div avec une classe et la retourne
*/

const buildNewDiv = (divClassName) =>{
    const newDiv = document.createElement('div');
    newDiv.classList.add(divClassName);
    newDiv.style.textDecoration = 'none';
    newDiv.style.backgroundColor = '#fcf9fb';
    newDiv.style.borderRadius = "20px";
    newDiv.style.margin = '15px';
    newDiv.style.color = 'black';
    newDiv.style.textAlign = 'center';
    newDiv.style.padding ="15px";
    return newDiv;    

    
}

/*
        Crée un titre avec une classe et la retourne
*/

const buildObjectTitle = (data, objectTitleClass) =>{
    const newTitle = document.createElement('p');
    newTitle.classList.add(objectTitleClass);
    newTitle.style.textAlign = 'center';
    newTitle.style.fontSize = '1.7em';
    newTitle.style.margin ="10px 0px 30px 0px";
    newTitle.textContent = data.title;
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
    newImg.style.maxWidth = '450px';
    newImg.style.maxHeight = '350px';
    newImg.style.objectFit = 'cover';
    newImg.style.borderRadius = "20px";
    return newImg;
}

/*
        Crée une balise text avec une classe et la retourne
*/

const buildObjectPrice = (data, objectPriceClass) => {
    const newPrice = document.createElement('p');
    newPrice.style.fontSize = '1.5em';
    newPrice.classList.add(objectPriceClass);
    newPrice.style.margin='15px';
    newPrice.textContent = data.price/100 + " " + "€";
    return newPrice;

}

/*
        Crée une balise text avec une classe et la retourne
*/

const buildObjectDescription = (data, objectTextClass) => {
    const newText = document.createElement('p');
    newText.classList.add(objectTextClass);
    newText.style.textDecoration = 'underline';
    newText.textContent = data;
    newText.style.cursor= "pointer";
    //console.log(data.description);
    return newText;
}

/*
        Fonctions gérant le dropdown : création des items, du menu et du dropdown
*/

const buildVariationLinks = (data, objectTextClass) => {
    const newText = document.createElement('a');
    newText.classList.add(objectTextClass);
    newText.textContent = data;
    newText.style.fontSize = '1.2em';
    newText.setAttribute('href', '#');
    //console.log(data.description);
    return newText;
}

const builddropDownMenu = () => {
    const newDiv = document.createElement('div');
    newDiv.classList.add("dropdown-menu");  
    newDiv.style.position='relative';
    newDiv.style.textAlign='center';
    return newDiv;
}

const builddropDown = () => {
    const newDiv = document.createElement('div');
    newDiv.classList.add("dropdown");  
    newDiv.style.fontSize = '1.2em';
    return newDiv;
}

/*
        Crée une balise text avec une classe et la retourne
*/

const buildObjectDetail = (data, objectDetailClass) => {
    const newDetail = document.createElement('p');
    newDetail.classList.add(objectDetailClass);
    newDetail.textContent = data.detail;
    return newDetail;
}

const buildObjectColors = (data, objectDetailClass) => {
    const newDetail = document.createElement('button');
    newDetail.classList.add(objectDetailClass);
    newDetail.textContent = data;
    return newDetail;
}

/*
        Affiche le produit en fonction des données fournies avec les fonctions du dessus et les parente à la même div
        Rajoute un menu déroulant afin d'afficher les différentes variété du même produit
*/
const buildObject = (data) => {    
    const newDiv = buildNewDiv('objet');
    newDiv.style.margin = '20px';
    const categoryList = document.getElementById("categoryList");
    categoryList.appendChild(newDiv);

    const newObjectTitle = buildObjectTitle(data, 'objectTitle');
    newDiv.appendChild(newObjectTitle);
    const newObjectImg = buildObjectImg(data, 'objectPicture');
    newDiv.appendChild(newObjectImg);
    const newObjectPrice = buildObjectPrice(data, 'objectPrice');
    newDiv.appendChild(newObjectPrice);
   // const newdropDrow = buildObjectDescription('Colors', 'dropDown');
    //newDiv.appendChild(newdropDrow);
    const newdropDrow = builddropDown();
    newDiv.appendChild(newdropDrow);
    const colors = buildObjectColors("Colors", "dropdown-toggle")
    newdropDrow.appendChild(colors);
    const dropDownMenu = builddropDownMenu();
    newdropDrow.appendChild(dropDownMenu);
    colors.addEventListener('click', function() {
        if (dropDownMenu.style.display == 'block'){
            dropDownMenu.style.display="none";
        } else {
            dropDownMenu.style.display="block";
        }

    })

    for (let color of data.description){
        const newObjectDescription = buildVariationLinks(color, 'dropdown-item');
        dropDownMenu.appendChild(newObjectDescription);
        newObjectDescription.addEventListener('click', function() {
            let itemNumberInCart = shoppingCart.length;
            let objectToPass = new ProductModel (data.ID, data.picUrl, data.title, data.price, color);
            /*if (shoppingCart.length == 0){
                shoppingCart.setItem("Item number " +itemNumberInCart, JSON.stringify(objectToPass));  
                             
            } else {
                itemNumberInCart == shoppingCart.length;
                shoppingCart.setItem("Item number " +itemNumberInCart, JSON.stringify(objectToPass));   
            }*/
            itemNumberInCart == shoppingCart.length;
            shoppingCart.setItem("Item number " +itemNumberInCart, JSON.stringify(objectToPass));  
            itemNumberInCart ++;
        })
    }

   /* for (let color of data.description){
        const newObjectDescription = buildObjectDescription(color, 'ObjectDescription');
        newObjectDescription.style.display = "none";
        newdropDrow.appendChild(newObjectDescription);
        newObjectDescription.addEventListener('click', function() {
            let itemNumberInCart = shoppingCart.length;
            let objectToPass = new ProductModel (data.ID, data.picUrl, data.title, data.price, color);
            if (shoppingCart.length == 0){
                shoppingCart.setItem("Item number " +itemNumberInCart, JSON.stringify(objectToPass));  
                             
            } else {
                itemNumberInCart == shoppingCart.length;
                shoppingCart.setItem("Item number " +itemNumberInCart, JSON.stringify(objectToPass));   
            }
            itemNumberInCart ++;
        })
    }*/
}

/*
        Gere l'appel des fonctions de la page
*/

const init = async () => {
    const categoryList = document.getElementById("categoryList");
    categoryList.style.display = "Flex";
    categoryList.style.justifyContent = 'space-around';

    const productID = getID("_id");
    //console.log(productID);

    const data = await loadData();

    for (let product of data){
        if (product.ID == productID){
            buildObject(product, categoryList);
        }

    }
}

init();
