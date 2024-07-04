import {gridNavigator} from './script.js';
import { ethers } from 'https://cdn.jsdelivr.net/npm/ethers@5.0.8/dist/ethers.esm.min.js'; 
//import pako from 'pako';

const myWebDomain = 'http://localhost:27015/'; 
var msgCount = 0; 
const WEIFACTOR = 0.001;
const RoysWallet = '0x5cdad7876270364242ade65e8e84655b53398b76';
const socket = io();
const iconHeaderWidth = '11.4vh';
const acceptableCoinsSelection = ['ether'];
let paintingChunks = [];
let totalChunks = 0;

var submitButtonIsClicked = false;
var currentlyPrinted = false;
var gridPageNumber = 1;
var changeUserNamePopUpExist = false;
var currentlyTryingToBuy = false;
var isSocketPresent = false;
var clientCanSendAIfetchRequest = true;

let EmailformData  = {
    email: "",
    address: "",
    firstName: "",
    lastName: ""
};

var etcPriceInUSD = '333.50';
var shibaInuPriceInUSD = '333.50';
var polygonPriceInUSD = '333.50';

export async function painting_section_click(parentElement) {
    console.log("Painting section clicked!"); 
    if(currentPaintingArray.length != 0){
        console.log('already did fetch request should have access to data no need to push again');
    }else {
        console.log('First time calling fecth');
        const loadingAnimation = document.createElement('div');
        loadingAnimation.textContent = 'Loading...'; 
        loadingAnimation.style.position = 'absolute';
        loadingAnimation.style.top = '0';
        loadingAnimation.style.left = '0';
        loadingAnimation.className = "loadingPopUp";
        document.body.appendChild(loadingAnimation);

        try {
            const response = await fetch('/getALL-paintings', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const compressedPaintingArray = await response.json();            
                if (compressedPaintingArray.success == false) {
                    console.log('did not get back array maybe it had hard time sending');
                }else{
                    for (let i = 0; i < compressedPaintingArray.length; i++) {
                        currentPaintingArray.push(compressedPaintingArray[i]);
                    }
                        try {
                            const purchaseResponse = await fetch('/getALL-purchases', {
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            });
                            if (purchaseResponse.ok) {
                                const compressedPurchaseArray = await purchaseResponse.json();            
                                if (compressedPaintingArray.success == false) {
                                    console.log('server sent back an error');
                                    alert('There was an unexpected error please refresh and check your internet connection');
                                }else{
                                    for (let i = 0; i < compressedPurchaseArray.length; i++) {
                                        currentPurchaseArray.push(compressedPurchaseArray[i]);
                                    }

                                    document.body.removeChild(loadingAnimation);
                                    shiftOffScreen(gridNavigator);
                                    
                                }
                            } else {
                                console.error('Failed to fetch purhcases:', response.statusText);
                                document.body.removeChild(loadingAnimation);
                            }
                        } catch (error) {
                            console.error('Error fetching paintings:', error);
                            document.body.removeChild(loadingAnimation);
                        }
                    }

                    
            } else {
                console.error('Failed to fetch paintings the response we not okay', response.statusText);
                // Hide the loading animation if there's an error
                document.body.removeChild(loadingAnimation);
            }
        } catch (error) {
            console.error('Error fetching paintings:', error);
            document.body.removeChild(loadingAnimation);
        }
    }
    
}

export async function addPaintingElementListener(paintingElement) {
    paintingElement.addEventListener('click',  function() { 
            if(!paintingClicked){
                paintingClicked = true;
                painting_section_click(paintingElement)
                  .then(() => {
                    setTimeout(async () => { 
                        if(window.innerWidth >= 1301 ){
                            sideElementsWidthPercent = '15%'; 
                            GridWidth = '65%';
                            gridItemWidth = '100%';
                            rowWidth = '10%';

                            if(currentPaintingArray.length >= 24){
                                makePaintingPage(currentPaintingArray.slice(0,24), currentPurchaseArray,  document.body, 4, sideElementsWidthPercent, GridWidth, gridItemWidth);
                            }else{
                                 makePaintingPage(currentPaintingArray, currentPurchaseArray,  document.body, 4, sideElementsWidthPercent, GridWidth, gridItemWidth);
                            }
                          
                            var paintingGrid = document.querySelector('.NewGrid');
                            paintingGrid.style.left = '18%';
                            
                        }else if(window.innerWidth <= 1300 && window.innerWidth >= 998 ){
                            sideElementsWidthPercent = '15%'; 
                            GridWidth = '65%';
                            gridItemWidth = '100%';
                            rowWidth = '10%';

                            if(currentPaintingArray.length >= 24){
                                makePaintingPage(currentPaintingArray.slice(0,24), currentPurchaseArray,  document.body, 4, sideElementsWidthPercent, GridWidth, gridItemWidth);
                            }else{
                                 makePaintingPage(currentPaintingArray, currentPurchaseArray,  document.body, 4, sideElementsWidthPercent, GridWidth, gridItemWidth);
                            }

                            
                            var paintingGrid = document.querySelector('.NewGrid');
                            const addToDBButton = document.querySelector('.add-to-DB');
                            const deleteToDBButton = document.querySelector('.minus-to-DB');
                            const backButtonContainer = document.querySelector('.backButtonContainer');
                            const commissionContainer = document.querySelector('.commissionContainer');
                            const AIbuttonContainer = document.querySelector('.AIbuttonContainer');
                            const gridFowardContainer = document.querySelector('.gridFowardContainer');
                            const gridBackContainer = document.querySelector('.gridBackContainer');
                            const headerTextContainer = document.querySelector('.headerTextContainer');


                            const ptagDescriptions = document.querySelectorAll('.descriptionPaintingPTAG');

                            ptagDescriptions.forEach(itemDescription => {
                                itemDescription.style.fontSize = '1.6vh';
                            });

                            
                            const purchasesInfoContainer = document.querySelector('.infoContainer');

                            if(purchasesInfoContainer){
                                purchasesInfoContainer.style.fontSize = '1.5vh';
                                purchasesInfoContainer.style.marginTop = '0vh';   
                            }


                            const dateNodes = document.querySelectorAll('.dateNode');
                            dateNodes.forEach(dateNode => {
                                dateNode.style.fontSize = '1.3vh'; 
                            });


                            const dpurchasesfirstNameDivs = document.querySelectorAll('.purchasesfirstNameDiv');
                            dpurchasesfirstNameDivs.forEach(dpurchasesfirstNameDiv => {
                                dpurchasesfirstNameDiv.style.fontSize = '1.3vh'; 
                            });

                            const dppurchasesPriceDivs = document.querySelectorAll('.purchasesPriceDiv');
                            dppurchasesPriceDivs.forEach(dppurchasesPriceDiv => {
                                dppurchasesPriceDiv.style.fontSize = '1.3vh'; 
                            });

                            

                            if(addToDBButton && deleteToDBButton){
                                addToDBButton.remove();
                                deleteToDBButton.remove();  
                            }else{
                                // dont do anything
                            }
                            paintingGrid.style.left = '18%';
                            backButtonContainer.style.left = '47.5%';
                            backButtonContainer.style.width = '6vh';
                            commissionContainer.style.left = '54.8%';
                            commissionContainer.style.width = '6vh';
                            AIbuttonContainer.style.left = '60.8%';
                            AIbuttonContainer.style.width = '6vh';
                            gridFowardContainer.style.left = '40%';
                            gridFowardContainer.style.width = '6vh';
                            gridBackContainer.style.left = '32.5%';
                            gridBackContainer.style.width = '6vh';

                            if(addToDBButton && deleteToDBButton){
                               addToDBButton.remove();
                                deleteToDBButton.remove(); 
                            }else{

                            }
                            
                            const searchBar = document.querySelector('.search-container');
                            
                            if(searchBar){
                              searchBar.remove();  
                            }
                            

                        }else if(window.innerWidth <= 998 && window.innerWidth >= 610 ){
                            GridWidth = '52%';
                            gridItemWidth = '95%';
                            sideElementsWidthPercent = '20%'; 
                            rowWidth = '33%';

                            if(currentPaintingArray.length >= 24){
                                makePaintingPage(currentPaintingArray.slice(0,24), currentPurchaseArray,  document.body, 3, sideElementsWidthPercent, GridWidth, gridItemWidth);
                            }else{
                                 makePaintingPage(currentPaintingArray, currentPurchaseArray,  document.body, 3, sideElementsWidthPercent, GridWidth, gridItemWidth);
                            }

                            var paintingGrid = document.querySelector('.NewGrid');
                            paintingGrid.style.left = '24.2%';

                            const searchBar = document.querySelector('.search-container');
                            const addToDBButton = document.querySelector('.add-to-DB');
                            const deleteToDBButton = document.querySelector('.minus-to-DB');
                            const headerTextContainer = document.querySelector('.headerTextContainer');
                            const backButtonContainer = document.querySelector('.backButtonContainer');
                            const commissionContainer = document.querySelector('.commissionContainer');
                            const AIbuttonContainer = document.querySelector('.AIbuttonContainer');
                            const gridFowardContainer = document.querySelector('.gridFowardContainer');
                            const gridBackContainer = document.querySelector('.gridBackContainer');

                            const ptagDescriptions = document.querySelectorAll('.descriptionPaintingPTAG');

                            ptagDescriptions.forEach(itemDescription => {
                                itemDescription.style.fontSize = '1.5vh';
                            });

                            const purchasesInfoContainer = document.querySelector('.infoContainer');
                            //purchasesInfoContainer.style.fontSize = '1.5vh';
                            if(purchasesInfoContainer){
                                purchasesInfoContainer.style.marginTop = '0vh';
                            }
                            
                            const dateNodes = document.querySelectorAll('.dateNode');

                            dateNodes.forEach(dateNode => {
                                dateNode.style.fontSize = '1.1vh'; 
                            });


                            const dpurchasesfirstNameDivs = document.querySelectorAll('.purchasesfirstNameDiv');

                            dpurchasesfirstNameDivs.forEach(dpurchasesfirstNameDiv => {
                                dpurchasesfirstNameDiv.style.fontSize = '1.1vh'; 
                            });

                            const dppurchasesPriceDivs = document.querySelectorAll('.purchasesPriceDiv');

                            dppurchasesPriceDivs.forEach(dppurchasesPriceDiv => {
                                dppurchasesPriceDiv.style.fontSize = '1.1vh'; 
                            });

                            if(purchasesInfoContainer){
                                purchasesInfoContainer.style.marginTop = '1.1vh';
                            }


                            headerTextContainer.style.width = '38%';
                            backButtonContainer.style.left = '44.5%';
                            backButtonContainer.style.width = '6vh';
                            commissionContainer.style.left = '52.8%';
                            commissionContainer.style.width = '6vh';
                            AIbuttonContainer.style.left = '60.8%';
                            AIbuttonContainer.style.width = '6vh';
                            gridFowardContainer.style.left = '36%';
                            gridFowardContainer.style.width = '6vh';
                            gridBackContainer.style.left = '27%';
                            gridBackContainer.style.width = '6vh';

                            if(addToDBButton && deleteToDBButton){
                                addToDBButton.remove();
                                deleteToDBButton.remove();  
                            }
                            searchBar.remove();

                            var listItems = document.getElementsByTagName('li');
                            var listH3Items = document.getElementsByTagName('li');

                            for (var i = 0; i < listItems.length; i++) {
                               listItems[i].style.fontSize = '2.2vh'; 
                            }

                            for (var i = 0; i < listH3Items.length; i++) {
                                listItems[i].style.fontSize = '2.2vh'; 
                            }

                        }else if(window.innerWidth <= 609 && window.innerWidth >= 500){
                            sideElementsWidthPercent = '24%'; 
                            GridWidth = '45%';
                            gridItemWidth = '100%';
                            rowWidth = '50%';

                            if(currentPaintingArray.length >= 24){
                                makePaintingPage(currentPaintingArray.slice(0,24), currentPurchaseArray,  document.body, 2, sideElementsWidthPercent, GridWidth, gridItemWidth);
                            }else{
                                 makePaintingPage(currentPaintingArray, currentPurchaseArray,  document.body, 2, sideElementsWidthPercent, GridWidth, gridItemWidth);
                            }

                            var paintingGrid = document.querySelector('.NewGrid');
                            const searchBar = document.querySelector('.search-container');
                            const addToDBButton = document.querySelector('.add-to-DB');
                            const deleteToDBButton = document.querySelector('.minus-to-DB');

                            const backButtonContainer = document.querySelector('.backButtonContainer');
                            const commissionContainer = document.querySelector('.commissionContainer');
                            const AIbuttonContainer = document.querySelector('.AIbuttonContainer');
                            const gridFowardContainer = document.querySelector('.gridFowardContainer');
                            const gridBackContainer = document.querySelector('.gridBackContainer');
                            const headerTextContainer = document.querySelector('.headerTextContainer');
                            const purchasesInfoContainer = document.querySelector('.infoContainer');

                            const ptagDescriptions = document.querySelectorAll('.descriptionPaintingPTAG');

                            ptagDescriptions.forEach(itemDescription => {
                                itemDescription.style.fontSize = '1.4vh';
                            });

                            const dateNodes = document.querySelectorAll('.dateNode');
                            dateNodes.forEach(dateNode => {
                                dateNode.style.fontSize = '1vh'; 
                            });

                            const dpurchasesfirstNameDivs = document.querySelectorAll('.purchasesfirstNameDiv');

                            dpurchasesfirstNameDivs.forEach(dpurchasesfirstNameDiv => {
                                dpurchasesfirstNameDiv.style.fontSize = '1vh'; 
                            });

                            const dppurchasesPriceDivs = document.querySelectorAll('.purchasesPriceDiv');
                            dppurchasesPriceDivs.forEach(dppurchasesPriceDiv => {
                                dppurchasesPriceDiv.style.fontSize = '1vh'; 
                            });

                            if(purchasesInfoContainer){
                                purchasesInfoContainer.style.marginTop = '1vh';
                            }
                            
                            headerTextContainer.style.width = '38%';

                            backButtonContainer.style.left = '40.5%';
                            backButtonContainer.style.width  = '5.5vh';

                            commissionContainer.style.left = '46.8%';
                            commissionContainer.style.width  = '5.5vh';

                            AIbuttonContainer.style.left = '52.8%';
                            AIbuttonContainer.style.width  = '5.5vh';

                            gridFowardContainer.style.left = '33%';
                            gridFowardContainer.style.width  = '5.5vh';

                            gridBackContainer.style.left = '26%';
                            gridBackContainer.style.width  = '5.5vh';

                            
                            searchBar.remove(); 
                            

                            if(addToDBButton && deleteToDBButton){
                                addToDBButton.remove();
                                deleteToDBButton.remove();  
                            }

                            var listItems = document.getElementsByTagName('li');
                            var listH3Items = document.getElementsByTagName('li');

                            for (var i = 0; i < listItems.length; i++) {
                               listItems[i].style.fontSize = '2.2vh'; 
                            }

                            for (var i = 0; i < listH3Items.length; i++) {
                                listItems[i].style.fontSize = '2.2vh'; 
                            }

                            paintingGrid.style.left = '27.5%';

                        }else if(window.innerWidth <= 499 && window.innerWidth >= 350 ){
                            sideElementsWidthPercent = '27%'; 
                            GridWidth = '80%';
                            gridItemWidth = '100%';
                            rowWidth = '50%';


                            if(currentPaintingArray.length >= 24){
                                makePaintingPage(currentPaintingArray.slice(0,24), currentPurchaseArray,  document.body, 2, sideElementsWidthPercent, GridWidth, gridItemWidth);
                            }else{
                                makePaintingPage(currentPaintingArray, currentPurchaseArray,  document.body, 2, sideElementsWidthPercent, GridWidth, gridItemWidth);
                            }

                            var paintingGrid = document.querySelector('.NewGrid');
                            paintingGrid.style.left = '10%';
                            paintingGrid.style.height = '60%';
                            paintingGrid.style.top = '2%';
                            paintingGrid.style.marginBottom = '2%';

                            const tree = document.querySelector('.tree');
                            const recentSells = document.querySelector('.recentSells');
                            const acceptibleCoins = document.querySelector('.acceptibleCoins');
                            const chatRoom = document.querySelector('.crypto-chat-room');
                            const searchBar = document.querySelector('.search-container');
                            const addToDBButton = document.querySelector('.add-to-DB');
                            const deleteToDBButton = document.querySelector('.minus-to-DB');

                            const backButtonContainer = document.querySelector('.backButtonContainer');
                            const commissionContainer = document.querySelector('.commissionContainer');
                            const AIbuttonContainer = document.querySelector('.AIbuttonContainer');
                            const gridFowardContainer = document.querySelector('.gridFowardContainer');
                            const gridBackContainer = document.querySelector('.gridBackContainer');



                            const ptagDescriptions = document.querySelectorAll('.descriptionPaintingPTAG');

                            ptagDescriptions.forEach(itemDescription => {
                                itemDescription.style.fontSize = '1.3vh';
                            });


                            const dateNodes = document.querySelectorAll('.dateNode');
                            dateNodes.forEach(dateNode => {
                                dateNode.style.fontSize = '.9vh'; 
                            });


                            const dpurchasesfirstNameDivs = document.querySelectorAll('.purchasesfirstNameDiv');
                            dpurchasesfirstNameDivs.forEach(dpurchasesfirstNameDiv => {
                                dpurchasesfirstNameDiv.style.fontSize = '.9vh'; 
                            });



                            const dppurchasesPriceDivs = document.querySelectorAll('.purchasesPriceDiv');
                            dppurchasesPriceDivs.forEach(dppurchasesPriceDiv => {
                                dppurchasesPriceDiv.style.fontSize = '.9vh'; 
                            });

                            tree.remove();
                            recentSells.remove();
                            acceptibleCoins.remove();
                            searchBar.remove();

                            if(addToDBButton && deleteToDBButton){
                                addToDBButton.remove();
                                deleteToDBButton.remove();  
                            }

                            if (typeof greenLight !== 'undefined' && greenLight) {
                                greenLight.remove();
                            }

                            //greenLight?.remove();
                            
                            backButtonContainer.style.width = '4.2vh';
                            backButtonContainer.style.left = '46.5%';
                            commissionContainer.style.width = '4.2vh';
                            commissionContainer.style.left = '55%';
                            AIbuttonContainer.style.width = '4.2vh';
                            AIbuttonContainer.style.left = '63%';
                            gridFowardContainer.style.width  = '4.2vh';
                            gridBackContainer.style.width  = '4.2vh';
                            gridBackContainer.style.left = '32%';
                            chatRoom.style.height = '14%';
                            chatRoom.style.width =  '78%';
                            chatRoom.style.height = '30%';
                            chatRoom.style.position = 'relative';
                            chatRoom.style.left = '11.5%';
                            chatRoom.style.top = '0%';
                            chatRoom.style.zIndex = '99999';


                            var listItems = document.getElementsByTagName('li');
                            var listH3Items = document.getElementsByTagName('h3');
                            for (var i = 0; i < listItems.length; i++) {
                               listItems[i].style.fontSize = '1.5vh'; 
                            }

                            for (var i = 0; i < listH3Items.length; i++) {
                                listH3Items[i].style.fontSize = '1.5vh'; 
                            }
                        }else if(window.innerWidth <= 350) {
                            window.location.href = 'unsupported.html'; 
                        }

                        gridNavigator.style.display = 'none';

                        let msgHisotry = await getMessageHistory();

                        for(const element of msgHisotry){
                            addMessage(element.msg, element.username, element.time);
                        }

                    }, 101); 
                  })
                  .catch((error) => {
                    console.error('Error:', error);
                  });
                paintingClicked = false;
            }else{
                console.log('we already clicked the painting section');
            }
        }); 
}

export function math_section_click(parentElement){
    comingSoonScreen(parentElement);
}

export function nft_section_click(parentElement){
     console.log("NFT section clicked!"); 
     comingSoonScreen(parentElement);
}

export function upcoming_section_click(parentElement){
     console.log("NFT section clicked!"); 
     comingSoonScreen(parentElement);
}





export function makeConnection() {
    let popup = document.querySelector('.popup');
    if (!popup) {
        popup = document.createElement("div");
        popup.className = "popup";
        popup.style.overflow = 'hidden';
        // append image 

        // Create Sign In div and append
        const signInDiv = document.createElement("div");

        signInDiv.style.position = 'relative';
        signInDiv.style.top = "2px";
        signInDiv.textContent = "Sign In";
        signInDiv.style.fontSize = '15px';
        signInDiv.classList.add("signin");
        popup.appendChild(signInDiv);

        const imageContainer = document.createElement('div');
        imageContainer.style.position = 'relative';
        imageContainer.style.width = '80%';
        imageContainer.style.height = '50%';
        imageContainer.style.marginTop = '1%'; 
        imageContainer.style.marginBottom = '7%'; 
        imageContainer.style.borderRadius = '5px';
        //imageContainer.style.backgroundColor = 'blue';
        imageContainer.style.backgroundImage = 'url("images/BursonSkull2.png")';
        //imageContainer.style.backgroundSize = 'cover'; 
        imageContainer.style.backgroundSize = 'contain'; 
        imageContainer.style.backgroundRepeat = 'no-repeat';
        imageContainer.style.backgroundPosition = 'center'; 
        imageContainer.style.left = '10%';
        popup.appendChild(imageContainer);

        const Logocontainer1 = document.createElement('div');
        const Logocontainer2 = document.createElement('div');

        const providers = ["Metamask", "Coinbase"]; 
        providers.forEach(providerName => {
            const providerDiv = document.createElement("div");
            //providerDiv.textContent = providerName;
            providerDiv.style.position = 'relative';
            providerDiv.classList.add("provider");
            providerDiv.className = providerName;
            providerDiv.style.width = '80%';
            providerDiv.style.height = '8%';
            providerDiv.style.marginTop = '2%';
            providerDiv.style.left = '10%';
            providerDiv.style.alignItems = "center"; 
            providerDiv.style.justifyContent = "center"; 
            providerDiv.style.borderRadius = '.5vh';
            providerDiv.style.backgroundColor = 'white';
            providerDiv.style.overflow = 'hidden';
            providerDiv.style.boxShadow = '0px 0px 15px rgba(0, 0, 0, 0.5)'; 

            if(providerName == "Coinbase"){
                providerDiv.style.backgroundImage = 'url("/images/coinbase.PNG")';
                providerDiv.style.backgroundSize = 'contain'; 
                providerDiv.style.backgroundRepeat = 'no-repeat';
                providerDiv.style.backgroundPosition = 'center'; 
            }else{
                providerDiv.style.backgroundImage = 'url("/images/metamask.png")';
                providerDiv.style.cursor = 'pointer'; 
                providerDiv.style.backgroundSize = 'contain';
                providerDiv.style.backgroundRepeat = 'no-repeat';
                providerDiv.style.backgroundPosition = 'center'; 
            }
            
            popup.appendChild(providerDiv);
        });

        const cancelButton = document.createElement("div");
        const ptag = document.createElement('p');

        ptag.style.position = 'relative'
        ptag.style.height = '50%';
        ptag.style.width = '80%';
        ptag.style.left = '10%';
        ptag.style.top = '25%';
        ptag.textContent = "Cancel";
        ptag.style.fontSize = '15px';


        cancelButton.classList.add("cancel-button");
        cancelButton.style.alignItems;
        cancelButton.style.fontSize = '1vw';
        cancelButton.style.boxShadow = '0px 0px 15px rgba(0, 0, 0, 0.5)';
        cancelButton.style.fontFamily = "Times New Roman";

        cancelButton.addEventListener("click", function () {
            popup.remove();
        });

        cancelButton.appendChild(ptag);
        popup.appendChild(cancelButton);

        document.body.appendChild(popup);

        let offsetX, offsetY;
        let isDragging = false;

        popup.addEventListener("mousedown", function (event) {
            isDragging = true;
            offsetX = event.clientX - parseFloat(window.getComputedStyle(popup).left);
            offsetY = event.clientY - parseFloat(window.getComputedStyle(popup).top);
            popup.style.cursor = "grabbing";
        });

        document.addEventListener("mousemove", function (event) {
            if (isDragging) {
                popup.style.left = (event.clientX - offsetX) + "px";
                popup.style.top = (event.clientY - offsetY) + "px";
            }
        });

        document.addEventListener("mouseup", function () {
            isDragging = false;
            popup.style.cursor = "grab";
        });
    }
}


export function comingSoonScreen(divElement) {
    divElement.style.position = 'relative';

    const overlay = document.createElement('div');
    const overlayText = document.createElement('p');

    overlay.classList.add('coming-soon-overlay');
    overlayText.classList.add('coming-soon-text');

    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.borderRadius = '10px';

    overlay.style.position = 'absolute';
    overlay.style.width = '100%';
    overlay.style.height = '0'; 
    overlay.style.left = '0';
    overlay.style.bottom = '0';


    overlayText.style.color = 'white';
    overlayText.style.position = 'absolute'; 
    overlayText.style.textAlign = 'center'; 
    overlayText.style.width = '100%'; 
    overlayText.style.margin = '0'; 
    overlayText.style.top = '50%'; 
    overlayText.style.transform = 'translateY(-50%)'; 

    overlayText.textContent = 'Coming Soon';
    overlayText.style.zIndex = 1000000;
    overlay.appendChild(overlayText);
    divElement.appendChild(overlay);

    function updateOverlayHeight() {
        const elapsedTime = performance.now() - startTime; 
        const percentageComplete = elapsedTime / animationDuration; 
        const newHeight = Math.min(percentageComplete * 100, 100); 
        overlay.style.height = newHeight + '%';

        if (percentageComplete < 1 && newHeight < 100) {
            requestAnimationFrame(updateOverlayHeight);
        }
    }

    const animationDuration = 1000; 
    const startTime = performance.now(); 

    requestAnimationFrame(updateOverlayHeight);
    setTimeout(function () {
        divElement.removeChild(overlay);
        NFTDivOverlay = false;
        mathOverlay = false;
        updatesOverlay = false;
    }, 3000); 
}


export function shiftOffScreen(element) {
    var shiftAmount = 2; 
    function shift() {
        var currentPosition = parseFloat(element.style.left) || 0; 
        element.style.left = (currentPosition - shiftAmount) + '1px';
        if (element.getBoundingClientRect().right <= 0) {
            clearInterval(interval);
        }
    }
    var interval = setInterval(shift, 38); 
}

export function makePaintGrid(array, parentElement, columns, gridWidthPercent) {
    var numRows = Math.ceil(array.length / columns);
    var oldGrid = document.querySelector('.Grid_container');
    var gridContainer = document.createElement('div');

    if (oldGrid) {
        oldGrid.parentNode.removeChild(oldGrid); 
    }
    
    gridContainer.style.position = 'relative';
    gridContainer.style.height = '100%'; 
    gridContainer.className = 'NewGrid';
    gridContainer.style.width = gridWidthPercent;
    gridContainer.style.top = '2%'; 
    gridContainer.style.padding = '4px';
    gridContainer.style.zIndex = '10'; 
    gridContainer.style.backgroundColor = 'none';
    gridContainer.style.overflow = 'auto'; 
    gridContainer.style.display = 'grid';
    gridContainer.style.zIndex = '0';

    gridContainer.style.scrollbarWidth = 'none'; 
    const rowHeight = '33%'; 
    gridContainer.style.gridTemplateColumns = `repeat(${columns}, 1fr)`; 
    gridContainer.style.gridTemplateRows = `repeat(${numRows},  ${rowHeight})`; 
    gridContainer.style.gap = '0px'; 
    array.forEach(item => {
        var gridItem = document.createElement('div');
        console.log(item.price.$numberDecimal);
        gridItem.classList.add('grid-item'+ item.price.$numberDecimal.toString());
        gridItem.setAttribute('id', item._id);
        gridItem.textContent = item; 
        gridItem.style.position = 'relative';
        gridItem.style.backgroundColor = '#aaaaaa'; 
        gridItem.style.width = '95%'; 
        gridItem.style.left = '2.5%'; 
        gridItem.style.height = '94%'; 
        gridItem.style.top = '3%';
        gridItem.style.display = 'flex';
        gridItem.style.justifyContent = 'center';
        gridItem.style.alignItems = 'center';
        gridItem.style.setProperty('border-radius', '10px', 'important'); 
        gridItem.style.boxShadow =  '0px 2px 4px rgba(0, 0, 0, 0.7)'; 
        removeString(gridItem, "[object Object]");
        gridItem.style.backgroundImage = `url("${item.image}")`;
        gridItem.style.backgroundSize = 'cover'; 
        gridItem.style.backgroundRepeat = 'no-repeat';
        gridItem.style.backgroundPosition = 'center'; 
        gridItem.style.backgroundSize = '90% 100%'; 

        var overlay = document.createElement('div');
        overlay.classList.add('overlay');
        overlay.style.position = 'absolute';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.top = 0;
        overlay.style.left = 0;
        overlay.style.setProperty('border-radius', '10px', 'important'); 
        overlay.style.backgroundColor = 'dimgray'; 
        overlay.style.display = 'none'; 
        overlay.style.flexDirection = 'column'; 
        overlay.style.justifyContent = 'flex-end'; 
        overlay.style.opacity = '.6';

        gridItem.addEventListener('mouseenter', async function() {
            gridItem.style.transform = 'translateY(-5px)';
            overlay.style.display = 'flex';
            var checkIfInStock = null;
            for(const myObj of currentPaintingArray){
                if(myObj._id == gridItem.id){
                    checkIfInStock = myObj.inStock;
                }else{
                    //checkIfInStock = false;   
                }
            }

            addBuyButton(gridItem, checkIfInStock, gridItem.id);

            var descriptionP = document.createElement('p');
            descriptionP.className = 'descriptionPaintingPTAG';
            descriptionP.style.width = '100%';
            descriptionP.style.height = '80%';
            descriptionP.style.top = '0%';
            descriptionP.style.position = 'absolute';
            descriptionP.style.overflowY = 'scroll';
            descriptionP.style.fontSize = '1.8vh';
            descriptionP.style.color = 'white';

            for(const painting of currentPaintingArray){
                //console.log(painting);
                if(painting._id == gridItem.id){
                    descriptionP.innerHTML =  'Name:' + "    " + painting.name + '<br>'  + 'Approximate Price:' + "    " + painting.price.$numberDecimal + " ETH " + '<br>'+ " Number of Views: "+  painting.views +  '<br> <br>' +  painting.description;
                }
            }
            overlay.appendChild(descriptionP);


            const containsPaintingId = currentViewedPaintings.some(item => item.paintingId === gridItem.id);

            if (!containsPaintingId) {
              currentViewedPaintings.push({paintingId: gridItem.id});
                try {
                    const response = await fetch('/UpdatePaintingViewsValue', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(gridItem.id) 
                    });

                    if (response.ok) {
                        const serverMessage = await response.json();
                        console.log(serverMessage);
                        
                        if(serverMessage.success == true){
                        }else{
                            console.log('we could not update the db object came back as', serverMessage);
                        }
                    } else {
                        console.error('Failed to add painting:', response.statusText);
                    }
                } catch (error) {
                    console.error('Error adding painting:', error);
                }
            }else{
            }


        });
        gridItem.addEventListener('mouseleave', function() {
            gridItem.style.transform = 'translateY(0)';
            overlay.style.display = 'none'; 
            const buyButton = document.querySelector('.buy-button' + gridItem.id.toString());
            const descriptionP = document.querySelector('.descriptionPaintingPTAG');
            if (buyButton) {
                buyButton.remove();
                descriptionP.remove();
            } else {
                console.error('Buy button not found');
            }
        });

        gridItem.appendChild(overlay);
        gridContainer.appendChild(gridItem);
    });
    
    parentElement.appendChild(gridContainer);

}


async function getAccetableCoinPrices(coins) {
    try {
        const response = await fetch('/get-prices', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(coins)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const prices = await response.json();
        return prices;
    } catch (error) {
        console.error('Error fetching prices:', error);
        return [];
    }
}


async function addCryptoTokens(div){

    const ethpopup = document.createElement('div');
    const ethlogo = document.createElement('div');
    const ethptagContainer = document.createElement('div'); 
    const ptag = document.createElement('p');

    ptag.textContent = 'Loading...'; 
    ptag.style.margin = '0'; 
    ptag.style.top = '25%'; 
    ptag.style.position = 'relative';
    ptag.style.height = '50%';
    ptag.style.width = '70%';
    ptag.style.left = '2.5%';
    ptag.style.fontFamily = 'Roboto, sans-serif'; 
    ethpopup.style.position = 'relative';
    ethpopup.style.width = '100%';
    ethpopup.style.height = '15%';
    ethpopup.style.backgroundColor = 'dimgray';
    ethpopup.style.borderBottom = '0.4vh solid lightgray'; 
    ethpopup.style.borderTopLeftRadius = '2vh'; 
    ethpopup.style.borderTopRightRadius = '2vh';

    ethlogo.style.display = 'inline-block';
    ethlogo.style.height = '100%'; 
    ethlogo.style.width = '20%';
    ethlogo.style.backgroundImage = 'url("/images/EthLogo.PNG")';
    ethlogo.style.backgroundSize = 'contain';
    ethlogo.style.backgroundRepeat = 'no-repeat';
    ethlogo.style.backgroundPosition = 'center'; 

    ethptagContainer.style.display = 'inline-block';
    ethptagContainer.style.height = '100%'; 
    ethptagContainer.style.width = '80%';
    ethptagContainer.style.backgroundColor = 'none';
    ethptagContainer.style.fontSize = '2.4vh';
    ethptagContainer.style.textAlign = 'center'; 
    ethptagContainer.style.verticalAlign = 'top';
    ethptagContainer.classList.add('ethereumPriceContainer');

    ethptagContainer.appendChild(ptag);
    ethpopup.appendChild(ethlogo);
    ethpopup.appendChild(ethptagContainer);
    div.appendChild(ethpopup);

    // use this functions to reset global prices values
    getEthereumPrice(ptag); 

    const polygonPopUp = document.createElement('div');
    const polygonLogo = document.createElement('div');
    const polygonptagContainer = document.createElement('div'); 
    const polyptag = document.createElement('p');

    polyptag.textContent = 'Loading...'; 
    polyptag.style.margin = '0'; 
    polyptag.style.top = '25%'; 
    polyptag.style.position = 'relative';
    polyptag.style.height = '50%';
    polyptag.style.width = '70%';
    polyptag.style.left = '2.5%';
    polyptag.style.fontFamily = 'Roboto, sans-serif';

    polygonPopUp.style.position = 'relative';
    polygonPopUp.style.width = '100%';
    polygonPopUp.style.height = '15%';
    polygonPopUp.style.backgroundColor = 'dimgray';
    polygonPopUp.style.borderBottom = '0.4vh solid lightgray'; 

    polygonLogo.style.display = 'inline-block';
    polygonLogo.style.height = '100%'; 
    polygonLogo.style.width = '20%';
    polygonLogo.style.backgroundImage = 'url("/images/PolyLogo.PNG")';
    polygonLogo.style.backgroundSize = 'contain';
    polygonLogo.style.backgroundRepeat = 'no-repeat';
    polygonLogo.style.backgroundPosition = 'center'; 

    polygonptagContainer.style.display = 'inline-block';
    polygonptagContainer.style.height = '100%'; 
    polygonptagContainer.style.width = '80%';
    polygonptagContainer.style.backgroundColor = 'none';
    polygonptagContainer.style.fontSize = '2.4vh';
    polygonptagContainer.style.textAlign = 'center'; 
    polygonptagContainer.style.verticalAlign = 'top';
    polygonptagContainer.classList.add('polygonPriceContainer');

    polygonptagContainer.appendChild(polyptag);
    polygonPopUp.appendChild(polygonLogo);
    polygonPopUp.appendChild(polygonptagContainer);
    div.appendChild(polygonPopUp);

    getPolygonPrice(polyptag);

    
    const bitCoinpopup = document.createElement('div');
    const bitCoinlogo = document.createElement('div');
    const bitCoinptagContainer = document.createElement('div'); 
    const bitCoinptag = document.createElement('p');

    bitCoinptag.textContent = 'Loading...'; 
    bitCoinptag.style.margin = '0'; 
    bitCoinptag.style.top = '25%'; 
    bitCoinptag.style.position = 'relative';
    bitCoinptag.style.height = '50%';
    bitCoinptag.style.width = '70%';
    bitCoinptag.style.left = '2.5%';
    bitCoinptag.style.fontFamily = 'Roboto, sans-serif'; 

    bitCoinpopup.style.position = 'relative';
    bitCoinpopup.style.width = '100%';
    bitCoinpopup.style.height = '15%';
    bitCoinpopup.style.backgroundColor = 'dimgray';
    bitCoinpopup.style.borderBottom = '0.4vh solid lightgray'; 


    bitCoinlogo.style.display = 'inline-block';
    bitCoinlogo.style.height = '100%'; 
    bitCoinlogo.style.width = '20%';
    bitCoinlogo.style.backgroundImage = 'url("/images/bitcoinLogo.PNG")';
    bitCoinlogo.style.backgroundSize = 'contain';
    bitCoinlogo.style.backgroundRepeat = 'no-repeat';
    bitCoinlogo.style.backgroundPosition = 'center'; 


    bitCoinptagContainer.style.display = 'inline-block';
    bitCoinptagContainer.style.height = '100%'; 
    bitCoinptagContainer.style.width = '80%';
    bitCoinptagContainer.style.backgroundColor = 'none';
    bitCoinptagContainer.style.fontSize = '2.4vh';
    bitCoinptagContainer.style.textAlign = 'center'; 
    bitCoinptagContainer.style.verticalAlign = 'top'; 
    bitCoinptagContainer.classList.add('BitCoinPriceContainer');

    bitCoinptagContainer.appendChild(bitCoinptag);
    bitCoinpopup.appendChild(bitCoinlogo);
    bitCoinpopup.appendChild(bitCoinptagContainer);
    div.appendChild(bitCoinpopup);

    getBitcoinPrice(bitCoinptag); 


    const shibaInuCoinpopup = document.createElement('div');
    const shibaInuCoinlogo = document.createElement('div');
    const shibaInuCoinptagContainer = document.createElement('div'); 
    const shibaInuCoinptag = document.createElement('p');

    shibaInuCoinptag.textContent = 'Loading...'; 
    shibaInuCoinptag.style.margin = '0'; 
    shibaInuCoinptag.style.top = '25%';
    shibaInuCoinptag.style.position = 'relative';
    shibaInuCoinptag.style.height = '50%';
    shibaInuCoinptag.style.width = '70%';
    shibaInuCoinptag.style.left = '2.5%';
    shibaInuCoinptag.style.fontFamily = 'Roboto, sans-serif';
    shibaInuCoinpopup.style.position = 'relative';
    shibaInuCoinpopup.style.width = '100%';
    shibaInuCoinpopup.style.height = '15%';
    shibaInuCoinpopup.style.backgroundColor = 'dimgray';
    shibaInuCoinpopup.style.borderBottom = '0.4vh solid lightgray'; 
    shibaInuCoinlogo.style.display = 'inline-block';
    shibaInuCoinlogo.style.height = '100%'; 
    shibaInuCoinlogo.style.width = '20%';
    shibaInuCoinlogo.style.backgroundImage = 'url("/images/ShibLogo.PNG")';
    shibaInuCoinlogo.style.backgroundSize = 'contain';
    shibaInuCoinlogo.style.backgroundRepeat = 'no-repeat';
    shibaInuCoinlogo.style.backgroundPosition = 'center'; 

    shibaInuCoinptagContainer.style.display = 'inline-block';
    shibaInuCoinptagContainer.style.height = '100%'; 
    shibaInuCoinptagContainer.style.width = '80%';
    shibaInuCoinptagContainer.style.backgroundColor = 'none';
    shibaInuCoinptagContainer.style.fontSize = '2.4vh';
    shibaInuCoinptagContainer.style.textAlign = 'center'; 
    shibaInuCoinptagContainer.style.verticalAlign = 'top'; 
    shibaInuCoinptagContainer.classList.add('ShibaInuPriceContainer');

    shibaInuCoinptagContainer.appendChild(shibaInuCoinptag);
    shibaInuCoinpopup.appendChild(shibaInuCoinlogo);
    shibaInuCoinpopup.appendChild(shibaInuCoinptagContainer);
    div.appendChild(shibaInuCoinpopup);

    getShibaInuPrice(shibaInuCoinptag); 

    const vechainCoinpopup = document.createElement('div');
    const vechainCoinlogo = document.createElement('div');
    const vechainCoinptagContainer = document.createElement('div');
    const vechainCoinptag = document.createElement('p');

    vechainCoinptag.textContent = 'Loading...'; 
    vechainCoinptag.style.margin = '0'; 
    vechainCoinptag.style.top = '25%'; 
    vechainCoinptag.style.position = 'relative';
    vechainCoinptag.style.height = '50%';
    vechainCoinptag.style.width = '70%';
    vechainCoinptag.style.left = '2.5%';
    vechainCoinptag.style.fontFamily = 'Roboto, sans-serif'; 

    vechainCoinpopup.style.position = 'relative';
    vechainCoinpopup.style.width = '100%';
    vechainCoinpopup.style.height = '15%';
    vechainCoinpopup.style.backgroundColor = 'dimgray';
    vechainCoinpopup.style.borderBottom = '0.4vh solid lightgray'; 


    vechainCoinlogo.style.display = 'inline-block';
    vechainCoinlogo.style.height = '100%'; 
    vechainCoinlogo.style.width = '20%';
    vechainCoinlogo.style.backgroundImage = 'url("/images/vechainLogo.PNG")';
    vechainCoinlogo.style.backgroundSize = 'contain';
    vechainCoinlogo.style.backgroundRepeat = 'no-repeat';
    vechainCoinlogo.style.backgroundPosition = 'center'; 

    vechainCoinptagContainer.style.display = 'inline-block';
    vechainCoinptagContainer.style.height = '100%'; 
    vechainCoinptagContainer.style.width = '80%';
    vechainCoinptagContainer.style.backgroundColor = 'none';
    vechainCoinptagContainer.style.fontSize = '2.4vh';
    vechainCoinptagContainer.style.textAlign = 'center'; 
    vechainCoinptagContainer.style.verticalAlign = 'top'; 
    vechainCoinptagContainer.classList.add('veChainPriceContainer');

    vechainCoinptagContainer.appendChild(vechainCoinptag);
    vechainCoinpopup.appendChild(vechainCoinlogo);
    vechainCoinpopup.appendChild(vechainCoinptagContainer);
    div.appendChild(vechainCoinpopup);

    getVeChainPrice(vechainCoinptag); 

    const etcClassicCoinpopup = document.createElement('div');
    const etcClassicCoinlogo = document.createElement('div');
    const etcClassicCoinptagContainer = document.createElement('div'); 
    const etcClassicCoinptag = document.createElement('p');

    etcClassicCoinptag.textContent = 'Loading...'; 
    etcClassicCoinptag.style.margin = '0'; 
    etcClassicCoinptag.style.top = '25%'; 
    etcClassicCoinptag.style.position = 'relative';
    etcClassicCoinptag.style.height = '50%';
    etcClassicCoinptag.style.width = '70%';
    etcClassicCoinptag.style.left = '2.5%';
    etcClassicCoinptag.style.fontFamily = 'Roboto, sans-serif';

    etcClassicCoinpopup.style.position = 'relative';
    etcClassicCoinpopup.style.width = '100%';
    etcClassicCoinpopup.style.height = '15%';
    etcClassicCoinpopup.style.backgroundColor = 'dimgray';
    etcClassicCoinpopup.style.borderBottom = '0.4vh solid lightgray'; 

    etcClassicCoinlogo.style.display = 'inline-block';
    etcClassicCoinlogo.style.height = '100%'; 
    etcClassicCoinlogo.style.width = '20%';
    etcClassicCoinlogo.style.backgroundImage = 'url("/images/etcClassicLogo.png")';
    etcClassicCoinlogo.style.backgroundSize = 'contain';
    etcClassicCoinlogo.style.backgroundRepeat = 'no-repeat';
    etcClassicCoinlogo.style.backgroundPosition = 'center'; 

    etcClassicCoinptagContainer.style.display = 'inline-block';
    etcClassicCoinptagContainer.style.height = '100%'; 
    etcClassicCoinptagContainer.style.width = '80%';
    etcClassicCoinptagContainer.style.backgroundColor = 'none';
    etcClassicCoinptagContainer.style.fontSize = '2.4vh';
    etcClassicCoinptagContainer.style.textAlign = 'center';
    etcClassicCoinptagContainer.style.verticalAlign = 'top'; 
    etcClassicCoinptagContainer.classList.add('ETCPriceContainer');

    etcClassicCoinptagContainer.appendChild(etcClassicCoinptag);
    etcClassicCoinpopup.appendChild(etcClassicCoinlogo);
    etcClassicCoinpopup.appendChild(etcClassicCoinptagContainer);
    div.appendChild(etcClassicCoinpopup);

    getEthereumClassicPrice(etcClassicCoinptag); 

    const dogeCoinpopup = document.createElement('div');
    const dogeCoinlogo = document.createElement('div');
    const dogeCoinptagContainer = document.createElement('div'); 
    const dogeCoinptag = document.createElement('p');

    dogeCoinptag.textContent = 'Loading...'; 
    dogeCoinptag.style.margin = '0'; 
    dogeCoinptag.style.top = '25%';
    dogeCoinptag.style.position = 'relative';
    dogeCoinptag.style.height = '50%';
    dogeCoinptag.style.width = '70%';
    dogeCoinptag.style.left = '2.5%';
    dogeCoinptag.style.fontFamily = 'Roboto, sans-serif'; 

    dogeCoinpopup.style.position = 'relative';
    dogeCoinpopup.style.width = '100%';
    dogeCoinpopup.style.height = '15%';
    dogeCoinpopup.style.backgroundColor = 'dimgray';
    dogeCoinpopup.style.borderBottom = '0.4vh solid lightgray'; 

    dogeCoinlogo.style.display = 'inline-block';
    dogeCoinlogo.style.height = '100%'; 
    dogeCoinlogo.style.width = '20%';
    dogeCoinlogo.style.backgroundImage = 'url("/images/dogelogo.PNG")';
    dogeCoinlogo.style.backgroundSize = 'contain';
    dogeCoinlogo.style.backgroundRepeat = 'no-repeat';
    dogeCoinlogo.style.backgroundPosition = 'center'; 

    dogeCoinptagContainer.style.display = 'inline-block';
    dogeCoinptagContainer.style.height = '100%'; 
    dogeCoinptagContainer.style.width = '80%';
    dogeCoinptagContainer.style.backgroundColor = 'none';
    dogeCoinptagContainer.style.fontSize = '2.4vh';
    dogeCoinptagContainer.style.textAlign = 'center'; 
    dogeCoinptagContainer.style.verticalAlign = 'top';
    dogeCoinptagContainer.classList.add('dogePriceContainer');

    dogeCoinptagContainer.appendChild(dogeCoinptag);
    dogeCoinpopup.appendChild(dogeCoinlogo);
    dogeCoinpopup.appendChild(dogeCoinptagContainer);
    div.appendChild(dogeCoinpopup);

    getDogecoinPrice(dogeCoinptag); 
};

function moveLeftAndRight(parentDiv, timeFrame, movementPercentages) {
    if (!parentDiv || !(parentDiv instanceof Element)) {
        console.error("Parent div is not provided or is not a valid DOM element.");
        return;
    }

    if (!Array.isArray(movementPercentages) || movementPercentages.length !== 5) {
        console.error("Movement percentages array is missing or invalid. It should be an array of length 5.");
        return;
    }

    const moveRightFlags = [true, true, true, true, true];

    function moveLiTags() {
        for (let i = 1; i <= 5; i++) {
            const div = parentDiv.querySelector(`.liTag${i}`);
            if (div) {
                let currentPosition = parseFloat(div.style.left) || 0;
                currentPosition += movementPercentages[i - 1] * (moveRightFlags[i - 1] ? 1 : -1);
                if (currentPosition > 30) {
                    currentPosition += (movementPercentages[i - 1] > 0 ? -0.2 : 0.2);
                }
                const maxRightPosition = 90; 
                if (currentPosition > maxRightPosition) {
                    currentPosition = maxRightPosition;
                    moveRightFlags[i - 1] = false;
                }
                const minLeftPosition = 0; 
                if (currentPosition < minLeftPosition) {
                    currentPosition = minLeftPosition;
                    moveRightFlags[i - 1] = true;
                }
                div.style.left = currentPosition + "%";
            }
        }
    }

    setInterval(moveLiTags, timeFrame);
}

function addTreeList(parentDiv, array, parentElement, numColumns, gridWidthPercent) {
    if (!parentDiv || !(parentDiv instanceof Element)) {
        console.error("Parent div is not provided or is not a valid DOM element.");
    }else{
        const ulContainer = document.createElement('div');
        ulContainer.style.position = 'relative';
        ulContainer.style.width = '100%';
        ulContainer.style.height = '100%';
        ulContainer.style.overflow = 'hidden';
        ulContainer.className = `treeListContainer`;

        const ul = document.createElement('div');
        ul.style.padding = '0';
        ul.style.position = 'absolute';
        ul.style.top = '20%'; 
        ul.style.left = '0%'; 
        ul.style.height = '60%'; 
        ul.style.width = '100%'; 
        ul.style.backgroundColor = 'none';
        ul.className = `treeList`;
        ul.style.borderBottom = '.4vh solid lightgray';
        ul.style.borderTop = '.4vh solid lightgray';
        ul.style.paddingTop = '10%';

        const numTags = 5;
        for (let i = 1; i <= numTags; i++) {
            const div = document.createElement('div');
            div.className = `liTag${i}`; 

            div.style.fontSize = '2vh'; 
            div.style.color = 'white';
            
            div.style.cursor = 'pointer'; 
            div.style.display = 'flex'; 
            div.style.alignItems = 'center'; 
            div.style.justifyContent = 'center'; 
            div.style.textShadow = '0px 2px 4px rgba(0, 0, 0, 0.3)'; 
            div.style.position = 'relative';
            div.style.backgroundColor = '#505050';
            div.style.borderRadius = '1vh';
            div.addEventListener('mouseenter', () => {
                div.style.transform = 'translateY(-2px)';
                div.style.boxShadow = '0px 2px 4px rgba(0, 0, 0, 0.3)';
                div.style.border = '.3vh solid lightgray';

            });
            div.addEventListener('mouseleave', () => {
                div.style.transform = 'translateY(0)';
                div.style.boxShadow = 'none';
                div.style.border = 'none';
            });

            div.style.height = `5.5vh`;
            div.style.width = '100%'; 

            if(i == 1){
                div.textContent = `Newest`;
                div.style.width = '40%'; 
                div.style.left = ((100 - parseFloat(div.style.width)) / 2).toString() + "%";
                div.addEventListener('click', async function(){
                    let organizedArray = await organizePaintingArrayByMostRecent(currentPaintingArray);
                    currentPaintingArray = organizedArray;
                    gridPageNumber = 1;

                    let thisGridContainer = document.querySelector('.NewGrid');
                    thisGridContainer.innerHTML = '';

                    if(currentPaintingArray.length >= 24){
                        let newGridArray = currentPaintingArray.slice(gridPageNumber-1, 23);
                        makeNewGrid(newGridArray, thisGridContainer);
                     }else{
                        let newGridArray = currentPaintingArray.slice(gridPageNumber-1, currentPaintingArray.length);
                        makeNewGrid(newGridArray, thisGridContainer);
                     }
                });


            }else if (i ==2){
                
                div.textContent = `Oldest`;
                div.style.width = '40%'; 
                div.style.left = ((100 - parseFloat(div.style.width)) / 2).toString() + "%";
                div.addEventListener('click', async function(){
                    let organizedArray = await organizePaintingArrayByOldest(currentPaintingArray);
                    currentPaintingArray = organizedArray;
                    gridPageNumber = 1;

                    let thisGridContainer = document.querySelector('.NewGrid');
                    thisGridContainer.innerHTML = '';

                    if(currentPaintingArray.length >= 24){
                        let newGridArray = currentPaintingArray.slice(gridPageNumber-1, 23);
                        makeNewGrid(newGridArray, thisGridContainer);
                     }else{
                        let newGridArray = currentPaintingArray.slice(gridPageNumber-1, currentPaintingArray.length);
                        makeNewGrid(newGridArray, thisGridContainer);
                     }
                });
            }else if (i == 3 ){
                div.textContent = `Cheapeast`;
                div.style.width = '60%'; 
                div.style.left = ((100 - parseFloat(div.style.width)) / 2).toString() + "%";
                div.addEventListener('click', async function(){
                    let organizedArray = await organizePaintingArrayByLeastExpensive(currentPaintingArray);
                    currentPaintingArray = organizedArray;
                    gridPageNumber = 1;

                    let thisGridContainer = document.querySelector('.NewGrid');
                    thisGridContainer.innerHTML = '';

                    if(currentPaintingArray.length >= 24){
                        let newGridArray = currentPaintingArray.slice(gridPageNumber-1, 23);
                        makeNewGrid(newGridArray, thisGridContainer);
                     }else{
                        let newGridArray = currentPaintingArray.slice(gridPageNumber-1, currentPaintingArray.length);
                        makeNewGrid(newGridArray, thisGridContainer);
                     }
                });
            }else if (i == 4 ){
                div.textContent = `Most Expensive`;
                div.style.width = '70%'; 
                div.style.left = ((100 - parseFloat(div.style.width)) / 2).toString() + "%";
                div.addEventListener('click', async  function(){
                    let organizedArray = await organizePaintingArrayByMostExpensive(currentPaintingArray);
                    currentPaintingArray = organizedArray;
                    gridPageNumber = 1;

                    let thisGridContainer = document.querySelector('.NewGrid');
                    thisGridContainer.innerHTML = '';

                    if(currentPaintingArray.length >= 24){
                        let newGridArray = currentPaintingArray.slice(gridPageNumber-1, 23);
                        makeNewGrid(newGridArray, thisGridContainer);
                     }else{
                        let newGridArray = currentPaintingArray.slice(gridPageNumber-1, currentPaintingArray.length);
                        makeNewGrid(newGridArray, thisGridContainer);
                     }
                });
            }else if (i == 5 ){
                div.textContent = `Most Viewed`;
                div.style.width = '80%'; 
                div.style.left = ((100 - parseFloat(div.style.width)) / 2).toString() + "%";
                div.addEventListener('click', async  function(){
                    let organizedArray = await organizePaintingArrayByMostViewed(currentPaintingArray);
                    currentPaintingArray = organizedArray;
                    gridPageNumber = 1;

                    let thisGridContainer = document.querySelector('.NewGrid');
                    thisGridContainer.innerHTML = '';

                    if(currentPaintingArray.length >= 24){
                        let newGridArray = currentPaintingArray.slice(gridPageNumber-1, 23);
                        makeNewGrid(newGridArray, thisGridContainer);
                     }else{
                        let newGridArray = currentPaintingArray.slice(gridPageNumber-1, currentPaintingArray.length);
                        makeNewGrid(newGridArray, thisGridContainer);
                     }
                });
            }
            ul.appendChild(div);
        }

        ulContainer.appendChild(ul);
        parentDiv.appendChild(ulContainer);

    }
}

export function makePaintingPage(array, purchaseArray, parentElement, numColumns, sideElementsWidth, gridWidthPercent) {
    var footer = document.createElement('div');

    var backButtonContainer = document.createElement('div');
    var backButton = document.createElement('div');
    var commissionContainer = document.createElement('div');
    var commission  = document.createElement('div');

    var header = document.querySelector('.Header');
    const footContainer = document.createElement('div');
    const logoContainer = document.createElement('div');
    const footerLargeTextContainer = document.createElement('div');
    var footerLEGAL = document.createElement('div');
    var footerLine = document.createElement('hr');

    
    const logo = document.createElement('div');

    const headerLogo = document.createElement('div');
    const tree = document.createElement('div');
    const recentSells = document.createElement('div');
    const acceptableCoins = document.createElement('div');
    const unknownDiv = document.createElement('div');

    var welcomeDiv = document.createElement("div");
    var welcomeDivPTAG = document.createElement('p');
    var AIbutton = document.createElement('div');
    var AIbuttonContainer = document.createElement('div');
    var headerTextContainer = document.createElement('div');
    var headertext = document.createElement('div');

    var gridFowardContainer = document.createElement('div');
    var gridBackContainer = document.createElement('div');
    var gridFoward = document.createElement('div');
    var gridBack = document.createElement('div');

    var community =  ["X", "Instagram", "Threads"];
    var commnityList = document.createElement("ul");
    
    var links = ["Opensea", "Github", "researchGate", 'Linkedin', 'MathOverflow'];
    var linkList = document.createElement("ul");
    
    var resources = ["Help", "Privacy Policy", "Terms of Service", "Contracts"];
    var resourcesList = document.createElement("ul");

    links.forEach(function(itemText) {
        var li = document.createElement("li");
        const atag = document.createElement('a');
        li.style.marginBottom = '1vh';
        li.style.fontSize = '3.2vh';
        atag.textContent = itemText;

        if(atag.textContent == 'Opensea'){
            atag.href = 'https://opensea.io/collection/bursonskullz/';
        }else if(atag.textContent == 'Github'){
            atag.href = 'https://github.com/bursonskullz';
        }else if(atag.textContent == 'researchGate'){
            atag.href = 'https://www.researchgate.net/profile/Roy-Burson-2';
        }else if(atag.textContent == 'Linkedin'){
             atag.href = 'https://www.linkedin.com/in/roy-burson-396ab51b7/';
        }else if(atag.textContent == 'MathOverflow'){
              atag.href = 'https://mathoverflow.net/users/528543/the-potato-eater';
        }
       
        li.appendChild(atag);
        linkList.appendChild(li);
    });

    community.forEach(function(itemText) {
        var li = document.createElement("li");
        const atag = document.createElement('a');

        li.style.marginBottom = '1vh';
        li.style.fontSize = '3.2vh';
        atag.textContent = itemText;

        if(atag.textContent == 'X'){
            atag.href = 'https://twitter.com/bursonskullz/';
        }else if(atag.textContent == 'Instagram'){
            atag.href = 'https://www.instagram.com/bursonskullz/';
        }else if(atag.textContent == 'Threads'){
            atag.href = 'https://www.threads.net/@bursonskullz2024';
        }

        li.appendChild(atag);
        commnityList.appendChild(li); 
    });


    resources.forEach(function(itemText) {
        var li = document.createElement("li");
        const atag = document.createElement('a');
        li.style.marginBottom = '1vh';
        li.style.fontSize = '3.2vh';
        atag.textContent = itemText;

        if(atag.textContent == 'Help'){
            atag.href = 'https://metamask.io/faqs/';
        }else if(atag.textContent == 'Privacy Policy'){
            atag.href = 'privacyPolicy.html';
        }else if(atag.textContent == 'Terms of Service'){
            atag.href = 'termsOfService.html';
        }else if(atag.textContent == 'Contracts'){
            atag.href = 'contracts.html';
        }

        li.appendChild(atag);
        resourcesList.appendChild(li);
    });

    welcomeDiv.style.width = '80%';
    welcomeDiv.style.position = 'absolute';
    welcomeDiv.style.left = '10%';
    welcomeDiv.style.fontSize = '3vh';
    welcomeDiv.style.Color = 'black';
    welcomeDiv.style.height = '10%';
    welcomeDiv.style.top = '0%';
    welcomeDiv.style.justifyContent = 'center';
    welcomeDiv.classList.add("blinking"); 

    welcomeDiv.appendChild(welcomeDivPTAG);

    welcomeDivPTAG.style.position = 'absolute';
    welcomeDivPTAG.style.height = '10%';
    welcomeDivPTAG.style.width = '60%';
    welcomeDivPTAG.style.left = '20%';
    welcomeDivPTAG.style.fontWeight = 'bold';
    

    linkList.style.listStyleType = "none";
    linkList.style.position = 'relative';
    linkList.style.width = '100%';
    linkList.style.left = '0%';
    linkList.style.padding = '0%';

    commnityList.style.listStyleType = "none";
    commnityList.style.position = 'relative';
    commnityList.style.width = '100%';
    commnityList.style.left = '0%';
    commnityList.style.padding = '0%';


    resourcesList.style.listStyleType = "none";
    resourcesList.style.position = 'relative';
    resourcesList.style.width = '100%';
    resourcesList.style.left = '0%';
    resourcesList.style.padding = '0%';


    acceptableCoins.style.width =  sideElementsWidth; 
    acceptableCoins.style.height = '35%';
    acceptableCoins.style.position = 'absolute';
    acceptableCoins.style.right = '1%';
    acceptableCoins.style.top = '10%';
    acceptableCoins.style.backgroundColor = '#9b9999';
    acceptableCoins.style.boxShadow = '0px 0.8px 5px rgba(0, 0, 0.5, 0.5)'; 
    acceptableCoins.style.borderRadius = '2vh';
    acceptableCoins.style.overflowY = 'scroll';
    acceptableCoins.className = 'acceptibleCoins';
    acceptableCoins.style.scrollbarWidth = 'none'; // For Firefox
    acceptableCoins.style.overflow = '-ms-scrollbars-none'; // For Internet Explorer/Edge
    acceptableCoins.style.msOverflowStyle = 'none'; // For Internet Explorer/Edge
    acceptableCoins.style.webkitScrollbarWidth = '0'; // For Webkit (Chrome, Safari)

    addCryptoTokens(acceptableCoins).then(()=>{
        console.log('we called to get toke data');
    });
    
    unknownDiv.id = 'crypto-chat-room';
    unknownDiv.className = 'crypto-chat-room';
    unknownDiv.style.width = sideElementsWidth;
    unknownDiv.style.height = '55%';
    unknownDiv.style.position = 'absolute';
    unknownDiv.style.right = '1%';
    unknownDiv.style.top = '47%';
    unknownDiv.style.backgroundColor = '#9b9999';
    unknownDiv.style.boxShadow = '0px 0.8px 5px rgba(0, 0, 0.5, 0.5)';
    unknownDiv.style.borderRadius = '2vh';
    document.body.appendChild(unknownDiv); 


    const chatBox = document.createElement('div');
    chatBox.classList.add('chatBox');
    chatBox.className = 'chatBox';

    chatBox.style.height = '85%';
    chatBox.style.left = '0%';
    chatBox.style.width = '100%';
    chatBox.style.overflowY = 'scroll';
    chatBox.style.position = 'relative';
    chatBox.style.borderBottom = '1px solid #ccc';
    chatBox.style.backgroundColor = 'dimgray';
    chatBox.style.borderTopLeftRadius = '1vh'; 
    chatBox.style.borderTopRightRadius = '1vh';
    chatBox.style.borderBottomLeftRadius = '0'; 
    chatBox.style.borderBottomRightRadius = '0'; 

    unknownDiv.appendChild(chatBox);

    const emojiButton = document.createElement('div');
    emojiButton.classList.add('emoji-button');
    emojiButton.textContent = '➕'; 
    emojiButton.style.position = 'absolute';
    emojiButton.style.bottom = '9%';
    emojiButton.style.left = '1%'; 
    emojiButton.style.width = '10%'; 
    emojiButton.style.height = '5%'; 
    emojiButton.style.backgroundColor = 'none';
    emojiButton.style.border = 'none';
    emojiButton.style.cursor = 'pointer';
    emojiButton.style.fontSize = '10px';

    const changeUserName = document.createElement('div');
    changeUserName.classList.add('emoji-button');
    changeUserName.textContent = '🖊️'; 
    changeUserName.style.position = 'absolute';
    changeUserName.style.bottom = '2.1%'; 
    changeUserName.style.left = '1%'; 
    changeUserName.style.width = '10%';
    changeUserName.style.height = '5%'; 
    changeUserName.style.backgroundColor = 'none';
    changeUserName.style.border = 'none';
    changeUserName.style.cursor = 'pointer';
    changeUserName.style.fontSize = '10px';

    changeUserName.addEventListener('click', async () => {
        createChangeUsernamePopup().then(()=>{
            console.log('we fired the createChangeUsernamePopup() function ');
        });
    });

    unknownDiv.appendChild(emojiButton);
    unknownDiv.appendChild(changeUserName);

    emojiButton.addEventListener('click', (event) => {
        const emojiMenuIsOpen = document.querySelector('.emoji-menu');

        if(emojiMenuIsOpen){
            console.log('emoji menu is already open');
        }else{
            const emojiMenu = document.createElement('div');
            emojiMenu.classList.add('emoji-menu');
            emojiMenu.style.position = 'absolute';
            emojiMenu.className =' emoji-Menu';

            const inputRect = messageInput.getBoundingClientRect();
            const inputTop = inputRect.top + window.scrollY;

            emojiMenu.style.bottom = `12%`; 
            emojiMenu.style.left = '0%';
            emojiMenu.style.width = '99.5%'; 
            emojiMenu.style.backgroundColor = 'lightgray';
            emojiMenu.style.border = '1px solid black';
            emojiMenu.style.zIndex = '1000'; 
            emojiMenu.className = 'emoji-menu';
            emojiMenu.style.display = 'flex-start';

            const cancelButton = document.createElement('div');
            cancelButton.textContent = 'Cancel';
            cancelButton.style.height = '32px';
            cancelButton.style.width = '30%'; 
            cancelButton.style.margin = '0 auto'; 
            cancelButton.style.marginBottom = '5px';
            cancelButton.style.backgroundColor = 'lightgray'; 
            cancelButton.style.cursor = 'pointer'; 
            cancelButton.style.display = 'flex';
            cancelButton.style.alignItems = 'center'; 
            cancelButton.style.justifyContent = 'center'; 
            cancelButton.style.border = '1px solid #ccc'; 
            cancelButton.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)'; 
            cancelButton.style.transition = 'background-color 0.3s ease'; 

            cancelButton.addEventListener('mouseover', () => {
                cancelButton.style.backgroundColor = '#f0f0f0'; 
            });
            cancelButton.addEventListener('mouseout', () => {
                cancelButton.style.backgroundColor = 'lightgray'; 
            });

            cancelButton.addEventListener('click', () => {
                emojiMenu.remove();
            });

            emojiMenu.appendChild(cancelButton);

            const emojiOptionsContainer = document.createElement('div');
            emojiOptionsContainer.style.display = 'block';
            emojiOptionsContainer.style.width = '100%';
            emojiOptionsContainer.style.height = '20vh';
            emojiOptionsContainer.style.bottom = '0%';
            emojiOptionsContainer.style.border = 'none';
            emojiOptionsContainer.style.overflowY = 'scroll';
            emojiOptionsContainer.className =' emojiOptionsContainer';

            emojiMenu.appendChild(emojiOptionsContainer);

            const emojis = ['😊', '🖕🏻',  '😁', '😎', '😍', '👍', '❤️', '🎉', '🌟', '🍕', '🎈', '🎨', '🚀', '💡', '🔥', '🌈', '🙌', '👏', '🤩', '💯', '🙏',
                   '🎶', '💪', '💥', '💖', '🌺', '🌸', '🌼', '🍦', '🍭', '🍩', '🍬', '🍔', '🍟', '🥇', '🏆', '🏅', '🎖️', '🏵️', '🎯', '🚗',
                   '🚲', '🚄', '🚢', '✈️', '🚀', '🛸', '🚁', '🎠', '🎡', '🏰', '🏯', '🏟️', '⛲', '🌆', '🌉', '🏞️', '🏝️', '🏖️', '⛱️',
                   '🎢', '🏎️', '🏍️', '🚓', '🚑', '🚒', '🚚', '🚛', '🚜', '🛴', '🚲', '🛵', '🚍', '🚠', '🚟', '🚡', '🚂', '🚃', '🚄',
                   '🚅', '🚆', '🚇', '🚈', '🚉', '🚊', '🚝', '🚞', '🚋', '🚌', '🚎', '🚐', '🚑', '🚒', '🚓', '🚔', '🚕', '🚖', '🚗'];

            emojis.forEach(emoji => {
                const emojiOption = document.createElement('button');
                emojiOption.style.backgroundColor = 'transparent'; 
                emojiOption.style.border = 'none';
                emojiOption.textContent = emoji;
                emojiOption.addEventListener('click', () => {
                    const currentMessage = messageInput.value;
                    messageInput.value = currentMessage + emoji;
                });
                emojiOptionsContainer.appendChild(emojiOption);
            });
            unknownDiv.appendChild(emojiMenu);
        }
        
    });

    const messageInput = document.createElement('input');

    messageInput.id = 'message-input';
    messageInput.placeholder = 'Type your message...';
    messageInput.style.width = '80%';
    messageInput.style.height = '5%';
    messageInput.style.right = '4%';
    messageInput.style.bottom = '5%';
    messageInput.style.position = 'absolute';
    //messageInput.style.display = 'block';
    messageInput.style.backgroundColor = 'lightgray';
    messageInput.style.color = 'black';
    messageInput.style.border = '1px solid black'; 
    messageInput.style.borderRadius = '2vh';
    messageInput.style.outline = 'none'; 
    messageInput.style.margin = 'auto';
    messageInput.style.overflowWrap = 'break-word';
    messageInput.style.whiteSpace = 'nowrap'; 

    messageInput.addEventListener('focus', () => {
        messageInput.style.border = '1px solid black'; 
    });

    messageInput.addEventListener('blur', () => {
        messageInput.style.border = '1px solid black'; 
    });
    unknownDiv.appendChild(messageInput);
    if(isSocketPresent && typeof socket != 'undefined'){
        console.log('socket is already present no need to add again');
    }else{
        isSocketPresent = true;
        socket.on('updateCurrentPaintings', data => {
            //console.log('Received data from server:', data);
            for(const myObj of currentPaintingArray){
                if(myObj._id == data.Id && myObj.inStock == true){
                    myObj.inStock = false;
                    //console.log('we updated the array item', myObj);
                    setTimeout( ()=> {
                        try{
                            const purchaseForm = document.querySelector('.purchase-form-container');

                            // maybe wait a few seconds before removing
                            if(purchaseForm && purchaseForm.id == myObj._id){
                                purchaseForm.remove();
                                console.log('we removed the form');
                            }else{
                                console.log('we did not find the form to remove after 1 Millisecond');
                            }

                        }catch(error){
                            console.log(error);
                        }
                    }, 15000); 


                }else{
                    console.log('cannot find painting to update');
                }
        }

        });

        socket.on('message', (myobject) => {   
            console.log('trying to add message from server');

            if(myobject.coolDown <= 10){
                addMessage(myobject.msg, myobject.username, myobject.time); 
            }else{
                alert('you cannot send anymore messages for 24 hours');
            }
            
        });


        socket.on('updatePaintingChunk', (data) => {
            paintingChunks[data.index] = data.chunk;
            totalChunks = data.total;

            if (paintingChunks.length === totalChunks && paintingChunks.every(chunk => chunk !== undefined)) {
                const paintingString = paintingChunks.join('');
                const newPainting = JSON.parse(paintingString);
                currentPaintingArray.push(newPainting);
            }
        });

        socket.on('updatePaintingComplete', () => {
            console.log('All chunks have been received.');
            alert('A new painting has been added. Please refresh the page');
            paintingChunks = [];
            totalChunks = 0;
        });
    }

    messageInput.addEventListener('keypress', (event) => {


        if(event.key === 'Enter') {
            const message = messageInput.value.trim();
            if (message !== '') {
                socket.emit('message', message);
                messageInput.value = ''; 
            }
        }

        const emojiMenu = document.querySelector('.emoji-menu');

        if(emojiMenu){
            emojiMenu.remove();
        }

    });

    tree.style.width = sideElementsWidth;
    tree.style.height = '54%';
    tree.style.position = 'absolute';
    tree.style.left = '2.4%';
    tree.style.top = '10%';
    tree.style.backgroundColor = 'dimgrey';
    tree.style.boxShadow = '0px 0.8px 5px rgba(0, 0, 0.5, 0.5)';
    tree.style.borderRadius = '2vh';
    //tree.style.opacity = '.6';
    tree.setAttribute("id", "tree");
    tree.className = 'tree';
    tree.appendChild(welcomeDiv);  

    addTreeList(tree, currentPaintingArray, parentElement, numColumns, gridWidthPercent); 

    const timeFrame = 15; 
    const movementPercentages = [1, 1.5, 0.5, 0.8, 1.2]; 
    moveLeftAndRight(tree, timeFrame, movementPercentages);
    printInfo(welcomeDivPTAG);

    setInterval(function() {
        if(currentlyPrinted){

        }else{
            printInfo(welcomeDivPTAG);
        }
       
    }, 3000);

    recentSells.style.width = sideElementsWidth;
    recentSells.style.height = '40%';
    recentSells.style.position = 'absolute';
    recentSells.style.left = '2.4%';
    recentSells.style.top = '66%';
    recentSells.style.backgroundColor = '#9b9999';
    recentSells.style.boxShadow = '0px 0.8px 5px rgba(0, 0, 0.5, 0.5)';
    recentSells.style.borderRadius = '2vh';
    recentSells.className = 'recentSells';


    if(purchaseArray.length == 0){
        var textDiv = document.createElement("div");
        textDiv.textContent = "Recent Sells";
        textDiv.style.position = "absolute";
        textDiv.style.top = "0%";
        textDiv.style.left = "50%";
        textDiv.style.transform = "translateX(-50%)";
        textDiv.style.color = "white"; 
        textDiv.style.fontSize = "2.5vh"; 
        textDiv.style.fontWeight = "bold"; 

        recentSells.appendChild(textDiv);
        recentSells.style.backgroundImage = 'url("/Gifs/HourGlass/loading2.gif")';
        recentSells.style.backgroundSize = 'cover';
        recentSells.style.backgroundRepeat = 'no-repeat';
        recentSells.style.backgroundPosition = 'center';
        recentSells.style.backgroundColor = 'dimgray'; 


    }else{
        recentSells.style.overflowY = 'auto'; 
        recentSells.style.display = "flex"; 
        recentSells.style.flexDirection = "column"; 
        recentSells.style.overflowY = 'auto';

        var purchaseIndex = 0;


        purchaseArray.forEach(purchase => {
            const purchaseDiv = document.createElement("div");
            purchaseDiv.style.borderBottomStyle = 'solid';
            purchaseDiv.style.borderBottomWidth = '0.2vh'; 
            purchaseDiv.style.borderBottomColor = 'lightgray'; 
            purchaseDiv.style.backgroundColor = 'dimgray';
            purchaseDiv.style.height = '15vh';
            purchaseDiv.style.position = 'relative';
            purchaseDiv.style.width = '110%';

            const image = document.createElement("img");
            image.src = purchase.productIMG; 
            image.style.width = '30%';
            image.style.height = '100%';
            image.style.left = '5%';
            image.style.top = '10%';

            const infoContainer = document.createElement("div");
            infoContainer.className = 'infoContainer';
            infoContainer.style.position = 'absolute';
            infoContainer.style.height = '100%';
            infoContainer.style.width = '70%';
            infoContainer.style.left = '30%';
            infoContainer.style.top = '0%';
            infoContainer.style.color = 'white';
            infoContainer.style.fontSize = '1.6vh';
            infoContainer.backgroundColor = 'none';
            infoContainer.style.overflowY = 'scroll';
            infoContainer.style.alignItems = "center"; 
            infoContainer.style.display = "flex";
            infoContainer.style.flexDirection = "column"; 

                                          
            const dateNode =  document.createElement("div");
            dateNode.textContent = `Date Purchased: ${purchase.datePurchased}`;

            const firstNameDiv = document.createElement("div");
            firstNameDiv.textContent = `Buyer: ${purchase.firstName}`;

            const priceDiv = document.createElement("div");
            priceDiv.textContent = `Price: ${purchase.price.$numberDecimal} ETH`;

            dateNode.style.width = '80%';
            dateNode.style.height = '33%';
            dateNode.style.fontSize = '1.6vh';
            dateNode.style.display = 'flex'; 
            dateNode.style.alignItems = 'center'; 
            dateNode.className = 'dateNode';

            firstNameDiv.style.width = '80%';
            firstNameDiv.style.height = '33%';
            firstNameDiv.style.fontSize = '1.6vh';
            firstNameDiv.style.display = 'flex'; 
            firstNameDiv.style.alignItems = 'center'; 
            firstNameDiv.className = 'purchasesfirstNameDiv';
            priceDiv.style.width = '80%';
            priceDiv.style.height = '33%';
            priceDiv.style.fontSize = '1.6vh';
            priceDiv.style.display = 'flex'; 
            priceDiv.style.alignItems = 'center';
            priceDiv.className = 'purchasesPriceDiv';
        
            infoContainer.appendChild(dateNode);
            infoContainer.appendChild(priceDiv);
            infoContainer.appendChild(firstNameDiv);

            purchaseDiv.appendChild(image);
            purchaseDiv.appendChild(infoContainer);
            recentSells.appendChild(purchaseDiv);


            if(purchaseIndex == 0){
                purchaseIndex  = purchaseIndex +1; 
                purchaseDiv.style.borderTopLeftRadius = '2vh'; 
                purchaseDiv.style.borderTopRightRadius = '2vh'; 
            }else{
                // dont do anything keep broder flat for the rest of the elements
            }


        });
    }


    headerTextContainer.style.height = '90%';
    headerTextContainer.style.width = '46.5%';
    headerTextContainer.style.top = '0%'; 
    headerTextContainer.style.left = '0.0%';
    headerTextContainer.style.position = 'absolute';
    headerTextContainer.style.backgroundColor = 'none';
    headerTextContainer.classList = 'headerTextContainer'; 

    headertext.style.height = '100%';
    headertext.style.width = '70%';
    headertext.style.top = '0%'; 
    headertext.style.left = '9%';
    headertext.style.position = 'absolute';
    headertext.style.display = 'block';
    headertext.style.backgroundColor = 'none'; 
    headertext.style.backgroundImage = 'url("/images/BursonSKullText.png")'; 
    headertext.style.backgroundSize = 'cover';
    headertext.style.backgroundRepeat = 'no-repeat';
    headertext.style.backgroundPosition = 'center'; 

    headertext.style.fontSize = '6vh';
    headertext.style.top = '0%';
    headertext.classList.add('header-text');

    backButtonContainer.style.height = '90%';
    backButtonContainer.style.width = iconHeaderWidth;
    backButtonContainer.style.top = '7%'; 
    backButtonContainer.style.left = '43.5%';
    backButtonContainer.style.position = 'absolute';
    backButtonContainer.style.backgroundColor = 'none'; 
    backButtonContainer.classList.add('backButtonContainer');
    
    backButton.style.position = 'absolute'; 
    backButton.style.width = '70%';
    backButton.style.height = '70%';
    backButton.style.left = '15%';
    backButton.style.top = '10%';
    backButton.style.borderRadius = '1vh';
    backButton.classList.add('back-button');
    backButton.style.backgroundImage = 'url("/images/Homeicon.png")'; 
    backButton.style.backgroundSize = 'contain';
    backButton.style.backgroundRepeat = 'no-repeat';
    backButton.style.backgroundPosition = 'center'; 

    backButton.addEventListener('click', function() {
        paintingClicked = false;
        const body = document.body;
        while (body.firstChild) {
            body.removeChild(body.firstChild);
        }

        const newBodyContent = `
            <div class="Header">
                <div class="buttonContainer"></div>
            </div>
            <div class="Grid_container">
                <div class="Navigation_section">
                    <div class="Physical_art"></div>
                    <div class="Digitial_art"></div>
                    <div class="Math_research"></div>
                    <div class="Upcoming_events"></div>
                </div>
            </div>
        `;

        body.innerHTML = newBodyContent;

        checkifConnected().then(() => {
            if(!isConnected){ 
                const thisConnectBUtton =  document.querySelector(".connect-button");

                if(thisConnectBUtton){
                    thisConnectBUtton.addEventListener("click", async function() {
                        makeConnection(); 
                        addMetaMaskListener();
                        //addCoinbaseListener();
                    });
                }else{
                    console.log('User is loggedin or metamask not found');
                }
            }else{
                const thisLoggedInBUtton = document.querySelector('.loggedIn-button');

                if(thisLoggedInBUtton){
                    thisLoggedInBUtton.addEventListener("click", async function(){
                        console.log('clicking current connect button');
                        const functionNameString = 'getGreeting';
                        callContractFunction(functionNameString);
                    });
                }else{
                    console.log('cannot find the loggedIn-button');
                }

            }
        }).catch(error =>{
            console.log('cannot call the checkifConnected() function properly');
            console.log(error);
        });  

        const paintingElement = document.querySelector('.Physical_art');
        const updatesElements = document.querySelector('.Upcoming_events'); 
        const digitalElement = document.querySelector('.Digitial_art'); 
        const mathElement = document.querySelector('.Math_research'); 

        if(paintingElement){
            addPaintingElementListener(paintingElement).then(()=>{
                console.log('we added the listener to the paintingElement element');
            });   
        }else{
            console.log('cannot find new painting array');
        }


        if(digitalElement){
            digitalElement.addEventListener('click', function() {
                if(!NFTDivOverlay){
                    NFTDivOverlay = true;
                    nft_section_click(digitalElement);                   
                }
            }); 
        }else{
            console.log('cannot find digitalElement div');
        }



        if(mathElement){
            mathElement.addEventListener('click', function() {
                if(!mathOverlay){
                    mathOverlay = true;
                    math_section_click(mathElement);      
                }
            }); 
        }else{
            console.log('cannot find math element div');
        }



        if(updatesElements){
            updatesElements.addEventListener('click', function() {
                if(!updatesOverlay){
                    mathOverlay = true;
                    upcoming_section_click(updatesElements);
                }
            }); 
        }else{
            console.log('cannot find events div');
        }


    });

    commissionContainer.style.height = '90%';
    commissionContainer.style.width = iconHeaderWidth;
    commissionContainer.style.top = '7%'; 
    commissionContainer.style.left = '47.8%';
    commissionContainer.style.position = 'absolute';
    commissionContainer.style.backgroundColor = 'none'; 
    commissionContainer.className = 'commissionContainer';

    commission.style.position = 'absolute'; 
    commission.style.width = '70%';
    commission.style.height = '70%';
    commission.style.left = '17%';
    commission.style.top = '10%';
    commission.style.borderRadius = '1vh';
    commission.classList.add('commission-button');
    commission.style.backgroundImage = 'url("/images/commission.png")';
    commission.style.backgroundSize = 'contain';
    commission.style.backgroundRepeat = 'no-repeat';
    commission.style.backgroundPosition = 'center'; 


    commission.addEventListener('click', async function() {
        const containerChecker = document.querySelector('.commissionUserInputForm');
        if(containerChecker == null){
            let containerInput = document.createElement('div');
            containerInput.classList.add('container-input');
            containerInput.style.position = 'absolute';
            containerInput.style.top = '10%';
            containerInput.style.width = '450px';
            containerInput.style.height = '600px';
            containerInput.style.overflow = 'auto'; 
            containerInput.style.border = '1px solid #ccc';
            containerInput.style.borderRadius = '10px';
            containerInput.style.boxSizing = 'border-box';
            containerInput.style.background = '#9b9999';
            containerInput.style.fontFamily = 'Arial, sans-serif';
            containerInput.style.border = '1px solid black';
            containerInput.className = 'commissionUserInputForm';

            let isDragging = false;
            let offsetX = 0;
            let offsetY = 0;

            containerInput.addEventListener("mousedown", function (event) {
                offsetX = event.clientX - containerInput.getBoundingClientRect().left;
                offsetY = event.clientY - containerInput.getBoundingClientRect().top;

                isDragging = true;
                containerInput.style.cursor = "grabbing";
            });

            document.addEventListener("mousemove", function (event) {
                if (isDragging) {
                    containerInput.style.left = (event.clientX - offsetX) + "px";
                    containerInput.style.top = (event.clientY - offsetY) + "px";
                }
            });

            document.addEventListener("mouseup", function () {
                isDragging = false;
                containerInput.style.cursor = "grab";
            });
            document.body.appendChild(containerInput);

            const mediaQuery = window.matchMedia('(max-width: 768px)');

            const handleMediaQuery = (mq) => {
                if (mq.matches) {
                    const screenWidth = window.innerWidth;
                    if (screenWidth <= 360) {
                        containerInput.style.left = '0%';
                        containerInput.style.width = '330px';
                        containerInput.style.zIndex = '100000000';
                    }else if (screenWidth <= 400) {
                        containerInput.style.left = '5%';
                        containerInput.style.width = '330px';
                        containerInput.style.zIndex = '100000000';
                    }else if (screenWidth <= 450) {
                        containerInput.style.left = '11%';
                        containerInput.style.width = '330px';
                        containerInput.style.zIndex = '100000000';
                    } else if (screenWidth <= 540) {
                        containerInput.style.left = '16%';
                        containerInput.style.width = '350px';
                        containerInput.style.zIndex = '100000000';
                    } else if (screenWidth <= 770) {
                        containerInput.style.left = '20%';
                        containerInput.style.width = '400px';
                        containerInput.style.zIndex = '100000000';
                    }
                }else{
                    const parentWidth = containerInput.parentElement.clientWidth;
                    const containerWidth = containerInput.offsetWidth;
                    const leftPosition = (parentWidth - containerWidth) / 2;
                    containerInput.style.left = leftPosition + 'px';
                }
            };

            handleMediaQuery(mediaQuery);

            mediaQuery.addEventListener('change', (event) => {
                handleMediaQuery(event.target);
            });

            let container = document.createElement('div');
            container.classList.add('container');
            container.style.width = '85%';
            container.style.height = '80%';
            container.style.left = '7.5%';
            container.style.top = '10%';
            container.style.position = 'absolute';
            //container.style.padding = '20px';
            container.style.backgroundColor = 'none';
            container.style.overflowY = 'scroll';
            container.style.justifyContent = 'center'; 
            container.style.textAlign = 'center';

            container.style.flexDirection = 'column';
            container.style.alignItems = 'center'; 

            let exitDiv = document.createElement('div');
            exitDiv.classList.add('exit-div');
            exitDiv.textContent = '✖'; 
            exitDiv.style.position = 'absolute';
            exitDiv.style.top = '0%';
            exitDiv.style.right = '5%';
            exitDiv.style.height = '25px';
            exitDiv.style.width = '25px';
            exitDiv.style.cursor = 'pointer';
            exitDiv.style.fontSize = '20px'; 
            exitDiv.style.color = 'black'; 
            container.appendChild(exitDiv);
                
            exitDiv.addEventListener('click', function() {
                document.body.removeChild(containerInput);
            });


            let title = document.createElement('h2');
            title.textContent = 'Commission Form';
            title.style.textAlign = 'center';
            title.style.marginBottom = '20px';


            const formDescription = `
            Hello,

            Thank you for considering me for your commission. To get started, I'll need some information from you. Please provide your name and contact details below. Additionally, kindly include a description of the painting you have in mind, along with any specific details or preferences.

            Once you've filled out the form, I'll review your request and get back to you as soon as possible. Your input is valuable, and I'm excited to bring your vision to life!
            `;
            
            let para = document.createElement('p');
            para.textContent = formDescription;
            para.style.marginBottom = '10px';

            container.appendChild(title);

            let imageContainer = document.createElement('div');
            imageContainer.style.display = 'flex';
            imageContainer.style.justifyContent = 'center'; 

            let image = document.createElement('img');
            image.setAttribute('src', '/images/BursonSkull.png'); 
            image.setAttribute('alt', 'BursonSkullCommissionTemp'); 
            image.style.width = '100px'; 
            image.style.height = '100px'; 
            image.style.marginBottom = '20px'; 

            imageContainer.appendChild(image);
            container.appendChild(imageContainer);
            container.appendChild(para);

            let formElements = [
                { label: 'First Name', type: 'text', id: 'firstName' },
                { label: 'Last Name', type: 'text', id: 'lastName' },
                { label: 'Email', type: 'email', id: 'email' },
                { label: 'Phone', type: 'tel', id: 'phone' },
                { label: 'Address', type: 'text', id: 'address' },
                { label: 'details', type: 'textarea', id: 'details' },
                { label: 'Artwork Title', type: 'text', id: 'artworkTitle' },
                { label: 'Artwork Medium', type: 'text', id: 'artworkMedium' },
                { label: 'Artwork Size', type: 'text', id: 'artworkSize' },
                { label: 'Comments', type: 'textarea', id: 'comments' }
            ];

            let maxLabelWidth = 0;
            formElements.forEach(element => {
                maxLabelWidth = Math.max(maxLabelWidth, element.label.length);
            });

            formElements.forEach(element => {
                let formGroup = document.createElement('div');
                formGroup.classList.add('form-group');
                formGroup.style.display = 'flex';
                formGroup.style.flexDirection = 'column'; 
                formGroup.style.marginBottom = '20px';

                let label = document.createElement('label');
                label.textContent = element.label;
                label.setAttribute('for', element.id);
                label.style.fontWeight = 'bold';
                label.style.marginBottom = '5px'; 

                let input;
                if (element.type === 'textarea') {
                    input = document.createElement('textarea');
                    input.classList.add('form-input');
                    input.style.width = '87%';
                    input.style.height = '80px'; 
                    input.style.padding = '10px';
                    input.style.marginBottom = '10px';
                } else {
                    input = document.createElement('input');
                    input.setAttribute('type', element.type);
                    input.classList.add('form-input');
                    input.style.width = '87%';
                    input.style.padding = '10px';
                    input.style.marginBottom = '10px';
                }
                input.setAttribute('id', element.id);

                formGroup.appendChild(label);
                formGroup.appendChild(input);
                container.appendChild(formGroup);
            });

                // Create submit button
                let submitButton = document.createElement('button');
                submitButton.textContent = 'Submit';
                submitButton.classList.add('form-submit');
                submitButton.style.backgroundColor = '#0067b3';
                submitButton.style.color = 'white';
                submitButton.style.border = 'none';
                submitButton.style.borderRadius = '5px';
                submitButton.style.padding = '10px 20px';
                submitButton.style.cursor = 'pointer';
                submitButton.style.marginTop = '20px'; 

                submitButton.addEventListener('click', async function() {
                    let formData = {};
                    formElements.forEach(element => {
                        formData[element.id] = document.getElementById(element.id).value;
                    });
                    if(formData.phone == ''){
                       alert('Please enter a phone number before proceeding');
                    }else{
                        const ValidNumber = isValidPhoneNumber(formData.phone);
                        if(ValidNumber){
                            if(formData.artWorkSize == ''){
                                alert('Please enter the dimensions length and width of the painting your requesting!');
                            }else{
                                if(formData.details == ''){
                                    alert('Please enter a few details of your painting you request!');
                                }else{
                                    if(formData.artworkTitle == ''){
                                        alert('Please enter title for your commission!');
                                    }else{
                                        const checkMyInfo = await validateUserInfo(formData.email, formData.address, formData.firstName, formData.lastName);

                                         if(checkMyInfo.verified){
                                            console.log('trying to send commission to Db!', formData);
                                            try {
                                                const response = await fetch('/add-commission', {
                                                    method: 'POST',
                                                    headers: {
                                                        'Content-Type': 'application/json'
                                                    },
                                                    body: JSON.stringify(formData) 
                                                });

                                                if (response.ok) {
                                                    const serverMessage = await response.json();
                                                    if(serverMessage.success == true){
                                                         console.log('message came back true',serverMessage);
                                                         console.log('need to make a success div');
                                                        formElements.forEach(element => {
                                                            document.getElementById(element.id).value = '';
                                                        });
                                                        containerInput.remove();

                                                        let successDiv = document.createElement('div');
                                                        successDiv.classList.add('success-message');
                                                        successDiv.style.position = 'fixed';
                                                        successDiv.style.top = '50%';
                                                        successDiv.style.left = '50%';
                                                        successDiv.style.transform = 'translate(-50%, -50%)';
                                                        successDiv.style.width = '80%'; 
                                                        successDiv.style.maxWidth = '400px'; 
                                                        successDiv.style.background = '#ffffff';
                                                        successDiv.style.border = '1px solid #ccc';
                                                        successDiv.style.padding = '20px';
                                                        successDiv.style.textAlign = 'center';
                                                        successDiv.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
                                                        successDiv.style.zIndex = '9999'; 
                                                        successDiv.style.backgroundColor = 'lightgray';
                                                        successDiv.style.border = '1px solid black';
                                                        successDiv.style.borderRadius = '1vh';

                                                        let thankYouMessage = document.createElement('p');
                                                        thankYouMessage.textContent = 'Thank you for your commission! We have received your request and will get back to you soon.';
                                                        successDiv.appendChild(thankYouMessage);

                                                        let exitButton = document.createElement('button');
                                                        exitButton.textContent = 'Close';
                                                        exitButton.style.marginTop = '20px'; 
                                                        exitButton.style.cursor = 'pointer';
                                                        exitButton.style.backgroundColor = '#ff3333'; 
                                                        exitButton.style.color = '#ffffff';
                                                        exitButton.style.border = 'none'; 
                                                        exitButton.style.padding = '10px 20px'; 
                                                        exitButton.style.borderRadius = '5px'; 
                                                        exitButton.addEventListener('click', function() {
                                                            document.body.removeChild(successDiv); 
                                                        });
                                                        successDiv.appendChild(exitButton);

                                                        document.body.appendChild(successDiv);

                                                    }else{
                                                        console.log('message came back false', serverMessage);
                                                        formElements.forEach(element => {
                                                            document.getElementById(element.id).value = '';
                                                        });

                                                       if(serverMessage.code == 230){
                                                            alert(' You already have a commission active bro!!');
                                                            containerInput.remove();
                                                       }else if(serverMessage.code == -2){  
                                                            alert(' The result from .save() came back false');
                                                       }else if(serverMessage.code == -3){
                                                            alert(' There was an unexpected issue we could not accept your information please try again.');
                                                       }
                                                    }
                                                    console.log('Received paintings:', serverMessage);
                                                } else {
                                                    console.error('Failed to add commission alert user');
                                                }
                                            } catch (error) {
                                                console.error('Error adding painting:', error);
                                            }
                                         }else if (!checkMyInfo.verified){
                                            if(checkMyInfo.email){
                                                if(checkMyInfo.address){
                                                    if(checkMyInfo.firstName){
                                                        if(checkMyInfo.lastName){
                                                            console.log('this should never call because one of them will be false as !checkMyInfo.verified = false');
                                                        }else{
                                                             alert('Please enter a valid last Name');
                                                        }
                                                    }else{
                                                          alert('Please enter a valid First Name');
                                                    }
                                                }else{
                                                    alert('Please enter a valid address to ship package');
                                                }
                                            }else{
                                                    alert('Please enter a valid email');
                                            }
                                        }

                                    }
                                }
                            }
                        }else{
                            alert('Please enter a valid phone number');
                        }
                    }
                });
            container.appendChild(submitButton);
            containerInput.appendChild(container);
            document.body.appendChild(containerInput);
        }else{
            console.log('commission form is already active');
        }


    });

    AIbuttonContainer.style.height = '90%';
    AIbuttonContainer.style.width = iconHeaderWidth ;
    AIbuttonContainer.style.top = '7%'; 
    AIbuttonContainer.style.left = '52.8%';
    AIbuttonContainer.style.position = 'absolute';
    AIbuttonContainer.style.backgroundColor = 'none'; 
    AIbuttonContainer.className = 'AIbuttonContainer';

    AIbutton.style.position = 'absolute'; 
    AIbutton.style.width = '70%';
    AIbutton.style.height = '70%';
    AIbutton.style.left = '17%';
    AIbutton.style.top = '10%';
    AIbutton.style.borderRadius = '1vh';
    AIbutton.classList.add('commission-button');
    AIbutton.style.backgroundImage = 'url("/images/AI3.png")';
    AIbutton.style.backgroundSize = 'contain';
    AIbutton.style.backgroundRepeat = 'no-repeat';
    AIbutton.style.backgroundPosition = 'center'; 

    AIbutton.addEventListener('click', function(){
        const botChecker = document.getElementById('botContainer');
        if(botChecker == null){
            const botContainer = document.createElement('div');
            botContainer.id = 'botContainer';
            botContainer.style.width = '350px';
            botContainer.style.height = '70%';
            botContainer.style.position = 'fixed';
            botContainer.style.top = '50%';
            botContainer.style.left = '50%';
            botContainer.style.transform = 'translate(-50%, -50%)';
            botContainer.style.backgroundColor = '#9b9999';
            botContainer.style.zIndex = '9999999';
            botContainer.style.borderRadius = '2vh';
            botContainer.style.border = '1px solid black';
            if (window.innerWidth > 700) {
                botContainer.style.width = '500px';
            }
            document.body.appendChild(botContainer);


            let offsetX, offsetY;
            let isDragging = false;

            botContainer.addEventListener("mousedown", function (event) {
                isDragging = true;
                offsetX = event.clientX - parseFloat(window.getComputedStyle(botContainer).left);
                offsetY = event.clientY - parseFloat(window.getComputedStyle(botContainer).top);
            });

            document.addEventListener("mousemove", function (event) {
                if (isDragging) {
                    botContainer.style.left = (event.clientX - offsetX) + "px";
                    botContainer.style.top = (event.clientY - offsetY) + "px";
                }
            });

            document.addEventListener("mouseup", function () {
                isDragging = false;
                botContainer.style.cursor = "grab";
            });

            const responseDiv = document.createElement('div');
            responseDiv.id = 'responseDiv';
            responseDiv.style.width = '90%';
            responseDiv.style.height = '68%';
            responseDiv.style.top = '5%';
            responseDiv.style.margin = '2% auto'; 
            responseDiv.style.backgroundColor = 'none';
            responseDiv.style.border = '1px solid black';
            responseDiv.style.overflowY = 'auto';
            responseDiv.style.position = 'relative';
            responseDiv.style.backgroundImage = 'url("/images/BursonSkull.png")';
            responseDiv.style.backgroundSize = 'contain';
            responseDiv.style.backgroundRepeat = 'no-repeat';
            responseDiv.style.backgroundPosition = 'center'; 
            responseDiv.style.borderRadius = '1vh';
            responseDiv.style.overflowY = 'hidden';
            botContainer.appendChild(responseDiv);

            const overlay = document.createElement('div');
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.position = 'absolute';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.backgroundColor = 'black';
            overlay.style.opacity = '0.73';
            //overlay.style.overflowY = 'scroll';

            responseDiv.appendChild(overlay);

            const overlayMain = document.createElement('div');
            overlayMain.style.width = '100%';
            overlayMain.style.height = '100%';
            overlayMain.style.top = '0';
            overlayMain.style.left = '0';
            overlayMain.style.backgroundColor = 'black';
            overlayMain.style.opacity = '0.70';
            overlayMain.style.color = 'white';
            overlayMain.style.overflowY = 'scroll';
            overlayMain.style.display = 'flex';
            overlayMain.style.flexDirection = 'column';
            overlayMain.style.justifyContent = 'flex-start'; 
            overlayMain.style.alignItems = 'center'; 
            overlayMain.style.overflowY = 'scroll';

            // Hide scrollbar for Chrome, Safari, and Opera
            //overlayMain.style.webkitOverflowScrolling = 'auto';
            //overlayMain.style.webkitScrollbar = 'auto';

            overlay.appendChild(overlayMain);

            overlayMain.style.fontSize = '2vh';
           
            const inputParent = document.createElement('div');
            inputParent.style.position = 'absolute';
            inputParent.style.bottom = '7.2%'; 
            inputParent.style.width = '90%'; 
            inputParent.style.height = '8.5%'; 
            inputParent.style.left = '3.2%'; 
            botContainer.appendChild(inputParent);

            const inputContainer = document.createElement('input');
            inputContainer.id = 'inputContainer';
            inputContainer.type = 'text';
            inputContainer.style.border = 'none';
            inputContainer.style.position = 'relative';
            inputContainer.placeholder = 'Type here...';
            inputContainer.style.width = '100%'; 
            inputContainer.style.height = '100%'; 
            inputContainer.style.left = '0%'; 
            inputParent.appendChild(inputContainer);

            inputContainer.addEventListener('keydown', async function(event) {
                if (event.key === 'Enter') {
                    const userInput = inputContainer.value;
                    if(userInput == ''){
                        // dont evaluate empty string
                    }else{
                        try{
                            if(clientCanSendAIfetchRequest){
                                overlayMain.innerHTML = '';
                                let thisIndex = -1;
                                let response = await getResponse(userInput);
                                inputContainer.value = '';
                                if(response != null){
                                    if(response.code == 4){
                                        overlayMain.innerHTML = '';
                                        clientCanSendAIfetchRequest = false;
                                        writeToParentDivWithDelay(response.serverMessage, overlayMain, 10,thisIndex);
                                        setTimeout(() => {
                                            clientCanSendAIfetchRequest = true;
                                        }, 48 * 60 * 60 * 1000);
                                    }else{
                                        console.log(response);

                                        if(response.serverAIResponse.length>0){
                                             console.log(response.serverAIResponse);
                                            for(const serverRSPDS of response.serverAIResponse){
                                                thisIndex +=1;
                                                console.log(serverRSPDS);
                                                writeToParentDivWithDelay(serverRSPDS[0].rsp, overlayMain, 10,thisIndex);
                                            }
                                        }else{
                                            console.log('unexpected error we did not get back an array', response.serverAIResponse);
                                        }

                                    }

                                }else{
                                    writeToParentDivWithDelay("there was an unexpected error", overlayMain, 10, 1);
                                }
                            }else{
                                overlayMain.innerHTML = '';
                                const restrictedString = "We're sorry, but you've exceeded the maximum number of AI requests allowed within a 48-hour period. For security and system stability reasons, we kindly ask you to wait for 48 hours before making additional requests. Thank you for your understanding and cooperation.";
                                writeToParentDivWithDelay(restrictedString, overlayMain, 10,1);
                            }
                            overlayMain.style.marginTop = '20px';
                            overlayMain.style.height = `calc(100% - 20px)`; 
                        }catch(error){
                            console.log(error);
                            writeToParentDivWithDelay("there was an unexpected error", overlayMain, 10,1);
                        }  
                    }

                    
                }
            });
            const exitButton = document.createElement('div');
            exitButton.id = 'exitButton';
            exitButton.textContent = '❌';
            exitButton.style.position = 'absolute';
            exitButton.style.top = '1%';
            exitButton.style.right = '95%';
            exitButton.style.width = '5%';
            exitButton.style.height = '5%'; 
            exitButton.style.fontSize = '2vh';
            exitButton.style.border = 'none'; 
            exitButton.style.background = 'none'; 
            exitButton.style.cursor = 'pointer'; 
            exitButton.addEventListener('click', function() {
                botContainer.remove();
            });
            botContainer.appendChild(exitButton);


            inputContainer.addEventListener('keypress', function(event) {
                if (event.key === 'Enter') {
                    console.log('User typed:', inputContainer.value);
                    inputContainer.value = ''; 
                }
            }); 
        }else{
            console.log('AI container already exist');
        }
    });

    gridFowardContainer.style.height = '90%';
    gridFowardContainer.style.width = iconHeaderWidth;
    gridFowardContainer.style.top = '7%'; 
    gridFowardContainer.style.left = '39%';
    gridFowardContainer.style.position = 'absolute';
    gridFowardContainer.style.backgroundColor = 'none'; 
    gridFowardContainer.className = 'gridFowardContainer';

    gridFowardContainer.addEventListener('click', function() {
        let totalPageNumbers = Math.ceil(currentPaintingArray.length / 24);
        console.log('total pages = ', totalPageNumbers);

        if(gridPageNumber < totalPageNumbers){
            gridPageNumber += 1;
            let startIndex = (gridPageNumber - 1) * 24;
            let endIndex = Math.min(gridPageNumber * 24, currentPaintingArray.length); 
            let newGridArray = currentPaintingArray.slice(startIndex, endIndex);
            let thisGridContainer = document.querySelector('.NewGrid');
            thisGridContainer.innerHTML = '';
            makeNewGrid(newGridArray, thisGridContainer);
        }else{
            alert('Shuffling pages in the Grid is unavailable until Roy makes over 24 paintings. Each page will have 24 Paintings.');
        }

    });

    gridFoward.style.position = 'absolute'; 
    gridFoward.style.width = '70%';
    gridFoward.style.height = '70%';
    gridFoward.style.left = '17%';
    gridFoward.style.top = '10%';
    gridFoward.style.borderRadius = '1vh';
    gridFoward.classList.add('gridFoward-button');
    gridFoward.style.backgroundImage = 'url("/images/righticon3.png")';
    gridFoward.style.backgroundSize = 'contain';
    gridFoward.style.backgroundRepeat = 'no-repeat';
    gridFoward.style.backgroundPosition = 'center'; 

    gridBackContainer.style.height = '90%';
    gridBackContainer.style.width = iconHeaderWidth;
    gridBackContainer.style.top = '7%'; 
    gridBackContainer.style.left = '34%';
    gridBackContainer.style.position = 'absolute';
    gridBackContainer.style.backgroundColor = 'none'; 
    gridBackContainer.className = 'gridBackContainer';


    gridBackContainer.addEventListener('click', function() {
        if(gridPageNumber >1){
            gridPageNumber -= 1;
            let startIndex = (gridPageNumber - 1) * 24;
            let endIndex = Math.min(gridPageNumber * 24, currentPaintingArray.length); 
            let newGridArray = currentPaintingArray.slice(startIndex, endIndex);
            let thisGridContainer = document.querySelector('.NewGrid');
            thisGridContainer.innerHTML = '';
            makeNewGrid(newGridArray, thisGridContainer);
        }else{
            alert('we are on page 1 of the paintings!');
        }

    });


    gridBack.style.position = 'absolute'; 
    gridBack.style.width = '70%';
    gridBack.style.height = '70%';
    gridBack.style.left = '17%';
    gridBack.style.top = '10%';
    gridBack.style.borderRadius = '1vh';
    gridBack.classList.add('gridBack-button');
    gridBack.style.backgroundImage = 'url("/images/leftIcon3.png")';
    gridBack.style.backgroundSize = 'contain';
    gridBack.style.backgroundRepeat = 'no-repeat';
    gridBack.style.backgroundPosition = 'center'; 

    header.style.backgroundColor = '#9b9999';
    header.style.boxShadow =  '0px 2px 4px rgba(0, 0, 0, 0.7)'; 


    headerLogo.style.position = 'absolute'; 
    headerLogo.style.height = '8.5vh'
    headerLogo.style.width = '10%'; 
    headerLogo.style.left = '0%'; 
    headerLogo.style.top = '0%';

    headerLogo.style.backgroundColor = 'none'; 
    headerLogo.style.backgroundImage = 'url(/images/BursonSkull.png)';
    headerLogo.style.backgroundSize = 'contain';
    headerLogo.style.backgroundRepeat = 'no-repeat';
    headerLogo.style.backgroundPosition = 'center';


    header.appendChild(headerLogo);
    headerTextContainer.appendChild(headertext);
    header.appendChild(headerTextContainer);
    gridFowardContainer.appendChild(gridFoward);
    header.appendChild(gridFowardContainer);
    gridBackContainer.appendChild(gridBack);
    header.appendChild(gridBackContainer);


    makePaintGrid(array, parentElement, numColumns, gridWidthPercent);

    footer.style.position = 'relative';
    footer.style.height = '65vh';
    footer.style.width = '100%';
    footer.style.left = '0%';
    footer.style.bottom = '0%';
    footer.style.backgroundColor = '#9b9999';
    footer.style.zIndex = '10';
    footer.style.marginTop = '3vh';
    footer.style.boxShadow = '0px -2px 4px rgba(0, 0, 0, 0.7)';
    footer.className = 'footer';

    footerLEGAL.style.position = 'relative';
    footerLEGAL.style.height = '10vh';
    footerLEGAL.style.width = '100%';
    footerLEGAL.style.left = '0%';
    footerLEGAL.style.bottom = '0%';
    footerLEGAL.style.backgroundColor = '#9b9999';
    footerLEGAL.style.zIndex = '10';
    footerLEGAL.style.marginTop = '0vh';

    footerLine.style.backgroundColor = 'dimgray';
    footerLine.style.width = '70%';
    footerLine.style.left = '15%';
    footerLine.style.height = '0.4vh';
    footerLine.style.border = 'none';
    footerLine.style.marginTop = '0vh';

    footContainer.style.position = 'absolute'; 
    footContainer.style.height = '50%'
    footContainer.style.width = '70%'; 
    footContainer.style.left = '15%'; 
    footContainer.style.bottom = '10%';
    footContainer.style.borderTop = "0.4vh solid dimgray"; 
    footContainer.style.backgroundColor = 'none'; 

    logoContainer.style.position = 'absolute'; 
    logoContainer.style.height = '30%'
    logoContainer.style.width = '70%'; 
    logoContainer.style.left = '15%'; 
    logoContainer.style.top = '10%';

    footerLargeTextContainer.style.position = 'absolute'; 
    footerLargeTextContainer.style.height = '100%'
    footerLargeTextContainer.style.width = '75%'; 
    footerLargeTextContainer.style.right = '5%'; 
    footerLargeTextContainer.style.top = '0%';
    footerLargeTextContainer.style.backgroundImage = 'url("/images/BursonSKullText.png")'; 
    footerLargeTextContainer.style.backgroundSize = 'cover';
    footerLargeTextContainer.style.backgroundRepeat = 'no-repeat';
    footerLargeTextContainer.style.backgroundPosition = 'center';


    logo.style.position = 'relative'; 
    logo.style.height = '100%'
    logo.style.width = '15%'; 
    logo.style.left = '10%'; 
    logo.style.backgroundImage = 'url(/images/BursonSkull.png)';
    logo.style.backgroundSize = 'contain';
    logo.style.backgroundRepeat = 'no-repeat';
    logo.style.backgroundPosition = 'center';

    var row = document.createElement("div");
    row.classList.add("row");
    for (var i = 1; i <= 3; i++) {
        var column = document.createElement("div");
        column.classList.add("column");
        var heading = document.createElement("h3");
        heading.style.fontSize = '3vh';

        if(i == 1){
            heading.textContent = "Links"; 
        }else if(i == 2){
            heading.textContent = "Community";  
            column.style.borderLeft = "0.4vh solid dimgray"; 
            column.style.borderRight = "0.4vh solid dimgray"; 
        }else if(i == 3){
            heading.textContent = "Resources";
        }

        column.appendChild(heading);

        if(i==1){
            const communityListItems = Array.from(commnityList.children);
            communityListItems.forEach(function(item) {
                item.setAttribute('href', 'https://www.google.com');
                item.style.cursor = 'pointer';
            });
            column.appendChild(linkList);
        }else if(i ==2){
            column.appendChild(commnityList);
        }else if(i ==3){
            column.appendChild(resourcesList);
        }

        row.appendChild(column);
    }

    footContainer.appendChild(row);
    createSearchBar(header);
    if(isConnected == true && window.ethereum.selectedAddress == RoysWallet){
        createDatabaseUtility(header);
    }else{
        // do nothing
    }
    

    parentElement.appendChild(tree);

    parentElement.appendChild(acceptableCoins);
    parentElement.appendChild(recentSells);
    parentElement.appendChild(unknownDiv);


    backButtonContainer.appendChild(backButton);
    header.appendChild(backButtonContainer);

    commissionContainer.appendChild(commission);

    header.appendChild(commissionContainer);

    AIbuttonContainer.appendChild(AIbutton);
    header.appendChild(AIbuttonContainer);

    logoContainer.appendChild(logo);
    logoContainer.appendChild(footerLargeTextContainer); 
    footer.appendChild(logoContainer);
    footer.appendChild(footContainer);
    footerLEGAL.appendChild(footerLine);
    
    parentElement.appendChild(footer);
    parentElement.appendChild(footerLEGAL);
}

function isValidPhoneNumber(phoneNumber) {
    let phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    return phoneRegex.test(phoneNumber);
}

export async function callContractFunction(contractFunctionName){
    // define globally so we dont have to keep making each time we call function to blockchain
    const baycContractAddress = '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D'; // Example Bored Ape Yacht Club contract address
    const baycContractAbi = [{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"},{"internalType":"uint256","name":"maxNftSupply","type":"uint256"},{"internalType":"uint256","name":"saleStart","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"BAYC_PROVENANCE","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_APES","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"REVEAL_TIMESTAMP","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"apePrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"baseURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"emergencySetStartingIndexBlock","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"flipSaleState","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxApePurchase","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"numberOfTokens","type":"uint256"}],"name":"mintApe","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"reserveApes","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"saleIsActive","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"baseURI","type":"string"}],"name":"setBaseURI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"provenanceHash","type":"string"}],"name":"setProvenanceHash","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"revealTimeStamp","type":"uint256"}],"name":"setRevealTimestamp","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"setStartingIndex","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"startingIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"startingIndexBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}];
    if(contractFunctionName === 'getGreeting'){
        console.log(' trying to call getGreeting() on solidiity');
        if (typeof window.ethereum !== 'undefined') {
            // Use MetaMask's provider
            try{
                const web3 = new Web3(window.ethereum);
                // Request account access if needed
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                // Create a contract instance
                console.log(`trying to set contract instance and call functions for: ${baycContractAddress}`);
                //const contract = new web3.eth.Contract(BursonSkullzContractAbi, contractAddress);
                const contract = new web3.eth.Contract(baycContractAbi, baycContractAddress);

                // Interact with your contract functions
                // Example: Call a function named 'myFunction' with some arguments
                const accounts = await web3.eth.getAccounts();
                const account = accounts[0];
                console.log('access to contract granted', contract);
                console.log('Contract methods:', contract._methods);
 

                //const nft = await contract_methods.nfts(tokenId).call();
                //const price = nft.price; // price is already in WEI

                // purchase NFT with specifiec amount
                //const tx = await contract.methods.purchaseSingleToken(tokenId).send({ from: account, value: price });


                const networkId = await web3.eth.net.getId();
                console.log('Network ID:', networkId);
                const result = await contract._methods.name().call();//.call({ from: account,  gas: 1000000 });
                console.log('Function call result:', result);
            }catch(error){
                console.log('Error accessing the contract', error);
            }
        } else {
            console.log('No Web3 provider found. Please install MetaMask!');
        }
    }else{
        console.log('calling a function that is not setup yet');
    }
}
/*
const tokenId = 1; // Example tokenId
const price = await contract.methods.nfts(tokenId).call().then(nft => nft.price); // Get the price from the contract

web3.eth.getAccounts().then(accounts => {
    const sender = accounts[0];
    contract.methods.purchaseSingleToken(tokenId).send({ from: sender, value: price })
        .on('receipt', function(receipt) {
            console.log('Transaction successful:', receipt);
        })
        .on('error', function(error) {
            console.error('Transaction failed:', error);
        });
});

*/

export function addMessage(message, username, timestamp) {
    msgCount +=1 ; 
    const p = document.createElement('p');
    p.textContent = message;
    p.style.height = 'auto';
    p.style.position = 'relative'; 


    const usernameDiv = document.createElement('div');
    usernameDiv.textContent = username;
    usernameDiv.style.position = 'absolute'; 
    usernameDiv.style.top = '0%'; 
    usernameDiv.style.left = '0%'; 
    usernameDiv.style.padding = '4px'; 
    usernameDiv.style.backgroundColor = 'transparent'; 
    usernameDiv.style.color = 'black'; 
    usernameDiv.style.fontSize = '1.5vh'; 
    usernameDiv.style.borderTopLeftRadius = '5px'; 
    usernameDiv.style.borderBottomRightRadius = '5px'; 
    usernameDiv.style.marginBottom = '2vh';
    usernameDiv.classList.add('message-username');

    const timestampDiv = document.createElement('div');
    timestampDiv.textContent = timestamp;
    timestampDiv.style.position = 'absolute'; 
    timestampDiv.style.bottom = '0%';
    timestampDiv.style.right = '0%'; 
    timestampDiv.style.padding = '0 5px'; 
    timestampDiv.style.backgroundColor = 'transparent'; 
    timestampDiv.style.color = 'white'; 
    timestampDiv.style.fontSize = '1.2vh'; 
    timestampDiv.style.marginTop = '2vh';

    const localChatBox = document.querySelector('.chatBox');
    localChatBox.appendChild(p);

    p.style.maxWidth = '80%';
    p.style.wordWrap = 'break-word'; 
    p.style.backgroundColor = 'dimgray';
    p.style.fontSize = '1.5vh';
    p.style.marginBottom = '10px';
    p.style.marginTop = '0px';
    p.style.overflowY = 'auto';

    p.style.borderBottomStyle = 'solid';
    p.style.borderBottomWidth = '0.2vh'; 
    p.style.borderBottomColor = 'lightgray'; 

    p.style.padding = '4vh'; 
    p.style.color = 'white';

    p.style.scrollbarWidth = 'thin'; 
    p.style.scrollbarColor = 'transparent dimgray'; 
    localChatBox.scrollTop = localChatBox.scrollHeight;

    p.classList.add('live-Messages');
    p.setAttribute('id', username + "Message" + msgCount.toString()); 

    p.appendChild(usernameDiv);
    p.appendChild(timestampDiv);
        
}



export async function checkifConnected(){
    let connectButtton = document.createElement("div"); 
    let loggedInButton = document.createElement("div"); 
    let buttonContainer = document.querySelector('.buttonContainer');

    loggedInButton.classList.add('loggedIn-button');
    connectButtton.classList.add('connect-button');

    let greenLight = document.createElement('div');
    greenLight.classList.add('green-light');

    if(typeof window.ethereum == 'undefined'){
        isConnected = false; 
        buttonContainer.appendChild(connectButtton);

        connectButtton.style.boxShadow = '0px 0px 15px rgba(0, 0, 0, 0.5)'; 

        const buttonPTAG = document.createElement('p');
        buttonPTAG.innerHTML = 'Connect';
        buttonPTAG.classList.add('centered-text');

        buttonPTAG.style.position = 'relative';
        buttonPTAG.style.width = '100%';
        buttonPTAG.style.height = '100%';
        buttonPTAG.style.top = '0%';
            //buttonPTAG.style.left = '0%';
        buttonPTAG.style.margin = '0%';
        buttonPTAG.style.fontSize = '1.5vh';

        buttonPTAG.style.display = 'flex';
        buttonPTAG.style.justifyContent = 'center';
        buttonPTAG.style.alignItems = 'center';
        connectButtton.appendChild(buttonPTAG);
    }else{
        if(window.ethereum.selectedAddress != null && window.ethereum.isMetaMask){ 
            isConnected = true; 
            buttonContainer.appendChild(greenLight);
            buttonContainer.appendChild(loggedInButton);


            const connectButtonPTAG = document.createElement('p');

            connectButtonPTAG.innerHTML = window.ethereum.selectedAddress.substring(0, 8) + '~~~';
            connectButtonPTAG.classList.add('centered-text'); 

            connectButtonPTAG.style.position = 'relative';
            connectButtonPTAG.style.width = '70%';
            connectButtonPTAG.style.height = '100%';
            connectButtonPTAG.style.top = '30%';
            connectButtonPTAG.style.left = '7%';
            connectButtonPTAG.style.margin = '0%';
            connectButtonPTAG.style.fontSize = '1.5vh';
            loggedInButton.appendChild(connectButtonPTAG);
            toggleGreenLight(); 
        }else{
                try {
                    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                    
                    if (accounts.length > 0 && window.ethereum.isMetaMask) {
                        isConnected = true; 
                        buttonContainer.appendChild(greenLight);
                        buttonContainer.appendChild(loggedInButton);
                        const connectButtonPTAG = document.createElement('p');

                        connectButtonPTAG.innerHTML = accounts[0].substring(0, 8) + '~~~'; 
                        connectButtonPTAG.classList.add('centered-text'); 

                        connectButtonPTAG.style.position = 'relative';
                        connectButtonPTAG.style.width = '70%';
                        connectButtonPTAG.style.height = '100%';
                        connectButtonPTAG.style.top = '30%';
                        connectButtonPTAG.style.left = '7%';
                        connectButtonPTAG.style.margin = '0%';
                        connectButtonPTAG.style.fontSize = '1.5vh';
                        loggedInButton.appendChild(connectButtonPTAG);
                        toggleGreenLight(); 
                    } else {
                        console.log('MetaMask is installed but not connected.');
                        isConnected = false; 
                        buttonContainer.appendChild(connectButtton);

                        connectButtton.style.boxShadow = '0px 0px 15px rgba(0, 0, 0, 0.5)'; 

                        const buttonPTAG = document.createElement('p');
                        buttonPTAG.innerHTML = 'Connect';
                        buttonPTAG.classList.add('centered-text');

                        buttonPTAG.style.position = 'relative';
                        buttonPTAG.style.width = '100%';
                        buttonPTAG.style.height = '100%';
                        buttonPTAG.style.top = '0%';
                        //buttonPTAG.style.left = '0%';
                        buttonPTAG.style.margin = '0%';
                        buttonPTAG.style.fontSize = '1.5vh';

                        buttonPTAG.style.display = 'flex';
                        buttonPTAG.style.justifyContent = 'center';
                        buttonPTAG.style.alignItems = 'center';
                        connectButtton.appendChild(buttonPTAG);
                    }
                } catch (error) {
                    console.error('Error requesting accounts from MetaMask:', error);
                }

            
        }
    }
    
}

async function createChangeUsernamePopup() {

    if(changeUserNamePopUpExist){
        console.log('popup already exist');
    }else{
        changeUserNamePopUpExist = true;

        const popupContainer = document.createElement('div');
        popupContainer.classList.add('popup-container');
        popupContainer.style.position = 'absolute';
        popupContainer.style.top = '50%';
        popupContainer.style.left = '50%';
        popupContainer.style.width = '340px';
        popupContainer.style.height = '150px';
        popupContainer.style.transform = 'translate(-50%, -50%)';
        popupContainer.style.backgroundColor = 'lightgray';
        popupContainer.style.padding = '20px';
        popupContainer.style.border = '2px solid #000';
        popupContainer.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';
        popupContainer.style.zIndex = '9999';
        popupContainer.style.display = 'flex';
        popupContainer.style.flexDirection = 'column';
        popupContainer.style.alignItems = 'center';

        const usernameInput = document.createElement('input');
        usernameInput.setAttribute('type', 'text');
        usernameInput.setAttribute('placeholder', 'Enter new username');
        usernameInput.style.width = '100%';
        usernameInput.style.marginBottom = '10px';

        const submitButton = document.createElement('button');
        submitButton.textContent = 'Submit';
        submitButton.style.position = 'absolute'; 
        submitButton.style.bottom = '7%'; 
        submitButton.style.left = '30%'; 
        submitButton.style.display = 'inline-block';

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.style.position = 'absolute'; 
        cancelButton.style.bottom = '7%'; 
        cancelButton.style.right = '30%'; 
        cancelButton.style.display = 'inline-block'; 

        cancelButton.addEventListener('click', () => {
            document.body.removeChild(popupContainer);
            changeUserNamePopUpExist = false;
        });


        submitButton.addEventListener('click', async () => {
            const newUsername = usernameInput.value;
            if (newUsername.length > 30 && newUsername.length <=3 ) {
                alert('Username must be no smaller then 3 letters and no larger than 30 letters.');
                return;
            }
            try{
                const response = await fetch('/UpdateUsername', {
                    method: 'POST', 
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({newUsername:  newUsername})
                });
                    if (!response.ok) {
                        console.log('response is not okay');
                    }else{
                        console.log('trying to return data we got from server');
                        const data = await response.json();

                        if(data.success == true){
                            const chatBox = document.querySelector('.chatBox');
                            const pTags = chatBox.querySelectorAll('.live-Messages');
                            if(pTags){
                                pTags.forEach(pTag => {  
                                    const thisName = pTag.querySelectorAll('.message-username');                               
                                    if(thisName[0].innerHTML == data.oldName){
                                        thisName[0].innerHTML = data.newName;
                                    }else{

                                    }
                                });
                            }else{
                                console.log('cannot find any messages might be empty');
                            }
                            document.body.removeChild(popupContainer);
                            changeUserNamePopUpExist = false;
                        }else{
                            if(data.code == 101){
                                alert('You have exceeded the Max number of times that you can change your name');
                            }else if(data.code == 201) {
                                alert('invalid username please choose another');
                            }else if(data.code == 301) {
                                alert('Your request for a new username is invalid. The string must be between 3 and 30 letters and or symbols long');
                            } else{
                                alert('Your request for a new username was not processed. Please try again at a later time. ');
                            }
                        }
                    }

            }catch(error){
                console.log('error with response from server try and catch failed', error);
            }

            
        });

        const attemptsMessage = document.createElement('p');
        attemptsMessage.textContent = 'Thanks for wanting a name change. Remember, you only have 7 total attempts.';
        attemptsMessage.style.marginTop = '10px';

        popupContainer.appendChild(usernameInput);
        popupContainer.appendChild(submitButton);
        popupContainer.appendChild(cancelButton);
        popupContainer.appendChild(attemptsMessage);
        document.body.appendChild(popupContainer);
    }
    
}
function toggleGreenLight() {
    var greenLight = document.querySelector('.green-light');
    var isGreen = false;

    setInterval(function() {
        isGreen = !isGreen;
        greenLight.style.backgroundColor = isGreen ? 'green' : 'transparent';
        }, 600); 
}


function removeString(parentElement, searchString) {
    searchString = searchString.toLowerCase();
    function searchAndRemove(element) {
        for (let node of element.childNodes) {
            if (node.nodeType === Node.TEXT_NODE) {
                let textContent = node.textContent;
                let regex = new RegExp(`(["'\\[\\]])?${searchString}(["'\\[\\]])?`, 'gi');
                node.textContent = textContent.replace(regex, '');
            }
            else if (node.nodeType === Node.ELEMENT_NODE) {
                searchAndRemove(node);
            }
        }
    }
    searchAndRemove(parentElement);
}



export function addMetaMaskListener() {
    
    const metamaskConnectButton = document.querySelector('.Metamask'); 

    metamaskConnectButton.addEventListener('click', async function(){ 
        if(typeof window.ethereum == 'undefined'){
            alert('Metamask is not installed or the browser cannot detect it');
        }else{
            if(window.ethereum.isMetaMask){
                try {
                    await window.ethereum.request({ method: 'eth_requestAccounts' }); 
                    window.location.reload();
                } catch (error) {
                    if(error.code = -32002){
                         alert('Please open the MetaMask extension manually sign in and reload the page.');
                    }else{
                        alert(error);
                    }
                 }
            }else {
                alert('MetaMask not detected. Please install MetaMask to use this feature. Also please use desktop if you are experiencing trouble');
            }
        }

    });
}




if(typeof window.ethereum !== 'undefined'){
    window.ethereum.on('accountsChanged', function (accounts) { 
        if (accounts.length === 0) {
            console.log('User logged out or disconnected');
        } else {
               const currentAddress = accounts[0];
               console.log('New current wallet address:', currentAddress);
             if(isConnected){
                document.querySelector(".centered-text").innerHTML = currentAddress.substring(0, 8) + '~~~';
             }
                
        }
    });
}else{
    alert('metamask or other ethereum wallet provider is not present in the browser extensions or is not detected');
}


function showScrollUpArrow() {
  console.log('We are scrolling');
}

function ScrollDownArrow() {
   console.log('make Down arrow');
}




function createDatabaseUtility(parentElement){
    var dbIconContainer = document.createElement("div");

    dbIconContainer.classList.add("dbIcon-container");

    var addButton = document.createElement("div");
    var deleteButton = document.createElement("div");

    dbIconContainer.style.position = 'absolute';
    dbIconContainer.style.height = '54%';
    dbIconContainer.style.right = '10%';
    dbIconContainer.style.top = '30%';
    dbIconContainer.style.width = '4.6%';
    dbIconContainer.style.backgroundColor = 'none';

    addButton.style.position = 'absolute';
    addButton.innerHTML = '<span style="margin-left: 5px;">➕</span>';
    addButton.style.height = '100%';
    addButton.style.right = '0%';
    addButton.style.top = '0%';
    addButton.style.width = '50%';
    addButton.style.display = 'flex';
    addButton.style.alignItems = 'center';
    addButton.style.justifyContent = 'center';
    addButton.className = 'add-to-DB';

    deleteButton.style.position = 'absolute';
    deleteButton.innerHTML = '<span style="margin-left: 5px;">➖</span>';
    deleteButton.style.height = '100%';
    deleteButton.style.left = '0%';
    deleteButton.style.top = '0%';
    deleteButton.style.width = '50%';
    deleteButton.style.display = 'flex';
    deleteButton.style.alignItems = 'center';
    deleteButton.style.justifyContent = 'center';
    deleteButton.className = 'minus-to-DB';

    dbIconContainer.appendChild(addButton);
    dbIconContainer.appendChild(deleteButton);



    addButton.addEventListener('mouseenter', function() {
        addButton.style.transform = 'translateY(-2px)';
    });
    addButton.addEventListener('mouseleave', function() {
        addButton.style.transform = 'translateY(0)';
    });

    addButton.addEventListener('click', function(){
         addSecretMenu();
    });
    parentElement.appendChild(dbIconContainer);
}



function createSearchBar(parentElement) {
    // Create search container
    var searchContainer = document.createElement("div");
    searchContainer.classList.add("search-container");

    var searchInput = document.createElement("input");
    searchInput.classList.add("search-input");
    searchInput.setAttribute("type", "text");
    searchInput.setAttribute("placeholder", "Search...");

    var popupDiv = document.createElement("div");
    popupDiv.classList.add("search-popup");
    popupDiv.style.display = "none";

    searchContainer.appendChild(searchInput);

    searchContainer.style.position = 'absolute';
    searchContainer.style.height = '54%';
    searchContainer.style.right = '15%';
    searchContainer.style.top = '10%';
    searchContainer.style.width = '33%';

    searchInput.style.position = 'absolute';
    searchInput.style.height = '60%';
    searchInput.style.right = '0%';
    searchInput.style.top = '15%';
    searchInput.style.width = '70%';
    searchInput.style.borderRadius = '5vh';
    searchInput.style.border = '1px solid #ccc';

    parentElement.appendChild(searchContainer);

    function handleSearch(event) {
        if (event.key === 'Enter') {
            var query = searchInput.value.trim().toLowerCase();
            var foundPaintings = currentPaintingArray.filter(painting => painting.name.toLowerCase().includes(query));
            if (foundPaintings.length != 0) {
                const popupContainerExist = document.querySelector('.popup-container');
                if(popupContainerExist){
                    console.log('pop up already exist');
                }else {

                    var additionalPixels = 152; 
                    var popupContainer = document.createElement('div');
                    popupContainer.classList.add('popup-container');

                    popupContainer.style.position = 'absolute';

                    var popupTop = searchContainer.offsetTop + searchContainer.offsetHeight + 10;
                    popupContainer.style.top = '10%';
                    popupContainer.style.width = '100%';
                    popupContainer.style.height = '200px';
                    popupContainer.style.backgroundColor = 'dimgray'; 
                    popupContainer.style.display = "flex"; 
                    popupContainer.style.flexDirection = "column";
                    popupContainer.style.overflowY = 'scroll';
                    popupContainer.style.padding = '0px';
                    popupContainer.style.borderRadius = "5px";
                    popupContainer.style.border = "0.1vh solid black"; 
                    var popupLeft = searchContainer.offsetLeft + additionalPixels;

                    popupContainer.style.left = '60%';
                    popupContainer.style.width = searchContainer.offsetWidth * .70 + 'px'; 

                    var exitButton = document.createElement('button');
                    exitButton.textContent = 'X';
                    exitButton.classList.add('exit-button'); 
                    exitButton.style.position = 'relative';
                    exitButton.style.top = '5px'; 
                    exitButton.style.right = '5px'; 
                    exitButton.style.border = 'none'; 
                    exitButton.style.backgroundColor = 'transparent'; 
                    exitButton.style.color = 'white'; 
                    exitButton.style.fontSize = '10px';
                    exitButton.style.cursor = 'pointer';

                    exitButton.addEventListener('click', function() {
                        popupContainer.remove();
                        searchInput.value = '';
                    });
                    popupContainer.appendChild(exitButton);

                    document.body.appendChild(popupContainer);

                    
                    for(const foundObj of foundPaintings){
                        var horizontalContainer = document.createElement('div');
                        horizontalContainer.style.width = '90%';
                        horizontalContainer.style.position = 'relative';
                        horizontalContainer.style.height = '25%';
                        horizontalContainer.style.left = '8%';
                        horizontalContainer.style.backgroundColor = 'none';
                        horizontalContainer.style.padding = '0px';
                        horizontalContainer.style.borderBottom = '0.4vh solid lightgray'; 
                        horizontalContainer.style.color = 'white';
                        horizontalContainer.className = foundObj.name;
                        horizontalContainer.setAttribute('id', 'horizontalContainer');

                        var imageElement = document.createElement('img');
                        imageElement.style.height = '99%';
                        imageElement.style.position = 'absolute';
                        imageElement.style.top = '1%'; 
                        imageElement.style.left = '10%'; 
                        imageElement.style.width = '12.5%';
                        imageElement.setAttribute('src', foundObj.image);

                        var spanElement = document.createElement('span');
                        spanElement.textContent = foundObj.name; 
                        spanElement.style.position = 'absolute';
                        spanElement.style.top = '50%'; 
                        spanElement.style.left = '50%';
                        spanElement.style.transform = 'translate(-50%, -50%)'; 

                        horizontalContainer.appendChild(imageElement);
                        horizontalContainer.appendChild(spanElement);
                        popupContainer.appendChild(horizontalContainer);



                        horizontalContainer.addEventListener('click', function(){
                            const index = currentPaintingArray.findIndex(painting => painting.name === foundObj.name);
                            if (index) {
                                const removedPainting = currentPaintingArray.splice(index, 1)[0];
                                currentPaintingArray.unshift(removedPainting);
                                let thisGridContainer = document.querySelector('.NewGrid');
                                thisGridContainer.innerHTML = '';
                                if(currentPaintingArray.length >= 24){
                                    makeNewGrid(currentPaintingArray.slice(0,24), thisGridContainer);
                                }else{
                                    makeNewGrid(currentPaintingArray, thisGridContainer);
                                }
                                popupContainer.remove();
                                searchInput.value = '';
                            }else{
                                console.log('could not find painting in array when we clicked this shouldnt happen');
                            }
                        });
                    }
                    popupContainer.style.display = 'block';
            }

            } else {
                console.log('we found nothing');
            }
        }
    }
    searchInput.addEventListener('keyup', handleSearch);
}


const calculateConversionFactor = (amount) => {
    const baseFactor = 0.001;
    if (amount >= 45) {
        return baseFactor / 1.8; 
    } else if (amount >= 35) {
        return baseFactor / 1.75; 
    } else if (amount >= 15) {
        return baseFactor / 1.6;
    }else if (amount >= 12) {
        return baseFactor / 1.5;
    }else if (amount >= 11) {
       return baseFactor / 1.4;
    }else if (amount >= 10) {
         return baseFactor / 1.4;
    }else if (amount >= 9) {
        return baseFactor;
    }else if (amount >= 8) {
        return baseFactor;
    }else if (amount >= 7) {
        return baseFactor;
    }else if (amount >= 6) {
        return baseFactor;
    }else if (amount >= 5) {
        return baseFactor; 
    }else if (amount >= 4) {
        return 0.0009942; 
    }else if (amount >= 3) {
        //check
        return 0.0009673; 
    }else if (amount >= 2) {
        //check
         return 0.0009895; 
    }else if (amount >= 1.6) {
        // check
        return 0.0009495;  
    }else if (amount >= 1.2) {
        // check
        return 0.0009542;  
    }else if (amount == 1) {
        return 0.00100;   
    }else if (amount == 0.9) {
        //not good value
        return 0.00124955; 
    }else if (amount == 0.8) {
        //not good value
        return 0.00124955; 
    }else if (amount == 0.7) {
        //check
        return 0.00142855; 
    }else if (amount == 0.6) {
        //check
        return 0.00145;
    }else if (amount == 0.5) {
        //check
        return 0.001412; 
    }else if (amount == 0.4) {
        //check
        return 0.001495; 
    }else if (amount == 0.3) {
        //check
       return 0.001495;  
    }else if (amount == 0.2) {
       return 0.0015005; 
    }else if (amount == 0.1) {
        //check
        return 0.0016805; 
    }else{
        return 1;
    } // must be a integer
}; 



/*
const calculateConversionFactor = (amount) => {
    // Check if the amount is a whole number
    if (Number.isInteger(amount)) {
        return 0.001;
    }else{

        // Get the fractional part by subtracting the integer part from the amount
        const fractionalPart = amount - Math.floor(amount);
        
        console.log('the fractional part is', fractionalPart);
        // Check if the fractional part matches any of the specified values
        if (fractionalPart <= 0.2){
            return 0.001 + 0.000100; // 20% the value of 0.001 because we split 5 times 
        }else if( fractionalPart <= 0.4){
           return 0.001 +  0.000200;
        }else if( fractionalPart <= 0.6){
           return 0.001 +  0.000400;
        }else if( fractionalPart <= 0.8){
           return 0.001 +  0.000600;
        }
    }
};

*/

function printInfo(div) {
    var strings = [
        'Welcome to',
        'BursonSkullz.com',
        'My Decentralized',
        'Art Website',
        'The Most Secure and',
        'Free WEB3 Site In',
        'The Entire Fucking ',
        'Universe!'
    ];

    div.textContent = "";
    div.style.fontSize = '2.1vh';
    div.style.width = '100%';
    div.style.left = '0%';
    div.style.textAlign = 'center'; 
    div.style.fontSize = '2.2vh';
    div.style.color = 'white';

    function printString(index) {

        var stringToPrint = strings[index];
        if (!stringToPrint) return; 
        for (var i = 0; i < stringToPrint.length; i++) {
            setTimeout(function(char) {
                return function() {
                    div.textContent += char; 
                };
            }(stringToPrint[i]), i * 200);
        }
         
        setTimeout(function() {
            div.textContent = '';
            printString(index + 1);
            if(index ==  strings.length-1){
                currentlyPrinted = false;
            }else{

            }
        }, stringToPrint.length * 250); 
    }

    printString(0);
    currentlyPrinted = true;
}

export async function getVeChainPrice(element) {
    let retryCount = 0; 
    const maxRetries = 2; 
    const retryInterval = 180000; 

    function fetchVETPrice() {
        fetch('https://api.coingecko.com/api/v3/simple/price?ids=vechain&vs_currencies=usd')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch VeChain price');
                }
                return response.json();
            })
            .then(data => {
                const vechainPrice = data.vechain.usd;
                element.textContent = '$' + '  ' + vechainPrice.toFixed(4); 
                retryCount = 0;
            })
            .catch(error => {
                console.error('Error fetching VeChain price:', error);
                element.textContent = 'error';
                if (retryCount < maxRetries) {
                    retryCount++;
                    setTimeout(fetchVETPrice, retryInterval); 
                }else{
                    fetch('https://api.coincap.io/v2/assets/vechain')
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Failed to fetch VeChain price from CoinCap');
                            }
                            return response.json();
                        })
                        .then(data => {
                            const vechainPrice = parseFloat(data.data.priceUsd);
                            element.textContent = '$' +  '  ' +  vechainPrice.toFixed(2); 
                            console.log('VeChain price:', vechainPrice);
                        })
                        .catch(error => {
                            console.error('Error fetching VeChain price from CoinCap:', error);
                        });
                }
            });
    }

    fetchVETPrice();
    setInterval(fetchVETPrice, retryInterval);
}

function addSecretMenu() {
    const menuItems = ['upload painting', 'remove painting', 'send tracking number', 'Mint NFTs'];
    const secretMenu = document.createElement('div');
    secretMenu.className = 'secret-menu';
    secretMenu.style.width = '250px';
    secretMenu.style.height = '450px';
    secretMenu.style.position = 'fixed';
    secretMenu.style.top = '40%';
    secretMenu.style.left = '70%';
    secretMenu.style.transform = 'translate(-50%, -50%)';
    secretMenu.style.backgroundColor = 'dimgray';
    secretMenu.style.zIndex = '9999999';
    secretMenu.style.borderRadius = '2vh';
    secretMenu.style.border = '1px solid black';

    let offsetX, offsetY;
    let isDragging = false;
    secretMenu.addEventListener("mousedown", function (event) {
        isDragging = true;
        offsetX = event.clientX - parseFloat(window.getComputedStyle(secretMenu).left);
        offsetY = event.clientY - parseFloat(window.getComputedStyle(secretMenu).top);
    });

    document.addEventListener("mousemove", function (event) {
        if (isDragging) {
            secretMenu.style.left = (event.clientX - offsetX) + "px";
            secretMenu.style.top = (event.clientY - offsetY) + "px";
        }
    });

    document.addEventListener("mouseup", function () {
        isDragging = false;
        secretMenu.style.cursor = "grab";
    });


    const closeButtonContainer = document.createElement('div');
    closeButtonContainer.style.position = 'absolute';
    closeButtonContainer.style.top = '10px';
    closeButtonContainer.style.right = '10px';

    const closeButton = document.createElement('div');
    closeButton.textContent = '❌';
    closeButton.style.fontSize = '10px';
    closeButton.style.cursor = 'pointer';
    closeButton.addEventListener('click', function() {
        document.body.removeChild(secretMenu);
    });


    closeButtonContainer.appendChild(closeButton);


    secretMenu.appendChild(closeButtonContainer);


    const itemList = document.createElement('div');
    itemList.style.marginTop = '50px';

    menuItems.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.textContent = item;
        itemDiv.style.margin = '5px 0';
        itemDiv.style.cursor = 'pointer';
        itemDiv.style.padding = '10px';
        itemDiv.style.textAlign = 'center';
        itemDiv.style.backgroundColor = 'none';
        itemDiv.style.borderRadius = '4px';
        itemDiv.style.borderBottom = '0.2vh solid lightgrey';

        itemDiv.addEventListener('mouseenter', function() {
            itemDiv.style.backgroundColor = '#585858';
        });

        itemDiv.addEventListener('mouseleave', function() {
            itemDiv.style.backgroundColor = 'dimgray';
        });

        itemDiv.addEventListener('click', function() {
            if(item == 'upload painting'){
                secretMenu.remove();

                const popupForm = document.createElement('div');

                const titleSpan = document.createElement('span');
                titleSpan.textContent = 'Upload Painting Form';
                titleSpan.style.fontSize = '20px';
                titleSpan.style.fontWeight = 'bold';
                titleSpan.style.marginBottom = '15px';

                popupForm.appendChild(titleSpan);
                popupForm.classList.add('dbPopup');

                let offsetX, offsetY;
                let isDragging = false;
                popupForm.style.display = 'flex';
                popupForm.addEventListener("mousedown", function (event) {
                    isDragging = true;
                    offsetX = event.clientX - parseFloat(window.getComputedStyle(popupForm).left);
                    offsetY = event.clientY - parseFloat(window.getComputedStyle(popupForm).top);
                    popupForm.style.cursor = "grabbing";
                });

                document.addEventListener("mousemove", function (event) {
                    if (isDragging) {
                        popupForm.style.left = (event.clientX - offsetX) + "px";
                        popupForm.style.top = (event.clientY - offsetY) + "px";
                    }
                });

                document.addEventListener("mouseup", function () {
                    isDragging = false;
                    popupForm.style.cursor = "grab";
                });

                const form = document.createElement('form');
                form.id = 'uploadForm';
                const imageInput = document.createElement('input');
                imageInput.type = 'file';
                imageInput.id = 'imageInput';
                imageInput.accept = 'image/*';
                imageInput.addEventListener('change', function() {
                    const file = imageInput.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = function() {
                            preview.src = reader.result;
                        };
                        reader.readAsDataURL(file);
                        exitButton.style.display = 'inline-block';
                    }
                });

                const previewContainer = document.createElement('div');
                previewContainer.style.position = 'relative';
                const preview = document.createElement('img');
                preview.id = 'imagePreview';
                preview.style.maxWidth = '25%';
                preview.style.maxHeight = '25%';
                preview.style.marginTop = '10px';
                previewContainer.appendChild(preview);

                const exitButton = document.createElement('button');
                exitButton.type = 'button';
                exitButton.textContent = '✕';
                exitButton.style.position = 'absolute';
                exitButton.style.top = '5px';
                exitButton.style.left = '25%';
                exitButton.style.backgroundColor = 'transparent';
                exitButton.style.border = 'none';
                exitButton.style.color = '#fff';
                exitButton.style.fontSize = '20px';
                exitButton.style.cursor = 'pointer';
                exitButton.style.display = 'none'; 
                exitButton.addEventListener('click', function() {
                    preview.src = ''; 
                    imageInput.value = ''; 
                    exitButton.style.display = 'none';
                });
                previewContainer.appendChild(exitButton);


                const dateInput = document.createElement('input');
                dateInput.type = 'date';
                dateInput.id = 'dateInput';


                const dateCreatedLabel = document.createElement('span');
                dateCreatedLabel.textContent = 'Date created';
                dateCreatedLabel.style.marginLeft = '10px';


                const booleanInput = document.createElement('input');
                booleanInput.type = 'checkbox';
                booleanInput.id = 'booleanInput';

                const availabilityLabel = document.createElement('label');
                availabilityLabel.textContent = 'Available';
                availabilityLabel.htmlFor = 'booleanInput';
                availabilityLabel.style.marginLeft = '10px';

                const stringInputs = [];
                const placeholders = ['Artist', 'Description', 'LegalContract'];
                for (let i = 0; i < placeholders.length; i++) {
                    const stringInput = document.createElement('input');
                    stringInput.type = 'text';
                    stringInput.id = `stringInput${i + 1}`;
                    stringInput.placeholder = placeholders[i];
                    stringInputs.push(stringInput);
                }

                const uploadName = document.createElement('input');
                uploadName.type = 'text';
                uploadName.id = 'priceInput';
                uploadName.placeholder = 'Painting Name';

                const priceInput = document.createElement('input');
                priceInput.type = 'text';
                priceInput.id = 'priceInput';
                priceInput.placeholder = 'Price in ETH';

                const uploadPassword = document.createElement('input');
                uploadPassword.type = 'text';
                uploadPassword.id = 'priceInput';
                uploadPassword.placeholder = 'passcode';

                const uploadButton = document.createElement('button');
                uploadButton.type = 'button';
                uploadButton.id = 'uploadButton';
                uploadButton.textContent = 'Submit';
                uploadButton.style.marginTop = '20px';
                uploadButton.style.padding = '10px 20px';
                uploadButton.style.backgroundColor = '#4CAF50';
                uploadButton.style.color = 'white';
                uploadButton.style.border = 'none';
                uploadButton.style.borderRadius = '5px';
                uploadButton.style.cursor = 'pointer';

                const cancelButton = document.createElement('button');
                cancelButton.type = 'button';
                cancelButton.id = 'uploadButton';
                cancelButton.textContent = 'Cancel';
                cancelButton.style.marginTop = '20px';
                cancelButton.style.padding = '10px 20px';
                cancelButton.style.backgroundColor = 'red';
                cancelButton.style.color = 'white';
                cancelButton.style.border = 'none';
                cancelButton.style.borderRadius = '5px';
                cancelButton.style.cursor = 'pointer';

                form.append(
                    imageInput, document.createElement('br'),
                    previewContainer, document.createElement('br'),
                    dateInput, dateCreatedLabel, document.createElement('br'), 
                    booleanInput, availabilityLabel, document.createElement('br')
                );
                stringInputs.forEach(input => {
                    form.append(input, document.createElement('br'));
                });
                form.append(uploadName, document.createElement('br'), priceInput, document.createElement('br'), uploadPassword,   document.createElement('br'), uploadButton, cancelButton);
                popupForm.appendChild(form);
                document.body.appendChild(popupForm);
                popupForm.style.display = 'block';

                uploadButton.addEventListener('click', async () =>  {

                    const price = parseFloat(priceInput.value);

                    if (isNaN(price)) {
                        alert('Price must be a valid integer.');                    }

                    const currentDate = new Date();
                    const thisObj = {
                        image: preview.src,
                        name: uploadName.value,
                        dateCreated: dateInput.value,
                        inStock: booleanInput.checked,
                        artist: stringInputs[0].value,
                        description: stringInputs[1].value,
                        legalContract: stringInputs[2].value,
                        price: price,
                        dateSold : null, 
                        dateUploaded: currentDate,
                        passcode: uploadPassword.value
                    };  
                    try {
                        const response = await fetch('/add-painting', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(thisObj)
                        });

                        if (response.ok) {
                            const serverMessage = await response.json();
                            if(serverMessage.success == true){
                                const dbPopUp = document.querySelector('.dbPopup');
                                document.body.removeChild(dbPopUp);
                            }else{
                                console.log('message came back false', serverMessage.success)
                            }
                            console.log('Received paintings:', serverMessage);
                        } else {
                            console.error('Failed to add painting:', response.statusText);
                        }
                    } catch (error) {
                        console.error('Error adding painting:', error);
                    }
                
                });

                cancelButton.addEventListener('click', function() {
                    popupForm.style.display = 'none';
                }); 
                
            }else if(item == 'send tracking number'){
                makeConfirmationForm();
            }else if(item == 'Mint NFTs') {
                console.log('calling makeMintingForm() function');
                makeMintingForm();
            }else{
                console.log('button not found');
            } 
        });

        itemList.appendChild(itemDiv);

        itemDiv.addEventListener('click', function() {
            console.log(`${item} clicked`);
        });

        itemList.appendChild(itemDiv);
    });

    secretMenu.appendChild(itemList);
    document.body.appendChild(secretMenu);
}

function makeMintingForm() {
    const formContainer = document.createElement('div');
    formContainer.className = 'Minting-form';
    formContainer.style.width = '300px';
    formContainer.style.height = '450px'; 
    formContainer.style.position = 'fixed';
    formContainer.style.top = '50%';
    formContainer.style.left = '50%';
    formContainer.style.transform = 'translate(-50%, -50%)';
    formContainer.style.backgroundColor = 'dimgray';
    formContainer.style.zIndex = '9999999';
    formContainer.style.borderRadius = '8px';
    formContainer.style.border = '1px solid black';
    formContainer.style.padding = '20px';
    formContainer.style.display = 'flex';
    formContainer.style.flexDirection = 'column';
    formContainer.style.alignItems = 'center';

    let offsetX, offsetY;
    let isDragging = false;
    formContainer.addEventListener("mousedown", function (event) {
        isDragging = true;
        offsetX = event.clientX - parseFloat(window.getComputedStyle(formContainer).left);
        offsetY = event.clientY - parseFloat(window.getComputedStyle(formContainer).top);
    });

    document.addEventListener("mousemove", function (event) {
        if (isDragging) {
            formContainer.style.left = (event.clientX - offsetX) + "px";
            formContainer.style.top = (event.clientY - offsetY) + "px";
        }
    });

    document.addEventListener("mouseup", function () {
        isDragging = false;
        formContainer.style.cursor = "grab";
    });

    const titleSpan = document.createElement('span');
    titleSpan.textContent = 'Minting Form';
    titleSpan.style.fontSize = '18px';
    titleSpan.style.marginBottom = '10px';
    formContainer.appendChild(titleSpan);

    const closeButton = document.createElement('div');
    closeButton.textContent = '❌';
    closeButton.style.fontSize = '10px';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.color = '#333';

    closeButton.addEventListener('click', function() {
        document.body.removeChild(formContainer);
    });

    formContainer.appendChild(closeButton);

    const dropArea = document.createElement('div');
    dropArea.style.width = '100%';
    dropArea.style.height = '150px';
    dropArea.style.border = '2px dashed #ccc';
    dropArea.style.borderRadius = '8px';
    dropArea.style.display = 'flex';
    dropArea.style.justifyContent = 'center';
    dropArea.style.alignItems = 'center';
    dropArea.style.marginBottom = '10px';
    dropArea.textContent = 'Drag & Drop Folder Here or Click to Upload';
    dropArea.style.color = '#fff';
    dropArea.style.cursor = 'pointer';

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.webkitdirectory = true;
    fileInput.style.display = 'none';

    dropArea.addEventListener('dragover', function(event) {
        event.preventDefault();
        dropArea.style.borderColor = 'lightblue';
    });

    dropArea.addEventListener('dragleave', function() {
        dropArea.style.borderColor = '#ccc';
    });

    dropArea.addEventListener('drop', function(event) {
        event.preventDefault();
        dropArea.style.borderColor = '#ccc';
        const files = event.dataTransfer.files;
        handleFiles(files);
    });

    dropArea.addEventListener('click', function() {
        fileInput.click();
    });

    fileInput.addEventListener('change', function(event) {
        const files = event.target.files;
        handleFiles(files);
    });

    formContainer.appendChild(dropArea);
    formContainer.appendChild(fileInput);

    const imagePlaceholder = document.createElement('div');
    imagePlaceholder.style.width = '100px';
    imagePlaceholder.style.height = '100px';
    imagePlaceholder.style.backgroundColor = '#fff';
    imagePlaceholder.style.borderRadius = '8px';
    imagePlaceholder.style.marginBottom = '10px';
    imagePlaceholder.style.display = 'flex';
    imagePlaceholder.style.justifyContent = 'center';
    imagePlaceholder.style.alignItems = 'center';
    imagePlaceholder.style.overflow = 'hidden';
    imagePlaceholder.textContent = 'Folder Image';
    imagePlaceholder.style.color = '#333';
    formContainer.appendChild(imagePlaceholder);

    const contractSelector = document.createElement('select');
    contractSelector.style.width = '100%';
    contractSelector.style.padding = '10px';
    contractSelector.style.marginBottom = '10px';
    contractSelector.style.borderRadius = '8px';
    contractSelector.style.border = '1px solid #ccc';

    const placeholderOption = document.createElement('option');
    placeholderOption.value = '';
    placeholderOption.textContent = 'Select contract';
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    contractSelector.appendChild(placeholderOption);

    const option1 = document.createElement('option');
    option1.value = 'BursonSkullz';
    option1.textContent = 'Burson Skullz';
    contractSelector.appendChild(option1);

    const option2 = document.createElement('option');
    option2.value = 'CrazyDonkeys';
    option2.textContent = 'Crazy Donkeys';
    contractSelector.appendChild(option2);

    formContainer.appendChild(contractSelector);

    let selectedContract = contractSelector.value; 

    contractSelector.addEventListener('change', function() {
        selectedContract = contractSelector.value;
        console.log(`Selected contract: ${selectedContract}`);
    });

    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit';
    submitButton.style.marginTop = 'auto';
    submitButton.style.padding = '10px 20px';
    submitButton.style.border = 'none';
    submitButton.style.borderRadius = '8px';
    submitButton.style.backgroundColor = '#333';
    submitButton.style.color = '#fff';
    submitButton.style.cursor = 'pointer';

    let filesArray = [];

    submitButton.addEventListener('click', function() {
        if (!selectedContract) {
            alert('Please select a contract.');
            return;
        }
        
        const compressedData = pako.gzip(JSON.stringify(filesArray)); 
        const folderData = {
            folderName: dropArea.textContent,
            contract: selectedContract,
            files: Array.from(compressedData) 
        };

        fetch('/MintNFTs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(folderData)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to upload files');
            }
        })
        .then(data => {
            console.log('Files uploaded successfully:', data);
            // Handle success
        })
        .catch(error => {
            console.error('Error uploading files:', error);
            // Handle error
        });
    });

    formContainer.appendChild(submitButton);
    document.body.appendChild(formContainer);


    function handleFiles(files) {
        filesArray = [];
        function readFile(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = function(event) {
                    resolve(event.target.result);
                };
                reader.onerror = function(event) {
                    reject(event.target.error);
                };
                reader.readAsDataURL(file);
            });
        }
        const readFilePromises = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.type.startsWith('image/')) {
                const promise = readFile(file)
                    .then(result => {
                        filesArray.push({
                            name: file.name,
                            type: file.type,
                            size: file.size,
                            image: result  
                        });
                    })
                    .catch(error => {
                        console.error(`Error reading ${file.name}: ${error}`);
                    });
                readFilePromises.push(promise);
            }
        }
        Promise.all(readFilePromises)
            .then(() => {
                console.log('Files read and processed:', filesArray);
            })
            .catch(error => {
                console.error('Error processing files:', error);
            });
    }
}
function makeConfirmationForm() {
    const formContainer = document.createElement('div');
    formContainer.className = 'confirmation-form';
    formContainer.style.width = '300px';
    formContainer.style.height = '500px';
    formContainer.style.position = 'fixed';
    formContainer.style.top = '50%';
    formContainer.style.left = '50%';
    formContainer.style.transform = 'translate(-50%, -50%)';
    formContainer.style.backgroundColor = 'dimgray';
    formContainer.style.zIndex = '9999999';
    formContainer.style.borderRadius = '8px';
    formContainer.style.border = '1px solid black';
    formContainer.style.padding = '20px';
    formContainer.style.display = 'flex';
    formContainer.style.flexDirection = 'column';
    formContainer.style.alignItems = 'center';

    let offsetX, offsetY;
    let isDragging = false;
    formContainer.addEventListener("mousedown", function (event) {
        isDragging = true;
        offsetX = event.clientX - parseFloat(window.getComputedStyle(formContainer).left);
        offsetY = event.clientY - parseFloat(window.getComputedStyle(formContainer).top);
    });

    document.addEventListener("mousemove", function (event) {
        if (isDragging) {
            formContainer.style.left = (event.clientX - offsetX) + "px";
            formContainer.style.top = (event.clientY - offsetY) + "px";
        }
    });

    document.addEventListener("mouseup", function () {
        isDragging = false;
        formContainer.style.cursor = "grab";
    });

    const titleSpan = document.createElement('span');
    titleSpan.textContent = 'Tracking Number Form';
    titleSpan.style.fontSize = '18px';
    titleSpan.style.marginBottom = '10px';
    formContainer.appendChild(titleSpan);

    const titleSpan2 = document.createElement('span');
    titleSpan2.textContent = '(please send image of corresponding product)';
    titleSpan2.style.fontSize = '10px';
    titleSpan2.style.color = 'white';
    titleSpan2.style.marginBottom = '10px';
    formContainer.appendChild(titleSpan2);

    const closeButton = document.createElement('div');
    closeButton.textContent = '❌';
    closeButton.style.fontSize = '10px';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.color = '#333'; 

    closeButton.addEventListener('click', function() {
        document.body.removeChild(formContainer);
    });

    formContainer.appendChild(closeButton);

    const form = document.createElement('form');
    form.id = 'confirmationForm';
    form.style.display = 'flex';
    form.style.flexDirection = 'column';
    form.style.alignItems = 'center';
    form.style.width = '100%';
    form.style.height = '70%';
    form.style.top = '15%';
    form.style.position = 'absolute';

    const emailLabel = document.createElement('label');
    emailLabel.textContent = 'Email:';
    emailLabel.for = 'emailInput';
    form.appendChild(emailLabel);
    const emailInput = document.createElement('input');
    emailInput.type = 'email';
    emailInput.id = 'emailInput';
    emailInput.name = 'email';
    emailInput.required = true;
    form.appendChild(emailInput);

    const nameLabel = document.createElement('label');
    nameLabel.textContent = 'Name:';
    nameLabel.for = 'nameInput';
    form.appendChild(nameLabel);
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.id = 'nameInput';
    nameInput.name = 'name';
    nameInput.required = true;
    form.appendChild(nameInput);

    const trackingLabel = document.createElement('label');
    trackingLabel.textContent = 'Tracking Number:';
    trackingLabel.for = 'trackingInput';
    form.appendChild(trackingLabel);
    const trackingInput = document.createElement('input');
    trackingInput.type = 'text';
    trackingInput.id = 'trackingInput';
    trackingInput.name = 'tracking';
    trackingInput.required = true;
    form.appendChild(trackingInput);

    const imageLabel = document.createElement('label');
    imageLabel.textContent = 'Image:';
    imageLabel.for = 'imageInput';
    form.appendChild(imageLabel);
    const imageInput = document.createElement('input');
    imageInput.type = 'file';
    imageInput.id = 'imageInput';
    imageInput.name = 'image';
    imageInput.accept = 'image/*';
    imageInput.required = true;
    form.appendChild(imageInput);

    const passcodeLabel = document.createElement('label');
    passcodeLabel.textContent = 'Passcode:';
    passcodeLabel.for = 'passcodeInput';
    form.appendChild(passcodeLabel);
    const passcodeInput = document.createElement('input');
    passcodeInput.type = 'password';
    passcodeInput.id = 'passcodeInput';
    passcodeInput.name = 'passcode';
    passcodeInput.required = true;
    form.appendChild(passcodeInput);

    const submitButton = document.createElement('input');
    submitButton.type = 'submit';
    submitButton.value = 'Submit';
    form.appendChild(submitButton);
    formContainer.appendChild(form);

    document.body.appendChild(formContainer);
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const reader = new FileReader();
        reader.onload = function(event) {
            const formData = {
                email: emailInput.value,
                name: nameInput.value,
                tracking: trackingInput.value,
                image: event.target.result, 
                passcode: passcodeInput.value
            };
            console.log('tracking input is = ', formData.tracking);

            const loadingContainer = document.createElement("div");
            loadingContainer.className = "loading-container";
            loadingContainer.style.position = "absolute";
            loadingContainer.style.top = "50%";
            loadingContainer.style.left = "50%";
            loadingContainer.style.transform = "translate(-50%, -50%)";
            loadingContainer.style.width = "80%";
            loadingContainer.style.height = "60%";
            loadingContainer.style.display = "flex";
            loadingContainer.style.justifyContent = "center";
            loadingContainer.style.alignItems = "center";
            loadingContainer.style.backgroundColor = "none"; 

            const loadingIcon = document.createElement("img");
            loadingIcon.setAttribute("class", "loading-gif");
            loadingIcon.setAttribute("src", "/Gifs/LoadingIcon1/loadingicon1.gif"); 
            loadingIcon.setAttribute("alt", "Loading..."); 
            loadingIcon.style.width = "50%"; 
            loadingIcon.style.height = "50%";
            loadingContainer.appendChild(loadingIcon);
            formContainer.appendChild(loadingContainer);

            fetch('/sendConfirmationEmail', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData)
            })
            .then(response => {
                if (response.ok) {
                    return response.json(); 
                } else {
                    return Promise.reject('Failed to send Email');
                }
            })
            .then(checker => { 
                loadingContainer.remove(); 
                if (checker.updated == true) {
                    document.body.removeChild(formContainer);                             
                    console.log('server sent email successfully');   
                } else {
                    console.log('the checker came back false', checker);   
                    console.log('Prompt user reason it was unable send confirmationForm');
                }
            })
            .catch(error => {
                loadingContainer.remove(); 
                console.error('Error getting response from server:', error);
            }); 

        } 
        reader.readAsDataURL(imageInput.files[0]);
    });
}
export async function getEthereumPrice(element) {
    let retryCount = 0;
    const maxRetries = 2; 
    const retryInterval = 180000; 

    function fetchETHPrice() {
        fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch Ethereum price');
                }
                return response.json();
            })
            .then(data => {
                const ethereumPrice = data.ethereum.usd;
                element.textContent = '$' + '  ' +  ethereumPrice.toFixed(2);
                retryCount = 0; 
            })
            .catch(error => {
                console.error('Error fetching Ethereum price:', error);
                 element.textContent = 'error';
                if (retryCount < maxRetries) {
                    retryCount++;
                    setTimeout(fetchETHPrice, retryInterval); 
                }else{
                    fetch('https://api.coincap.io/v2/assets/ethereum')
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Failed to fetch ethereum price from CoinCap');
                            }
                        return response.json();
                        })
                        .then(data => {
                        const ethereumPrice = parseFloat(data.data.priceUsd);
                            element.textContent = '$' + '  ' +  ethereumPrice.toFixed(2);
                        })
                        .catch(error => {
                            console.error('Error fetching Polygon price from CoinCap:', error);
                            element.textContent = 'error'; 
                        });
                }
            });
    }
    fetchETHPrice();
    
    setInterval(fetchETHPrice, 90000);  
}

export async function getBitcoinPrice(element) {
    let retryCount = 0; 
    const maxRetries = 2; 
    const retryInterval = 180000;

    function fetchBTCPrice() {
        fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch Bitcoin price');
                }
                return response.json();
            })
            .then(data => {
                const bitcoinPrice = data.bitcoin.usd;
                element.textContent = '$' +  '  ' +  bitcoinPrice.toFixed(2);
                retryCount = 0; 
            })
            .catch(error => {
                console.error('Error fetching Ethereum price:', error);
                 element.textContent = 'error';
                if (retryCount < maxRetries) {
                    retryCount++;
                    setTimeout(fetchBTCPrice, retryInterval); 
                }else{
                    fetch('https://api.coincap.io/v2/assets/bitcoin')
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Failed to fetch bitcoin price from CoinCap');
                            }
                            return response.json();
                        })
                        .then(data => {

                            const bitcoinPrice = parseFloat(data.data.priceUsd);
                            element.textContent = '$' + '  ' +  bitcoinPrice.toFixed(2); 
                        })
                        .catch(error => {
                            console.error('Error fetching Polygon price from CoinCap:', error);
                            element.textContent = 'error'; 
                        });      
                }

            });
    }
    fetchBTCPrice();
    setInterval(fetchBTCPrice, retryInterval);
}

export async function getShibaInuPrice(element) {
    let retryCount = 0; 
    const maxRetries = 2;
    const retryInterval = 180000; 

    function fetchShibaInuPrice() {
        fetch('https://api.coingecko.com/api/v3/simple/price?ids=shiba-inu&vs_currencies=usd')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch Shiba Inu price');
                }
                return response.json();
            })
            .then(data => {
                const shibaInuPrice = data['shiba-inu'].usd;
                element.textContent = '$' +  '  ' +  shibaInuPrice.toFixed(6);
                retryCount = 0; 
                shibaInuPriceInUSD = element.textContent;
            })
            .catch(error => {
                console.error('Error fetching Shiba Inu price:', error);
                element.textContent = 'error';
                if (retryCount < maxRetries) {
                    retryCount++;
                    setTimeout(fetchShibaInuPrice, retryInterval); 
                }
            });
    }
    fetchShibaInuPrice();
    setInterval(fetchShibaInuPrice, retryInterval);
}
export async function getDogecoinPrice(element) {
    let retryCount = 0; 
    const maxRetries = 2; 
    const retryInterval = 180000;

    function fetchDogecoinPrice() {
        fetch('https://api.coingecko.com/api/v3/simple/price?ids=dogecoin&vs_currencies=usd')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch Dogecoin price');
                }
                return response.json();
            })
            .then(data => {
                const dogecoinPrice = data.dogecoin.usd;
                element.textContent = '$' + '  ' +  dogecoinPrice.toFixed(5); 
                retryCount = 0;
            })
            .catch(error => {
                console.error('Error fetching Dogecoin price from CoinGecko:', error);
                element.textContent = 'error';

                if (retryCount < maxRetries) {
                    retryCount++;
                     setTimeout(fetchDogecoinPrice, retryInterval); 
                 }else{
                     fetch('https://api.coincap.io/v2/assets/dogecoin')
                         .then(response => {
                             if (!response.ok) {
                                 throw new Error('Failed to fetch Polygon price from CoinCap');
                             }
                             return response.json();
                         })
                         .then(data => {
                             const dogeCoinPrice = parseFloat(data.data.priceUsd);
                             element.textContent = '$' + '  ' +  dogeCoinPrice.toFixed(2); 
                         })
                         .catch(error => {
                             console.error('Error fetching Polygon price from CoinCap:', error);
                             element.textContent = 'error'; 
                         });
                 }
            });
    }

    fetchDogecoinPrice();
    setInterval(fetchDogecoinPrice, retryInterval);
}
export async function getEthereumClassicPrice(element) {
    let retryCount = 0;
    const maxRetries = 2; 
    const retryInterval = 180000; 

    function fetchETCPrice() {
        fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum-classic&vs_currencies=usd')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch Ethereum Classic price');
                }
                return response.json();
            })
            .then(data => {
                const etcPrice = data['ethereum-classic'].usd;
                element.textContent = '$' + etcPrice.toFixed(2); 
                retryCount = 0;
                etcPriceInUSD = element.textContent;
            })
            .catch(error => {
                console.error('Error fetching Ethereum Classic price:', error);
                element.textContent = 'error';
                if (retryCount < maxRetries) {
                    retryCount++;
                    setTimeout(fetchETCPrice, retryInterval); 
                }else{
                    console.error('Error fetching Ethereum price from CoinGecko:', error);
                    element.textContent = 'error';

                    if (retryCount < maxRetries) {
                        retryCount++;
                        setTimeout(fetchPolygonPrice, retryInterval); 
                    }else{
                        fetch('https://api.coincap.io/v2/assets/ethereum-classic')
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Failed to fetch Polygon price from CoinCap');
                                }
                                return response.json();
                            })
                            .then(data => {
                                const etcPrice = parseFloat(data.data.priceUsd);
                                element.textContent = '$' + etcPrice.toFixed(2); 
                            })
                            .catch(error => {
                                console.error('Error fetching Polygon price from CoinCap:', error);
                                element.textContent = 'error'; 
                            });
                    }
                }
            });
    }

    fetchETCPrice();
    setInterval(fetchETCPrice, retryInterval);
}

export async function getPolygonPrice(element) {
    let retryCount = 0; 
    const maxRetries = 3; 
    const retryInterval = 90000; 

    function fetchPolygonPrice() {
        fetch('https://api.coingecko.com/api/v3/simple/price?ids=polygon&vs_currencies=usd')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch Polygon price');
                }
                return response.json();
            })
            .then(data => {
                const polygonPrice = data.polygon.usd;
                element.textContent = '$' + polygonPrice.toFixed(2); 
                retryCount = 0; 
            })
            .catch(error => {
                console.error('Error fetching Polygon price from CoinGecko:', error);
                element.textContent = 'error';

                if (retryCount < maxRetries) {
                    retryCount++;
                    setTimeout(fetchPolygonPrice, retryInterval); 
                }else{
                    fetch('https://api.coincap.io/v2/assets/polygon')
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Failed to fetch Polygon price from CoinCap');
                            }
                            return response.json();
                        })
                        .then(data => {
                            const polygonPrice = parseFloat(data.data.priceUsd);
                            element.textContent = '$' + polygonPrice.toFixed(2);
                            polygonPriceInUSD = element.textContent;
                        })
                        .catch(error => {
                            console.error('Error fetching Polygon price from CoinCap:', error);
                            element.textContent = 'error'; 
                        });
                }
            });
    }

    fetchPolygonPrice();
    setInterval(fetchPolygonPrice, retryInterval); 
}

export function handleResize() {
    if (window.innerWidth < 921 && window.innerWidth >= 675) {
        console.log("Window width = ", window.innerWidth);
        console.log("if 3 rows arent already present, then call with 3 elements");
        const gridDiv = document.querySelector('div[style*="grid-template-columns"]');
        if (gridDiv) {
            const gridColumnValue = gridDiv.style.gridTemplateColumns;
            if (gridColumnValue.includes("repeat(4,")) {
                console.log("The grid needs to be updated to 3.");

            } else {
                console.log("The grid has already been updated do nothing.");
            }
        } else {
            console.log("No div element found with grid-template-columns property.");
        }

    }else if(window.innerWidth < 675 && window.innerWidth >= 300){
        console.log("remove the grid elements and refire with 2 items");
        console.log("Window width = ", window.innerWidth);
        console.log("if 3 rows arent already present, then call with 3 elements");
        const gridDiv = document.querySelector('div[style*="grid-template-columns"]');
        if (gridDiv) {
            const gridColumnValue = gridDiv.style.gridTemplateColumns;
            if (gridColumnValue.includes("repeat(3,")) {
                console.log("The grid needs to be updated to 2.");
            } else {
                console.log("The grid does not have 3 columns.");
            }
        } else {
            console.log("No div element found with grid-template-columns property.");
        }
    }
    window.addEventListener('resize', handleResize);
}

async function fetchEthereumPrice() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data.ethereum.usd;
    } catch (error) {
        console.error('Error fetching Ethereum price:', error);
        return null;
    }
}

async function checkNetwork(network_name) {
    if (network_name.toLowerCase() === "ethereum") {
        const networkId = await web3.eth.net.getId();
        const ethNetworkId = 1; // Ethereum Mainnet ID
        if (networkId === ethNetworkId) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}
function addBuyButton(parentDiv, availabe, buttonClassName) {
    var buyButton = document.createElement("div");
    buyButton.className =  'buy-button' + buttonClassName;
    buyButton.style.position = "fixed";
    buyButton.style.width = "100%";
    buyButton.style.height = "11.8%";
    buyButton.style.bottom = "0%";
    buyButton.style.backgroundColor = "lightgrey";
    buyButton.style.display = "flex";
    buyButton.style.alignItems = "center";
    buyButton.style.justifyContent = "center";
    buyButton.style.backgroundColor = 'lightgray';
    buyButton.style.border = "0.1vh solid black"; 
    buyButton.style.borderTopLeftRadius = '0.4vh';
    buyButton.style.borderTopRightRadius = '0.4vh';
    buyButton.style.fontSize = '1.8vh';

    if(availabe){
        var buttonText = document.createTextNode("Purchase");
    }else{
        var buttonText = document.createTextNode("Unavailable");
    }
   
    buyButton.appendChild(buttonText);

    parentDiv.appendChild(buyButton);
    let currentname; 
    for(const painting of currentPaintingArray){
        if(painting._id == parentDiv.id){
            currentname = painting.name;
        }
    }

    if(buttonText.textContent == "Purchase"){
        buyButton.addEventListener("click", async function() {
            if(isConnected && !currentlyTryingToBuy){
                currentlyTryingToBuy = true;
                const parentDiv = this.parentElement;
                const formContainer = document.createElement("div");
                formContainer.className = "purchase-form-container";
                formContainer.style.position = "fixed";
                formContainer.style.top = "50%"; 
                formContainer.style.left = "50%"; //
                formContainer.style.transform = "translate(-50%, -50%)"; 
                formContainer.style.width = "45vh";
                formContainer.style.height = "52vh"; 
                formContainer.style.backgroundColor = "lightgray"; 
                formContainer.style.border = "0.1vh solid black"; 
                formContainer.style.padding = "0px"; 
                formContainer.style.display = "flex"; 
                formContainer.style.flexDirection = "column"; 
                formContainer.style.overflow = 'hidden';
                formContainer.style.zIndex = '100000';
                formContainer.id = parentDiv.id;

                let offsetX, offsetY;
                let isDragging = false;
                formContainer.addEventListener("mousedown", function (event) {
                    isDragging = true;
                    offsetX = event.clientX - parseFloat(window.getComputedStyle(formContainer).left);
                    offsetY = event.clientY - parseFloat(window.getComputedStyle(formContainer).top);
                });

                document.addEventListener("mousemove", function (event) {
                    if (isDragging) {
                        formContainer.style.left = (event.clientX - offsetX) + "px";
                        formContainer.style.top = (event.clientY - offsetY) + "px";
                    }
                });

                document.addEventListener("mouseup", function () {
                    isDragging = false;
                    formContainer.style.cursor = "grab";
                });

                const form = document.createElement("form");
                form.className = "purchase-form";
                form.style.display = "flex";
                form.style.flexDirection = "column"; 
                form.style.alignItems = "center"; 
                form.style.gap = "2px"; 
                form.style.width = "100%";
                form.style.height = '80%';
                form.style.top = '10%';
                form.style.position = 'absolute';

                const titleDiv = document.createElement("div");
                titleDiv.className = "title";
                titleDiv.innerText = "Purchase" + "  " + " " + currentname;
                titleDiv.style.fontWeight = "bold";
                titleDiv.style.textAlign = "center";
                titleDiv.style.fontSize = '2vh';

                const emailInput = document.createElement("input");
                emailInput.setAttribute("type", "email");
                emailInput.setAttribute("placeholder", "Email");
                emailInput.style.width = '80%';
                emailInput.style.height = '8%';
                emailInput.style.left = '10%';
                emailInput.style.position = 'absolute';
                emailInput.style.top = '10%';

                const addressInput = document.createElement("input");
                addressInput.setAttribute("type", "text");
                addressInput.setAttribute("placeholder", "Address");
                addressInput.setAttribute("type", "email");
                addressInput.setAttribute("placeholder", "Address");
                addressInput.style.width = '80%';
                addressInput.style.height = '8%';
                addressInput.style.left = '10%';
                addressInput.style.position = 'absolute';
                addressInput.style.top = '30%';

                const firstNameInput = document.createElement("input");
                firstNameInput.setAttribute("type", "text");
                firstNameInput.setAttribute("placeholder", "First Name");
                firstNameInput.style.width = '80%';
                firstNameInput.style.height = '8%';
                firstNameInput.style.left = '10%';
                firstNameInput.style.position = 'absolute';
                firstNameInput.style.top = '50%';

                const lastNameInput = document.createElement("input");
                lastNameInput.setAttribute("type", "text");
                lastNameInput.setAttribute("placeholder", "Last Name");
                lastNameInput.style.width = '80%';
                lastNameInput.style.height = '8%';
                lastNameInput.style.left = '10%';
                lastNameInput.style.position = 'absolute';
                lastNameInput.style.top = '70%';

                const submitButton = document.createElement("div");
                submitButton.className = "submit-button";
                submitButton.innerText = "Submit";
                submitButton.style.cursor = "pointer";
                submitButton.style.padding = "10px";
                submitButton.style.backgroundColor = "dimgray";
                submitButton.style.color = "white";
                submitButton.style.textAlign = "center";
                submitButton.style.borderRadius = "5px";
                submitButton.style.width = "40%";
                submitButton.style.left = '30%';
                submitButton.style.height = "10%";
                submitButton.style.boxSizing = "border-box";
                submitButton.style.position = 'absolute';
                submitButton.style.left = '30%';
                submitButton.style.bottom = '1%';
                submitButton.style.fontSize = '2vh';

                submitButton.addEventListener("click", async function(event) {
                    event.preventDefault(); 
                    if(submitButtonIsClicked){
                        console.log('we already clicked it');
                    }else{  
                        submitButtonIsClicked = true;
                        EmailformData.email =  emailInput.value;
                        EmailformData.address =  addressInput.value;
                        EmailformData.firstName =  firstNameInput.value;
                        EmailformData.lastName = lastNameInput.value;
                        
                        
                        const data = {
                            transactionHash: '0x89ffec4ef5f4fe434efbd5b94eb620aa6749c22714b6f00a6247f043bf22bd01',
                            objectId: parentDiv.id,
                            email: EmailformData.email, 
                            address: EmailformData.address, 
                            firstName: EmailformData.firstName,
                            lastName: EmailformData.lastName
                        };
                        console.log('data looks good on the client side lets try and send');

                        fetch('/checkForAttemptedPurchases', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(data)
                        })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Server response is not okay');
                            }
                            return response.json();
                        })
                        .then(async firstChecker => {
                            if (firstChecker.canUserAttemptPurchase) {
                                console.log('server said it is okay to send transaction');
                    /*
                                // comment 4781--4978 and uncomment 4745-4778 when sending fake purchase
                                fetch('/UpdateDB', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(data)
                                })
                                .then(response => {

                                    if (response.ok) {
                                        return response.json(); // Return the promise returned by response.json()
                                    } else {
                                        return Promise.reject('Failed to update database');
                                    }
                                })
                                .then(checker => { 
                                    if (checker.updated == true) {
                                        purchaseSuccessPopUp(formContainer, checker.firstName, checker.lastName, checker.Id, checker.price.$numberDecimal, checker.img, checker.productName);
                                        submitButtonIsClicked = false;
                                        if(currentlyTryingToBuy){
                                            currentlyTryingToBuy = false;
                                        }else{

                                        }
                                    } else {
                                        console.log('Prompt user reason it was unable to add like bad email');
                                    }
                                })
                                .catch(error => {
                                    submitButtonIsClicked = false;
                                    console.error('Error updating database:', error);
                                    // Handle the error, notify user accordingly
                                }); 
                        */
                                                           
                                try{
                                    if(transactionInProgress){

                                    }else{
                                        const checkMyInfo = await validateUserInfo(data.email, data.address, data.firstName, data.lastName);
                                        console.log('checkMyInfo() returns', checkMyInfo);
                                        if(checkMyInfo.verified){   
                                            if (typeof window.ethereum != 'undefined' && isConnected){
                                                window.web3 = new Web3(window.ethereum);
                                                const loadingContainer = document.createElement("div");
                                                loadingContainer.className = "loading-container";
                                                loadingContainer.style.position = "absolute";
                                                loadingContainer.style.top = "50%";
                                                loadingContainer.style.left = "50%";
                                                loadingContainer.style.transform = "translate(-50%, -50%)";
                                                loadingContainer.style.width = "80%";
                                                loadingContainer.style.height = "60%";
                                                loadingContainer.style.display = "flex";
                                                loadingContainer.style.justifyContent = "center";
                                                loadingContainer.style.alignItems = "center";
                                                loadingContainer.style.backgroundColor = "none"; 
                                                const loadingIcon = document.createElement("img");
                                                loadingIcon.setAttribute("class", "loading-gif");
                                                loadingIcon.setAttribute("src", "/Gifs/LoadingIcon1/loadingicon1.gif");
                                                loadingIcon.setAttribute("alt", "Loading..."); 
                                                loadingIcon.style.width = "50%"; 
                                                loadingIcon.style.height = "50%"; 

                                                loadingContainer.appendChild(loadingIcon);
                                                formContainer.appendChild(loadingContainer);

                                                try{
                                                    const amountToSendString = parentDiv.className.replace("grid-item", ""); 
                                                    const amountToSendFloat = parseFloat(amountToSendString);
                                                    const conversionFactor = calculateConversionFactor(amountToSendFloat);
                                                    console.log('the conversion factor is', conversionFactor);

                                                    if(conversionFactor != null){
                                                        const networkStatus = await checkNetwork('ethereum'); 
                                                        if(networkStatus){
                                                            console.log('its okay to send transaction we are on the correct network');
                                                            transactionInProgress = true;
                                                            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                                                            const userWallet = accounts[0];
                                                            const recipientWallet = RoysWallet; 
                                                            const weiParameter = amountToSendFloat*conversionFactor;
                                                            const desiredDecimalPlaces = 7; 
                                                            let weiParameterStr = weiParameter.toString();
                                                            let decimalIndex = weiParameterStr.indexOf('.');

                                                            if (decimalIndex !== -1) {
                                                              let decimalPlaces = weiParameterStr.length - decimalIndex - 1;
                                                              if (decimalPlaces > desiredDecimalPlaces) {
                                                                weiParameterStr = weiParameterStr.slice(0, decimalIndex + desiredDecimalPlaces + 1);
                                                              }
                                                            }

                                                            const finalWeiParameter = parseFloat(weiParameterStr);
                                                            //console.log(finalWeiParameter.toString());
                                                            const amountInWei = web3.utils.toWei(finalWeiParameter.toString(), 'ether');
                                                            //const amountInWei = web3.utils.toWei(amountToSendString, 'ether');
                                                            const transactionObject = {
                                                                from: userWallet, 
                                                                to: recipientWallet,
                                                                value: amountInWei
                                                            };
                                                            console.log('trying to send string:', amountToSendString);
                                                            console.log('trying to send', amountToSendFloat);
                                                            console.log('in WEI', amountInWei);

                                                            const response = await window.ethereum.request({
                                                                method: 'eth_sendTransaction',
                                                                params: [transactionObject]
                                                            });

                                                            if(response.error){
                                                                console.log('an error occured', response.error.message);
                                                            }else if(response.result){
                                                                console.log(response.result);
                                                                console.log('User accepeted the transaction send the hash over to check on server');

                                                                const data = {
                                                                    transactionHash: response.result,
                                                                    objectId: parentDiv.id
                                                                };
                                                                    console.log('data looks good on the client side lets try and send');
                                                                    fetch('/UpdateDB', {
                                                                        method: 'POST',
                                                                        headers: {
                                                                            'Content-Type': 'application/json'
                                                                        },
                                                                        body: JSON.stringify(data)
                                                                    })
                                                                    .then(response => {

                                                                        if (response.ok) {
                                                                            return response.json(); 
                                                                        } else {
                                                                            return Promise.reject('Failed to update database');
                                                                        }
                                                                    })
                                                                    .then(checker => { 
                                                                        submitButtonIsClicked = false;
                                                                        transactionInProgress = false;
                                                                        if (checker.updated == true) {
                                                                            currentlyTryingToBuy = false;
                                                                            purchaseSuccessPopUp(formContainer, checker.firstName, checker.lastName, checker.Id, checker.price.$numberDecimal, checker.img, checker.productName);

                                                                        } else {
                                                                            console.log('Prompt user reason it was unable to add like bad email');
                                                                            formContainer.removeChild(loadingContainer);
                                                                        }
                                                                    })
                                                                    .catch(error => {
                                                                        submitButtonIsClicked = false;
                                                                        transactionInProgress = false;
                                                                        console.error('Error updating database:', error);
                                                                        formContainer.removeChild(loadingContainer);
                                                                    });
                                                            }else{
                                                                submitButtonIsClicked = false;
                                                                transactionInProgress = false;
                                                                console.log('an unexpected error occured');
                                                            }
                                                            submitButtonIsClicked = false;
                                                        }else{
                                                            alert('Make sure that you switch the network to Ethereum before proceeding with a transaction');
                                                            submitButtonIsClicked = false;
                                                        }
                                                    }else{
                                                        submitButtonIsClicked = false;
                                                    }
                                                } catch (error) {
                                                    submitButtonIsClicked = false;
                                                    transactionInProgress = false;
                                                    console.error('Error sending transaction:', error);
                                                    if(error.code == 4001){
                                                        console.log('user denied the transaction');
                                                        submitButtonIsClicked = false;
                                                        try{
                                                            const updateResponse = await fetch('/UpdateInProgressAttribute', {
                                                                method: 'POST',
                                                                headers: {
                                                                    'Content-Type': 'application/json'
                                                                },
                                                                body: JSON.stringify({objectId: data.objectId}) 
                                                            });

                                                            if (updateResponse.ok) {
                                                                const serverMessage = await updateResponse.json();
                                                                if(serverMessage.success == true){
                                                                   console.log('server message came back true and we updated the atemptedClient array');
                                                                }else{
                                                                    console.log('we could not update the values. Server response false');
                                                                }
                                                            } else {
                                                                console.error('Failed to update server values response was not okay');
                                                            }

                                                            }catch(error){
                                                                console.log('there was an error sending update fecth ',error);
                                                            }
                                                        }
                                                }
                                                console.log('User wallet:', userWallet);
                                                console.log('User trying to send', amountToSendFloat)
                                            }else{
                                                console.log('send user a request to login');
                                            }

                                        }else if (!checkMyInfo.verified){
                                            if(checkMyInfo.email){
                                                if(checkMyInfo.address){
                                                    if(checkMyInfo.firstName){
                                                        if(checkMyInfo.lastName){
                                                            console.log('this should never call because one of them will be false as !checkMyInfo.verified = false');
                                                        }else{
                                                             alert('Please enter a valid last Name');
                                                        }
                                                    }else{
                                                          alert('Please enter a valid First Name');
                                                    }
                                                }else{
                                                    alert('Please enter a valid address to ship package');
                                                }
                                            }else{
                                                alert('Please enter a valid email');
                                            }
                                        }else if(checkMyInfo == null){
                                             console.log('there is an error we are getting Null for checkMyInfo() function');
                                        }else{
                                            console.log('an unepexected error occured');
                                        }
                                    }

                                }catch(error){
                                    console.log('we could not fire the function checkMyInfo correctly');   
                                    const loadingContainer = document.querySelector('.loading-container');
                                    if(loadingContainer){
                                        formContainer.removeChild(loadingContainer);
                                    }else{
                                        console.log('the form container is not availabe');
                                    }
                                } 
                             submitButtonIsClicked = false;    
                            } else {
                                if(firstChecker.code == 102111){
                                    console.log('Server says client is already trying to get the same painting. Please try again in 30 seconds.');
                                    warningTransactionPresent();
                                }else if (firstChecker.code == 232585511 ) {
                                    warningMaxTransactionProcessed();
                                }else if (firstChecker.code == 232111119 ) {
                                    console.log('Item is out of Stock');
                                }else if (firstChecker.code == 6477665555) {
                                    console.log('Cannot Find item in Db maybe the server is down');
                                }                                
                                submitButtonIsClicked = false;
                            }
                        })
                        .catch(error => {
                            console.error('Error getting first check from server', error);
                        });
                        
                                        
                    }                
                    
                }); 
                    const cancelButton = document.createElement("div");
                    cancelButton.className = "cancelEmail-button";
                    cancelButton.innerText = "X";
                    cancelButton.style.cursor = "pointer";
                    cancelButton.style.position = "absolute"; 
                    cancelButton.style.top = "0";
                    cancelButton.style.right = "0";
                    cancelButton.style.width = "8vh"; 
                    cancelButton.style.height = "10vh"; 
                    cancelButton.style.backgroundColor = "none"; 
                    cancelButton.style.fontSize = "2vh"; 
                    cancelButton.style.display = "flex"; 
                    cancelButton.style.justifyContent = "center"; 
                    cancelButton.style.alignItems = "center";

                    cancelButton.addEventListener("click", function() {
                        document.body.removeChild(formContainer);
                        currentlyTryingToBuy = false;
                    });


                    form.appendChild(emailInput);
                    form.appendChild(addressInput);
                    form.appendChild(firstNameInput);
                    form.appendChild(lastNameInput);
                    form.appendChild(submitButton);

                    formContainer.appendChild(titleDiv);
                    formContainer.appendChild(form);
                    formContainer.appendChild(cancelButton);

                    document.body.appendChild(formContainer);
            }else{
                if(!isConnected){
                    alert('Please connect your wallet to make a purchase.');
                }else if(currentlyTryingToBuy){  
                    alert('You are currently already trying to purchase a painting. Please close the form and reopen a new one if you would like to choose another painting.');
                }else{
                    alert('an unexpected error occured');
                }
                
            }

        });
    }else{
         console.log('painting not availabe');
    }
}
function  warningMaxTransactionProcessed(){
    var modal = document.createElement('div');
    modal.id = 'myModal';
    modal.classList.add('modal');

    var modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    var closeDiv = document.createElement('div');
    closeDiv.classList.add('close');
    closeDiv.textContent =  "X";
    closeDiv.style.fontSize = '2vh';

    var messageParagraph = document.createElement('p');
    messageParagraph.textContent = 'You have reached the maximum number of purchase attempts. Please try again in a few hours';

    modalContent.appendChild(closeDiv);
    modalContent.appendChild(messageParagraph);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    modal.style.display = 'block';
    modal.style.position = 'fixed';
    modal.style.left = '50%';
    modal.style.top = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.width = '250px';
    modal.style.height = '150px';
    modal.style.backgroundColor = 'lightgray';
    modal.style.border = '1px solid black';
    modal.style.borderRadius = '5px';
    modal.style.padding = '15px';
    modal.style.zIndex = 10000000;

    modalContent.style.width = '100%';
    modalContent.style.height = '100%';
    modalContent.style.display = 'flex';
    modalContent.style.flexDirection = 'column';
    modalContent.style.justifyContent = 'center';
    modalContent.style.alignItems = 'center';

    closeDiv.style.color = 'black';
    closeDiv.style.position = 'absolute';
    closeDiv.style.top = '10px';
    closeDiv.style.right = '10px';
    closeDiv.style.cursor = 'pointer';

    closeDiv.addEventListener('click', function() {
        modal.parentNode.removeChild(modal);
    });

}
function warningTransactionPresent() {
    var modal = document.createElement('div');
    modal.id = 'myModal';
    modal.classList.add('modal');

    var modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    var closeDiv = document.createElement('div');
    closeDiv.classList.add('close');
    closeDiv.textContent =  "X";
    closeDiv.style.fontSize = '2vh';

    var messageParagraph = document.createElement('p');
    messageParagraph.textContent = 'A client is already trying to purchase the same painting. Please try again in 30 seconds. If the transaction fails or the user doesn\'t execute their MetaMask request, we will reset the value for you.';

    modalContent.appendChild(closeDiv);
    modalContent.appendChild(messageParagraph);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    modal.style.display = 'block';
    modal.style.position = 'fixed';
    modal.style.left = '50%';
    modal.style.top = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.width = '250px';
    modal.style.height = '150px';
    modal.style.backgroundColor = 'lightgray';
    modal.style.border = '1px solid black';
    modal.style.borderRadius = '5px';
    modal.style.padding = '15px';
    modal.style.zIndex = 10000000;

    modalContent.style.width = '100%';
    modalContent.style.height = '100%';
    modalContent.style.display = 'flex';
    modalContent.style.flexDirection = 'column';
    modalContent.style.justifyContent = 'center';
    modalContent.style.alignItems = 'center';

    closeDiv.style.color = 'black';
    closeDiv.style.position = 'absolute';
    closeDiv.style.top = '10px';
    closeDiv.style.right = '10px';
    closeDiv.style.cursor = 'pointer';

    closeDiv.addEventListener('click', function() {
        modal.parentNode.removeChild(modal);
    });

}


function writeToParentDivWithDelay(text, parentDiv, delay, thisIndex) {
    const repsonseContainer = document.createElement('div');
    repsonseContainer.style.height = '600px';
    repsonseContainer.style.width = '100%';
    repsonseContainer.style.opacity = '0.73';
    repsonseContainer.style.borderBottom = '0.2vh solid lightgrey';
    repsonseContainer.style.overflowY = 'scroll';
    repsonseContainer.style.marginBottom = '40px';

    parentDiv.appendChild(repsonseContainer);

    let index = 0;
    let newText = `Response ${thisIndex+1}:` + " \n " +  text; 
    const intervalId = setInterval(() => {
        if (index < newText.length) {
            repsonseContainer.textContent += newText[index];
            index++;
        } else {
            clearInterval(intervalId); 
        }
    }, delay);

}

async function getResponse(question) {
    await new Promise(resolve => setTimeout(resolve, 2000)); 
    const lowercaseQuestion = question.toLowerCase();

    try{
        const response = await fetch('/AI-event', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ question: lowercaseQuestion })
        });

            if (!response.ok) {
                console.log('response is not okay');
                return null;
            }else{
                console.log('trying to return data we got from server');
                const data = await response.json();
                return data;  
            }

    }catch(error){
        console.log('error with response from server try and catch failed');
        return null;
    }
}

async function validateUserInfo(email, address, firstName, lastName) {
    try {
        console.log('trying to get response');
        const response = await fetch('/validate_info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                address: address,
                firstName: firstName,
                lastName: lastName
            })
        });

        if(response.ok){

            let data = await response.json();
            return data;
        }else{
            return null;
        }

    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}


export async function getMessageHistory() {
    try {
        const response = await fetch('/GetMessageHistory', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            const localMessageHistory = await response.json();        
            return localMessageHistory;
        } else {
            console.error('Response.ok failed the response is not okay');
        }
    } catch (error) {
        console.error('Error fetching paintings:', error);
        return [];
      
    }
}


function purchaseSuccessPopUp(formContainer, firstName, lastName, productID, price, productImageBase64, ProductName) {
    while (formContainer.firstChild) {
        formContainer.removeChild(formContainer.firstChild);
    }
    const container = document.createElement('div');
    container.className = 'container';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.backgroundColor = '#ffffff';
    container.style.border = '1px solid #ccc';
    container.style.borderRadius = '5px';
    container.style.padding = '20px';
    container.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    container.style.overflow = 'hidden';
    container.style.position = 'relative'; 
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';
    container.style.backgroundColor = 'lightgray';

    const header = document.createElement('div');
    header.className = 'header';
    header.style.position = 'absolute';
    header.style.width = '80%';
    header.style.height = '10%';
    header.style.top = '0%';
    header.style.left = '0%';
    header.style.borderRadius = '5px 5px 0 0';
    header.style.marginBottom = '2px';
    header.style.backgroundImage = 'url("images/BursonSKullText.png")';
    header.style.backgroundSize = 'cover';
    header.style.backgroundRepeat = 'no-repeat';
    header.style.backgroundPosition = 'center'; 
    header.style.marginBottom = '5px';

    const exitButtonContainer = document.createElement('div');
    exitButtonContainer.className = 'exitButtonContainer';
    exitButtonContainer.style.position = 'absolute';
    exitButtonContainer.style.width = '80%';
    exitButtonContainer.style.height = '5%';
    exitButtonContainer.style.top = '0%';
    exitButtonContainer.style.marginBottom = '2%';
    exitButtonContainer.style.backgroundColor = 'none';


    const exitPurchaseButton =  document.createElement('div');
    exitPurchaseButton.className = 'exitPurchaseButton';
    exitPurchaseButton.style.position = 'absolute';
    exitPurchaseButton.style.width = '10%';
    exitPurchaseButton.style.height = '100%';
    exitPurchaseButton.style.right = '2%';
    exitPurchaseButton.style.borderRadius = '5px 5px 0 0';
    exitPurchaseButton.style.marginBottom = '0px';
    exitPurchaseButton.style.backgroundColor = 'none';
    exitPurchaseButton.textContent = '❌'; 
    exitPurchaseButton.style.fontSize = '2vh'; 
    exitPurchaseButton.style.border = 'none'; 
    exitPurchaseButton.style.cursor = 'pointer'; 

    exitPurchaseButton.addEventListener('click', function() {
        console.log('trying to remove form');
        formContainer.remove();
    });

    const centeredDiv = document.createElement('div');
    centeredDiv.style.backgroundImage = `url(${productImageBase64})`;
    centeredDiv.style.backgroundSize = 'cover'; 
    centeredDiv.style.width = '14vh';
    centeredDiv.style.height = '14vh';
    centeredDiv.style.borderRadius = '5px';
    centeredDiv.style.zIndex = '1';
    centeredDiv.style.position = 'absolute'; 
    centeredDiv.style.top = '10%'; 
    centeredDiv.style.left = '28%';
    centeredDiv.style.marginBottom = '2px';
    centeredDiv.style.backgroundRepeat = 'no-repeat';
    centeredDiv.style.backgroundPosition = 'center'; 
    centeredDiv.style.borderRadius = '.2vh';
    centeredDiv.style.border = '1px solid #ccc';
    centeredDiv.style.borderRadius = '5px';
    container.appendChild(centeredDiv);

    const message = document.createElement('div');
    message.className = 'message';
    message.style.position = 'absolute';
    message.style.fontSize = '1.8vh';
    message.style.width = '75%';
    message.style.marginTop = '10px'; 
    message.style.textAlign = 'left';
    message.style.backgroundColor = 'none';
    message.style.bottom = '0%';
    message.style.top = '37%';
    message.style.left = '12.5%';
    message.style.height = '60%';
    message.style.overflow = 'scroll';

    message.style.cssText += `
        scrollbar-width: thin; /* For Firefox */
        scrollbar-color: transparent transparent; /* For Firefox */
        ::-webkit-scrollbar-track {
            background-color: transparent; /* Make scrollbar track transparent */
        }
    `;
    message.innerHTML = `
        <p style="font-size: 1.8vh; margin: 0, left: 2%;">Thank you ${firstName} ${lastName} for your purchase. We're excited to have you on board!</p>
        <p style="font-size: 1.8vh; margin: 8px, left: 2%;">Here are the details of your purchase:</p>
        <ul style="font-size: 1.8vh; padding-inline-start: 15px; margin: 0; text-align: left;"> <!-- Adjusted text-align -->
            <li style="margin-bottom: 4px;">Product: ${ProductName} </li>
            <li style="margin-bottom: 4px;">Price: ${price} ETH</li>
            <li style="margin-bottom: 4px;">Order ID: ${productID}</li>
        </ul>
        <p style="font-size: 1.8vh; margin: 10px, left: 2%;">If you have any questions or concerns, feel free to <a href="mailto:bursodevelopments@gmail.com" style="font-size: 1.8vh;">contact us</a>. Check your email for a copy of this receipt and a tracking number for your package.</p>
        <p style="font-size: 1.8vh; margin: 0, left: 2%;">Best regards,<br><span class="signature" style="text-indent: 20px;"> &nbsp; &nbsp; Roy Burson</span></p>
    `;
    container.appendChild(header);
    exitButtonContainer.appendChild(exitPurchaseButton);
    container.appendChild(exitButtonContainer);
    container.appendChild(message);
    formContainer.appendChild(container);
}



function makeNewGrid(array, grid){
        array.forEach(item => {
        var gridItem = document.createElement('div');
        gridItem.classList.add('grid-item'+item.price.$numberDecimal.toString());
        gridItem.setAttribute('id', item._id);
        gridItem.textContent = item; 
        gridItem.style.position = 'relative';

        gridItem.style.backgroundColor = '#aaaaaa'; 
        gridItem.style.width = '95%'; 
        gridItem.style.left = '2.5%'; 
        gridItem.style.height = '94%'; 
        gridItem.style.top = '3%';
        gridItem.style.display = 'flex';
        gridItem.style.justifyContent = 'center';
        gridItem.style.alignItems = 'center';
        gridItem.style.setProperty('border-radius', '10px', 'important');
        gridItem.style.boxShadow =  '0px 2px 4px rgba(0, 0, 0, 0.7)';
        removeString(gridItem, "[object Object]");
        gridItem.style.backgroundImage = `url("${item.image}")`;
        gridItem.style.backgroundSize = 'cover'; 
        gridItem.style.backgroundRepeat = 'no-repeat';
        gridItem.style.backgroundPosition = 'center'; 
        gridItem.style.backgroundSize = '90% 100%'; 

        var overlay = document.createElement('div');
        overlay.classList.add('overlay');
        overlay.style.position = 'absolute';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.top = 0;
        overlay.style.left = 0;
        overlay.style.setProperty('border-radius', '10px', 'important');
        overlay.style.backgroundColor = 'dimgray'; 
        overlay.style.display = 'none';
        overlay.style.flexDirection = 'column'; 
        overlay.style.justifyContent = 'flex-end'; 
        overlay.style.opacity = '.6';

        gridItem.addEventListener('mouseenter', async function() {

            gridItem.style.transform = 'translateY(-5px)';
            overlay.style.display = 'flex';
            var checkIfInStock = null;
            for(const myObj of currentPaintingArray){
                if(myObj._id == gridItem.id){
                    checkIfInStock = myObj.inStock;
                }else{

                }
            }

            addBuyButton(gridItem, checkIfInStock, gridItem.id);

            var descriptionP = document.createElement('p');
            descriptionP.className = 'descriptionPaintingPTAG';
            descriptionP.style.width = '100%';
            descriptionP.style.height = '80%';
            descriptionP.style.top = '0%';
            descriptionP.style.position = 'absolute';
            descriptionP.style.overflowY = 'scroll';
            descriptionP.style.fontSize = '1.8vh';
            descriptionP.style.color = 'white';

            for(const painting of currentPaintingArray){
                if(painting._id == gridItem.id){
                    descriptionP.innerHTML =  'Name:' + "    " + painting.name + '<br>'  + 'Approximate Price:' + "    " + painting.price.$numberDecimal + " ETH " + '<br>'+ " Number of Views: "+  painting.views +  '<br> <br>' +  painting.description;
                }
            }
            overlay.appendChild(descriptionP);

            const containsPaintingId = currentViewedPaintings.some(item => item.paintingId === gridItem.id);

            if (!containsPaintingId) {
              currentViewedPaintings.push({paintingId: gridItem.id});
                try {
                    const response = await fetch('/UpdatePaintingViewsValue', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(gridItem.id) 
                    });

                    if (response.ok) {
                        const serverMessage = await response.json();
                        if(serverMessage.success == true){

                        }else{
                            console.log('we could not update the db object came back as', serverMessage);
                        }
                    } else {
                        console.error('Failed to add painting:', response.statusText);
                    }
                } catch (error) {
                    console.error('Error adding painting:', error);
                }
            }else{

            }
        });
        gridItem.addEventListener('mouseleave', function() {
            gridItem.style.transform = 'translateY(0)';
            overlay.style.display = 'none'; 
            const buyButton = document.querySelector('.buy-button' + gridItem.id.toString());
            const descriptionP = document.querySelector('.descriptionPaintingPTAG');
            if (buyButton) {
                buyButton.remove();
                descriptionP.remove();
            } else {
                console.error('Buy button not found');
            }
        });
        gridItem.appendChild(overlay);
        grid.appendChild(gridItem);
    });

}

async function organizePaintingArrayByMostRecent(array) {
    array.sort((a, b) =>  {

        const dateA = new Date(a.dateCreated);
        const dateB = new Date(b.dateCreated);

        // Compare dates
        if (dateA < dateB) return 1;
        if (dateA > dateB) return -1;
        return 0;
    });
    return array;
}

async function organizePaintingArrayByOldest(array) {
    array.sort((a, b) => {
        const dateA = new Date(a.dateCreated);
        const dateB = new Date(b.dateCreated);
        if (dateA > dateB) return 1;
        if (dateA < dateB) return -1;
        return 0;
    });
    return array;
}


async function organizePaintingArrayByLeastExpensive(array) {
    array.sort((a, b) => a.price.$numberDecimal - b.price.$numberDecimal);
    return array;
}

async function  organizePaintingArrayByMostExpensive(array) {
     array.sort((a, b) => b.price.$numberDecimal - a.price.$numberDecimal);
    return array;
}


async function organizePaintingArrayByMostViewed(array) {
    array.sort((a, b) => b.views - a.views);
    return array;
}


