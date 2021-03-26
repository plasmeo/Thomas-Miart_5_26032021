class fakeData {
    constructor(objectID, picUrl, title, price, description, productType){
        this.ID = objectID;
        this.picUrl = picUrl;
        this.title = title;
        this.price = price;
        this.description = description;

        switch (productType) {
            case 'camera':
                this.detail = 'lentilles';
              break;
            case 'peluche':
                this.detail = 'couleurs';
                break;
            case 'meuble':
                this.detail = 'vernis';
              break;

          }
    }
}
let newData = new fakeData ("00001", "./Assets/Pics/oak_1.jpg", "Premier Objet", "35.00", 'ceci est une table', 'meuble');
let newData02 = new fakeData ("00002", "./Assets/Pics/teddy_1.jpg", "Second Objet", "15.00", 'ceci est un ourson en peluche', 'peluche');
let newData03 = new fakeData ("00003", "./Assets/Pics/vcam_1.jpg", "Troisième Objet", "70.00", 'ceci est un appareil photo', 'camera');

const itemsArray = [newData, newData02, newData03];

const loadData = (data) => {
    return[
        data.ID,
        data.picUrl,
        data.title,
        data.price,
    ]
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
    newPrice.textContent = data.price + " " + "€";
    return newPrice;

}

const buildObjectDescription = (data, objectTextClass) => {
    const newText = document.createElement('p');
    newText.classList.add(objectTextClass);
    newText.textContent = data.description;
    return newText;
}

const addLink = (Url) =>{
    const newLink = document.createElement('a');
    newLink.setAttribute('href', Url);
    return newLink;

}

const buildObject = (data, categoryList) => {    
    const newDiv = buildNewDiv('objet');
    newDiv.style.margin = '20px';

    const queryStr = data;
    const usp = new URLSearchParams(queryStr);
    console.log(usp.toString());
    
    const newLink = addLink('./details.html?' + usp.toString());

    categoryList.appendChild(newLink);
    newLink.appendChild(newDiv);
    const newObjectTitle = buildObjectTitle(data, 'objectTitle');
    newDiv.appendChild(newObjectTitle);
    const newObjectImg = buildObjectImg(data, 'objectPicture');
    newDiv.appendChild(newObjectImg);
    const newObjectPrice = buildObjectPrice(data, 'objectPrice');
    newDiv.appendChild(newObjectPrice);
    const newObjectDescription = buildObjectDescription(data, 'ObjectDescription');
    newDiv.appendChild(newObjectDescription);
}


const init = () => {
    const categoryList = document.getElementById("categoryList");
    categoryList.style.display = "Flex";
    categoryList.style.justifyContent = 'space-around';

    buildObject(itemsArray[0], categoryList);
    buildObject(itemsArray[1], categoryList);
    buildObject(itemsArray[2], categoryList);

}

init();

