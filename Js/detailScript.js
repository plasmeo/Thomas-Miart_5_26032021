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



const loadData = async (data) => {
    const dataFromApi = await fetch("http://localhost:3000/api/teddies/")
    const dataJson = await dataFromApi.json();
    // console.log(dataJson);
    return dataJson.map( (item)=> new ProductModel (item._id, item.imageUrl, item.name, item.price, item.colors))
}

const getID = (urlParameter) =>{
    let productID = new URLSearchParams(window.location.search);
    return productID.get(urlParameter);
} 

const buildNewDiv = (divClassName) =>{
    const newDiv = document.createElement('div');
    newDiv.classList.add(divClassName);
    return newDiv;    
}

const buildObjectTitle = (data, objectTitleClass) =>{
    const newTitle = document.createElement('h3');
    newTitle.classList.add(objectTitleClass);
    newTitle.textContent = data.title;
    return newTitle;
}

const buildObjectImg = (data, objectImgClass) =>{
    const newImg = document.createElement('img');
    newImg.classList.add(objectImgClass);
    newImg.setAttribute('src', data.picUrl);
    newImg.setAttribute('alt', 'photo01');
    newImg.style.maxWidth = "300px";
    return newImg;
}

const buildObjectPrice = (data, objectPriceClass) => {
    const newPrice = document.createElement('p');
    newPrice.classList.add(objectPriceClass);
    newPrice.textContent = data.price/100 + " " + "€";
    return newPrice;

}

const buildObjectDescription = (data, objectTextClass) => {
    const newText = document.createElement('p');
    newText.classList.add(objectTextClass);
    newText.style.textDecoration = 'underline';
    newText.textContent = data;
    //console.log(data.description);
    return newText;
}

const buildObjectDetail = (data, objectDetailClass) => {
    const newDetail = document.createElement('p');
    newDetail.classList.add(objectDetailClass);
    newDetail.textContent = data.detail;
    return newDetail;
}

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



    for (let color of data.description){
        const newObjectDescription = buildObjectDescription(color, 'ObjectDescription');
        newDiv.appendChild(newObjectDescription);
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
    }
}


const init = async () => {
    const categoryList = document.getElementById("categoryList");
    categoryList.style.display = "Flex";
    categoryList.style.justifyContent = 'space-around';

    const productID = getID("_id");
    //console.log(productID);

    const data = await loadData(productID);

    for (let product of data){
        if (product.ID == productID){
            buildObject(product, categoryList);
        }

    }
}

init();
