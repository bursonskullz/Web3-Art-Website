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
let currentNFTcollections = [];
let userSelectedContract;
let contractName;
let totalChunks = 0;

var submitButtonIsClicked = false;
var currentlyPrinted = false;
var gridPageNumber = 1;
var NFTPageNumber = 1;
var changeUserNamePopUpExist = false;
var currentlyTryingToBuy = false;
var isSocketPresent = false;
var clientCanSendAIfetchRequest = true;
var tryingToAccessData = false;

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

function makeUserForm(title) {
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

    // Make the element draggable if you have that function
    // makeElementDraggable(formContainer); // Uncomment if you have this function defined

    const titleSpan = document.createElement('span');
    titleSpan.textContent = title; // Set the form title based on the clicked item
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

    closeButton.addEventListener('click', function () {
        document.body.removeChild(formContainer);
    });

    formContainer.appendChild(closeButton);
    return formContainer;
}


function makeSelectorForm(){
        // Create a form element and apply styles for the pop-up
    const form = document.createElement('form');
    form.className = 'contract-selector-form';

    if(window.innerWidth >= 450){
        form.style.width = '400px';
        form.style.height = '400px';
    }else{
        form.style.width = '300px';
        form.style.height = '400px';
    }
    form.style.position = 'fixed';
    form.style.top = '50%';
    form.style.left = '50%';
    form.style.transform = 'translate(-50%, -50%)';
    form.style.backgroundColor = 'dimgray';
    form.style.border = '1px solid #ccc';
    form.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    form.style.padding = '10px';
    form.style.overflow = 'hidden'; // No scrolling allowed
    form.style.zIndex = '1000'; // Ensure it appears on top of other elements
    makeElementDraggable(form);

    // Create a header for the form
    const header = document.createElement('div');
    header.style.position = 'relative';
    header.style.height = '30px'; // Height of the header
    header.style.backgroundColor = 'dimgray';
    header.style.color = '#fff'; // Text color for the header
    header.style.display = 'flex';
    header.style.alignItems = 'center';
    header.style.padding = '5px';
    header.style.fontSize = '18px';
    header.style.fontWeight = 'bold';

    const header2 = document.createElement('div');
    header2.style.position = 'relative';
    header2.style.height = '30px'; // Height of the header
    header2.style.backgroundColor = 'dimgray';
    header2.style.color = '#fff'; // Text color for the header
    header2.style.display = 'flex';
    header2.style.alignItems = 'center';
    header2.style.padding = '5px';
    header2.style.fontSize = '18px';
    header2.style.fontWeight = 'bold';

    // Create a close button for the pop-up with an "X"
    const closeButton = document.createElement('button');
    closeButton.textContent = '×'; // Unicode character for "X"
    closeButton.style.position = 'absolute';
    closeButton.style.top = '5px';
    closeButton.style.right = '5px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.border = 'none';
    closeButton.style.background = 'none';
    closeButton.style.fontSize = '18px';
    closeButton.style.color = '#888'; // Gray color for a subtle look
    closeButton.style.padding = '5px';
    closeButton.style.lineHeight = '1';
    closeButton.style.fontWeight = 'bold';
    closeButton.style.borderRadius = '50%';
    closeButton.style.width = '25px';
    closeButton.style.height = '25px';
    closeButton.style.display = 'flex';
    closeButton.style.alignItems = 'center';
    closeButton.style.justifyContent = 'center';
    closeButton.style.transition = 'background-color 0.3s, color 0.3s';

    // Close button event listener
    closeButton.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent form submission
        document.body.removeChild(form);
    });

    const titleSpan = document.createElement('span');
    titleSpan.textContent = '';
    titleSpan.className = 'slectorFormTitleSpanTag';
    titleSpan.style.flex = '1';
    titleSpan.style.textAlign = 'center';
    titleSpan.style.fontWeight = 'bold'; // Make the text bold
    header.appendChild(closeButton);
    header.appendChild(titleSpan);
    form.appendChild(header);
    form.appendChild(header2);
    document.body.appendChild(form);

    const msgSpanTag = document.createElement('span');
    msgSpanTag.className = 'msgSpanTag';
    msgSpanTag.textContent = 'Loading....';
    msgSpanTag.style.flex = '1';
    msgSpanTag.style.textAlign = 'center';
    msgSpanTag.style.fontWeight = 'bold'; // Make the text bold
    header2.appendChild(msgSpanTag);
    var strings = [
        "Loading",
        "Please Wait"
     ];

    printInfo(msgSpanTag, strings);

    // Create a container for the form content
    const contentContainer = document.createElement('div');
    contentContainer.className = 'contentContainerNFTs';
    contentContainer.style.overflow = 'auto'; // Allow scrolling if necessary
    contentContainer.style.height = 'calc(100% - 40px)'; // Subtract header height
    form.appendChild(contentContainer);

    return form;
}
export async function addDigitalElementListener(digitalElement){
    digitalElement.addEventListener('click', function() {
        if(!NFTDivOverlay){
            NFTDivOverlay = true;
            shiftOffScreen(gridNavigator);

            console.log('Trying to create the selector form');
            const checkIfFormIsActive = document.querySelector(".contract-selector-form");
            if(checkIfFormIsActive){

            }else{
                const contractsForm = makeSelectorForm();

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
                contractsForm.appendChild(loadingContainer);

                

                // this returns all the contracts dont call it yet 
                nft_section_click(digitalElement).then(async (result) => {
                    console.log('collections data recived from database:', result);
                    currentNFTcollections = result;
                    loadingContainer.remove();
                    const titleSpanTag = document.querySelector(".slectorFormTitleSpanTag");
                    titleSpanTag.textContent = 'Collections';
                    result.forEach((item) => {
                        console.log('trying to add collection to container');
                        // Create a container div for each contract
                        const contractDiv = document.createElement('div');

                        contractDiv.style.display = 'flex';
                        contractDiv.style.alignItems = 'center';
                        contractDiv.style.cursor = 'pointer';
                        contractDiv.style.padding = '5px';
                        contractDiv.style.border = '1px solid #ccc';
                        contractDiv.style.marginBottom = '5px';
                        contractDiv.style.borderBottom = '0.4vh solid lightgray'; 
                        contractDiv.style.transition = 'background-color 0.3s';
                        contractDiv.style.width = '100%'; // Make the div span all the way across
                        contractDiv.style.backgroundColor = 'dimgray'; // Add light gray background

                        // Add a hover effect
                        contractDiv.addEventListener('mouseenter', () => {
                            contractDiv.style.backgroundColor = '#e0e0e0';
                        });

                        contractDiv.addEventListener('mouseleave', () => {
                            contractDiv.style.backgroundColor = 'dimgray'; // Change this back to initial color
                        });

                        // Create an image container for the collection background image
                        const imageContainer = document.createElement('div');
                        imageContainer.style.marginRight = '10px';
                        imageContainer.style.width = '50px'; // Adjust width as needed
                        imageContainer.style.height = '50px';
                        imageContainer.style.overflow = 'hidden';
                        imageContainer.style.display = 'flex';
                        imageContainer.style.alignItems = 'center';
                        imageContainer.style.justifyContent = 'center';

                        // Create the image element
                        const image = document.createElement('img');
                        image.src = item.collectionBackgroundImage;
                        image.style.width = '100%';
                        image.style.height = 'auto';
                        image.style.objectFit = 'cover';

                        // Append the image to its container
                        imageContainer.appendChild(image);

                        // Create a span for the contract name
                        const contractNameSpan = document.createElement('span');
                        contractNameSpan.textContent = item.contractName;
                        contractNameSpan.style.flex = '1';
                        contractNameSpan.style.textAlign = 'center';

                        // Append the image and contract name to the contract div
                        contractDiv.appendChild(imageContainer);
                        contractDiv.appendChild(contractNameSpan);


                        // Add click event to resolve the promise with the selected contract name
                        contractDiv.addEventListener('click', async () => {
                            if(!tryingToAccessData){
                                const msgSpanTag = document.querySelector(".msgSpanTag");
                                msgSpanTag.textContent = "";
                                console.log(`Contract selected: ${item.contractName}`);
                                console.log('setting contract data locally for client side access');
                                tryingToAccessData = true;
                                userSelectedContract = {contractName: item.contractName, contractAddress: item.contractAddress, contractABI: item.contractABI, collectionBackgroundImage: item.collectionBackgroundImage};

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
                                contractsForm.appendChild(loadingContainer);

                                msgSpanTag.textContent = "Searching for token data. Please Wait a moment until tokens are presented.";
                                msgSpanTag.style.color = 'white';
                                const nfts = await getNFTS(item.contractName);
                                console.log('We got the documents', nfts);
                                loadingContainer.remove();


                                if(nfts.length!= 0){
                                    currentNFTArray = nfts;
                                    setTimeout(async () => { 
                                        contractsForm.remove();
                                        // remove loading icon on top right
                                        console.log('trying to make dummy page with array', currentNFTArray);
                                        sideElementsWidthPercent = '15%'; 
                                        GridWidth = '65%';
                                        gridItemWidth = '100%';
                                        rowWidth = '10%';

                                        if(window.innerWidth >= 999 ){
                                            if(currentNFTArray.length >= 24){
                                                makeNFTPage(currentNFTArray.slice(0,24), currentNFTsPurchaseArray, sideElementsWidthPercent,  document.body, 4, GridWidth, gridItemWidth);
                                            }else{
                                                makeNFTPage(currentNFTArray, currentNFTsPurchaseArray, sideElementsWidthPercent,  document.body, 4, GridWidth, gridItemWidth);
                                            }
                                        }else if(window.innerWidth <= 998 && window.innerWidth >= 610 ){
                                            GridWidth = '52%';
                                            gridItemWidth = '95%';
                                            sideElementsWidthPercent = '20%'; 
                                            rowWidth = '33%';

                                            if(currentNFTArray.length >= 24){
                                                makeNFTPage(currentNFTArray.slice(0,24), currentNFTsPurchaseArray, sideElementsWidthPercent,  document.body, 3, GridWidth, gridItemWidth);
                                            }else{
                                                makeNFTPage(currentNFTArray, currentNFTsPurchaseArray, sideElementsWidthPercent,  document.body, 3, GridWidth, gridItemWidth);
                                            }

                                            var grid = document.querySelector('.NewGrid');
                                            grid.style.left = '23%';

                                        }else if(window.innerWidth <= 609 && window.innerWidth >= 500){
                                            sideElementsWidthPercent = '24%'; 
                                            GridWidth = '80%';
                                            gridItemWidth = '100%';
                                            rowWidth = '50%';

                                            if(currentNFTArray.length >= 24){
                                                makeNFTPage(currentNFTArray.slice(0,24), currentNFTsPurchaseArray, sideElementsWidthPercent,  document.body, 3, GridWidth, gridItemWidth);
                                            }else{
                                                makeNFTPage(currentNFTArray, currentNFTsPurchaseArray, sideElementsWidthPercent,  document.body, 3, GridWidth, gridItemWidth);
                                            }

                                            const contractInfoContainer = document.querySelector('.contractInfoContrainer');
                                            const contractTools = document.querySelector('.contractTools');
                                            const contractOptions = document.querySelector('.contractOptions');
                                            const chatBox = document.querySelector('.crypto-chat-room');

                                            const gridContainer = document.querySelector('.NewGrid');
                                            gridContainer.style.left = '10%';

                                            contractInfoContainer.remove();
                                            contractTools.remove();
                                            contractOptions.remove();
                                            chatBox.remove();
                                        }else if(window.innerWidth <= 499 && window.innerWidth >= 350 ){
                                            //sideElementsWidthPercent = '5%'; 
                                            GridWidth = '80%';
                                            gridItemWidth = '100%';
                                            //rowWidth = '50%';
                                            if(currentNFTArray.length >= 24){
                                                makeNFTPage(currentNFTArray.slice(0,24), currentNFTsPurchaseArray, sideElementsWidthPercent,  document.body, 2, GridWidth, gridItemWidth);
                                            }else{
                                                makeNFTPage(currentNFTArray, currentNFTsPurchaseArray, sideElementsWidthPercent,  document.body, 2, GridWidth, gridItemWidth);
                                            }
                                            const contractInfoContainer = document.querySelector('.contractInfoContrainer');
                                            const contractTools = document.querySelector('.contractTools');
                                            const contractOptions = document.querySelector('.contractOptions');
                                            const chatBox = document.querySelector('.crypto-chat-room');

                                            const gridContainer = document.querySelector('.NewGrid');
                                            gridContainer.style.left = '10%';

                                            contractInfoContainer.remove();
                                            contractTools.remove();
                                            contractOptions.remove();
                                            chatBox.remove();
                                        }else if(window.innerWidth <= 350) {
                                            window.location.href = 'unsupported.html'; 
                                        }

                                    }, 101)
                                }else{
                                    console.log('There are no NFTs on the contract yet');
                                    msgSpanTag.textContent = "There are currently no NFT's on this contract. Wait until mint is annocuned or select another contract";
                                    msgSpanTag.style.color = '#8b0000';

                                }
                                tryingToAccessData = false;
                            }else{
                                alert('Currently trying to fetch tokens on contract please wait a second before trying to select a different contract');
                            }
                        });

                        // Append the contract div to the content container
                        const container = document.querySelector('.contentContainerNFTs');
                        container.appendChild(contractDiv);
                    });



                }).catch(error =>{
                    console.log(error);
                });
            }
        }   

    }); 
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
                            addMessage(element.msg, element.username, element.time, 'dimgray');
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

/*
export function nft_section_click(parentElement){
     console.log("NFT section clicked!"); 
     comingSoonScreen(parentElement);
}
*/

function makeElementDraggable(element) {
    let offsetX, offsetY;
    let isDragging = false;

    element.addEventListener("mousedown", function (event) {
        isDragging = true;
        offsetX = event.clientX - parseFloat(window.getComputedStyle(element).left);
        offsetY = event.clientY - parseFloat(window.getComputedStyle(element).top);
        element.style.cursor = "grabbing";
    });

    document.addEventListener("mousemove", function (event) {
        if (isDragging) {
            element.style.left = (event.clientX - offsetX) + "px";
            element.style.top = (event.clientY - offsetY) + "px";
        }
    });

    document.addEventListener("mouseup", function () {
        isDragging = false;
        element.style.cursor = "grab";
    });
}
async function createContractSelectionForm(array) {
    console.log('Trying to create the selector form');

    // Create a form element and apply styles for the pop-up
    const form = document.createElement('form');
    form.style.width = '400px';
    form.style.height = '400px';
    form.style.position = 'fixed';
    form.style.top = '50%';
    form.style.left = '50%';
    form.style.transform = 'translate(-50%, -50%)';
    form.style.backgroundColor = 'dimgray';
    form.style.border = '1px solid #ccc';
    form.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    form.style.padding = '10px';
    form.style.overflow = 'hidden'; // No scrolling allowed
    form.style.zIndex = '1000'; // Ensure it appears on top of other elements
    makeElementDraggable(form);

    // Create a header for the form
    const header = document.createElement('div');
    header.style.position = 'relative';
    header.style.height = '30px'; // Height of the header
    header.style.backgroundColor = 'dimgray';
    header.style.color = '#fff'; // Text color for the header
    header.style.display = 'flex';
    header.style.alignItems = 'center';
    header.style.padding = '5px';
    header.style.fontSize = '18px';
    header.style.fontWeight = 'bold';

    // Create a close button for the pop-up with an "X"
    const closeButton = document.createElement('button');
    closeButton.textContent = '×'; // Unicode character for "X"
    closeButton.style.position = 'absolute';
    closeButton.style.top = '5px';
    closeButton.style.right = '5px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.border = 'none';
    closeButton.style.background = 'none';
    closeButton.style.fontSize = '18px';
    closeButton.style.color = '#888'; // Gray color for a subtle look
    closeButton.style.padding = '5px';
    closeButton.style.lineHeight = '1';
    closeButton.style.fontWeight = 'bold';
    closeButton.style.borderRadius = '50%';
    closeButton.style.width = '25px';
    closeButton.style.height = '25px';
    closeButton.style.display = 'flex';
    closeButton.style.alignItems = 'center';
    closeButton.style.justifyContent = 'center';
    closeButton.style.transition = 'background-color 0.3s, color 0.3s';

    // Close button event listener
    closeButton.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent form submission
        document.body.removeChild(form);
    });

    const titleSpan = document.createElement('span');
    titleSpan.textContent = 'Collections';
    titleSpan.style.flex = '1';
    titleSpan.style.textAlign = 'center';
    titleSpan.style.fontWeight = 'bold'; // Make the text bold
    header.appendChild(closeButton);
    header.appendChild(titleSpan);
    form.appendChild(header);

    // Create a container for the form content
    const contentContainer = document.createElement('div');
    contentContainer.style.overflow = 'auto'; // Allow scrolling if necessary
    contentContainer.style.height = 'calc(100% - 40px)'; // Subtract header height

    // Create the promise here and handle the resolve function properly
    return new Promise((resolve) => {
        // Loop through the array and create elements for each item
        array.forEach((item) => {
            // Create a container div for each contract
            const contractDiv = document.createElement('div');
            contractDiv.style.display = 'flex';
            contractDiv.style.alignItems = 'center';
            contractDiv.style.cursor = 'pointer';
            contractDiv.style.padding = '5px';
            contractDiv.style.border = '1px solid #ccc';
            contractDiv.style.marginBottom = '5px';
            contractDiv.style.borderBottom = '0.4vh solid lightgray'; 
            contractDiv.style.transition = 'background-color 0.3s';
            contractDiv.style.width = '100%'; // Make the div span all the way across
            contractDiv.style.backgroundColor = 'dimgray'; // Add light gray background

            // Add a hover effect
            contractDiv.addEventListener('mouseenter', () => {
                contractDiv.style.backgroundColor = '#e0e0e0';
            });

            contractDiv.addEventListener('mouseleave', () => {
                contractDiv.style.backgroundColor = 'dimgray'; // Change this back to initial color
            });

            // Create an image container for the collection background image
            const imageContainer = document.createElement('div');
            imageContainer.style.marginRight = '10px';
            imageContainer.style.width = '50px'; // Adjust width as needed
            imageContainer.style.height = '50px';
            imageContainer.style.overflow = 'hidden';
            imageContainer.style.display = 'flex';
            imageContainer.style.alignItems = 'center';
            imageContainer.style.justifyContent = 'center';

            // Create the image element
            const image = document.createElement('img');
            image.src = item.collectionBackgroundImage;
            image.style.width = '100%';
            image.style.height = 'auto';
            image.style.objectFit = 'cover';

            // Append the image to its container
            imageContainer.appendChild(image);

            // Create a span for the contract name
            const contractNameSpan = document.createElement('span');
            contractNameSpan.textContent = item.contractName;
            contractNameSpan.style.flex = '1';
            contractNameSpan.style.textAlign = 'center';

            // Append the image and contract name to the contract div
            contractDiv.appendChild(imageContainer);
            contractDiv.appendChild(contractNameSpan);

            // Add click event to resolve the promise with the selected contract name
            contractDiv.addEventListener('click', () => {
                console.log(`Contract selected: ${item.contractName}`);
                document.body.removeChild(form); // Remove the form from the body
                resolve(item.contractName); // Resolve the promise with the contract name
            });

            // Append the contract div to the content container
            contentContainer.appendChild(contractDiv);
        });

        // Append the content container to the form
        form.appendChild(contentContainer);

        // Append the form to the body or any other container
        document.body.appendChild(form);
    });
}
export async function nft_section_click(parentElement) {
    const functionNameString = 'getAllNFTS';


    let listofCollections ;
    try {
         const response = await fetch('/getALLDeployedCollections', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            listofCollections = await response.json();
            if(listofCollections.success == false){
                console.log('no databases active');
            }else{
                console.log('Received collections', listofCollections);

            }
        } else {
            console.error("Failed to get response from server");
        }
    } catch (error) {
        console.error("Error With server");
        listofCollections = [];
    }
    return listofCollections;
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

        makeElementDraggable(popup);
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

export function makeNFTGrid(array, parentElement, columns, gridWidthPercent) {
    var numRows = Math.ceil(array.length / columns);
    var oldGrid = document.querySelector('.Grid_container');
    var gridContainer = document.createElement('div');

    if (oldGrid) {
        console.log('removed old grid');
        oldGrid.parentNode.removeChild(oldGrid); 
    }
    
    gridContainer.style.position = 'relative';
    gridContainer.style.left = `17%`;
    gridContainer.style.height = '100%'; 
    gridContainer.className = 'NewGrid';
    gridContainer.style.width = gridWidthPercent;
    gridContainer.style.top = '-5%'; 
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
        console.log('trying to make items to append to grid')
        var gridItem = document.createElement('div');
        gridItem.classList.add('grid-item'+ item.contractAddress);// price in classlist if needed to access later but contract handles that
        gridItem.setAttribute('id', item.tokenID);
        //gridItem.textContent = item; 
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
        //console.log('trying to set background image to', item.image);
        gridItem.style.backgroundImage = `url("${item.image}")`;
        gridItem.style.backgroundSize = 'cover'; 
        gridItem.style.backgroundRepeat = 'no-repeat';
        gridItem.style.backgroundPosition = 'center'; 
        gridItem.style.backgroundSize = '100%'; 

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
            console.log('we are hovering on the mouse');
            gridItem.style.transform = 'translateY(-5px)';
            overlay.style.display = 'flex';

            var checkIfInStock = false; // call contract instead and get boolean value from contract

            var descriptionP = document.createElement('p');
            descriptionP.className = 'descriptionNFTPTAG';
            descriptionP.style.width = '100%';
            descriptionP.style.height = '80%';
            descriptionP.style.top = '0%';
            descriptionP.style.position = 'absolute';
            descriptionP.style.overflowY = 'scroll';
            descriptionP.style.fontSize = '1.8vh';
            descriptionP.style.color = 'white';

            let maticValue = '50000'; // get value from contract instead this is dummy variable
            let NFTOwner = '0x37277211111'; // get actually owner data from contract

            descriptionP.innerHTML =  'Name:' + "    " + item.contractName + ' ' + item.tokenID + '<br>'  + 'Approximate Price:' + "    " + maticValue + " Matic " + '<br>'+ " Owner: "+  NFTOwner +  '<br> <br>';
            overlay.appendChild(descriptionP);
            gridItem.appendChild(overlay);
            addNFTBuyButton(gridItem, checkIfInStock, gridItem.id);
        });
        gridItem.addEventListener('mouseleave', function() {
            gridItem.style.transform = 'translateY(0)';
            overlay.style.display = 'none'; 

            const buyButton = document.querySelector('.buy-button' + gridItem.id.toString());
            const descriptionP = document.querySelector('.descriptionNFTPTAG');

            if (buyButton != 'undefined' || buyButton != null) {
                buyButton.remove();
            } else {
                console.error('Buy button not found');
            }
            if(descriptionP){
               descriptionP.remove(); 
            }else{
                console.log('Description not found');
            }
        });

        gridContainer.appendChild(gridItem);
        // add hover event to buy NFT 
        // check if NFT is avaiabale (check from contract) then put purchase text content in button else put unavailable
        // add attributes and info to overlay 
        // add event listener to button if avaialable to call prucahse function to contract
        // if contract returns false then alert user
        // else make a successpopup like before may be able to use the same function 
        // on hover out remove overlay
        // make ability to sweep floor (toss multiple token ids into array and toss to contract if avaialabale)
    });

    
    parentElement.appendChild(gridContainer);

}


export function makeNewNFTGrid(array, grid) {
    console.log('trying to make new grid');
    array.forEach(item => {
        console.log('trying to make items to append to grid');
        var gridItem = document.createElement('div');
        console.log(item.price);
        gridItem.classList.add('grid-item'+ item.price);
        gridItem.setAttribute('id', item.id);
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
        gridItem.style.backgroundSize = '100%'; 

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
        grid.appendChild(gridItem);
        console.log('we made a new grid'); 

        // add hover event to buy NFT 
        // check if NFT is avaiabale (check from contract) then put purchase text content in button else put unavailable
        // add attributes and info to overlay 
        // add event listener to button if avaialable to call prucahse function to contract
        // if contract returns false then alert user
        // else make a successpopup like before may be able to use the same function 
        // on hover out remove overlay
        // make ability to sweep floor (toss multiple token ids into array and toss to contract if avaialabale)
    });
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
                    console.error('Error adding painting views:', error);
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
                    console.log('need to shuffle currentNFTArray by date created from blockchain or currentNFTArray[i].mintDate');
                    console.log('makeNewOrganized array and shuffle data from blockchain mint date is string');
                    
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
                    console.log('need to shuffle currentNFTArray and maybe fix function');
                    
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
                    console.log('need to shuffle currentNFTArray and maybe fix function');
                    
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
                    console.log('need to shuffle currentNFTArray and maybe fix function');
                    
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
                    console.log('need to shuffle currentNFTArray and maybe fix function');
                    
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

function createCircularSweeper(container) {
    const sweeperCircle = document.createElement('div');
    sweeperCircle.classList.add('sweeper-circle');
    container.appendChild(sweeperCircle);

    const knot = document.createElement('div');
    knot.classList.add('knot');
    sweeperCircle.appendChild(knot);

    const infoSpan = document.createElement('span');
    infoSpan.classList.add('info-span');
    container.appendChild(infoSpan);

    let isDragging = false;
    const radius = sweeperCircle.offsetWidth / 2 - knot.offsetWidth / 2;
    const maxItems = 25;
    let angle = -Math.PI / 2; // Start angle at the left edge (top-center of the circle)

    function updateKnotPosition() {
        // Calculate the position of the knot based on the current angle
        const x = radius * Math.cos(angle) + sweeperCircle.offsetWidth / 2;
        const y = radius * Math.sin(angle) + sweeperCircle.offsetHeight / 2;

        // Update the knot position to keep it on the edge
        knot.style.left = `${x - knot.offsetWidth / 2}px`;
        knot.style.top = `${y - knot.offsetHeight / 2}px`;

        // Update the sweep information
        updateSweepInfo();
    }

    function updateSweepInfo() {
        // Calculate the percentage based on the angle
        const percent = (angle + Math.PI / 2) / (2 * Math.PI) * 100; // Normalize angle to 0 to 100%
        const items = Math.round((percent / 100) * maxItems); // Convert percentage to item count
        infoSpan.textContent = `Sweep ${items} items`;
        sweeperCircle.style.background = `conic-gradient(#4caf50 ${percent}%, transparent ${percent}%)`;
    }

    function onMouseMove(event) {
        if (isDragging) {
            const rect = sweeperCircle.getBoundingClientRect();
            const x = event.clientX - rect.left - sweeperCircle.offsetWidth / 2;
            const y = event.clientY - rect.top - sweeperCircle.offsetHeight / 2;
            angle = Math.atan2(y, x); // Calculate angle without the + Math.PI / 2 adjustment

            if (angle < -Math.PI / 2) angle += 2 * Math.PI; // Adjust angle to start from the top-center position

            updateKnotPosition();
        }
    }

    function onMouseDown(event) {
        isDragging = true;
        onMouseMove(event);
    }

    function onMouseUp() {
        isDragging = false;
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    knot.addEventListener('mousedown', onMouseDown);

    // Initialize knot position on the edge of the circle
    updateKnotPosition();
}


export function makeNFTPage(array, purchaseArray, sideElementsWidth, parentElement, numColumns, gridWidthPercent, gridItemWidth) {
    console.log('2) make header to hold collection logo directly above grid from database'); 
    console.log('3) make grid work on all screen sizes');
    console.log('4) test deploy contract function and start to call them on hover, ...etc. Make sure to test contract on IDE devloper or whatever');
    console.log('5) make abaility to navigate pages maybe 50 items per page');
    console.log(`6) use ${userSelectedContract} to acess data for selected contract and display on page`);

    const collectionBackgroundImageContainer = document.createElement('div');
    collectionBackgroundImageContainer.style.position = 'relative';
    collectionBackgroundImageContainer.style.width = '60%';
    collectionBackgroundImageContainer.style.top = '-5%';
    collectionBackgroundImageContainer.style.left = '20%';
    collectionBackgroundImageContainer.style.height = '15%';
    //collectionBackgroundImageContainer.style.backgroundColor = 'dimgray';

    collectionBackgroundImageContainer.style.backgroundImage = 'url("/images/BursonSKullText.png")'; 
    collectionBackgroundImageContainer.style.backgroundSize = 'cover';
    collectionBackgroundImageContainer.style.backgroundRepeat = 'no-repeat';
    collectionBackgroundImageContainer.style.backgroundPosition = 'center'; 

    parentElement.appendChild(collectionBackgroundImageContainer);

    const contractInfoDiv = document.createElement('div');
    contractInfoDiv.className = 'contractInfoContrainer';
    contractInfoDiv.style.width = sideElementsWidth;
    contractInfoDiv.style.color = 'white';
    contractInfoDiv.style.fontSize = '1.5vh';
    contractInfoDiv.style.position = 'absolute';
    contractInfoDiv.style.left = '0.5%';
    contractInfoDiv.style.top = '20vh';
    contractInfoDiv.style.height = '40%';
    contractInfoDiv.style.padding = '20px';
    contractInfoDiv.style.boxSizing = 'border-box';
    contractInfoDiv.style.backgroundColor = '#404a5c';//#404a5c
    contractInfoDiv.style.borderStyle = 'solid';
    contractInfoDiv.style.borderColor = 'black';
    contractInfoDiv.style.borderRadius = '5px';
    contractInfoDiv.style.borderWidth = '2px';

    // Add contract information (replace with your actual data need to pull from contract)
    // const currentContractData = getContractData(contractAddress, thisContractABI);

    //let recentNFTSells = await getAllNFTSells(userSelectedContract.contractAddress, userSelectedContract.contractABI);// store data using contract
    //             --- each time a transfer occurs we need to store it in a map or track the event and save it to the contract
    // return an array of all tokens and data
    //let maximumNFTSell = await getMaxNFTSell(userSelectedContract.contractAddress, userSelectedContract.contractABI);// store data using contract 

    contractInfoDiv.innerHTML = `
        <h2 style="margin: 0; text-align: center;">Contract Information</h2>
        <p style="display: flex; align-items: center; justify-content: center; width: 100%; flex-grow: 1; border-bottom: 1px solid white; margin: 0;">Address: ${userSelectedContract.contractAddress.substr(25)+ "~~~"}</p>
        <p style="display: flex; align-items: center; justify-content: center; width: 100%; flex-grow: 1; border-bottom: 1px solid white; margin: 0;">Number of Tokens: ${array.length}</p>
        <p style="display: flex; align-items: center; justify-content: center; width: 100%; flex-grow: 1; border-bottom: 1px solid white; margin: 0;">Max Sale: 0 MATIC</p>
        <p style="display: flex; align-items: center; justify-content: center; width: 100%; flex-grow: 1; border-bottom: 1px solid white; margin: 0;">Number of Sells: 0</p> 
    `;

    // Center content using Flexbox
    contractInfoDiv.style.display = 'flex';
    contractInfoDiv.style.flexDirection = 'column'; // Stack items vertically
    contractInfoDiv.style.alignItems = 'center'; // Center items horizontally
    contractInfoDiv.style.justifyContent = 'center'; // Center items vertically
    contractInfoDiv.style.textAlign = 'center'; // Center text inside each <p>

    // Append the contract info div to the parent element
    parentElement.appendChild(contractInfoDiv);

    // Adjust the parent element's padding to make space for the contract info
    parentElement.style.paddingLeft = `${sideElementsWidth}px`;

    const options = document.createElement('div');
    options.className = 'contractOptions';
    options.style.fontSize = '1.5vh';
    options.style.width = sideElementsWidth;
    options.style.color = 'white';
    options.style.position = 'absolute';
    options.style.left = '0.5%';
    options.style.top = '62vh';
    options.style.height = '40%';
    options.style.padding = '20px';
    options.style.boxSizing = 'border-box';
    options.style.backgroundColor = '#404a5c';//#404a5c
    options.style.borderStyle = 'solid';
    options.style.borderColor = 'black';
    options.style.borderWidth = '2px';
    options.style.borderRadius = '5px';

    options.innerHTML = `
        <h2 style="margin: 0; text-align: center;">Options</h2>
        <p class="option-item" data-title="Recent Sells" style="display: flex; align-items: center; justify-content: center; width: 100%; flex-grow: 1; border-bottom: 1px solid white; margin: 0;">Recent Sells</p>
        <p class="option-item" data-title="My Tokens" style="display: flex; align-items: center; justify-content: center; width: 100%; flex-grow: 1; border-bottom: 1px solid white; margin: 0;">My Tokens</p>
        <p class="option-item" data-title="All Owners" style="display: flex; align-items: center; justify-content: center; width: 100%; flex-grow: 1; border-bottom: 1px solid white; margin: 0;">All Owners</p>
        <p class="option-item" data-title="Utility" style="display: flex; align-items: center; justify-content: center; width: 100%; flex-grow: 1; border-bottom: 1px solid white; margin: 0;">Utility</p> 
    `;
    // Center content using Flexbox
    options.style.display = 'flex';
    options.style.flexDirection = 'column'; // Stack items vertically
    options.style.alignItems = 'center'; // Center items horizontally
    options.style.justifyContent = 'center'; // Center items vertically
    options.style.textAlign = 'center'; // Center text inside each <p>

    // Append the contract info div to the parent element
    parentElement.appendChild(options);

    document.querySelectorAll('.option-item').forEach((item) => {
        item.addEventListener('click', function () {
            // Use a unique identifier based on data-title to check for existing forms
            const formIdentifier = `form-${this.getAttribute('data-title').replace(/\s+/g, '-')}`;
            const existingForm = document.querySelector(`.${formIdentifier}`);

            if (existingForm) {
                console.log('Form is already active, no need to populate again');
                return; // Stop further execution if form already exists
            }

            console.log('Trying to make form');
            const title = this.getAttribute('data-title');
            let form = makeUserForm(title);
            form.className = formIdentifier; // Use unique identifier as class
            document.body.appendChild(form);
            makeElementDraggable(form);

            if (item.textContent === "Recent Sells") {
                console.log('Trying to get recent sells to display.');
            } else if (item.textContent === "My Tokens") {
                console.log('Trying to get my tokens to display.');
            } else if (item.textContent === "All Owners") {
                console.log('Trying to get all Unique owners and how many they own and display.');
            } else if (item.textContent === "Utility") {
                console.log('Trying to show Utility page.');
                form.style.width = window.innerWidth <= 500 ? '350px' : '450px';
                form.style.height = '500px';
                form.style.overflowY = 'scroll';

                // Create a list of utilities
                const utilities = [
                    'Utility 1: Fractional ownership of Burson Research Articles',
                    'Utility 2: Access To exclusive web3 software.',
                    'Utility 3: Exclusive Content and Updates.',
                    'Utility 4: Early access to new collection releases.',
                    'Utility 5: Special discounts and offers.',
                    'Utility 6: Priority support and consultations.',
                ];

                // Create a container for the utilities
                const utilitiesContainer = document.createElement('div');
                utilitiesContainer.style.padding = '15px';

                // Create a list element
                const ul = document.createElement('ul');
                ul.style.listStyleType = 'disc';
                ul.style.paddingLeft = '20px';
                ul.style.fontSize = '15px';

                utilities.forEach((utility) => {
                    // Create a flex container for each utility item
                    const utilityItem = document.createElement('div');
                    utilityItem.style.display = 'flex';
                    utilityItem.style.justifyContent = 'space-between';
                    utilityItem.style.alignItems = 'center';
                    utilityItem.style.borderBottom = '1px solid #eee'; // Lighter divider for a softer look
                    utilityItem.style.padding = '10px 0';
                    utilityItem.style.fontSize = '14px'; // Consistent font size
                    utilityItem.style.color = 'black'; // Subtle color for text

                    // Create paragraph for the utility description
                    const paragraph = document.createElement('p');
                    paragraph.textContent = utility;
                    paragraph.style.margin = '0'; // Remove default margin
                    paragraph.style.flex = '1'; // Allow paragraph to take available space

                    // Create access button
                    const button = document.createElement('button');
                    button.textContent = 'Coming Soon';
                    button.style.padding = '8px 14px';
                    button.style.backgroundColor = '#007bff';
                    button.style.color = 'white';
                    button.style.border = 'none';
                    button.style.borderRadius = '4px';
                    button.style.cursor = 'pointer';
                    button.style.fontSize = '14px';
                    button.style.transition = 'background-color 0.3s, box-shadow 0.3s'; // Smooth transition

                    // Add shadow and interactive hover effect
                    button.style.boxShadow = '0 2px 4px rgba(0, 123, 255, 0.3)';
                    button.addEventListener('mouseenter', () => {
                        button.style.backgroundColor = '#0056b3';
                        button.style.boxShadow = '0 4px 8px rgba(0, 123, 255, 0.5)'; // Enhanced shadow on hover
                    });
                    button.addEventListener('mouseleave', () => {
                        button.style.backgroundColor = '#007bff';
                        button.style.boxShadow = '0 2px 4px rgba(0, 123, 255, 0.3)';
                    });

                    // Event listener for the button
                    button.addEventListener('click', () => {
                        console.log(`Accessing ${utility}`);
                        // Add access functionality here
                    });

                    // Append paragraph and button to the utility item
                    utilityItem.appendChild(paragraph);
                    utilityItem.appendChild(button);

                    // Append utility item to the list
                    ul.appendChild(utilityItem);
                });

                // Append list to the container
                utilitiesContainer.appendChild(ul);

                // Append container to the form
                form.appendChild(utilitiesContainer);
            }
        });

        // Add mouseenter and mouseleave events to create hover effect
        item.addEventListener('mouseenter', function () {
            this.style.backgroundColor = '#5a647d'; // Change background color on hover
            this.style.color = '#f0f0f0'; // Optional: Change text color
        });

        item.addEventListener('mouseleave', function () {
            this.style.backgroundColor = ''; // Reset background color
            this.style.color = ''; // Reset text color
        });
    });
    const tools = document.createElement('div');
    tools.className = 'contractTools';
    tools.style.fontSize = '1.5vh';
    tools.style.width = sideElementsWidth;
    tools.style.color = 'white';
    tools.style.position = 'absolute';
    tools.style.right = '1%';
    tools.style.top = '20vh';
    tools.style.height = '27%';
    tools.style.padding = '20px';
    tools.style.boxSizing = 'border-box';
    tools.style.backgroundColor = '#404a5c';//#404a5c
    tools.style.border = '2px solid black';
    tools.style.borderRadius = '5px';


    // Set the container to use Flexbox and distribute children evenly
    tools.style.display = 'flex';
    tools.style.flexDirection = 'column'; // Stack items vertically
    tools.style.justifyContent = 'space-between'; // Distribute space evenly between items

    // Each <p> element will span the full width and have an even height
    tools.innerHTML = `
        <h2 style="margin: 0; text-align: center;">Tools</h2>
        <p class="option-item-2" style="display: flex; align-items: center; justify-content: center; width: 100%; flex-grow: 1; border-bottom: 1px solid white; margin: 0;">Sweep</p>
        <p class="option-item-2" style="display: flex; align-items: center; justify-content: center; width: 100%; flex-grow: 1; border-bottom: 1px solid white; margin: 0;">Sort</p>
        <p class="option-item-2" style="display: flex; align-items: center; justify-content: center; width: 100%; flex-grow: 1; border-bottom: 1px solid white; margin: 0;">Search</p>
        <p class="option-item-2" style="display: flex; align-items: center; justify-content: center; width: 100%; flex-grow: 1; border-bottom: 1px solid white; margin: 0;">File a Report</p> 
    `;

    // Center content using Flexbox
    tools.style.display = 'flex';
    tools.style.flexDirection = 'column'; // Stack items vertically
    tools.style.alignItems = 'center'; // Center items horizontally
    tools.style.justifyContent = 'center'; // Center items vertically
    tools.style.textAlign = 'center'; // Center text inside each <p>

    parentElement.appendChild(tools);


    document.querySelectorAll('.option-item-2').forEach((item) => {
        item.addEventListener('click', function () {
            if(item.textContent == 'Sweep'){
                console.log('trying to perform sweep');
                const sweepBox = document.createElement('div');
                // Copy the size and styling from the existing element
                sweepBox.style.position = 'absolute'; // Position the new div on top of the existing element
                sweepBox.style.top = `${tools.offsetTop}px`;
                sweepBox.style.left = `${tools.offsetLeft}px`;
                sweepBox.style.width = `${tools.offsetWidth}px`;
                sweepBox.style.height = `${tools.offsetHeight}px`;
                sweepBox.style.backgroundColor = 'rgba(64, 74, 92, 0.7)'; // Set the background color to #404a5c with 70% opacity
                sweepBox.style.border = '1px solid black'; // Optional: Border to visualize the new div

                // Create the close icon
                const closeIcon = document.createElement('span');
                closeIcon.textContent = '×'; // You can use Unicode or an icon library
                closeIcon.style.position = 'absolute';
                closeIcon.style.top = '10px'; // Position it in the corner
                closeIcon.style.right = '10px';
                closeIcon.style.cursor = 'pointer'; // Show a pointer cursor on hover
                closeIcon.style.fontSize = '20px'; // Size of the close icon
                closeIcon.style.color = 'red'; // Color of the close icon

                // Append the close icon to the new div
                sweepBox.appendChild(closeIcon);
                closeIcon.addEventListener('click', ()=>{
                    document.body.removeChild(sweepBox);
                });
                document.body.appendChild(sweepBox);

                createCircularSweeper(sweepBox);
                // add over tools the same size with exist button 

                // pup up a circle with a knot on it that we can turn 
                // if we move it all the way around the cicle the span tag should say the maximum amount to seep say 25
                // the cirlce needs to pop up over the tools container and haveexit button without affecting other elements 
                // needs to add broom gif to each container
            }else if(item.textContent == 'Sort'){
                console.log('trying to pop up menu directly centered over the tools container');
            }else if(item.textContent == 'Sort'){
                console.log('')
            }else if(item.textContent == 'Search'){
                console.log('trying to make mini search bar in small pop up over tools container');
            }else{
                console.log('unepexected click');
            }
            // take grid and add loading container to each NFT you want to sweep
        });
        // Add mouseenter and mouseleave events to create hover effect
        item.addEventListener('mouseenter', function () {
            this.style.backgroundColor = '#5a647d'; // Change background color on hover
            this.style.color = '#f0f0f0'; // Optional: Change text color
        });

        item.addEventListener('mouseleave', function () {
            this.style.backgroundColor = ''; // Reset background color
            this.style.color = ''; // Reset text color
        });
    });

    // Adjust the parent element's padding to make space for the contract info
    parentElement.style.paddingLeft = `${sideElementsWidth}px`;

    // Create the NFT grid to the right of the contract info

    var footer = document.createElement('div');
    const footContainer = document.createElement('div');
    const logoContainer = document.createElement('div');
    const footerLargeTextContainer = document.createElement('div');
    var footerLEGAL = document.createElement('div');
    var footerLine = document.createElement('hr');
    const unknownDiv = document.createElement('div');
    var community =  ["X", "Instagram", "Threads"];
    var commnityList = document.createElement("ul");
    
    var links = ["Opensea", "Github", "researchGate", 'Linkedin', 'MathOverflow'];
    var linkList = document.createElement("ul");
    
    var resources = ["Help", "Privacy Policy", "Terms of Service", "Contracts"];
    var resourcesList = document.createElement("ul");

    unknownDiv.id = 'crypto-chat-room';
    unknownDiv.className = 'crypto-chat-room';
    unknownDiv.style.width = sideElementsWidth;
    unknownDiv.style.height = '55%';
    unknownDiv.style.position = 'absolute';
    unknownDiv.style.right = '1%';
    unknownDiv.style.top = '49%';
    unknownDiv.style.backgroundColor = '#404a5c';
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
    chatBox.style.backgroundColor = '#404a5c';
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

    links.forEach(function(itemText) {
        var li = document.createElement("li");
        const atag = document.createElement('a');
        li.style.marginBottom = '1vh';
        li.style.fontSize = '2.1vh';
        atag.textContent = itemText;
        atag.style.color = 'white';

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
        li.style.fontSize = '2.1vh';
        atag.textContent = itemText;
        atag.style.color = 'white';

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
        li.style.fontSize = '2.1vh';
        atag.textContent = itemText;
        atag.style.color = 'white';

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

    if(isSocketPresent && typeof socket != 'undefined'){
        console.log('socket is already present no need to add again');
    }else{
        isSocketPresent = true;
        socket.on('message', (myobject) => {   
            console.log('trying to add message from server');
            if(myobject.coolDown <= 10){
                let color = '#404a5c';
                addMessage(myobject.msg, myobject.username, myobject.time, color); 
            }else{
                alert('you cannot send anymore messages for 24 hours');
            }
            
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

    makeNFTGrid(array, parentElement, numColumns, gridWidthPercent, gridItemWidth);

    const logo = document.createElement('div');
    footer.style.position = 'relative';
    footer.style.height = '65vh';
    footer.style.width = '100%';
    footer.style.left = '0%';
    footer.style.bottom = '0vh';
    footer.style.backgroundColor = '#404a5c';
    footer.style.zIndex = '10';
    footer.style.marginTop = '3vh';
    footer.style.boxShadow = '0px -2px 4px rgba(0, 0, 0, 0.7)';
    footer.className = 'footer';

    footerLEGAL.style.position = 'relative';
    footerLEGAL.style.height = '10vh';
    footerLEGAL.style.width = '100%';
    footerLEGAL.style.left = '0%';
    footerLEGAL.style.bottom = '0%';
    footerLEGAL.style.backgroundColor = '#404a5c';
    footerLEGAL.style.zIndex = '10';
    footerLEGAL.style.marginTop = '0vh';

    footerLine.style.backgroundColor = 'white';
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
    footContainer.style.borderTop = "0.4vh solid white"; 
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
        heading.style.color = 'white';

        if(i == 1){
            heading.textContent = "Links"; 
        }else if(i == 2){
            heading.textContent = "Community";  
            column.style.borderLeft = "0.4vh solid white"; 
            column.style.borderRight = "0.4vh solid white"; 
        }else if(i == 3){
            heading.textContent = "Resources";
        }

        column.appendChild(heading);

        if(i==1){
            column.appendChild(linkList);
        }else if(i ==2){
            column.appendChild(commnityList);
        }else if(i ==3){
            column.appendChild(resourcesList);
        }

        row.appendChild(column);
    }

    footContainer.appendChild(row);
    parentElement.appendChild(unknownDiv);

    logoContainer.appendChild(logo);
    logoContainer.appendChild(footerLargeTextContainer); 
    footer.appendChild(logoContainer);
    footer.appendChild(footContainer);
    footerLEGAL.appendChild(footerLine);
    
    parentElement.appendChild(footer);
    parentElement.appendChild(footerLEGAL);

}

/*export function makeNFTPage(array, purchaseArray, sideElementsWidth, parentElement, numColumns, gridWidthPercent, gridItemWidth){
    makeNFTGrid(array, parentElement, numColumns, gridWidthPercent);
}*/
export function makePaintingPage(array, purchaseArray, parentElement, numColumns, sideElementsWidth, gridWidthPercent, griditem) {
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
                addMessage(myobject.msg, myobject.username, myobject.time, 'dimgray'); 
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
    printInfo(welcomeDivPTAG, strings);

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
            makeElementDraggable(containerInput);
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
            makeElementDraggable(botContainer);

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
            alert('We are on the last page of the paintings!');
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

export async function getNFTS(contractName){
    let tokensArray = [];
        try {
           const response = await fetch('/getALL-NFTs', { 
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({contractName: contractName})
              });
           if (response.ok) {
                  const compressedNFTArray = await response.json();            
                  if (compressedNFTArray.success == false) {
                      console.log('did not get back array maybe it had hard time sending');
                  }else{
                      for (let i = 0; i < compressedNFTArray.length; i++) {
                          let tokenObject = {
                               contractName: compressedNFTArray[i].contractName,
                               contractAddress: compressedNFTArray[i].contractAddress,
                               tokenID: compressedNFTArray[i].tokenID,
                               image: compressedNFTArray[i].image
                       };

                        tokensArray.push(tokenObject);   
                    }
                }                                
            } else {
              console.error('Failed to fetch NFTS the response was not okay', response.statusText);
              document.body.removeChild(loadingAnimation);
          }
        } catch (error) {
            console.error('Error fetching paintings:', error);
            document.body.removeChild(loadingAnimation);
    }
    return tokensArray;
}

export function addMessage(message, username, timestamp, color) {
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
    p.style.backgroundColor = color;
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
        const isSecretMenuActive = document.querySelector(".secret-menu");
        if(isSecretMenuActive){
        }else{
            addSecretMenu();
        }
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

function printInfo(div, strings) {
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
    const menuItems = ['upload painting', 'remove painting', 'send tracking number', 'Deploy a Contract', 'Mint a Collection'];
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

    makeElementDraggable(secretMenu);


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
                //secretMenu.remove();
                const isPaintingUploadFormActive = document.querySelector('.dbPopup');

                if(isPaintingUploadFormActive){

                }else{
                    const popupForm = document.createElement('div');
                    const titleSpan = document.createElement('span');
                    titleSpan.textContent = 'Upload Painting Form';
                    titleSpan.style.fontSize = '20px';
                    titleSpan.style.fontWeight = 'bold';
                    titleSpan.style.marginBottom = '15px';

                    popupForm.appendChild(titleSpan);
                    popupForm.classList.add('dbPopup');

                    makeElementDraggable(popupForm);

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
                            alert('Price must be a valid integer.');
                        }

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
                } 
                
            }else if(item == 'send tracking number'){
                const isConfirmationFormActive = document.querySelector('.confirmation-form');

                if(isConfirmationFormActive){

                }else{
                    makeConfirmationForm();
                }
                
            }else if(item == 'Mint a Collection') {
                const isMintingFormActive = document.querySelector('.Minting-form');

                if(isMintingFormActive){

                }else{
                    makeMintingForm();
                }
                
            }else if(item == "Deploy a Contract"){
                console.log('making a deployer form');

                // 1) check if form is already in the document before calling again 
                // 2) deploy simple contract to test it 
                // 3) use remix to write better contract and test using crazy donkeys
                // 4) save adress and ABI to database 
                // 5) pull all contracts and display them on the mint form before minting 
                // 6) use data to create a new model and database and save all data to it
                // 7) do not create data if database already exist
                const deployerFormIsActive = document.querySelector('.Deployer-form');

                console.log(deployerFormIsActive);

                if(deployerFormIsActive){
                    console.log(' form is active no need to call');
                }else{
                    console.log('form is not active calling function to make form');
                    makeDeployerForm();
                }
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

function createContract(data) {
    const minimumPolygonListingPrice = 100*(15*10**18); // 100 Matic minimum listing price 
    const minimumEtheruemListingPrice = 0.5*(15*10**18); // 0.5 ETH minimum listing price 
    const minimumETCCLassicListingPrice = 3*(15*10**18); // 0.5 ETH minimum listing price 

    const minimumPolygonTransferPrice = 10*(15*10**18); 
    const minimumEtheruemTransferPrice = 0.1*(15*10**18); 
    const minimumETCCLassicTransferPrice = 0.5*(15*10**18); 

    var minimalListingPrice;
    var minimalTransferFEE;

    if(data.token == 'ERC1155'){// Matic
        minimalListingPrice = minimumPolygonListingPrice;
        minimalTransferFEE = minimumPolygonTransferPrice;
    }else if(data.token == 'ERC721'){ //ETC
        minimalListingPrice = minimumEtheruemListingPrice;
        minimalTransferFEE = minimumEtheruemTransferPrice;
    } else if (data.token === 'ERC20') {// etc classic
        minimalListingPrice = 3 * (15 * 10 ** 18); 
        minimalTransferFEE = 0.5 * (15 * 10 ** 18);
    } 

    const version = '^0.8.19'; // may need to ^0.8.19 depending on coin
    const contractString = `
        // SPDX-License-Identifier: MIT
    
        pragma solidity ${version};
    
        contract ${data.name.replace(/ /g, '')}{
            // Struct to declare NFT (Non-Fungible Token) data attributes stored on contract.
            struct NFT {
                uint256 id;         // Unique identifier for the NFT
                uint256 price;      // Price of the NFT in wei (1 ether = 1e18 wei)
                address owner;      // Current owner of the NFT
                uint256 mintDate;   // Date of mint
                string tokenName;   // Token name
                bool forSale;       // Flag indicating if the NFT is for sale
                bool flagged;
            }
    
            // Mappings and arrays
            mapping(uint256 => NFT) public nfts;
            mapping(address => uint256[]) private userTokens; // Mapping from user address to array of token IDs owned by the user
            uint256[] private recentSells; // Array to track recent sells
    
            // Events to track NFT minting, listing for sale, and sale
            event NFTMinted(uint256 id, address owner);
            event NFTForSale(uint256 id, uint256 price);
            event NFTSells(uint256 id, uint256 price, uint256 date);
            
            // State variables to store the owners
            address public contractCreator;
            string public artist;
            address[] internal owners;
            uint256 creatorFee;
            address public walletToReceiveFunds;
            address public RoysWallet;
            uint256 public minimalTransferFee;
            uint256 public minimalListingPrice;// changes depending on deployment
            uint256 public tokenCount;
            uint256 maximumTokenCount;
    
            bool isRoyaltyFeeChangeable;
            bool isManagerInitiated;
            bool isContractSellable;
            bool isTokensPausible;
            bool isTokensBurnable;
    
            // constructor called once when code is initially deployed 
            constructor () {
                contractCreator = msg.sender; 
                artist = "Roy Burson";
                owners.push(contractCreator);
                creatorFee = 10;
                RoysWallet = 0x5CdaD7876270364242Ade65e8e84655b53398B76;
                walletToReceiveFunds = RoysWallet;
                minimalListingPrice = ${BigInt(minimalListingPrice)}; 
                minimalTransferFee = ${BigInt(minimalTransferFEE)}; 
                tokenCount = 0;
                maximumTokenCount = ${data.royaltyFee};
                isManagerInitiated = ${data.options[0].active};
                isContractSellable = ${data.options[1].active};
                isRoyaltyFeeChangeable = ${data.options[2].active};
                isTokensPausible = ${data.options[3].active};
                isTokensBurnable = ${data.options[4].active};
            }
    
            function changeMinimalTransferFee(uint256 amountInWEI) external {
                // Only the Owner in the first index (owner[0]) can change the minimal transfer fee 
                require(msg.sender == owners[0], "Privilege denied");
                minimalTransferFee = amountInWEI;
            }
    
            function checkIfOwner(address _address) internal view returns (bool) {
                for (uint256 i = 0; i < owners.length; i++) {
                    if (owners[i] == _address) {
                        return true;
                    }
                }
                return false;
            }
    
            function mintNFT(uint256 price) public payable returns (bool) {
                // any owner can mint
                if (!checkIfOwner(msg.sender)) {
                    return false;
                } else { 
                    uint256 newItemId = tokenCount; 
                    //_mint(owners[0], newItemId);  
                    tokenCount +=1;// plus one to the token count directly after mint
    
                    nfts[newItemId] = NFT({
                        id: newItemId,
                        price: price, // price in WEI
                        owner: owners[0],
                        mintDate: block.timestamp,
                        tokenName: "${data.name}",
                        forSale: true, 
                        flagged: false    
                    });
    
                    userTokens[owners[0]].push(newItemId); // Track ownership
                    emit NFTMinted(newItemId, owners[0]);
                    return true;
                }
            }
    
            function mintArrayOfNFTs(NFT[] memory nftArray) external payable returns (bool) {
                // do not increment token count because mint function already does
                for (uint256 i = 0; i < nftArray.length; i++) {
                    if (!mintNFT(nftArray[i].price)) {
                        return false;
                    }
                }
                return true;
            }
    
            function listNFT(uint256 tokenId, uint256 userListPrice) external payable {
                // remember to send 15 matic to Roy for listing fee
                require(owners[tokenId] == msg.sender, "Only the owner can list the NFT");
                require(userListPrice >= minimalListingPrice, "Price below minimum listing price");
                payable(walletToReceiveFunds).transfer(minimalTransferFee); // send Roy minimal transfer fee
                nfts[tokenId].forSale = true;
                nfts[tokenId].price = userListPrice;
                emit NFTForSale(tokenId, nfts[tokenId].price);
            }
    
            function delistNFT(uint256 tokenId) external payable {
                require(owners[tokenId] == msg.sender, "Only the owner can delist the NFT");
                nfts[tokenId].forSale = false;
            }
    
            function tokenByIndex(uint256 index) public view returns (uint256) {
                // gets tokenId from index of array which should be identical if increment works correctly
                require(index < tokenCount, "Index out of bounds");
                uint256 tokenId = tokenCount - index - 1;
                return tokenId;
            }
    
            function getAllNFTS() public view returns (NFT[] memory) {
                uint256 totalTokens = tokenCount;
                NFT[] memory tokens = new NFT[](totalTokens); // Initialize array correctly
    
                for (uint256 i = 0; i < totalTokens; i++) {
                    uint256 tokenId = tokenByIndex(i);
                    tokens[i] = nfts[tokenId];
                }
    
                return tokens;
            }
            
            function purchaseSingleNFT(uint256 tokenId) payable public returns (bool) {
                // Allows anyone that does not own the token to attempt purchase
                require(msg.value >= nfts[tokenId].price, "Insufficient payment");
                NFT storage nft = nfts[tokenId];
                require(nft.forSale, "NFT is not for sale");
                require(msg.value >= nft.price, "Insufficient payment");
    
                uint256 fee = (nft.price * creatorFee) / 100;
                uint256 ownerShare = nft.price - fee;
                
                // Transfer the creator's fee
                payable(walletToReceiveFunds).transfer(fee);
                // Transfer the remaining amount to the NFT owner
                payable(nft.owner).transfer(ownerShare);
                
                // Transfer the NFT to the buyer
                //safeTransferFrom(nft.owner, msg.sender, tokenId);
                
                // Update the NFT details
                nft.owner = msg.sender; // Change the owner after safeTransfer is complete
                nft.forSale = false;
    
                // Track recent sells
                recentSells.push(tokenId);
                
                // Keep the length of recentSells to a maximum of 1000 items
                if (recentSells.length > 1000) {
                    // Remove the first element by shifting all other elements left
                    for (uint i = 0; i < recentSells.length - 1; i++) {
                        recentSells[i] = recentSells[i + 1];
                    }
                    // Remove the last element
                    recentSells.pop();
                }
    
                emit NFTSells(tokenId, msg.value, block.timestamp);
                return true;
            }
    
            function purchaseArrayOfNFT(uint256[] memory tokenIdArray) external payable returns (bool) {
                // meant for sweep function
                uint256 totalCost;
                for (uint256 i = 0; i < tokenIdArray.length; i++) {
                    require(nfts[tokenIdArray[i]].forSale, "NFT not for sale");
                    totalCost += nfts[tokenIdArray[i]].price;
                    require(msg.sender != nfts[tokenIdArray[i]].owner, "Owner cannot purchase own NFT");
                }
                require(msg.value >= totalCost, "Insufficient payment");
                for (uint256 i = 0; i < tokenIdArray.length; i++) {
                    purchaseSingleNFT(tokenIdArray[i]);
                }
                return true;
            }
    
            function checkIfOwnerOfArray(uint256[] memory tokenIdArray) public view returns (bool) {
                // Checks if person is an owner of all tokens passed
                for (uint256 k = 0; k < tokenIdArray.length; k++) {
                    if (msg.sender != nfts[tokenIdArray[k]].owner) {
                        return false; // Return false immediately if sender doesn't own any token
                    }
                }
                return true; 
            }
    
            function transferSingleNFT(address recipient, uint256 tokenId) payable public returns (bool) {
                // this is for owner of token to transfer to another wallet
                require(msg.value >= minimalTransferFee, "Insufficient payment");
                require(!nfts[tokenId].flagged, "NFT has been flagged; cannot be sold");
                require(nfts[tokenId].forSale, "NFT is not for sale");
                require(msg.sender == nfts[tokenId].owner, "Only owner can transfer NFT");
                payable(walletToReceiveFunds).transfer(minimalTransferFee); // send Roy minimal transfer fee
    
                nfts[tokenId].owner = recipient;
                //safeTransferFrom(msg.sender, recipient, tokenId);
                return true;
            }
    
            function transferArrayOfNFTS(address recipient, uint256[] memory tokenIdArray) public returns (bool) {
                // meant for owners to transfer array of NFTs that they own to another wallet
                require(checkIfOwnerOfArray(tokenIdArray), "Sender is not owner of one or more NFTs");
                for (uint256 i = 0; i < tokenIdArray.length; i++) {
                    transferSingleNFT(recipient, tokenIdArray[i]);
                }
                return true;
            }
    
            function getMaxSell() public view returns (uint256 maxPrice) {
                maxPrice = 0;
                for (uint256 i = 1; i <= tokenCount; i++) {
                    if (nfts[i].price > maxPrice) {
                        maxPrice = nfts[i].price;
                    }
                }
                return maxPrice;
            }
    
            function getNumberOfTokens() public view returns (uint256) {
                return tokenCount;
            }
    
            function getRecentSells() public view returns (uint256[] memory) {
                uint256 limit = recentSells.length > 1000 ? 1000 : recentSells.length;
                uint256[] memory sells = new uint256[](limit);
                for (uint256 i = 0; i < limit; i++) {
                    sells[i] = recentSells[recentSells.length - i - 1];
                }
                return sells;
            }
    
            function getUsersTokens(address user) public view returns (uint256[] memory) {
                return userTokens[user];
            }
    
            function checkIfTokenIsAvailable(uint256 tokenId) public view returns (bool) {
                NFT storage nft = nfts[tokenId];
                return !nft.flagged && nft.forSale;
            }
        }`;
    return contractString;
}
function makeDeployerForm() {
    // make sure name does not exist before deploying
    const formContainer = document.createElement('div');
    formContainer.className = 'Deployer-form';
    formContainer.style.width = '300px';
    //formContainer.style.height = '600px';
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
    formContainer.style.maxHeight = '500px'; // Optional: Add max height to avoid overflow issues
    formContainer.style.overflowY = 'scroll'; // Optional: Add scroll if content exceeds max height
    document.body.appendChild(formContainer);

    makeElementDraggable(formContainer);

    const titleSpan = document.createElement('span');
    titleSpan.textContent = 'Deploy a Contract';
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


    // Create the image upload section
    const imageUploadSection = document.createElement('div');
    imageUploadSection.className = 'image-upload-section';
    imageUploadSection.style.width = '100%';
    imageUploadSection.style.height = '300px';
    imageUploadSection.style.backgroundColor = '#444';
    imageUploadSection.style.border = '2px dashed #ccc';
    imageUploadSection.style.display = 'flex';
    imageUploadSection.style.flexDirection = 'column';
    imageUploadSection.style.alignItems = 'center';
    imageUploadSection.style.justifyContent = 'center';
    imageUploadSection.style.cursor = 'pointer';
    imageUploadSection.style.marginBottom = '20px';
    imageUploadSection.style.backgroundSize = 'cover';
    imageUploadSection.style.backgroundPosition = 'center';
    
    // Hover effect
    imageUploadSection.addEventListener('mouseover', () => {
        imageUploadSection.style.backgroundColor = '#555';
    });
    imageUploadSection.addEventListener('mouseout', () => {
        imageUploadSection.style.backgroundColor = '#444';
    });

    // Label for the image upload section
    const imageLabel = document.createElement('p');
    imageLabel.textContent = 'Collection Background Image';
    imageLabel.style.color = '#fff';
    imageLabel.style.textAlign = 'center';
    imageUploadSection.appendChild(imageLabel);

    // Hidden file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    imageUploadSection.appendChild(fileInput);

    // Handle image upload
    imageUploadSection.addEventListener('click', () => {
        fileInput.click();
    });
    let collectionBackgroundBase64Image = null;
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                collectionBackgroundBase64Image = e.target.result;
                imageUploadSection.style.backgroundImage = `url(${collectionBackgroundBase64Image})`;
                console.log('Background image:', collectionBackgroundBase64Image);
            };
            reader.readAsDataURL(file);
        }
    });

    formContainer.appendChild(imageUploadSection);

    // Add the selection dropdown for contract type
    const contractSelect = document.createElement('select');
    contractSelect.style.marginTop = '20px';
    contractSelect.style.padding = '5px';
    contractSelect.style.borderRadius = '4px';
    contractSelect.style.border = '1px solid #333';
    contractSelect.style.width = '85%';

    const options = ['Select Token', 'MATIC', 'ETH'];

    options.forEach(optionText => {
        const option = document.createElement('option');
        option.value = optionText.toLowerCase();
        option.textContent = optionText;
        contractSelect.appendChild(option);
    });

    formContainer.appendChild(contractSelect);

    // Add input for contract name
    const contractNameInput = document.createElement('input');
    contractNameInput.placeholder = 'Contract Name';
    contractNameInput.style.marginTop = '20px';
    contractNameInput.style.padding = '5px';
    contractNameInput.style.borderRadius = '4px';
    contractNameInput.style.border = '1px solid #333';
    contractNameInput.style.width = '80%';
    formContainer.appendChild(contractNameInput);

    // Add input for creator earning percentage
    const creatorEarningInput = document.createElement('input');
    creatorEarningInput.placeholder = 'Creator Earning (%)';
    creatorEarningInput.type = 'number';
    creatorEarningInput.min = '0';
    creatorEarningInput.max = '100';
    creatorEarningInput.step = '0.01';
    creatorEarningInput.style.marginTop = '20px';
    creatorEarningInput.style.padding = '5px';
    creatorEarningInput.style.borderRadius = '4px';
    creatorEarningInput.style.border = '1px solid #333';
    creatorEarningInput.style.width = '80%';
    formContainer.appendChild(creatorEarningInput);

    // Add input for number of tokens to mint
    const tokenCountInput = document.createElement('input');
    tokenCountInput.placeholder = 'Number of Tokens';
    tokenCountInput.type = 'number';
    tokenCountInput.min = '1';
    tokenCountInput.style.marginTop = '20px';
    tokenCountInput.style.padding = '5px';
    tokenCountInput.style.borderRadius = '4px';
    tokenCountInput.style.border = '1px solid #333';
    tokenCountInput.style.width = '80%';
    formContainer.appendChild(tokenCountInput);

        // Add input for number of tokens to mint
    const deployContractPasscode = document.createElement('input');
    deployContractPasscode.placeholder = 'Passcode';
    deployContractPasscode.style.marginTop = '20px';
    deployContractPasscode.style.padding = '5px';
    deployContractPasscode.style.borderRadius = '4px';
    deployContractPasscode.style.border = '1px solid #333';
    deployContractPasscode.style.width = '80%';
    formContainer.appendChild(deployContractPasscode);


    const booleanOptions = [
        { label: 'Add a manager', value: 'addManager', placeholder: "Manager address" },
        { label: 'Make contract sellable', value: 'changeOwners', placeholder: "Owners Address" },
        { label: 'Change owner percentage', value: 'changeOwnerPercentage', placeholder: "Royalty Fee (0-12%)" },
        { label: 'Enable Pause/Unpause', value: 'enablePause', placeholder: "Owners Address" },
        { label: 'Enable Burnable Tokens', value: 'enableBurnable', placeholder: "Burners Address" }
    ];

    booleanOptions.forEach(option => {
        const optionContainer = document.createElement('div');
        optionContainer.style.marginTop = '10px';
        optionContainer.style.width = '80%';
        optionContainer.style.display = 'flex';
        optionContainer.style.flexDirection = 'column';

        const labelRow = document.createElement('div');
        labelRow.style.display = 'flex';
        labelRow.style.justifyContent = 'space-between';
        labelRow.style.alignItems = 'center';

        const optionLabel = document.createElement('label');
        optionLabel.textContent = option.label;

        const switchLabel = document.createElement('label');
        switchLabel.className = 'switch';
        const switchInput = document.createElement('input');
        switchInput.type = 'checkbox';
        switchInput.value = option.value;

        const switchSpan = document.createElement('span');
        switchSpan.className = 'slider round';

        switchLabel.appendChild(switchInput);
        switchLabel.appendChild(switchSpan);
        labelRow.appendChild(optionLabel);
        labelRow.appendChild(switchLabel);
        optionContainer.appendChild(labelRow);
        formContainer.appendChild(optionContainer);
    });

    // Add submit button
    const submitButton = document.createElement('button');
    submitButton.textContent = 'Deploy Contract';
    submitButton.style.marginTop = '30px';
    submitButton.style.padding = '10px 20px';
    submitButton.style.borderRadius = '4px';
    submitButton.style.border = '1px solid #333';
    submitButton.style.backgroundColor = '#444';
    submitButton.style.color = 'white';
    submitButton.style.cursor = 'pointer';

    formContainer.appendChild(submitButton);

    // Add event listener for submit button
    submitButton.addEventListener('click', async function() {

        await new Promise(resolve => setTimeout(resolve, 0));// wait briefly for icon to render

        if(collectionBackgroundBase64Image == null){
            alert('Make sure to upload a background image pelase for your collection');
            throw new Error("Error no background image inserted");
        }

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

        const selectedContract = contractSelect.value;
        const contractName = contractNameInput.value;
        const creatorEarning = creatorEarningInput.value;
        const tokenCount = tokenCountInput.value;
        const attemptedClientPasscode = deployContractPasscode.value;

        // make sure these variables (selectedContract, creatorEarning, tokenCount, and attemptedClientPasscode ) are not empty or null
        // if so throw error and warn client

        //const selectedOptions = booleanOptions.map(option => {
        //    const checkbox = formContainer.querySelector(`input[value="${option.value}"]`);
        //    const input = checkbox.parentElement.parentElement.querySelector('input[type="text"]');
        //    return checkbox.checked && input ? { option: option.value, inputValue: input.value } : null;
        //}).filter(Boolean);


        // Collect selected options and associated input values
        const selectedOptions = booleanOptions.map(option => {
            const checkbox = formContainer.querySelector(`input[value="${option.value}"]`);
            const input = checkbox.parentElement.parentElement.querySelector('input[type="text"]');
            if (checkbox.checked) {
                return { option: option.value};
            }else{
                return {option: null}
            }
        });

        let ERCStandard = '';
        console.log('select coin type', contractSelect.value);

        if(contractSelect.value == 'matic'){
            ERCStandard = 'ERC115';
        }else if(contractSelect.value == 'eth'){
            ERCStandard = 'ERC721';
        }else{
            ERCStandard = null;
        }

        let contractData = {
                token: ERCStandard,
                address: null, //initially null
                name: contractName,
                royaltyFee: creatorEarning,
                numberOfTokens: tokenCount,
                backgroundImage: collectionBackgroundBase64Image, 
                solidityContract: null, //initially null  
                options: selectedOptions,
                passcode: attemptedClientPasscode,
                lastChunk: null

        };

        const contractString = createContract(contractData); // return the actual contract in a string 
        contractData.solidityContract = contractString; // resets null attribute
        console.log('trying to make contract using data', contractData);
        console.log('compressedData on client side');

        //const compressedData = pako.gzip(JSON.stringify(contractData));

        // send send a bunch of fetches with string chunks insteads
        deployContractUsingServer(contractData).then(result =>{
            if(result.success == false){
                //alert('failed to compile bytecode please try again');
                //loadingContainer.remove();
            }else{
                console.log('contract deployed successfully please check database to mint');
            }
            
        }).catch(error=>{
            console.log('Error', error);
            alert('unexpected error occured');
            loadingContainer.remove();
        });


    });

    // Add custom styles for toggle switches
    const style = document.createElement('style');
    style.textContent = `
        .switch {
            position: relative;
            display: inline-block;
            width: 34px;
            height: 20px;
        }

        .switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 34px;
        }

        .slider:before {
            position: absolute;
            content: "";
            height: 14px;
            width: 14px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }

        input:checked + .slider {
            background-color: #2196F3;
        }

        input:checked + .slider:before {
            transform: translateX(14px);
        }

        .slider.round {
            border-radius: 34px;
        }

        .slider.round:before {
            border-radius: 50%;
        }
    `;
    document.head.appendChild(style);
}

async function deployContractUsingServer(data){
    console.log("Trying to send data to server to deploy", data);
    let contractDeploymentSuccess = false;
    let deployedContractABI;
    let deployedAddress = null;
    let stringChunk = '';

    // send fetch to server to handle deployment with a passcode 
    try {

        // chunk up data.backgroundImage and send a bunnch of fetches 
        const maxChunkSize = 700;
        const numberOfChunks = Math.ceil(data.backgroundImage.length/maxChunkSize);
        // check type is integer or convert 
        console.log('total number of chunks:', numberOfChunks);

        for (let i = 0; i < numberOfChunks; i++) {
            let start = i * maxChunkSize;
            let end = Math.min(start + maxChunkSize, data.backgroundImage.length);

            // Extract chunk
            let stringChunk = data.backgroundImage.substring(start, end);

            // Determine if this is the last chunk
            let isLastChunk = (i === numberOfChunks - 1);

            // Prepare data to send
            // send passcode with data
            // throw error and exist loop if code is equal to bad passcode
            const newData = {
                token: data.token,
                address: data.address, // initially null
                name: data.name,
                royaltyFee: data.royaltyFee,
                numberOfTokens: data.numberOfTokens,
                backgroundImage: stringChunk,
                solidityContract: data.solidityContract, // initially null  
                options: data.options,
                passcode: data.passcode,
                lastChunk: isLastChunk
            };
            //console.log(`trying to send fetch to server using chunk i = ${i}`);
            const response = await fetch('/deploy-a-contract', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newData)
            });
            if (response.ok) {
                const serverMessage = await response.json();
                //console.log(`Received response`, serverMessage);

                if(serverMessage.success == true  && serverMessage.contractABI != null){
                    console.log('all chunks have been sent over');
                    console.log('trying to deploy contract');

                    deployedContractABI = serverMessage.contractABI;

                    console.log('deployedContractABI', deployedContractABI);

                    // Determine the intended network based on the token
                    let expectedNetwork;

                    if (data.token === 'ERC115') {
                        expectedNetwork = 'matic'; // Polygon network
                    } else if (data.token === 'ERC721') {
                        expectedNetwork = 'main'; // Ethereum mainnet
                    } else {
                        alert('Please select from availabe tokens to deploy contract');
                        throw new Error(`Unsupported token: ${data.token}`);
                    }

                    // Check the current network connection
                    const web3 = new Web3(window.ethereum);
                    const currentNetwork = await web3.eth.net.getId();

                    console.log('web3 window object', await web3.eth.net);
                    console.log(`Connected to ${currentNetwork} network`);

                    // Check if the current network matches the expected network
                    if ((data.token === 'ERC115' && currentNetwork !== 137) || (data.token === 'ERC721' && currentNetwork !== 1)) {
                        alert('Please make sure you are on the correct network. Change networks in the metamask app.');
                        throw new Error(`Mismatch between selected network (${currentNetwork}) and expected network (${expectedNetwork})`);
                        // create span tag to prompt user inside the form
                    }

                    
                    console.log('Prepare to deploy the contract and approve the transaction');
                    // change span tag to say this inside the form

                    const Contract = new web3.eth.Contract(serverMessage.contractABI);
                    const deployOptions = {
                        data: serverMessage.bytecode,
                        arguments: [], // Add any constructor arguments if required
                    };

                    // Estimate gas for deployment
                    const connectedAccounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                    let deployerAddress;
                    deployerAddress = connectedAccounts[0];

                    console.log('deployerAddress = ', deployerAddress);

                    const gasEstimate = await web3.eth.estimateGas({
                        from: deployerAddress,
                        data: serverMessage.bytecode,
                    });


                    console.log('estimated gas fee to deploy solidity contract', gasEstimate);
                    console.log('need to make sure there is enough funds');

                    try {
                        // Deploy the contract and capture the transaction hash
                        const deployedContract = Contract.deploy(deployOptions)
                        .send({
                            from: deployerAddress,
                            gas: gasEstimate,
                            // Optional: Set a higher gas price for faster transactions
                            gasPrice: web3.utils.toWei('100', 'gwei'), // Adjust the value as needed
                        })
                        .on('transactionHash', (hash) => {
                            console.log('Transaction sent, waiting to be mined...', hash);
                        })
                        .on('receipt', async (receipt) => {
                            console.log('Transaction mined!', receipt);
                            contractDeploymentSuccess = true;

                            const contractInstance = receipt.contractAddress ? receipt : await deployedContract;
                            console.log('User accepted the transaction', contractInstance);
                            console.log('Address of the contract:', contractInstance.contractAddress);

                            // Capture the contract information once deployment is confirmed
                            let contractInformation = {
                                contractName: data.name,
                                contractAddress:  contractInstance.contractAddress,
                                contractABI: serverMessage.contractABI,
                                collectionBackground: data.backgroundImage
                            };

                            try {
                                const response = await fetch('/saveNFTCollection', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(contractInformation)
                                });

                                if (response.ok) {
                                    let serverMessage = await response.json();

                                    if (serverMessage.success === true) {
                                        console.log('Data saved successfully. Make a pop-up form containing information (ABI and Address with hyperlinks).');
                                        alert('data successfully saved to database');
                                    } else {
                                        console.log('serverMessage was false');
                                        alert('Error saving collection to database. Check your internet connection.');
                                    }
                                } else {
                                    console.error('Failed to get response from server');
                                }
                            } catch (error) {
                                console.error('Error with server:', error);
                            }

                            const loadingContainer = document.querySelector('.loading-gif');
                            if(loadingContainer){
                                loadingContainer.remove();
                                console.log('change text content in span tag and warn the user');
                            }
                            console.log('contract deployed successfully remove form and promt success!');
                        })
                        .on('error', (error) => {
                            const loadingContainer = document.querySelector('.loading-gif');
                            if(loadingContainer){
                                loadingContainer.remove();
                                console.log('change text content in span tag and warn the user transaction rejected');
                            }
                            if(error.code == 4001){
                                console.log('the user denied the transaction to deploy the transaction');
                            }else{
                                console.log('unexpected error occured', error);
                            }
                            // if not mined within 50 blocks retry or increase gas estimat
                        });

                    } catch (error) {
                        if (error.message.includes('User denied transaction signature')) {
                            console.log('User denied the transaction.');
                        } else {
                            console.error('An error occurred:', error);
                        }
                        deployerAddress = null;
                        contractDeploymentSuccess = false;
                    }

                }else if(serverMessage.success == false && serverMessage.error == 10983838122){
                    console.log(`passcode is incorrect stopping loop`);
                    contractDeploymentSuccess = false;
                    break;
                }else if(serverMessage.success == false && serverMessage.error == 10200299222222){
                    // sending next chunk dont print anything
                }else{
                    console.log('unexpected error', serverMessage);
                }
                
            } else {
                console.error(`Failed to get server response`, response.statusText);
                contractDeploymentSuccess = false;
                deployedContractABI = null;
            }
        }
    } catch (error) {
        console.error(`Error sending fetch /deploy-a-contract`, error);
        contractDeploymentSuccess = false;
        deployedContractABI = null;
    }
    // server message needs to return the actual fucking ABI and adress

    return {
        success: contractDeploymentSuccess,
        abi: deployedContractABI,
        contractAddress: deployedAddress
    };
}
async function makeMintingForm() {
    let listofCollections;
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

    makeElementDraggable(formContainer);

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
       
    try {
         const response = await fetch('/getALLDeployedCollections', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            listofCollections = await response.json();
            if(listofCollections.success == false){
                console.log('no databases active');
            }else{
                console.log('Received collections', listofCollections);
            }
        } else {
            console.error("Failed to get response from server");
        }
    } catch (error) {
        console.error("Error With server");
        listofCollections = [];
    }

    for(const collection of listofCollections){
        const option = document.createElement('option');
        option.value = collection.contractName;
        option.textContent = collection.contractName;
        contractSelector.appendChild(option);
        formContainer.appendChild(contractSelector);
    }

    // may need to instead search for contracts that are already minted or saved in DB 
    // so we dont have to manuelly add next time if we make another one

    let selectedContract = contractSelector.value; 

    contractSelector.addEventListener('change', function() {
        selectedContract = contractSelector.value;
        console.log(`Selected contract: ${selectedContract}`);
    });

    // Add input for passcode to
    const mintPasscode = document.createElement('input');
    mintPasscode.placeholder = 'Passcode';
    mintPasscode.style.marginTop = '20px';
    mintPasscode.style.padding = '5px';
    mintPasscode.style.borderRadius = '4px';
    mintPasscode.style.border = '1px solid #333';
    mintPasscode.style.width = '90%';
    formContainer.appendChild(mintPasscode);

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

    submitButton.addEventListener('click', async function() {
        if (!selectedContract) {
            alert('Please select a contract.');
            return;
        }

        console.log('sending data ....');
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

        const previousSearchBarContainer = document.querySelector('.progressBar1Container');
        const previousSearchText = document.querySelector('.progressBar1Text');

        if(previousSearchBarContainer){
            previousSearchBarContainer.remove();
        }

        if(previousSearchText){
            previousSearchText.remove();
        }

        const submitedProgressBarContainer = document.createElement('div');
        submitedProgressBarContainer.style.width = '100%';
        submitedProgressBarContainer.style.height = '20px';
        submitedProgressBarContainer.style.backgroundColor = '#ccc';
        submitedProgressBarContainer.style.borderRadius = '8px';
        submitedProgressBarContainer.style.marginBottom = '10px';
        formContainer.appendChild(submitedProgressBarContainer);

        const submitedProgressBar = document.createElement('div');
        submitedProgressBar.style.width = '0%';
        submitedProgressBar.className = 'submitedProgressBar';
        submitedProgressBar.style.height = '100%';
        submitedProgressBar.style.backgroundColor = '#4caf50';
        submitedProgressBar.style.borderRadius = '8px';
        submitedProgressBar.style.transition = 'width 0.5s';
        submitedProgressBarContainer.appendChild(submitedProgressBar);

        const submitedProgressText = document.createElement('span');
        submitedProgressText.className = 'submitedProgressText';
        submitedProgressText.style.color = '#fff';
        submitedProgressText.style.marginTop = '10px';
        formContainer.appendChild(submitedProgressText);

        let mintingAddress;
        let mintingABI;
        console.log('trying to get Address and ABI from data and selection', selectedContract);

        for(const collection of listofCollections){
            if(selectedContract == collection.contractName){
                mintingAddress = collection.contractAddress;
                mintingABI = collection.contractABI;
            }else{

            }
        }
        console.log('minting address = ', mintingAddress);
        console.log('minting ABI', mintingABI );
        let myContract;
        try{
            const web3 = new Web3(window.ethereum);
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const accounts = await web3.eth.getAccounts();
            const account = accounts[0];
            // Create a contract instance
            console.log(`trying to set contract instance and call functions for: ${mintingAddress}`);
            //const contract = new web3.eth.Contract(BursonSkullzContractAbi, contractAddress);
            const contract = new web3.eth.Contract(JSON.parse(mintingABI), mintingAddress);

            console.log('access to contract granted', contract);
            console.log('Contract methods:', contract.methods);
            const networkId = await web3.eth.net.getId();
            console.log('Network ID:', networkId);
            const result = await contract.methods.greet().call();
            console.log('Function call result:', result);
            

            //                 -- send seperate fetch and check if models exist before proceeding if you want to limit 
            //                 -- the amount of mints per contract
            //                 -- and might want to pull ii from DB if it already exist so we dont mint the same tokenID to DB 
            //                 -- server code below
            //                 -- send this back to client 
            console.log('trying to save files to database');// show on the form 

            //1) make next for statement this a function that returns the serverMessageArray to stay organized
            //2) may need to chunk image and send to seperate fetch or compress if you want to work inside droplet (remember adding painting failed because it was to much data)
            //3) check everything is working (may want to remove buttons so you cant click twice) and resend data
            //4) make a span tag to print info similiar to the select contract form inside the NFT sections
            // if successfull call mintCollectionSuccessPopUpForm(selectedContract, filesArray[0].image);

            if(filesArray.length == 0){
                alert('Please Insert files to be processed');
            }else{
                const tryToAddDocument = await addTokensToDataBase(filesArray, mintPasscode.value, selectedContract,  mintingAddress); // returns serverMessageArray with at last 1 document
                console.log('addTokensToDataBase() retuns',tryToAddDocument);
                const successChecker = await checkDocumentsSuccess(tryToAddDocument);
                console.log('checkDocumentsSuccess() returns', successChecker);
                // if this returns true at least one document was added to the database
                if(successChecker){
                    mintCollectionSuccessPopUpForm(selectedContract, filesArray[0].image);
                    // use codes to check which documents where
                    // make this pop up form show them the tokens that did not save 
                    // promt them if you want to try again on the failed documents 
                    // dont worry about organization will organize on client side 
                    // just make sure to not save the same tokenID over again in DB
                }else{
                    alert('at least one document failed to upload to database');
                    console.log('trying to resend fetch with token ID and image info');
                } 
            }  
           
        }catch(error){
            console.log('Error accessing the contract', error);
        }
        loadingContainer.remove();
        formContainer.remove();
    });

    formContainer.appendChild(submitButton);
    document.body.appendChild(formContainer);

    const progressBarContainer = document.createElement('div');
    progressBarContainer.className = 'progressBar1Container';
    progressBarContainer.style.width = '100%';
    progressBarContainer.style.height = '20px';
    progressBarContainer.style.backgroundColor = '#ccc';
    progressBarContainer.style.borderRadius = '8px';
    progressBarContainer.style.marginBottom = '10px';
    formContainer.appendChild(progressBarContainer);

    const progressBar = document.createElement('div');
    progressBar.style.width = '0%';
    progressBar.style.height = '100%';
    progressBar.style.backgroundColor = '#4caf50';
    progressBar.style.borderRadius = '8px';
    progressBar.style.transition = 'width 0.5s';
    progressBarContainer.appendChild(progressBar);

    const progressText = document.createElement('span');
    progressText.className = 'progressBar1Text';
    progressText.style.color = '#fff';
    progressText.style.marginTop = '10px';
    formContainer.appendChild(progressText);

    function handleFiles(files) {
        filesArray = [];
        progressBar.style.width = '0%';
        progressText.textContent = '0 items processed';
        
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
                console.log('we found an image in file');
                const promise = readFile(file)
                    .then(result => {
                        filesArray.push({
                            name: file.name,
                            type: file.type,
                            size: file.size,
                            image: result  
                        });

                        const progressPercentage = ((filesArray.length / files.length) * 100).toFixed(2);
                        progressBar.style.width = progressPercentage + '%';
                        progressText.textContent = `${filesArray.length} items processed`;
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
                progressBar.style.width = '100%';
                progressText.textContent = `${filesArray.length} items processed`;
            })
            .catch(error => {
                console.error('Error processing files:', error);
            });
    }
}

async function checkDocumentsSuccess(array) {
    // code 10900: bad server response
    // code 222102999221121: success document added
    // code: 21202021122344: error with .save() threw catch error possibly internet 
    // code: 83939111110001: passcode incorrect
    //
    let success = false;
    for(const indicator of array){
        if(indicator.code == 10900){
            success = false;
        }else if(indicator.code == 222102999221121){
            success = true;
        }else if (indicator.code == 21202021122344){
            success = false;
        }else if(indicator.code == 83939111110001){
            success = false;
        }else{
            success = false;
        }
    }
    return success;
}

async function addTokensToDataBase(array, passcode, contract, address) {
    let serverMessageArray = [];
    for (let ii = 1; ii <= array.length; ii++) {
        // can loop through image length and send chunks with json objects {startOfNewString: true} and {startOfNewString: false} if not new image chunks
        // or try to compress using Zip like in node should be similiar funtion Zip()

        const folderData = {
            passcode: passcode,
            contractName: contract,
            contractAddress: address, 
            tokenID: ii,
            tokenURI: array[ii-1].image 
        };
        // Convert the object to a JSON string
        const compressedFolder = pako.gzip(JSON.stringify(folderData));

        // before the fetch we need to call the mint function on burson skullz contract!
        try {
            const response = await fetch('/add-token-to-collection', {
                // need to check IP on server side to add additional security
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(folderData)// change to compress and print on server to see if we have access to data
            });

            if (response.ok) {
                const serverMessage = await response.json();
                console.log(`Received response from server for chunk ${ii}`, serverMessage);
                serverMessageArray.push(serverMessage);

                if(serverMessage.code == 83939111110001){
                    alert('passcode incorrect');
                   break;
                }else if(serverMessage.code == 29292929100999){
                    alert('The server has trouble accessing the collection model');
                    break;
                }else if(serverMessage.code == 21202021122344){
                    console.log(`Error adding token ${ii} to the database mongoose failed`);
                }else{
                    console.log('trying to change progressBar length token added successfully');
                    const submitedProgressPercentage = ((ii / (array.length)))*100;
                    const submitedProgressBar = document.querySelector(".submitedProgressBar");
                    const submitedProgressText = document.querySelector(".submitedProgressText");

                    if(submitedProgressBar && submitedProgressText){
                        submitedProgressBar.style.width = submitedProgressPercentage.toFixed(2) + '%';                    
                        submitedProgressText.textContent = `${ii} items saved to database`;
                    }else{
                        console.log('cannot find bar');
                    }
                }
            } else {
                console.error(`Failed to add chunk ${ii}: The server failed to respond`, response.statusText);
                serverMessageArray.push({success: false, code: 10900, tokenID: ii});
            }
        } catch (error) {
            console.error(`Error sending chunk ${ii} to server`, error);
        }
    }
    return serverMessageArray;
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

    makeElementDraggable(formContainer);

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
function bigNumberToHex(bigNumber) {
    let hexString = bigNumber.toString(16); // Get hex representation of the number
    if (hexString.length % 2 !== 0) {
        hexString = '0' + hexString; // Ensure even length hex string
    }
    return '0x' + hexString;
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
        console.log('current network ID:', networkId);
        const ethNetworkId =  1; // Ethereum Mainnet ID
        if (networkId === ethNetworkId || '1n') {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}
function addNFTBuyButton(parentDiv, availabe, buttonClassName){
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

    for(const NFT of currentNFTArray){
        if(NFT.id == parentDiv.id){
            currentname = NFT.name + " " + NFT.id;
        }
    }

    if(buttonText.textContent == "Purchase"){
        buyButton.addEventListener("click", async function() {
            if(isConnected){
                console.log('trying to call solidity function on blockchain');
                // may need to send request to server and check if there is a client trying to get the same token 
                // because two people can click the purchase button near same time and call soidity function at same time
                // solidity function changes instock value so it needs to change the value before the next call to function 
                // 
            }else{
                alert('you must connect you wallet to make a purchase');
            }
        });
    }
    parentDiv.appendChild(buyButton);
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

                makeElementDraggable(formContainer);

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
                                                console.log('checking if metamask is installed');   
                                            if (typeof window.ethereum != 'undefined' && isConnected){
                                                console.log('creating loading icon');
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
                                                console.log('trying to call try statement line 6997');
                                                try{
                                                    const amountToSendString = parentDiv.className.replace("grid-item", ""); 
                                                    const amountToSendFloat = parseFloat(amountToSendString);
                                                    if(true){
                                                        const networkStatus = await checkNetwork('ethereum'); 
                                                        if(networkStatus){
                                                            transactionInProgress = true;
                                                            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                                                            const userWallet = accounts[0];
                                                            const recipientWallet = RoysWallet; 
                                                            const weiParameter = amountToSendFloat;
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
                                                            const amountInWei = web3.utils.toWei(finalWeiParameter.toString(), 'ether');
                                                            const amountInHex = web3.utils.toHex(amountInWei);
                                                            const transactionObject = {
                                                                from: userWallet, 
                                                                to: recipientWallet,
                                                                value: amountInHex
                                                            };
                                                            console.log('trying to send string:', amountToSendString);
                                                            console.log('final Wei paramater', finalWeiParameter);
                                                            console.log('amount to send float', amountToSendFloat);
                                                            console.log('in WEI', amountInWei);
                                                            console.log('in hex', amountInHex);

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
                                    console.log(error);
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

function mintCollectionSuccessPopUpForm(collectionName, collectionImage) {
    const container = document.createElement('div');
    container.className = 'popup-container';
    container.style.width = '350px';
    container.style.height = '250px';
    container.style.backgroundColor = 'dimgray';
    container.style.border = '1px solid #ccc';
    container.style.borderRadius = '10px';
    container.style.padding = '20px';
    container.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
    container.style.position = 'fixed'; 
    container.style.top = '50%';
    container.style.left = '50%';
    container.style.transform = 'translate(-50%, -50%)';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';
    container.style.zIndex = '1000000000000';

    makeElementDraggable(container);

    // Collection Image
    const imgContainer = document.createElement('div');
    imgContainer.style.width = '150px';
    imgContainer.style.height = '150px';
    imgContainer.style.borderRadius = '2px';
    imgContainer.style.marginBottom = '15px';
    imgContainer.style.left = '100px';
    imgContainer.style.backgroundImage = `url(${collectionImage})`;
    imgContainer.style.backgroundSize = 'cover';
    imgContainer.style.backgroundRepeat = 'no-repeat';
    imgContainer.style.backgroundPosition = 'center'; 
    container.appendChild(imgContainer);

    // Congratulatory Message
    const message = document.createElement('span');
    message.textContent = `Congratulations! Your collection "${collectionName}" has been successfully minted!`;
    message.style.fontSize = '16px';
    message.style.fontWeight = 'bold';
    message.style.textAlign = 'center';
    message.style.marginBottom = '20px';
    container.appendChild(message);

    // Close Button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.padding = '10px 20px';
    closeButton.style.border = 'none';
    closeButton.style.backgroundColor = '#007bff';
    closeButton.style.color = '#ffffff';
    closeButton.style.borderRadius = '5px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.transition = 'background-color 0.3s';
    
    closeButton.addEventListener('mouseenter', () => {
        closeButton.style.backgroundColor = '#0056b3';
    });
    
    closeButton.addEventListener('mouseleave', () => {
        closeButton.style.backgroundColor = '#007bff';
    });
    
    closeButton.addEventListener('click', () => {
        document.body.removeChild(container);
    });
    
    container.appendChild(closeButton);

    // Append to body
    document.body.appendChild(container);
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


