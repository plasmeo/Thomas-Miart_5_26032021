/*
        Classe pour stocker le produit en tant qu'objet
*/

class ProductModel {
    constructor(objectID, picUrl, title, price){
        this.ID = objectID;
        this.picUrl = picUrl;
        this.title = title;
        this.price = price;    
    }
}

/*
        Charge les données de l'API et les retourne
*/

const loadData = async () => {
    const dataFromApi = await fetch("http://localhost:3000/api/teddies")
    //console.log(dataFromApi);
    const dataJson = await dataFromApi.json();
     console.log(dataJson);
    return dataJson.map( (item)=> new ProductModel (item._id, item.imageUrl, item.name, item.price))
}

/*
        Affiche les données fournies
*/
const displayDataList = (dataList) => {
    console.log(dataList);
}

/*
        Crée une balise  div avec une classe et la retourne
*/

const buildNewDiv = (divClassName) =>{
    const newDiv = document.createElement('div');
    newDiv.classList.add(divClassName);
    return newDiv;    
}

/*
        Crée une balise titre avec une classe et la retourne
*/

const buildObjectTitle = (data, objectTitleClass) =>{
    const newTitle = document.createElement('p');
    newTitle.style.textDecoration = "none";
    newTitle.classList.add(objectTitleClass);
    newTitle.style.textAlign = 'center';
    newTitle.style.fontSize = '1.2em';
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
    newImg.style.maxWidth = '250px';
    newImg.style.maxHeight = '150px';
    newImg.style.objectFit = 'cover';
    newImg.style.borderRadius = "20px";
    return newImg;
}


/*
        Crée une balise text avec une classe et la retourne
*/

const buildObjectPrice = (data, objectPriceClass) => {
    const newPrice = document.createElement('p');
    newPrice.classList.add(objectPriceClass);
    newPrice.textContent = data.price/100 + " " + "€";
    newPrice.style.marginTop = '20px';
    newPrice.style.textAlign = 'center';
    return newPrice;
}

/*
        Crée une balise a et la retourne
*/

const addLink = (Url) =>{
    const newLink = document.createElement('a');
    newLink.style.textDecoration = 'none';
    newLink.style.backgroundColor = '#fcf9fb';
    newLink.style.borderRadius = "20px";
    newLink.style.margin = '15px';
    newLink.style.color = 'black';
    newLink.setAttribute('href', Url);
    newLink.addEventListener('mouseenter', function(){
        newLink.style.backgroundColor = '#d8d8d8';
    })
    newLink.addEventListener('mouseleave', function(){
        newLink.style.backgroundColor = '#fcf9fb';
    })
    return newLink;

}

/*
        Affiche le produit en fonction des données fournies avec les fonctions du dessus et les parente à la même div
*/

const buildObject = (data, categoryList) => {    
    const newDiv = buildNewDiv('objet');
    newDiv.style.margin = '20px';

    const queryStr = data.ID;
    const usp = new URLSearchParams("_id=" + queryStr);
    //console.log(usp.toString());
    
    const newLink = addLink('./details.html?' + usp.toString());

    categoryList.appendChild(newLink);
    newLink.appendChild(newDiv);
    const newObjectTitle = buildObjectTitle(data, 'objectTitle');
    newDiv.appendChild(newObjectTitle);
    const newObjectImg = buildObjectImg(data, 'objectPicture');
    newDiv.appendChild(newObjectImg);
    const newObjectPrice = buildObjectPrice(data, 'objectPrice');
    newDiv.appendChild(newObjectPrice);
}

/*
        Gere l'appel des fonctions de la page
*/

const init = async() => {
    const categoryList = document.getElementById("categoryList");
    categoryList.style.display = "Flex";
    categoryList.style.flexWrap = "wrap";
    categoryList.style.justifyContent = 'center';

    const data = await loadData({});
    //console.log(data);
    
    for (let product of data){
        buildObject(product, categoryList);
    }


}

init();

