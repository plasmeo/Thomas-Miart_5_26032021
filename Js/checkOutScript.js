console.log(window.localStorage);
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

const getID = (itemInCartNumber) =>{
    let productID = shoppingCart.key(itemInCartNumber);
    let productDetail = shoppingCart.getItem(productID);
    return [productID, productDetail];
} 


const loadData = async () => {
    const dataFromApi = await fetch("http://localhost:3000/api/teddies/")
    const dataJson = await dataFromApi.json();
     console.log(dataJson);
    return dataJson.map( (item)=> new ProductModel (item._id, item.imageUrl, item.name, item.price, item.colors))
}

const buildNewDiv = (divClassName) =>{
    const newDiv = document.createElement('div');
    newDiv.classList.add(divClassName);
    return newDiv;    
}

const buildObjectTitle = (data, objectTitleClass) =>{
    const newTitle = document.createElement('h3');
    newTitle.classList.add(objectTitleClass);
    newTitle.textContent = data;
    return newTitle;
}

const buildObjectDetail = (data, objectDetailClass) => {
    const newDetail = document.createElement('p');
    newDetail.classList.add(objectDetailClass);
    newDetail.textContent = data;
    return newDetail;
}

const buildObject = (data) => {    
    const newDiv = buildNewDiv('objet');
    newDiv.style.margin = '20px';
    const categoryList = document.getElementById("shoppingCartList");
    categoryList.appendChild(newDiv);

    const newObjectTitle = buildObjectTitle(data[0], 'objectTitle');
    newDiv.appendChild(newObjectTitle);

    const newObjectDetail = buildObjectDetail(data[1], 'objectDetail');
    newDiv.appendChild(newObjectDetail);
}
   

const addClearButton = () => {
    const clearBtn = document.getElementById("clearButton");
    clearBtn.addEventListener('click', function() {
        shoppingCart.clear();
    })
}

const init = async () => {
    addClearButton();
    const categoryList = document.getElementById("shoppingCartList");
    categoryList.style.display = "Flex";
    categoryList.style.flexDirection = "column"
    categoryList.style.justifyContent = 'space-around';

    for (let itemsInCartNumber = 0; itemsInCartNumber < shoppingCart.length; itemsInCartNumber++){
        const productInfos = getID(itemsInCartNumber);
        console.log(productInfos);

        // const data = await loadData();

        buildObject(productInfos);
    }

}

init();