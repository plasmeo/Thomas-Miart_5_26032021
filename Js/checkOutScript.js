//console.log(window.localStorage);
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

class contact {
    constructor (firstName, lastName, adress, city, email){
        this.firstName = firstName;
        this.lastName = lastName;
        this.adress = adress;
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

const buildObject = (productInfos) => {    
    const newDiv = buildNewDiv('objet');
    newDiv.style.margin = '20px';
    const categoryList = document.getElementById("shoppingCartList");
    categoryList.appendChild(newDiv);

    const newObjectTitle = buildObjectTitle(productInfos.title, 'objectTitle');
    newDiv.appendChild(newObjectTitle);
    const newObjectDetail = buildObjectDetail(productInfos.description, 'objectDetail');
    newDiv.appendChild(newObjectDetail);
}
   

const addClearButton = () => {
    const clearBtn = document.getElementById("clearButton");
    clearBtn.addEventListener('click', function() {
        shoppingCart.clear();
    })
}

const getID = (itemInCartNumber) =>{
    let productNumber = shoppingCart.key(itemInCartNumber);
    let productDetail = shoppingCart.getItem(productNumber);
    const obj = JSON.parse(productDetail);
    return obj;
} 

const listCart = async (categoryList) => {
    for (let itemsInCartNumber = 0; itemsInCartNumber < shoppingCart.length; itemsInCartNumber++){
        const productInfos = getID(itemsInCartNumber);
         const data = await loadData();

         for (let product of data){
            if (product.ID == productInfos.ID){
                buildObject(productInfos, categoryList);
            }
    
        }
    }
}

const validate = () => {
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const adress = document.getElementById('adress');
    const city = document.getElementById('city');
    const email = document.getElementById('email');
   // const validateButton = document.getElementById('validation');
        let buyerContacts = new contact (firstName.value, lastName.value, adress.value, city.value, email.value);
        console.log(buyerContacts);
        shoppingCart.setItem("Buyer contact", JSON.stringify(buyerContacts));



}

const init = async() => {
    addClearButton();
    const categoryList = document.getElementById("shoppingCartList");
    categoryList.style.display = "Flex";
    categoryList.style.flexDirection = "column"
    categoryList.style.justifyContent = 'space-around';  
    listCart(categoryList);

}

init();