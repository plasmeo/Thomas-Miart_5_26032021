class ProductModel {
    constructor(objectID, picUrl, title, price, description, productType){
        this.ID = objectID;
        this.picUrl = picUrl;
        this.title = title;
        this.price = price;    
    }
}


const loadData = async (data) => {
    const dataFromApi = await fetch("http://localhost:3000/api/teddies")
    //console.log(dataFromApi);
    const dataJson = await dataFromApi.json();
     console.log(dataJson);




    return dataJson.map( (item)=> new ProductModel (item._id, item.imageUrl, item.name, item.price))
}

const displayDataList = (dataList) => {
    console.log(dataList);
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

const addLink = (Url) =>{
    const newLink = document.createElement('a');
    newLink.setAttribute('href', Url);
    return newLink;

}

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


const init = async() => {
    const categoryList = document.getElementById("categoryList");
    categoryList.style.display = "Flex";
    categoryList.style.justifyContent = 'space-around';

    const data = await loadData({});
    //console.log(data);
    
    for (let product of data){
        buildObject(product, categoryList);
    }


}

init();

