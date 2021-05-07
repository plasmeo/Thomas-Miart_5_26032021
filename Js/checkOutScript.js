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

const buildNewDiv = (divClassName) =>{
    const newDiv = document.createElement('div');
    newDiv.classList.add(divClassName);
    return newDiv;    
}

const buildObjectTitle = (data, objectTitleClass) =>{
    const newTitle = document.createElement('h3');
    newTitle.classList.add(objectTitleClass);
    newTitle.textContent = data;
    newTitle.style.fontSize = '1.7rem';
    return newTitle;
}

const buildObjectDetail = (data, objectDetailClass) => {
    const newDetail = document.createElement('p');
    newDetail.classList.add(objectDetailClass);
    newDetail.textContent = data;
    newDetail.style.fontSize = '1.5rem';
    return newDetail;
}

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

const buildObject = (productInfos) => {    
    const newDiv = buildNewDiv('objet');
    newDiv.style.margin = '20px';
    const categoryList = document.getElementById("shoppingCartList");
    categoryList.appendChild(newDiv);

    const newObjectTitle = buildObjectTitle(productInfos.title, 'objectTitle');
    newDiv.appendChild(newObjectTitle);
    const newObjectDetail = buildObjectDetail(productInfos.description, 'objectDetail');
    newDiv.appendChild(newObjectDetail);

    const eraseButton = buildEraseButton(productInfos);
    newDiv.appendChild(eraseButton);

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
    return obj
} 

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


const init = () => {
    addClearButton();
    const categoryList = document.getElementById("shoppingCartList");
    categoryList.style.display = "Flex";
    categoryList.style.flexDirection = "column"
    categoryList.style.justifyContent = 'space-around';  
    listCart();

}

init();