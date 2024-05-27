import {gridNavigator} from './script.js';
//import { ethers } from './ethers';
 import { ethers } from 'https://cdn.jsdelivr.net/npm/ethers@5.0.8/dist/ethers.esm.min.js'; 
const myWebDomain = 'http://localhost:27015/'; 
var msgCount = 0; 
//const WEIFACTOR = 0.001;
const WEIFACTOR = 0.001;
const RoysWallet = '0x5cdad7876270364242ade65e8e84655b53398b76';
// ABI (Application Binary Interface) of your contract
const abi = [/* Your contract ABI here */];
const socket = io();
const iconHeaderWidth = '11.4vh';

let paintingChunks = [];
let totalChunks = 0;

var submitButtonIsClicked = false;
var currentlyPrinted = false;
var gridPageNumber = 1;
var changeUserNamePopUpExist = false;
var currentlyTryingToBuy = false;
var isSocketPresent = false;
//const sideElementsWidth = '15%';

let EmailformData  = {
    email: "",
    address: "",
    firstName: "",
    lastName: ""
};

const contractAddress = "0x123abc...";



export async function painting_section_click(parentElement) {
    console.log("Painting section clicked!"); 

    if(currentPaintingArray.length != 0){
        console.log('already did fetch request should have access to data no need to push again');
        // need to add listeners again
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
                    // need to warn user to try again!
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
                ////////////////////////////////////DO NOT REMOVE FOR DEV/////////////////////////////////////////////////
                // add loading animation to the left side of screen
                // send request to server to get paintings and save as mypaintingsArray
                // may need to send 1 at  time to ensure the user doesnt get overloaded once it reaches say 10,000 items 
                // when user recieved all paintings remove animation and call lines 67-79
                ////////////////////////////////////DO NOT REMOVE FOR DEV/////////////////////////////////////////////////

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

                            /*
                            const searchBar = document.querySelector('.search-container');
                            if(searchBar){
                               searchBar.remove(); // comment if statement when function searchBar is properly setup
                            }*/
                            
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

                            // Loop through each dateNode element
                            dateNodes.forEach(dateNode => {
                                dateNode.style.fontSize = '1.3vh'; // Reset the font size
                                // Add more style resets as needed
                            });


                            const dpurchasesfirstNameDivs = document.querySelectorAll('.purchasesfirstNameDiv');

                            // Loop through each dateNode element
                            dpurchasesfirstNameDivs.forEach(dpurchasesfirstNameDiv => {
                                dpurchasesfirstNameDiv.style.fontSize = '1.3vh'; // Reset the font size
                                // Add more style resets as needed
                            });



                            const dppurchasesPriceDivs = document.querySelectorAll('.purchasesPriceDiv');

                            // Loop through each dateNode element
                            dppurchasesPriceDivs.forEach(dppurchasesPriceDiv => {
                                dppurchasesPriceDiv.style.fontSize = '1.3vh'; // Reset the font size
                                // Add more style resets as needed
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

                            // need to decrease the width of the image not the height
                            GridWidth = '52%';
                            gridItemWidth = '95%';
                            // change width to each grid time
                            sideElementsWidthPercent = '20%'; 
                            rowWidth = '33%';

                            if(currentPaintingArray.length >= 24){
                                makePaintingPage(currentPaintingArray.slice(0,24), currentPurchaseArray,  document.body, 3, sideElementsWidthPercent, GridWidth, gridItemWidth);
                            }else{
                                 makePaintingPage(currentPaintingArray, currentPurchaseArray,  document.body, 3, sideElementsWidthPercent, GridWidth, gridItemWidth);
                            }

                            var paintingGrid = document.querySelector('.NewGrid');
                            paintingGrid.style.left = '24.2%';
                            // grab the gid make it sat 10% smaller and make side elements larger

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

                            // Loop through each dateNode element
                            dateNodes.forEach(dateNode => {
                                dateNode.style.fontSize = '1.1vh'; // Reset the font size
                                // Add more style resets as needed
                            });


                            const dpurchasesfirstNameDivs = document.querySelectorAll('.purchasesfirstNameDiv');

                            // Loop through each dateNode element
                            dpurchasesfirstNameDivs.forEach(dpurchasesfirstNameDiv => {
                                dpurchasesfirstNameDiv.style.fontSize = '1.1vh'; // Reset the font size
                                // Add more style resets as needed
                            });



                            const dppurchasesPriceDivs = document.querySelectorAll('.purchasesPriceDiv');

                            // Loop through each dateNode element
                            dppurchasesPriceDivs.forEach(dppurchasesPriceDiv => {
                                dppurchasesPriceDiv.style.fontSize = '1.1vh'; // Reset the font size
                                // Add more style resets as needed
                            });

                            if(purchasesInfoContainer){
                                //purchasesInfoContainer.style.fontSize = '1.2vh';
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

                            // reset font size of footer 
                            var listItems = document.getElementsByTagName('li');
                            var listH3Items = document.getElementsByTagName('li');
                            //var descriptionTags = document.getElementsByClassName('descriptionPaintingPTAG');

                            for (var i = 0; i < listItems.length; i++) {
                               listItems[i].style.fontSize = '2.2vh'; // Change '16px' to your desired font size
                            }

                            for (var i = 0; i < listH3Items.length; i++) {
                                listItems[i].style.fontSize = '2.2vh'; // Change '16px' to your desired font size
                            }
                            /*
                            for (var i = 0; i < descriptionTags.length; i++) {
                                descriptionTags[i].style.fontSize = '1.2vh';
                            }*/

                        }else if(window.innerWidth <= 609 && window.innerWidth >= 500){

                            // need to fix this to be better other ones are good. Maybe make additional if with one element high. 
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

                            // Loop through each dateNode element
                            dateNodes.forEach(dateNode => {
                                dateNode.style.fontSize = '1vh'; // Reset the font size
                                // Add more style resets as needed
                            });


                            const dpurchasesfirstNameDivs = document.querySelectorAll('.purchasesfirstNameDiv');

                            // Loop through each dateNode element
                            dpurchasesfirstNameDivs.forEach(dpurchasesfirstNameDiv => {
                                dpurchasesfirstNameDiv.style.fontSize = '1vh'; // Reset the font size
                                // Add more style resets as needed
                            });



                            const dppurchasesPriceDivs = document.querySelectorAll('.purchasesPriceDiv');

                            // Loop through each dateNode element
                            dppurchasesPriceDivs.forEach(dppurchasesPriceDiv => {
                                dppurchasesPriceDiv.style.fontSize = '1vh'; // Reset the font size
                                // Add more style resets as needed
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
                            //var descriptionTags = document.getElementsByClassName('descriptionPaintingPTAG');

                            for (var i = 0; i < listItems.length; i++) {
                               listItems[i].style.fontSize = '2.2vh'; // Change '16px' to your desired font size
                            }

                            for (var i = 0; i < listH3Items.length; i++) {
                                listItems[i].style.fontSize = '2.2vh'; // Change '16px' to your desired font size
                            }

                            //need to reset icons size in header and move left a little
                            // make additional if size is less than 400 for example galazy Z fold 5
                            // should not be less then 200 maybe ever

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
                            // need to change font size inside grid elements overlay to half 
                            // increase the width of .connect-button, and .loggedIn-button
                            // sit closer to the right 
                            // decrease the font size 
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

                            // Loop through each dateNode element
                            dateNodes.forEach(dateNode => {
                                dateNode.style.fontSize = '.9vh'; // Reset the font size
                                // Add more style resets as needed
                            });


                            const dpurchasesfirstNameDivs = document.querySelectorAll('.purchasesfirstNameDiv');

                            // Loop through each dateNode element
                            dpurchasesfirstNameDivs.forEach(dpurchasesfirstNameDiv => {
                                dpurchasesfirstNameDiv.style.fontSize = '.9vh'; // Reset the font size
                                // Add more style resets as needed
                            });



                            const dppurchasesPriceDivs = document.querySelectorAll('.purchasesPriceDiv');

                            // Loop through each dateNode element
                            dppurchasesPriceDivs.forEach(dppurchasesPriceDiv => {
                                dppurchasesPriceDiv.style.fontSize = '.9vh'; // Reset the font size
                                // Add more style resets as needed
                            });

                            tree.remove();
                            recentSells.remove();
                            acceptibleCoins.remove();
                            searchBar.remove();

                            if(addToDBButton && deleteToDBButton){
                                addToDBButton.remove();
                                deleteToDBButton.remove();  
                            }

                            if(greenLight){
                                greenLight.remove();
                            }
                            
                            // reset home back size and alignment
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
                            //var descriptionTags = document.getElementsByClassName('descriptionPaintingPTAG');

                            for (var i = 0; i < listItems.length; i++) {
                               listItems[i].style.fontSize = '1.5vh'; // Change '16px' to your desired font size
                            }

                            for (var i = 0; i < listH3Items.length; i++) {
                                listH3Items[i].style.fontSize = '1.5vh'; // Change '16px' to your desired font size
                            }

                            // edit the input tag to fit parent element or adjust here
                        }else if(window.innerWidth <= 350) {
                            window.location.href = 'unsupported.html'; // Replace 'another_page.html' with the URL of the page you want to redirect to
                        }

                        //handleResize(); // get working before uplading code 
                        gridNavigator.style.display = 'none';

                        let msgHisotry = await getMessageHistory();

                        for(const element of msgHisotry){
                            addMessage(element.msg, element.username, element.time);
                        }

                    }, 101); 
                  })
                  .catch((error) => {
                    // Handle any errors that occurred during the asynchronous operation
                    console.error('Error:', error);
                  });
                //painting_section_click(paintingElement); // have this function return all the paintings in

                // const mypaintingsArray  = painting_section_click(paintingElement);
                paintingClicked = false;
            }else{
                console.log('we already clicked the painting section');
            }
        }); 
}

export function math_section_click(parentElement){
    /*
    if(!mathOverlay){

    }else{
        comingSoonScreen(parentElement);
    }
    */
    comingSoonScreen(parentElement);
}

export function nft_section_click(parentElement){
     // need access to function coming soon so we if we want in myfunction we need to pass in the function (parentElement, myfunctin)
     console.log("NFT section clicked!"); // Log a message to the console
     comingSoonScreen(parentElement);
     //shiftOffScreen(gridNavigator);
}

export function upcoming_section_click(parentElement){
     // need access to function coming soon so we if we want in myfunction we need to pass in the function (parentElement, myfunctin)
     console.log("NFT section clicked!"); // Log a message to the console
     comingSoonScreen(parentElement);
     //shiftOffScreen(gridNavigator);
}





export function makeConnection() {
    // Check if already connected
    // If connected, return or do whatever is needed

    // Check if popup already exists
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
        imageContainer.style.marginTop = '1%'; // adjust margin only on bottom
        imageContainer.style.marginBottom = '7%'; // adjust margin only on bottom
        imageContainer.style.borderRadius = '5px';
        //imageContainer.style.backgroundColor = 'blue';
        imageContainer.style.backgroundImage = 'url("images/bursonskull2.png")';
        //imageContainer.style.backgroundSize = 'cover'; 
        imageContainer.style.backgroundSize = 'contain'; 
        imageContainer.style.backgroundRepeat = 'no-repeat';
        imageContainer.style.backgroundPosition = 'center'; 
        //imageContainer.style.textAlign = 'center'; // Horizontally center the content
        imageContainer.style.left = '10%';
        popup.appendChild(imageContainer);

        const Logocontainer1 = document.createElement('div');
        const Logocontainer2 = document.createElement('div');

        // Create Provider divs
        const providers = ["Metamask", "Coinbase"]; // Example providers remove coinbase until we are ready
        providers.forEach(providerName => {
            const providerDiv = document.createElement("div");
            //providerDiv.textContent = providerName;
            providerDiv.style.position = 'relative';
            providerDiv.classList.add("provider");
            providerDiv.className = providerName;
            //providerDiv.style.border = "1px solid #ccc"; // Adding border
            providerDiv.style.width = '80%';
            providerDiv.style.height = '8%';
            providerDiv.style.marginTop = '2%';
            providerDiv.style.left = '10%';
            providerDiv.style.alignItems = "center"; // Center vertically
            providerDiv.style.justifyContent = "center"; // Center horizontally
            providerDiv.style.borderRadius = '.5vh';
            providerDiv.style.backgroundColor = 'white';
            providerDiv.style.overflow = 'hidden';
            providerDiv.style.boxShadow = '0px 0px 15px rgba(0, 0, 0, 0.5)'; /* Adding shadow */
            

            //providerDiv.style.margin = '2px'; only add
            if(providerName == "Coinbase"){
                //providerDiv.style.textDecoration = 'line-through';
                providerDiv.style.backgroundImage = 'url("/images/coinbase.png")';
                providerDiv.style.backgroundSize = 'contain'; // Optional: Adjust the size of the background image
                providerDiv.style.backgroundRepeat = 'no-repeat';
                providerDiv.style.backgroundPosition = 'center'; 
            }else{
                providerDiv.style.backgroundImage = 'url("/images/metamask.png")';
                providerDiv.style.cursor = 'pointer'; // Cursor style
                providerDiv.style.backgroundSize = 'contain'; // Optional: Adjust the size of the background image
                providerDiv.style.backgroundRepeat = 'no-repeat';
                providerDiv.style.backgroundPosition = 'center'; 
            }
            
            popup.appendChild(providerDiv);
        });

        // Create cancel button
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

        // Append popup to body
        document.body.appendChild(popup);

        // Add event listeners for dragging behavior
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
    // Set the position of the parent div to relative
    divElement.style.position = 'relative';

    // Create a new div element for the overlay
    const overlay = document.createElement('div');
    const overlayText = document.createElement('p');

    overlay.classList.add('coming-soon-overlay');
    overlayText.classList.add('coming-soon-text');

    // Set the background color of the overlay to black with 50% opacity
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.borderRadius = '10px';

    // Set overlay position to absolute
    overlay.style.position = 'absolute';
    overlay.style.width = '100%';
    overlay.style.height = '0'; // Initially set height to 0
    overlay.style.left = '0';
    overlay.style.bottom = '0'; // Start from the bottom of the parent div

    // Create and style the text element
    overlayText.style.color = 'white'; // Set text color to white
    overlayText.style.position = 'absolute'; // Set position to absolute
    overlayText.style.textAlign = 'center'; // Center align text
    overlayText.style.width = '100%'; // Ensure text takes full width of parent
    overlayText.style.margin = '0'; // Remove default margin
    overlayText.style.top = '50%'; // Center vertically
    overlayText.style.transform = 'translateY(-50%)'; // Adjust for vertical centering

    // Set text content
    overlayText.textContent = 'Coming Soon';
    overlayText.style.zIndex = 1000000;
    // Append elements
    overlay.appendChild(overlayText);
    divElement.appendChild(overlay);

    // Function to update the overlay height
    function updateOverlayHeight() {
        const elapsedTime = performance.now() - startTime; // Calculate elapsed time
        const percentageComplete = elapsedTime / animationDuration; // Calculate percentage complete
        const newHeight = Math.min(percentageComplete * 100, 100); // Ensure height doesn't exceed 100%
        overlay.style.height = newHeight + '%'; // Update overlay height

        if (percentageComplete < 1 && newHeight < 100) {
            requestAnimationFrame(updateOverlayHeight); // Continue animation until 100% completion or height reaches 100%
        }
    }

    // Calculate the total duration of the animation in milliseconds
    const animationDuration = 1000; // 1000 milliseconds (1 second)
    const startTime = performance.now(); // Get the current time in milliseconds

    // Start the animation
    requestAnimationFrame(updateOverlayHeight);

    // Schedule the removal of the overlay after 3 seconds
    setTimeout(function () {
        // Remove overlay
        divElement.removeChild(overlay);

        // Reset global variables
        NFTDivOverlay = false;
        mathOverlay = false;
        updatesOverlay = false;
    }, 3000); // 3000 milliseconds (3 seconds)
}


export function shiftOffScreen(element) {
    // Define the shift amount
    var shiftAmount = 2; // Move the element to the left by 2 pixels

    // Define a function to shift the element
    function shift() {
        // Get the current left position or default to 0
        var currentPosition = parseFloat(element.style.left) || 0; 
        // Move the element to the left by shiftAmount pixels
        element.style.left = (currentPosition - shiftAmount) + '1px';

        // Check if the element is off-screen
        if (element.getBoundingClientRect().right <= 0) {
            clearInterval(interval); // Stop shifting when the element is off-screen
        }
    }

    // Start shifting the element every 1 millisecond
    var interval = setInterval(shift, 38); // Adjust interval time as needed
}

export function makePaintGrid(array, parentElement, columns, gridWidthPercent) {
    //  variables declaration
    var numRows = Math.ceil(array.length / columns);
    var oldGrid = document.querySelector('.Grid_container');
    var gridContainer = document.createElement('div');

    if (oldGrid) {
        oldGrid.parentNode.removeChild(oldGrid); 
    }
    
    // container attributes
    gridContainer.style.position = 'relative';
    gridContainer.style.height = '100%'; 
    gridContainer.className = 'NewGrid';
    gridContainer.style.width = gridWidthPercent;
    //gridContainer.style.margin = '0 auto'; // Center horizontally
    //gridContainer.style.left = '18%'; // Center horizontally
    gridContainer.style.top = '2%'; 
    gridContainer.style.padding = '4px';
    gridContainer.style.zIndex = '10'; // Higher z-index to make it appear on top
    gridContainer.style.backgroundColor = 'none'; // Set background color for grid container
    gridContainer.style.overflow = 'auto'; // Make the container scrollable
    gridContainer.style.display = 'grid';
    gridContainer.style.zIndex = '0';


    // four side elements should depend on grid size (doc.width- gridWidth -2% or something )
    // all four need to be the save width
    // change the grid with smaller when users 

    gridContainer.style.scrollbarWidth = 'none'; // Hide scrollbar for Firefox and edge
    //gridContainer.style.msOverflowStyle = 'none'; // Hide scrollbar for Internet Explorer 
    //gridContainer.style.overflow = '-moz-scrollbars-none'; // Hide scrollbar for Firefox (alternative)

    const rowHeight = '33%'; // Example height for each row
    // Set grid layout properties (number of columns and rows)
    gridContainer.style.gridTemplateColumns = `repeat(${columns}, 1fr)`; // Each column occupies equal space
    gridContainer.style.gridTemplateRows = `repeat(${numRows},  ${rowHeight})`; // Each row occupies equal space
    gridContainer.style.gap = '0px'; // vertical Gap between grid items
        // Loop through the array to populate the grid
    array.forEach(item => {
        // if viewport is computer fix heigh 
        // otherwise set to relative
        var gridItem = document.createElement('div');

        // if converting price to a decimal we need to fi 
        console.log(item.price.$numberDecimal);
        gridItem.classList.add('grid-item'+ item.price.$numberDecimal.toString());// set class 
        gridItem.setAttribute('id', item._id);// set ID
        gridItem.textContent = item; // Set the content of the grid item
        gridItem.style.position = 'relative'; // Position relative for absolute positioning of overlay

        // Apply styles for grid item
        gridItem.style.backgroundColor = '#aaaaaa'; // Set background color for grid item
        gridItem.style.width = '95%'; 
        gridItem.style.left = '2.5%'; 
        gridItem.style.height = '94%'; // Set height of grid item to fill the container
        gridItem.style.top = '3%';
        gridItem.style.display = 'flex';
        gridItem.style.justifyContent = 'center';
        gridItem.style.alignItems = 'center';
        gridItem.style.setProperty('border-radius', '10px', 'important'); // Round corners
        //gridItem.style.boxShadow = '0px 0.8px 5px rgba(0, 0, 0.5, 0.5)'; /* Adding shadow */
        gridItem.style.boxShadow =  '0px 2px 4px rgba(0, 0, 0, 0.7)'; /* Adjust values for your shadow */
        removeString(gridItem, "[object Object]");
        //removeString(gridItem, " ");
        // need to resize image before uplaoding
        //gridItem.style.backgroundImage = 'url("/images/napolean.jpg")';// convert to 600x500 pixels
        gridItem.style.backgroundImage = `url("${item.image}")`;// convert to 600x500 pixels
        gridItem.style.backgroundSize = 'cover'; // Optional: Adjust the size of the background image
        gridItem.style.backgroundRepeat = 'no-repeat';
        gridItem.style.backgroundPosition = 'center'; 
        gridItem.style.backgroundSize = '90% 100%'; // Decreases the width of the background image to 80% of its original size
        // Set height of the grid item
        //gridItem.style.height = '25vh';

        //parentElement.style.backgroundColor = 'dimgray';
        //parentElement.style.backgroundImage = 'url(/images/metalback2.png)';
        //parentElement.style.backgroundSize = 'cover'; 

        // Create a transparent overlay 
        var overlay = document.createElement('div');
        overlay.classList.add('overlay');
        // Style the overlay
        overlay.style.position = 'absolute';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.top = 0;
        overlay.style.left = 0;
        overlay.style.setProperty('border-radius', '10px', 'important'); // Round corners
        overlay.style.backgroundColor = 'dimgray'; // Semi-transparent blue background
        overlay.style.display = 'none'; // Initially hide the overlay
        overlay.style.flexDirection = 'column'; // Stack buttons vertically
        overlay.style.justifyContent = 'flex-end'; // Align buttons to the bottom
        overlay.style.opacity = '.6';

        // add back button to header and reload main website url when clicked

        gridItem.addEventListener('mouseenter', async function() {

            // send request to server to add 1 do views and send back success or failure in jason 

            gridItem.style.transform = 'translateY(-5px)';
            // Show the overlay on hover
            overlay.style.display = 'flex';

            // get inStock from currentPaintingArray
            var checkIfInStock = null;
            for(const myObj of currentPaintingArray){
                if(myObj._id == gridItem.id){
                    checkIfInStock = myObj.inStock;
                }else{
                    //checkIfInStock = false;   
                }
            }

            addBuyButton(gridItem, checkIfInStock, gridItem.id);
            // Create a p element for description

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
                    descriptionP.innerHTML =  'Name:' + "    " + painting.name + '<br>'  + 'Approximate Price:' + "    " + painting.price.$numberDecimal + " ETH " +   '<br> <br>' +  painting.description;
                }
            }
            overlay.appendChild(descriptionP);


            const containsPaintingId = currentViewedPaintings.some(item => item.paintingId === gridItem.id);

            // If the paintingId is not already in the array, push it
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
                           // added a value but dont warn the user
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
                // user has already clicked it while on the website
            }


        });
        gridItem.addEventListener('mouseleave', function() {
            // Restore the original position on mouse leave
            gridItem.style.transform = 'translateY(0)';
            // Hide the overlay on mouse leave
            overlay.style.display = 'none'; 
            const buyButton = document.querySelector('.buy-button' + gridItem.id.toString());
            const descriptionP = document.querySelector('.descriptionPaintingPTAG');
            if (buyButton) {
                buyButton.remove();
                descriptionP.remove();
            } else {
                console.error('Buy button not found');
            }
            //buyButton.style.display = 'hidden';
            //document.remove(buyButton);
            //gridItem.removeChild(buyButton);
        });

        // Append the overlay to the grid item
        gridItem.appendChild(overlay);

        // Append the grid item to the grid container
        gridContainer.appendChild(gridItem);
    });
    
    parentElement.appendChild(gridContainer);

}

function addCryptoTokens(div){

    const ethpopup = document.createElement('div');
    const ethlogo = document.createElement('div');
    const ethptagContainer = document.createElement('div'); // Rename ethptag to ethptagContainer
    const ptag = document.createElement('p');

    ptag.textContent = 'Loading...'; 
    ptag.style.margin = '0'; 
    ptag.style.top = '25%'; // Align content to the top
    ptag.style.position = 'relative';
    ptag.style.height = '50%';
    ptag.style.width = '70%';
    ptag.style.left = '2.5%';
    ptag.style.fontFamily = 'Roboto, sans-serif'; // Change 'Roboto' to the desired font name
    // Set styles for the parent container (ethpopup)
    ethpopup.style.position = 'relative';
    ethpopup.style.width = '100%';
    ethpopup.style.height = '15%';
    ethpopup.style.backgroundColor = 'dimgray';
    ethpopup.style.borderBottom = '0.4vh solid lightgray'; 
    ethpopup.style.borderTopLeftRadius = '2vh'; // Adjust border radius at the top left corner
    ethpopup.style.borderTopRightRadius = '2vh'; // Adjust border radius at the top right corner

    // Set styles for the Ethereum logo container (ethlogo)
    ethlogo.style.display = 'inline-block';
    ethlogo.style.height = '100%'; 
    ethlogo.style.width = '20%';
    ethlogo.style.backgroundImage = 'url("/images/EthLogo.png")';
    ethlogo.style.backgroundSize = 'contain';
    ethlogo.style.backgroundRepeat = 'no-repeat';
    ethlogo.style.backgroundPosition = 'center'; 

    // Set styles for the Ethereum price container (ethptagContainer)
    ethptagContainer.style.display = 'inline-block';
    ethptagContainer.style.height = '100%'; 
    ethptagContainer.style.width = '80%';
    ethptagContainer.style.backgroundColor = 'none';
    ethptagContainer.style.fontSize = '2.4vh';
    ethptagContainer.style.textAlign = 'center'; // Center the content horizontally
    ethptagContainer.style.verticalAlign = 'top'; // Align content to the top
    ethptagContainer.classList.add('ethereumPriceContainer');

    // Append the ptag element to the ethptagContainer
    ethptagContainer.appendChild(ptag);
    ethpopup.appendChild(ethlogo);
    ethpopup.appendChild(ethptagContainer);
    div.appendChild(ethpopup);

    getEthereumPrice(ptag); 

    const polygonPopUp = document.createElement('div');
    const polygonLogo = document.createElement('div');
    const polygonptagContainer = document.createElement('div'); // Rename ethptag to polygonptagContainer
    const polyptag = document.createElement('p');

    polyptag.textContent = 'Loading...'; 
    polyptag.style.margin = '0'; 
    polyptag.style.top = '25%'; // Align content to the top
    polyptag.style.position = 'relative';
    polyptag.style.height = '50%';
    polyptag.style.width = '70%';
    polyptag.style.left = '2.5%';
    polyptag.style.fontFamily = 'Roboto, sans-serif'; // Change 'Roboto' to the desired font name

    // Set styles for the parent container (polygonPopUp)
    polygonPopUp.style.position = 'relative';
    polygonPopUp.style.width = '100%';
    polygonPopUp.style.height = '15%';
    polygonPopUp.style.backgroundColor = 'dimgray';
    polygonPopUp.style.borderBottom = '0.4vh solid lightgray'; 
    // Set styles for the Polygon logo container (polygonLogo)
    polygonLogo.style.display = 'inline-block';
    polygonLogo.style.height = '100%'; 
    polygonLogo.style.width = '20%';
    polygonLogo.style.backgroundImage = 'url("/images/PolyLogo.png")';
    polygonLogo.style.backgroundSize = 'contain';
    polygonLogo.style.backgroundRepeat = 'no-repeat';
    polygonLogo.style.backgroundPosition = 'center'; 

    // Set styles for the Polygon price container (polygonptagContainer)
    polygonptagContainer.style.display = 'inline-block';
    polygonptagContainer.style.height = '100%'; 
    polygonptagContainer.style.width = '80%';
    polygonptagContainer.style.backgroundColor = 'none';
    polygonptagContainer.style.fontSize = '2.4vh';
    polygonptagContainer.style.textAlign = 'center'; // Center the content horizontally
    polygonptagContainer.style.verticalAlign = 'top'; // Align content to the top
    polygonptagContainer.classList.add('polygonPriceContainer');

    // Append the ptag element to the polygonptagContainer
    polygonptagContainer.appendChild(polyptag);
    polygonPopUp.appendChild(polygonLogo);
    polygonPopUp.appendChild(polygonptagContainer);
    div.appendChild(polygonPopUp);

    getPolygonPrice(polyptag);

    
    const bitCoinpopup = document.createElement('div');
    const bitCoinlogo = document.createElement('div');
    const bitCoinptagContainer = document.createElement('div'); // Rename ethptag to ethptagContainer
    const bitCoinptag = document.createElement('p');

    bitCoinptag.textContent = 'Loading...'; 
    bitCoinptag.style.margin = '0'; 
    bitCoinptag.style.top = '25%'; // Align content to the top
    bitCoinptag.style.position = 'relative';
    bitCoinptag.style.height = '50%';
    bitCoinptag.style.width = '70%';
    bitCoinptag.style.left = '2.5%';
    bitCoinptag.style.fontFamily = 'Roboto, sans-serif'; // Change 'Roboto' to the desired font name
    // Set styles for the parent container (ethpopup)
    bitCoinpopup.style.position = 'relative';
    bitCoinpopup.style.width = '100%';
    bitCoinpopup.style.height = '15%';
    bitCoinpopup.style.backgroundColor = 'dimgray';
    bitCoinpopup.style.borderBottom = '0.4vh solid lightgray'; 

    // Set styles for the Ethereum logo container (ethlogo)
    bitCoinlogo.style.display = 'inline-block';
    bitCoinlogo.style.height = '100%'; 
    bitCoinlogo.style.width = '20%';
    bitCoinlogo.style.backgroundImage = 'url("/images/bitcoinLogo.png")';
    bitCoinlogo.style.backgroundSize = 'contain';
    bitCoinlogo.style.backgroundRepeat = 'no-repeat';
    bitCoinlogo.style.backgroundPosition = 'center'; 

    // Set styles for the Ethereum price container (ethptagContainer)
    bitCoinptagContainer.style.display = 'inline-block';
    bitCoinptagContainer.style.height = '100%'; 
    bitCoinptagContainer.style.width = '80%';
    bitCoinptagContainer.style.backgroundColor = 'none';
    bitCoinptagContainer.style.fontSize = '2.4vh';
    bitCoinptagContainer.style.textAlign = 'center'; // Center the content horizontally
    bitCoinptagContainer.style.verticalAlign = 'top'; // Align content to the top
    bitCoinptagContainer.classList.add('BitCoinPriceContainer');

    // Append the ptag element to the ethptagContainer
    bitCoinptagContainer.appendChild(bitCoinptag);
    bitCoinpopup.appendChild(bitCoinlogo);
    bitCoinpopup.appendChild(bitCoinptagContainer);
    div.appendChild(bitCoinpopup);

    getBitcoinPrice(bitCoinptag); 


    const shibaInuCoinpopup = document.createElement('div');
    const shibaInuCoinlogo = document.createElement('div');
    const shibaInuCoinptagContainer = document.createElement('div'); // Rename ethptag to ethptagContainer
    const shibaInuCoinptag = document.createElement('p');

    shibaInuCoinptag.textContent = 'Loading...'; 
    shibaInuCoinptag.style.margin = '0'; 
    shibaInuCoinptag.style.top = '25%'; // Align content to the top
    shibaInuCoinptag.style.position = 'relative';
    shibaInuCoinptag.style.height = '50%';
    shibaInuCoinptag.style.width = '70%';
    shibaInuCoinptag.style.left = '2.5%';
    shibaInuCoinptag.style.fontFamily = 'Roboto, sans-serif'; // Change 'Roboto' to the desired font name
    // Set styles for the parent container (ethpopup)
    shibaInuCoinpopup.style.position = 'relative';
    shibaInuCoinpopup.style.width = '100%';
    shibaInuCoinpopup.style.height = '15%';
    shibaInuCoinpopup.style.backgroundColor = 'dimgray';
    shibaInuCoinpopup.style.borderBottom = '0.4vh solid lightgray'; 

    // Set styles for the Ethereum logo container (ethlogo)
    shibaInuCoinlogo.style.display = 'inline-block';
    shibaInuCoinlogo.style.height = '100%'; 
    shibaInuCoinlogo.style.width = '20%';
    shibaInuCoinlogo.style.backgroundImage = 'url("/images/ShibLogo.png")';
    shibaInuCoinlogo.style.backgroundSize = 'contain';
    shibaInuCoinlogo.style.backgroundRepeat = 'no-repeat';
    shibaInuCoinlogo.style.backgroundPosition = 'center'; 

    // Set styles for the Ethereum price container (ethptagContainer)
    shibaInuCoinptagContainer.style.display = 'inline-block';
    shibaInuCoinptagContainer.style.height = '100%'; 
    shibaInuCoinptagContainer.style.width = '80%';
    shibaInuCoinptagContainer.style.backgroundColor = 'none';
    shibaInuCoinptagContainer.style.fontSize = '2.4vh';
    shibaInuCoinptagContainer.style.textAlign = 'center'; // Center the content horizontally
    shibaInuCoinptagContainer.style.verticalAlign = 'top'; // Align content to the top
    shibaInuCoinptagContainer.classList.add('ShibaInuPriceContainer');

    // Append the ptag element to the ethptagContainer
    shibaInuCoinptagContainer.appendChild(shibaInuCoinptag);
    shibaInuCoinpopup.appendChild(shibaInuCoinlogo);
    shibaInuCoinpopup.appendChild(shibaInuCoinptagContainer);
    div.appendChild(shibaInuCoinpopup);

    getShibaInuPrice(shibaInuCoinptag); 

    const vechainCoinpopup = document.createElement('div');
    const vechainCoinlogo = document.createElement('div');
    const vechainCoinptagContainer = document.createElement('div'); // Rename ethptag to ethptagContainer
    const vechainCoinptag = document.createElement('p');

    vechainCoinptag.textContent = 'Loading...'; 
    vechainCoinptag.style.margin = '0'; 
    vechainCoinptag.style.top = '25%'; // Align content to the top
    vechainCoinptag.style.position = 'relative';
    vechainCoinptag.style.height = '50%';
    vechainCoinptag.style.width = '70%';
    vechainCoinptag.style.left = '2.5%';
    vechainCoinptag.style.fontFamily = 'Roboto, sans-serif'; // Change 'Roboto' to the desired font name
    // Set styles for the parent container (ethpopup)
    vechainCoinpopup.style.position = 'relative';
    vechainCoinpopup.style.width = '100%';
    vechainCoinpopup.style.height = '15%';
    vechainCoinpopup.style.backgroundColor = 'dimgray';
    vechainCoinpopup.style.borderBottom = '0.4vh solid lightgray'; 

    // Set styles for the Ethereum logo container (ethlogo)
    vechainCoinlogo.style.display = 'inline-block';
    vechainCoinlogo.style.height = '100%'; 
    vechainCoinlogo.style.width = '20%';
    vechainCoinlogo.style.backgroundImage = 'url("/images/vechainLogo.png")';
    vechainCoinlogo.style.backgroundSize = 'contain';
    vechainCoinlogo.style.backgroundRepeat = 'no-repeat';
    vechainCoinlogo.style.backgroundPosition = 'center'; 

    // Set styles for the Ethereum price container (ethptagContainer)
    vechainCoinptagContainer.style.display = 'inline-block';
    vechainCoinptagContainer.style.height = '100%'; 
    vechainCoinptagContainer.style.width = '80%';
    vechainCoinptagContainer.style.backgroundColor = 'none';
    vechainCoinptagContainer.style.fontSize = '2.4vh';
    vechainCoinptagContainer.style.textAlign = 'center'; // Center the content horizontally
    vechainCoinptagContainer.style.verticalAlign = 'top'; // Align content to the top
    vechainCoinptagContainer.classList.add('veChainPriceContainer');

    // Append the ptag element to the ethptagContainer
    vechainCoinptagContainer.appendChild(vechainCoinptag);
    vechainCoinpopup.appendChild(vechainCoinlogo);
    vechainCoinpopup.appendChild(vechainCoinptagContainer);
    div.appendChild(vechainCoinpopup);

    getVeChainPrice(vechainCoinptag); 

    const etcClassicCoinpopup = document.createElement('div');
    const etcClassicCoinlogo = document.createElement('div');
    const etcClassicCoinptagContainer = document.createElement('div'); // Rename ethptag to ethptagContainer
    const etcClassicCoinptag = document.createElement('p');

    etcClassicCoinptag.textContent = 'Loading...'; 
    etcClassicCoinptag.style.margin = '0'; 
    etcClassicCoinptag.style.top = '25%'; // Align content to the top
    etcClassicCoinptag.style.position = 'relative';
    etcClassicCoinptag.style.height = '50%';
    etcClassicCoinptag.style.width = '70%';
    etcClassicCoinptag.style.left = '2.5%';
    etcClassicCoinptag.style.fontFamily = 'Roboto, sans-serif'; // Change 'Roboto' to the desired font name
    // Set styles for the parent container (ethpopup)
    etcClassicCoinpopup.style.position = 'relative';
    etcClassicCoinpopup.style.width = '100%';
    etcClassicCoinpopup.style.height = '15%';
    etcClassicCoinpopup.style.backgroundColor = 'dimgray';
    etcClassicCoinpopup.style.borderBottom = '0.4vh solid lightgray'; 

    // Set styles for the Ethereum logo container (ethlogo)
    etcClassicCoinlogo.style.display = 'inline-block';
    etcClassicCoinlogo.style.height = '100%'; 
    etcClassicCoinlogo.style.width = '20%';
    etcClassicCoinlogo.style.backgroundImage = 'url("/images/etcClassicLogo.png")';
    etcClassicCoinlogo.style.backgroundSize = 'contain';
    etcClassicCoinlogo.style.backgroundRepeat = 'no-repeat';
    etcClassicCoinlogo.style.backgroundPosition = 'center'; 

    // Set styles for the Ethereum price container (ethptagContainer)
    etcClassicCoinptagContainer.style.display = 'inline-block';
    etcClassicCoinptagContainer.style.height = '100%'; 
    etcClassicCoinptagContainer.style.width = '80%';
    etcClassicCoinptagContainer.style.backgroundColor = 'none';
    etcClassicCoinptagContainer.style.fontSize = '2.4vh';
    etcClassicCoinptagContainer.style.textAlign = 'center'; // Center the content horizontally
    etcClassicCoinptagContainer.style.verticalAlign = 'top'; // Align content to the top
    etcClassicCoinptagContainer.classList.add('ETCPriceContainer');

    // Append the ptag element to the ethptagContainer
    etcClassicCoinptagContainer.appendChild(etcClassicCoinptag);
    etcClassicCoinpopup.appendChild(etcClassicCoinlogo);
    etcClassicCoinpopup.appendChild(etcClassicCoinptagContainer);
    div.appendChild(etcClassicCoinpopup);

    getEthereumClassicPrice(etcClassicCoinptag); 

    const dogeCoinpopup = document.createElement('div');
    const dogeCoinlogo = document.createElement('div');
    const dogeCoinptagContainer = document.createElement('div'); // Rename ethptag to ethptagContainer
    const dogeCoinptag = document.createElement('p');

    dogeCoinptag.textContent = 'Loading...'; 
    dogeCoinptag.style.margin = '0'; 
    dogeCoinptag.style.top = '25%'; // Align content to the top
    dogeCoinptag.style.position = 'relative';
    dogeCoinptag.style.height = '50%';
    dogeCoinptag.style.width = '70%';
    dogeCoinptag.style.left = '2.5%';
    dogeCoinptag.style.fontFamily = 'Roboto, sans-serif'; // Change 'Roboto' to the desired font name
    // Set styles for the parent container (ethpopup)
    dogeCoinpopup.style.position = 'relative';
    dogeCoinpopup.style.width = '100%';
    dogeCoinpopup.style.height = '15%';
    dogeCoinpopup.style.backgroundColor = 'dimgray';
    dogeCoinpopup.style.borderBottom = '0.4vh solid lightgray'; 

    // Set styles for the Ethereum logo container (ethlogo)
    dogeCoinlogo.style.display = 'inline-block';
    dogeCoinlogo.style.height = '100%'; 
    dogeCoinlogo.style.width = '20%';
    dogeCoinlogo.style.backgroundImage = 'url("/images/dogelogo.png")';
    dogeCoinlogo.style.backgroundSize = 'contain';
    dogeCoinlogo.style.backgroundRepeat = 'no-repeat';
    dogeCoinlogo.style.backgroundPosition = 'center'; 

    // Set styles for the Ethereum price container (ethptagContainer)
    dogeCoinptagContainer.style.display = 'inline-block';
    dogeCoinptagContainer.style.height = '100%'; 
    dogeCoinptagContainer.style.width = '80%';
    dogeCoinptagContainer.style.backgroundColor = 'none';
    dogeCoinptagContainer.style.fontSize = '2.4vh';
    dogeCoinptagContainer.style.textAlign = 'center'; // Center the content horizontally
    dogeCoinptagContainer.style.verticalAlign = 'top'; // Align content to the top
    dogeCoinptagContainer.classList.add('dogePriceContainer');

    // Append the ptag element to the ethptagContainer
    dogeCoinptagContainer.appendChild(dogeCoinptag);
    dogeCoinpopup.appendChild(dogeCoinlogo);
    dogeCoinpopup.appendChild(dogeCoinptagContainer);
    div.appendChild(dogeCoinpopup);

    getDogecoinPrice(dogeCoinptag); 
};

// Call the function every second
function moveLeftAndRight(parentDiv, timeFrame, movementPercentages) {
    if (!parentDiv || !(parentDiv instanceof Element)) {
        console.error("Parent div is not provided or is not a valid DOM element.");
        return;
    }

    if (!Array.isArray(movementPercentages) || movementPercentages.length !== 5) {
        console.error("Movement percentages array is missing or invalid. It should be an array of length 5.");
        return;
    }

    // Initialize movement directions for each tag
    const moveRightFlags = [true, true, true, true, true];

    // Function to move the li tags
    function moveLiTags() {
        // Iterate through each li tag
        for (let i = 1; i <= 5; i++) {
            const div = parentDiv.querySelector(`.liTag${i}`);
            if (div) {
                // Get the current left position of the div
                let currentPosition = parseFloat(div.style.left) || 0;

                // Update the position of the div based on the movement percentage for this tag
                currentPosition += movementPercentages[i - 1] * (moveRightFlags[i - 1] ? 1 : -1);

                // Start moving left a bit sooner
                if (currentPosition > 30) {
                    currentPosition += (movementPercentages[i - 1] > 0 ? -0.2 : 0.2);
                }

                // Limit the maximum right position
                const maxRightPosition = 90; // Adjust as needed
                if (currentPosition > maxRightPosition) {
                    currentPosition = maxRightPosition;
                    // Change the movement direction to left
                    moveRightFlags[i - 1] = false;
                }

                // Limit the minimum left position
                const minLeftPosition = 0; // Adjust as needed
                if (currentPosition < minLeftPosition) {
                    currentPosition = minLeftPosition;
                    // Change the movement direction to right
                    moveRightFlags[i - 1] = true;
                }

                // Apply the new position to the div
                div.style.left = currentPosition + "%";
            }
        }
    }

    // Call the function to move the li tags every second
    setInterval(moveLiTags, timeFrame);
}

// Example 


function addTreeList(parentDiv, array, parentElement, numColumns, gridWidthPercent) {


    // needs acess to call makePaintGrid(array, parentElement, numColumns, gridWidthPercent) when elements are clicked 
    // call the function with appropriate gridth length depending on the doc window 
    // make 5 functions that take in an array and reorganizes it and returns an array 
    // call this function with the appriopriate orginzer function when elements are clicked

    // Check if parentDiv is provided and is a valid DOM element
    if (!parentDiv || !(parentDiv instanceof Element)) {
        console.error("Parent div is not provided or is not a valid DOM element.");
    }else{
        // Create the ul container element
        const ulContainer = document.createElement('div');
        ulContainer.style.position = 'relative';
        ulContainer.style.width = '100%';
        ulContainer.style.height = '100%';
        ulContainer.style.overflow = 'hidden';
        ulContainer.className = `treeListContainer`;

        // Create the ul element
        const ul = document.createElement('div');
        ul.style.padding = '0';
        ul.style.position = 'absolute';
        ul.style.top = '20%'; 
        ul.style.left = '0%'; 
        //ul.style.transform = 'translate(-50%, -50%)'; // Center the ul precisely
        ul.style.height = '60%'; 
        ul.style.width = '100%'; 
        ul.style.backgroundColor = 'none';
        ul.className = `treeList`;
        ul.style.borderBottom = '.4vh solid lightgray';
        ul.style.borderTop = '.4vh solid lightgray';
        ul.style.paddingTop = '10%';

        // Create and append div elements with class names and text content

        const numTags = 5; // Number of tags
        for (let i = 1; i <= numTags; i++) {
            const div = document.createElement('div');
            div.className = `liTag${i}`; 

            div.style.fontSize = '2vh'; 
            div.style.color = 'white';
            
            div.style.cursor = 'pointer'; // Change cursor to pointer on hover
            //div.style.borderRadius = '1.2vh'; // Fixed border radius
            div.style.display = 'flex'; // Use flexbox for vertical centering
            div.style.alignItems = 'center'; // Vertically center text
            div.style.justifyContent = 'center'; // Horizontally center text
            div.style.textShadow = '0px 2px 4px rgba(0, 0, 0, 0.3)'; // Add shadow effect
            //div.style.borderBottom = '.3vh solid lightgray';
            div.style.position = 'relative';
            div.style.backgroundColor = '#505050';
            div.style.borderRadius = '1vh';
            //div.style.background = 'linear-gradient(to bottom, lightgray, dimgray)';
            // Add hover effect
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
                div.style.width = '40%'; // Ensure div spans full width of ul
                //div.style.borderLeft = '.1vh solid lightgray';
                div.style.left = ((100 - parseFloat(div.style.width)) / 2).toString() + "%";
                //div.style.borderLeft = '.2vh solid lightgray';

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
                //div.style.borderRight = '.2vh solid lightgray';

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
                //div.style.borderLeft = '.2vh solid lightgray';

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
                //div.style.borderRight = '.2vh solid lightgray';

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
                //div.style.borderLeft = '.2vh solid lightgray';
                //div.style.borderBottom = 'none';

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

        // Append ul to parentDiv
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

    // Loop through the items array and create list items for each item
    var community =  ["X", "Instagram", "Threads"];
    var commnityList = document.createElement("ul");
    
    var links = ["Opensea", "Github", "researchGate", 'Linkedin', 'MathOverflow'];
    var linkList = document.createElement("ul");
    
    var resources = ["Help", "Privacy Policy", "Terms of Service", "Contracts"];
    var resourcesList = document.createElement("ul");

    links.forEach(function(itemText) {
        var li = document.createElement("li");
        const atag = document.createElement('a');
        //li.textContent = itemText;
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
              atag.href = 'https://mathoverflow.net/users/525490/roy-burson';
        }
       
        li.appendChild(atag);
        linkList.appendChild(li); // Append the list item to the unordered list
    });

    // Loop through the items array and create list items for each item
    community.forEach(function(itemText) {
        var li = document.createElement("li");
        const atag = document.createElement('a');

        //li.textContent = itemText;
        li.style.marginBottom = '1vh';
        li.style.fontSize = '3.2vh';
        atag.textContent = itemText;

        if(atag.textContent == 'X'){
            atag.href = 'https://twitter.com/bursonskullz/';
        }else if(atag.textContent == 'Instagram'){
            // might want to add check and see if URL is available if not dont add it 
            atag.href = 'https://www.instagram.com/bursonskullz/';
        }else if(atag.textContent == 'Threads'){
            atag.href = 'https://www.threads.net/@bursonskullz2024';
        }

        li.appendChild(atag);
        commnityList.appendChild(li); // Append the list item to the unordered list
    });



    
   

    // Loop through the items array and create list items for each item
    resources.forEach(function(itemText) {
        var li = document.createElement("li");
        const atag = document.createElement('a');

        //li.textContent = itemText;
        li.style.marginBottom = '1vh';
        li.style.fontSize = '3.2vh';
        atag.textContent = itemText;

        if(atag.textContent == 'Help'){
            atag.href = 'https://metamask.io/faqs/';
        }else if(atag.textContent == 'Privacy Policy'){
            // might want to add check and see if URL is available if not dont add it 
            //atag.href = 'https://policies.google.com/privacy';
            atag.href = 'privacyPolicy.html';
        }else if(atag.textContent == 'Terms of Service'){
            atag.href = 'termsOfService.html';
        }else if(atag.textContent == 'Contracts'){
            atag.href = 'contracts.html';
        }

        li.appendChild(atag);
        resourcesList.appendChild(li); // Append the list item to the unordered list
    });

    // styling elements
    welcomeDiv.style.width = '80%';
    welcomeDiv.style.position = 'absolute';
    welcomeDiv.style.left = '10%';
    welcomeDiv.style.fontSize = '3vh';
    welcomeDiv.style.Color = 'black';
    welcomeDiv.style.height = '10%';
    welcomeDiv.style.top = '0%';
    welcomeDiv.style.justifyContent = 'center';
    //welcomeDiv.textContent = "Welcome";
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


    acceptableCoins.style.width =  sideElementsWidth; // replace with input width
    acceptableCoins.style.height = '35%';
    acceptableCoins.style.position = 'absolute';
    acceptableCoins.style.right = '1%';
    acceptableCoins.style.top = '10%';
    acceptableCoins.style.backgroundColor = '#9b9999';
    acceptableCoins.style.boxShadow = '0px 0.8px 5px rgba(0, 0, 0.5, 0.5)'; /* Adding shadow */
    acceptableCoins.style.borderRadius = '2vh';
    acceptableCoins.style.overflowY = 'scroll';
    acceptableCoins.className = 'acceptibleCoins';
    acceptableCoins.style.scrollbarWidth = 'none'; // For Firefox
    acceptableCoins.style.overflow = '-ms-scrollbars-none'; // For Internet Explorer/Edge
    acceptableCoins.style.msOverflowStyle = 'none'; // For Internet Explorer/Edge
    acceptableCoins.style.webkitScrollbarWidth = '0'; // For Webkit (Chrome, Safari)


    //add overlay same size with .5 opacity and black 
    // make sure message background of message is none

    //const acceptableCoinsOverlay = document.createElement('div');
    //acceptableCoinsOverlay.style.position = 'absolute'; 

    addCryptoTokens(acceptableCoins);
    
    unknownDiv.id = 'crypto-chat-room';
    unknownDiv.className = 'crypto-chat-room';
    unknownDiv.style.width = sideElementsWidth;
    unknownDiv.style.height = '55%';
    unknownDiv.style.position = 'absolute';
    unknownDiv.style.right = '1%';
    unknownDiv.style.top = '47%';
    unknownDiv.style.backgroundColor = '#9b9999';
    unknownDiv.style.boxShadow = '0px 0.8px 5px rgba(0, 0, 0.5, 0.5)'; /* Adding shadow */
    unknownDiv.style.borderRadius = '2vh';
    document.body.appendChild(unknownDiv); // Append the main container to the body

    // Create chat elements
    const chatBox = document.createElement('div');
    chatBox.classList.add('chatBox');
    chatBox.className = 'chatBox';

    chatBox.style.height = '85%';
    chatBox.style.left = '0%';
    chatBox.style.width = '100%';
    chatBox.style.overflowY = 'scroll';
    //chatBox.style.padding = '3px';
    chatBox.style.position = 'relative';
    chatBox.style.borderBottom = '1px solid #ccc';
    //chatBox.style.overflowX = 'hidden';
    chatBox.style.backgroundColor = 'dimgray';
    chatBox.style.borderTopLeftRadius = '1vh'; // Add border radius to top left corner
    chatBox.style.borderTopRightRadius = '1vh'; // Add border radius to top right corner
    chatBox.style.borderBottomLeftRadius = '0'; // Remove border radius from bottom left corner
    chatBox.style.borderBottomRightRadius = '0'; // Remove border radius from bottom right corner

    unknownDiv.appendChild(chatBox);


    // Create the emoji container button
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

    // Create the changeUserName button
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

    // Add event listener to the changeUserName button
    changeUserName.addEventListener('click', async () => {
        createChangeUsernamePopup().then(()=>{
            console.log('we fired the createChangeUsernamePopup() function ');
        });
    });

    // Append the emoji button to the parent element (e.g., unknownDiv)
    unknownDiv.appendChild(emojiButton);
    unknownDiv.appendChild(changeUserName);

    // Event listener to show emoji menu when the button is clicked
    emojiButton.addEventListener('click', (event) => {
        // Create the emoji menu container
        const emojiMenuIsOpen = document.querySelector('.emoji-menu');

        if(emojiMenuIsOpen){
            console.log('emoji menu is already open');
        }else{
            const emojiMenu = document.createElement('div');
            emojiMenu.classList.add('emoji-menu');
            emojiMenu.style.position = 'absolute';
            emojiMenu.className =' emoji-Menu';
            
            // Calculate the position of the message input field
            const inputRect = messageInput.getBoundingClientRect();
            const inputTop = inputRect.top + window.scrollY;

            // Set the bottom of the emoji menu to align with the top of the input field
            emojiMenu.style.bottom = `12%`; 
            emojiMenu.style.left = '0%';
            emojiMenu.style.width = '99.5%'; // Span the same width as the chat box
            emojiMenu.style.backgroundColor = 'lightgray';
            emojiMenu.style.border = '1px solid black';
            emojiMenu.style.zIndex = '1000'; // Ensure it has a higher z-index
            emojiMenu.className = 'emoji-menu';
            emojiMenu.style.display = 'flex-start';
            //emojiMenu.style.display = ''

            // Create the cancel button
            const cancelButton = document.createElement('div');
            cancelButton.textContent = 'Cancel';
            cancelButton.style.height = '32px';
            cancelButton.style.width = '30%'; 
            cancelButton.style.margin = '0 auto'; // Center the button horizontally
            cancelButton.style.marginBottom = '5px';
            cancelButton.style.backgroundColor = 'lightgray'; // Add background color for better visibility
            cancelButton.style.cursor = 'pointer'; // Add cursor style for better interaction
            cancelButton.style.display = 'flex'; // Enable flexbox for vertical alignment
            cancelButton.style.alignItems = 'center'; // Center the content vertically
            cancelButton.style.justifyContent = 'center'; // Center the content horizontally
            cancelButton.style.border = '1px solid #ccc'; // Add outline border
            cancelButton.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)'; // Add shadow underneath
            cancelButton.style.transition = 'background-color 0.3s ease'; // Add transition for hover effect

            cancelButton.addEventListener('mouseover', () => {
                cancelButton.style.backgroundColor = '#f0f0f0'; // Change background color on hover
            });
            cancelButton.addEventListener('mouseout', () => {
                cancelButton.style.backgroundColor = 'lightgray'; // Restore original background color when not hovered
            });

            cancelButton.addEventListener('click', () => {
                // Remove the emoji menu when cancel button is clicked
                emojiMenu.remove();
            });

            emojiMenu.appendChild(cancelButton);



            // Create a container for the emoji options
            const emojiOptionsContainer = document.createElement('div');
            emojiOptionsContainer.style.display = 'block';
            emojiOptionsContainer.style.width = '100%';
            emojiOptionsContainer.style.height = '20vh';
            emojiOptionsContainer.style.bottom = '0%';
            emojiOptionsContainer.style.border = 'none';
            emojiOptionsContainer.style.overflowY = 'scroll';
            emojiOptionsContainer.className =' emojiOptionsContainer';

            emojiMenu.appendChild(emojiOptionsContainer);



            // Populate the emoji menu with emoji options
            const emojis = ['😊', '🖕🏻',  '😁', '😎', '😍', '👍', '❤️', '🎉', '🌟', '🍕', '🎈', '🎨', '🚀', '💡', '🔥', '🌈', '🙌', '👏', '🤩', '💯', '🙏',
                   '🎶', '💪', '💥', '💖', '🌺', '🌸', '🌼', '🍦', '🍭', '🍩', '🍬', '🍔', '🍟', '🥇', '🏆', '🏅', '🎖️', '🏵️', '🎯', '🚗',
                   '🚲', '🚄', '🚢', '✈️', '🚀', '🛸', '🚁', '🎠', '🎡', '🏰', '🏯', '🏟️', '⛲', '🌆', '🌉', '🏞️', '🏝️', '🏖️', '⛱️',
                   '🎢', '🏎️', '🏍️', '🚓', '🚑', '🚒', '🚚', '🚛', '🚜', '🛴', '🚲', '🛵', '🚍', '🚠', '🚟', '🚡', '🚂', '🚃', '🚄',
                   '🚅', '🚆', '🚇', '🚈', '🚉', '🚊', '🚝', '🚞', '🚋', '🚌', '🚎', '🚐', '🚑', '🚒', '🚓', '🚔', '🚕', '🚖', '🚗'];

            emojis.forEach(emoji => {
                const emojiOption = document.createElement('button');
                emojiOption.style.backgroundColor = 'transparent'; // Set background color to transparent
                emojiOption.style.border = 'none'; // Remove border
                emojiOption.textContent = emoji;
                emojiOption.addEventListener('click', () => {
                    const currentMessage = messageInput.value;
                    messageInput.value = currentMessage + emoji;
                });
                emojiOptionsContainer.appendChild(emojiOption);
            });

            // Append the emoji menu to the parent element (e.g., unknownDiv)
            unknownDiv.appendChild(emojiMenu);
        }
        
    });

    const messageInput = document.createElement('input');


    messageInput.id = 'message-input';
    messageInput.placeholder = 'Type your message...';
    messageInput.style.width = '80%';
    messageInput.style.height = '5%';
    //messageInput.style.marginTop = '10%';
    messageInput.style.right = '4%';
    messageInput.style.bottom = '5%';
    messageInput.style.position = 'absolute';
    //messageInput.style.display = 'block';
    messageInput.style.backgroundColor = 'lightgray';
    messageInput.style.color = 'black';
    messageInput.style.border = '1px solid black'; // Set the default black border
    messageInput.style.borderRadius = '2vh';
    messageInput.style.outline = 'none'; // Remove the default outline
    messageInput.style.margin = 'auto'; // Center horizontally within flex container
    messageInput.style.overflowWrap = 'break-word'; // Allow long words to break and wrap
    messageInput.style.whiteSpace = 'nowrap'; // Prevent text from wrapping


    // Add event listeners to change border color when focused and blurred
    messageInput.addEventListener('focus', () => {
        messageInput.style.border = '1px solid black'; // Change border color when focused
    });

    messageInput.addEventListener('blur', () => {
        messageInput.style.border = '1px solid black'; 
    });


    unknownDiv.appendChild(messageInput);


    if(isSocketPresent){
        console.log('socket is already present no need to add again');
    }else{
        isSocketPresent = true;
        socket.on('updateCurrentPaintings', data => {
                // Access the data sent from the server
            console.log('Received data from server:', data);

            for(const myObj of currentPaintingArray){
                if(myObj._id == data.Id && myObj.inStock == true){
                    myObj.inStock = false;
                    console.log('we updated the array item', myObj);

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
                    }, 15000); // 15 seconds then remove form if active


                }else{
                    console.log('cannot find painting to update');
                }
        }

        });
        socket.on('message', (myobject) => {        
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
            alert('A new painting has been added.');
            paintingChunks = [];
            totalChunks = 0;
        });
    }



    // Event listener for send button
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
    //unknownDiv.style.opacity = '.6';

    tree.style.width = sideElementsWidth;
    tree.style.height = '54%';
    tree.style.position = 'absolute';
    tree.style.left = '2.4%';
    tree.style.top = '10%';
    tree.style.backgroundColor = 'dimgrey';
    tree.style.boxShadow = '0px 0.8px 5px rgba(0, 0, 0.5, 0.5)'; /* Adding shadow */
    tree.style.borderRadius = '2vh';
    //tree.style.opacity = '.6';
    tree.setAttribute("id", "tree");
    tree.className = 'tree';
    tree.appendChild(welcomeDiv);  

    addTreeList(tree, currentPaintingArray, parentElement, numColumns, gridWidthPercent); 

    const timeFrame = 15; // 1000 milliseconds = 1 second
    const movementPercentages = [1, 1.5, 0.5, 0.8, 1.2]; // Movement percentages for each tag
    moveLeftAndRight(tree, timeFrame, movementPercentages);
    printInfo(welcomeDivPTAG);// need to fix and make sure its not calling when string is present

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
    recentSells.style.boxShadow = '0px 0.8px 5px rgba(0, 0, 0.5, 0.5)'; /* Adding shadow */
    recentSells.style.borderRadius = '2vh';
    recentSells.className = 'recentSells';
    //recentSells.style.padding = '0%';
    //recentSells.style.opacity = '.6'; //make overlay so it can look like terminal



    if(purchaseArray.length == 0){
        // apend a div the same width the sells sells at the top
        // Create a new div for the text
        var textDiv = document.createElement("div");
        textDiv.textContent = "Recent Sells";
        textDiv.style.position = "absolute";
        textDiv.style.top = "0%";
        textDiv.style.left = "50%";
        textDiv.style.transform = "translateX(-50%)";
        //textDiv.style.left = "5vh";
        //textDiv.style.transform = "translate(-50%, -50%)";
        textDiv.style.color = "white"; // Adjust text color as needed
        textDiv.style.fontSize = "2.5vh"; // Adjust text size as needed
        textDiv.style.fontWeight = "bold"; // Adjust font weight as needed

        // Append the text div to the parent of recentSells
        recentSells.appendChild(textDiv);
        recentSells.style.backgroundImage = 'url("/Gifs/HourGlass/loading2.gif")';
        recentSells.style.backgroundSize = 'cover';
        recentSells.style.backgroundRepeat = 'no-repeat';
        recentSells.style.backgroundPosition = 'center';
        recentSells.style.backgroundColor = 'dimgray'; 


    }else{
        recentSells.style.overflowY = 'auto'; // Make the container scrollable when content exceeds height
        //recentSells.style.padding = '1vh'; // Add padding for spacing

        recentSells.style.display = "flex"; // Use flexbox for vertical stacking
        recentSells.style.flexDirection = "column"; // Stack items vertically
        recentSells.style.overflowY = 'auto';

        var purchaseIndex = 0;


        purchaseArray.forEach(purchase => {
            // Create a div element for each purchase

            const purchaseDiv = document.createElement("div");
            purchaseDiv.style.borderBottomStyle = 'solid';
            purchaseDiv.style.borderBottomWidth = '0.2vh'; 
            purchaseDiv.style.borderBottomColor = 'lightgray'; 
            purchaseDiv.style.backgroundColor = 'dimgray';
            purchaseDiv.style.height = '15vh';
            purchaseDiv.style.position = 'relative';
            purchaseDiv.style.width = '110%';

            //purchaseDiv.style.height = '35%';
            // Create an image element
            const image = document.createElement("img");
            image.src = purchase.productIMG; // Set the image source
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
            infoContainer.style.alignItems = "center"; // Center items horizontally
            infoContainer.style.display = "flex"; // Use flexbox for vertical stacking
            infoContainer.style.flexDirection = "column"; // Stack items vertically



            // Create text nodes for date, first name, and price

            /*
            const dateTextNode = document.createTextNode(`Date: ${purchase.datePurchased}`);
            const firstNameTextNode = document.createTextNode(`First Name: ${purchase.firstName}`);
            const priceTextNode = document.createTextNode(`Price: $${purchase.price}`);

            */
                                          
            const dateNode =  document.createElement("div");
            dateNode.textContent = `Date Purchased: ${purchase.datePurchased}`;

            const firstNameDiv = document.createElement("div");
            firstNameDiv.textContent = `Buyer: ${purchase.firstName}`;

            const priceDiv = document.createElement("div");
            console.log(purchase.price);
            priceDiv.textContent = `Price: ${purchase.price.$numberDecimal} ETH`;

            //dateNode.style.position = 'absolute';
            dateNode.style.width = '80%';
            dateNode.style.height = '33%';
            //dateNode.style.left = '10%';
            ////dateNode.style.top = '2%';
            dateNode.style.fontSize = '1.6vh';
            dateNode.style.display = 'flex'; // Use flexbox for vertical centering
            dateNode.style.alignItems = 'center'; // Center text vertically
            dateNode.className = 'dateNode';

            //firstNameDiv.style.position = 'absolute';
            firstNameDiv.style.width = '80%';
            firstNameDiv.style.height = '33%';
            //firstNameDiv.style.left = '10%';
            firstNameDiv.style.fontSize = '1.6vh';
            firstNameDiv.style.display = 'flex'; // Use flexbox for vertical centering
            firstNameDiv.style.alignItems = 'center'; // Center text vertically
            firstNameDiv.className = 'purchasesfirstNameDiv';
            //firstNameDiv.style.top = '23%';

            //priceDiv.style.position = 'absolute';
            priceDiv.style.width = '80%';
            priceDiv.style.height = '33%';
            //priceDiv.style.left = '10%';
            priceDiv.style.fontSize = '1.6vh';
            priceDiv.style.display = 'flex'; // Use flexbox for vertical centering
            priceDiv.style.alignItems = 'center'; // Center text vertically
            priceDiv.className = 'purchasesPriceDiv';
            //priceDiv.style.top = '40%';


            // Append image and text nodes to the purchaseDiv
        
            infoContainer.appendChild(dateNode);
            //infoContainer.appendChild(priceDiv);
            //infoContainer.appendChild(document.createElement("br")); // Add line break
            infoContainer.appendChild(priceDiv);
            infoContainer.appendChild(firstNameDiv);

            // Add the purchaseDiv to the purchaseContainer
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
    headertext.style.backgroundImage = 'url("/images/bursonSKullText.png")'; // images created via Gimp
    headertext.style.backgroundSize = 'cover';
    headertext.style.backgroundRepeat = 'no-repeat';
    headertext.style.backgroundPosition = 'center'; 


    //headertext.textContent = 'Burson Skullz';
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
    backButton.style.backgroundImage = 'url("/images/Homeicon.png")'; //https://www.iconfinder.com/search?q=home+icon+
    backButton.style.backgroundSize = 'contain';
    backButton.style.backgroundRepeat = 'no-repeat';
    backButton.style.backgroundPosition = 'center'; 

    backButton.addEventListener('click', function() {
        paintingClicked = false;
        const body = document.body;

        // Clear all existing content from the body
        while (body.firstChild) {
            body.removeChild(body.firstChild);
        }

        // Define the new HTML content for the body
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

        // Insert the new HTML content into the body
        body.innerHTML = newBodyContent;

        // need to check if connected again 


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
                        // makeLog(user);
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
                    // no need to reset boolean operators as function already does
                    
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

        // Add containerInput element
        let containerInput = document.createElement('div');
        containerInput.classList.add('container-input');
        containerInput.style.position = 'absolute';
        containerInput.style.top = '10%';
        containerInput.style.width = '450px';
        containerInput.style.height = '600px';
        containerInput.style.overflow = 'auto'; // Use auto to show scrollbars if content exceeds height
        containerInput.style.border = '1px solid #ccc';
        containerInput.style.borderRadius = '10px';
        containerInput.style.boxSizing = 'border-box';
        containerInput.style.background = '#9b9999';
        containerInput.style.fontFamily = 'Arial, sans-serif';
        containerInput.style.border = '1px solid black';

        // Variables to track dragging state and offsets
        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;

        // Add mousedown event listener to start dragging
        containerInput.addEventListener("mousedown", function (event) {
            // Calculate the offset of the mouse click relative to the container's position
            offsetX = event.clientX - containerInput.getBoundingClientRect().left;
            offsetY = event.clientY - containerInput.getBoundingClientRect().top;

            // Set dragging state to true
            isDragging = true;

            // Change cursor style to indicate dragging
            containerInput.style.cursor = "grabbing";
        });

        // Add mousemove event listener to handle dragging movement
        document.addEventListener("mousemove", function (event) {
            if (isDragging) {
                // Update container position based on mouse movement
                containerInput.style.left = (event.clientX - offsetX) + "px";
                containerInput.style.top = (event.clientY - offsetY) + "px";
            }
        });

        // Add mouseup event listener to stop dragging
        document.addEventListener("mouseup", function () {
            // Set dragging state to false
            isDragging = false;

            // Reset cursor style
            containerInput.style.cursor = "grab";
        });
        // Append containerInput to the body or another container element
        document.body.appendChild(containerInput);

        // Media query for smaller screens
        const mediaQuery = window.matchMedia('(max-width: 768px)');

        const handleMediaQuery = (mq) => {
            if (mq.matches) {
                const screenWidth = window.innerWidth;
                if (screenWidth <= 360) {
                    // If screen width is 400 or less, adjust the left position to 5%
                    containerInput.style.left = '0%';
                    containerInput.style.width = '330px';
                    containerInput.style.zIndex = '100000000';
                }else if (screenWidth <= 400) {
                    // If screen width is 400 or less, adjust the left position to 5%
                    containerInput.style.left = '5%';
                    containerInput.style.width = '330px';
                    containerInput.style.zIndex = '100000000';
                }else if (screenWidth <= 450) {
                    // If screen width is 400 or less, adjust the left position to 5%
                    containerInput.style.left = '11%';
                    containerInput.style.width = '330px';
                    containerInput.style.zIndex = '100000000';
                } else if (screenWidth <= 540) {
                    // If screen width is 500 or less, adjust the left position to 7%
                    containerInput.style.left = '16%';
                    containerInput.style.width = '350px';
                    containerInput.style.zIndex = '100000000';
                } else if (screenWidth <= 770) {
                    // If screen width is 770 or less, adjust the left position to 8%
                    containerInput.style.left = '20%';
                    containerInput.style.width = '400px';
                    containerInput.style.zIndex = '100000000';
                }
            }else{
                // Set the left position to center it inside its parent
                const parentWidth = containerInput.parentElement.clientWidth;
                const containerWidth = containerInput.offsetWidth;
                const leftPosition = (parentWidth - containerWidth) / 2;
                containerInput.style.left = leftPosition + 'px';
            }
        };

        // Initial call to handle media query
        handleMediaQuery(mediaQuery);

        // Add event listener for changes to the media query
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
        container.style.alignItems = 'center'; // Center its children horizontally

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

        


       // Create form title
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

        // Create parent element for the image and center it
        let imageContainer = document.createElement('div');
        imageContainer.style.display = 'flex'; // Use flexbox
        imageContainer.style.justifyContent = 'center'; // Center its children horizontally

        // Create image element
        let image = document.createElement('img');
        image.setAttribute('src', '/images/BursonSkull.png'); 
        image.setAttribute('alt', 'BursonSkullCommissionTemp'); 
        image.style.width = '100px'; // Adjust width as needed
        image.style.height = '100px'; // Adjust height as needed
        image.style.marginBottom = '20px'; // Add space between image and form

        // Append image to its parent container
        imageContainer.appendChild(image);

        // Append imageContainer to the main container
        container.appendChild(imageContainer);


        container.appendChild(para);


        // Create form elements
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
            formGroup.style.flexDirection = 'column'; // Set the direction to column
            formGroup.style.marginBottom = '20px';

            let label = document.createElement('label');
            label.textContent = element.label;
            label.setAttribute('for', element.id);
            label.style.fontWeight = 'bold';
            label.style.marginBottom = '5px'; // Adjust as needed

            let input;
            if (element.type === 'textarea') {
                input = document.createElement('textarea');
                input.classList.add('form-input');
                input.style.width = '87%';
                input.style.height = '80px'; // Adjust height for textarea
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
            submitButton.style.marginTop = '20px'; // Add margin to separate from other elements

            // Add event listener for form submission
            submitButton.addEventListener('click', async function() {
                // Get form values
                let formData = {};
                formElements.forEach(element => {
                    formData[element.id] = document.getElementById(element.id).value;
                });
                // to to make loading icon inside and remove if successful or bad input 
                // can make after validateUserInfo
                // need to restrict fecthes on server side 

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
                                                     // delete content and create sucess and thank you div! 
                                                     console.log('message came back true',serverMessage);

                                                     console.log('need to make a success div');
                                                    formElements.forEach(element => {
                                                        document.getElementById(element.id).value = '';
                                                    });
                                                    containerInput.remove();

                                                    // create success div
                                                    // Create success div
                                                    let successDiv = document.createElement('div');
                                                    successDiv.classList.add('success-message');
                                                    successDiv.style.position = 'fixed';
                                                    successDiv.style.top = '50%';
                                                    successDiv.style.left = '50%';
                                                    successDiv.style.transform = 'translate(-50%, -50%)';
                                                    successDiv.style.width = '80%'; // Set width to 80% of the viewport
                                                    successDiv.style.maxWidth = '400px'; // Set maximum width for larger screens
                                                    successDiv.style.background = '#ffffff';
                                                    successDiv.style.border = '1px solid #ccc';
                                                    successDiv.style.padding = '20px';
                                                    successDiv.style.textAlign = 'center';
                                                    successDiv.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
                                                    successDiv.style.zIndex = '9999'; // Ensure it appears above other elements
                                                    successDiv.style.backgroundColor = 'lightgray';
                                                    successDiv.style.border = '1px solid black';
                                                    successDiv.style.borderRadius = '1vh';

                                                    // Add thank you message
                                                    let thankYouMessage = document.createElement('p');
                                                    thankYouMessage.textContent = 'Thank you for your commission! We have received your request and will get back to you soon.';
                                                    successDiv.appendChild(thankYouMessage);
                                                    // Add exit button
                                                    let exitButton = document.createElement('button');
                                                    exitButton.textContent = 'Close';
                                                    exitButton.style.marginTop = '20px'; // Add some space between message and button
                                                    exitButton.style.cursor = 'pointer';
                                                    exitButton.style.backgroundColor = '#ff3333'; // Set background color to red
                                                    exitButton.style.color = '#ffffff'; // Set text color to white
                                                    exitButton.style.border = 'none'; // Remove border
                                                    exitButton.style.padding = '10px 20px'; // Add padding for better appearance
                                                    exitButton.style.borderRadius = '5px'; // Add border radius for rounded corners
                                                    exitButton.addEventListener('click', function() {
                                                        document.body.removeChild(successDiv); // Remove the success div when the button is clicked
                                                    });
                                                    successDiv.appendChild(exitButton);

                                                    // Append success div to the body
                                                    document.body.appendChild(successDiv);

                                                }else{
                                                    console.log('message came back false', serverMessage)

                                                                                                        // Clear form inputs
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

    });

function isValidPhoneNumber(phoneNumber) {
    // Regular expression to match a valid phone number format
    // This example matches North American phone numbers
    // Adjust the regex pattern as needed for different phone number formats
    let phoneRegex = /^\d{3}-\d{3}-\d{4}$/;

    // Test the phone number against the regex pattern
    return phoneRegex.test(phoneNumber);
}


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
        
        // Create botContainer
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

        // Check if the width should be adjusted
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
            //popupForm.style.cursor = "grabbing";
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
        responseDiv.style.height = '68%'; // Adjusted height
        responseDiv.style.top = '5%';
        responseDiv.style.margin = '2% auto'; // Adjusted margin-top to 10% and centered horizontally
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

        // Create overlay
        const overlay = document.createElement('div');
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.position = 'absolute';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.backgroundColor = 'black';
        overlay.style.opacity = '0.73';
        responseDiv.appendChild(overlay);
        // Create overlay on top of overlay
        const overlayMain = document.createElement('div');
        overlayMain.style.width = '100%';
        overlayMain.style.height = '100%';
        //overlayMain.style.position = 'absolute';
        overlayMain.style.top = '0';
        overlayMain.style.left = '0';
        overlayMain.style.backgroundColor = 'black';
        overlayMain.style.opacity = '0.70';
        overlayMain.style.color = 'white';
        overlayMain.style.overflowY = 'scroll';
        overlayMain.style.display = 'flex';
        overlayMain.style.flexDirection = 'column';
        overlayMain.style.justifyContent = 'flex-start'; // optional, to center vertically
        overlayMain.style.alignItems = 'center'; // optional, to center horizontally

        overlay.appendChild(overlayMain);

        overlayMain.style.fontSize = '2vh';
       

        // Create parent div for inputContainer
        const inputParent = document.createElement('div');
        inputParent.style.position = 'absolute';
        inputParent.style.bottom = '7.2%'; // Positioned at the bottom with 10px margin
        inputParent.style.width = '90%'; // Set to same width as responseDiv
        inputParent.style.height = '8.5%'; // Set to same width as responseDiv
        inputParent.style.left = '3.2%'; // Center input horizontally
        //inputContainer.style.display = 'block';
        botContainer.appendChild(inputParent);

        // Create inputContainer
        const inputContainer = document.createElement('input');
        inputContainer.id = 'inputContainer';
        inputContainer.type = 'text';
        inputContainer.style.border = 'none';
        inputContainer.style.position = 'relative';
        inputContainer.placeholder = 'Type here...';
        inputContainer.style.width = '100%'; // Set to full width of parent div
        inputContainer.style.height = '100%'; // Set to full width of parent div
        inputContainer.style.left = '0%'; // Set to full width of parent div
        //inputContainer.style.padding = '10px'; // Adding padding for better appearance
        inputParent.appendChild(inputContainer);

        inputContainer.addEventListener('keydown', async function(event) {
            if (event.key === 'Enter') {
                const userInput = inputContainer.value;
                if(userInput == ''){
                    // dont evaluate empty string
                }else{
                    try{
                        overlayMain.innerHTML = '';
                        let response = await getResponse(userInput);
                        inputContainer.value = '';

                        // response is array of server messages that need to be appended in a ptag to parent ptag


                        if(response != null){
                            console.log(' we should get an array', response);

                            for(const serverRSPDS of response.serverAIResponse){
                                console.log(serverRSPDS);
                                writeToParentDivWithDelay(serverRSPDS[0].rsp, overlayMain, 10);
                            }
                        }else{
                            writeToParentDivWithDelay("there was an unexpected error", overlayMain, 10);
                        }

                        overlayMain.style.marginTop = '20px';
                        overlayMain.style.height = `calc(100% - 20px)`; 

                        
                    }catch(error){
                        console.log(error);
                        // type error in main div
                        writeToParentDivWithDelay("there was an unexpected error", overlayMain, 10);
                    }  
                }

                
            }
        });
        // Create exitButton
        const exitButton = document.createElement('div');
        exitButton.id = 'exitButton';
        exitButton.textContent = '❌'; // X emoji
        exitButton.style.position = 'absolute';
        exitButton.style.top = '1%';
        exitButton.style.right = '95%';
        exitButton.style.width = '5%'; // Fixed width
        exitButton.style.height = '5%'; // Fixed height
        exitButton.style.fontSize = '2vh'; // Adjust font size
        exitButton.style.border = 'none'; // Remove border for a cleaner look
        exitButton.style.background = 'none'; // Remove background color
        exitButton.style.cursor = 'pointer'; // Change cursor to pointer on hover
        exitButton.addEventListener('click', function() {
            botContainer.remove();
        });
        botContainer.appendChild(exitButton);

        // Add event listener to inputContainer
        inputContainer.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                console.log('User typed:', inputContainer.value);
                // You can add more logic here to handle the user's input
                inputContainer.value = ''; // Clear input after submission
            }
        }); 
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
    gridFoward.style.backgroundImage = 'url("/images/rightIcon3.png")';
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
    header.style.boxShadow =  '0px 2px 4px rgba(0, 0, 0, 0.7)'; /* Adjust values for your shadow */

    //header.style.opacity = '.6'; 

    headerLogo.style.position = 'absolute'; 
    headerLogo.style.height = '8.5vh'
    headerLogo.style.width = '10%'; 
    headerLogo.style.left = '0%'; 
    headerLogo.style.top = '0%';
    //logoContainer.style.borderTop = "0.4vh solid dimgray"; 
    headerLogo.style.backgroundColor = 'none'; 
    headerLogo.style.backgroundImage = 'url(/images/bursonskull.png)';
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
    // call this function with elements only change array!!!


    // footer attributes
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

    // footer attributes
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
    //logoContainer.style.borderTop = "0.4vh solid dimgray"; 
    //logoContainer.style.backgroundColor = 'none'; 

    footerLargeTextContainer.style.position = 'absolute'; 
    footerLargeTextContainer.style.height = '100%'
    footerLargeTextContainer.style.width = '75%'; 
    footerLargeTextContainer.style.right = '5%'; 
    footerLargeTextContainer.style.top = '0%';
    //footerLargeTextContainer.style.backgroundColor = 'white';
    footerLargeTextContainer.style.backgroundImage = 'url("/images/bursonSKullText.png")'; // images created via Gimp
    footerLargeTextContainer.style.backgroundSize = 'cover';
    footerLargeTextContainer.style.backgroundRepeat = 'no-repeat';
    footerLargeTextContainer.style.backgroundPosition = 'center';


    logo.style.position = 'relative'; 
    logo.style.height = '100%'
    logo.style.width = '15%'; 
    logo.style.left = '10%'; 
    //logo.style.top = '0%';
    //logoContainer.style.borderTop = "0.4vh solid dimgray"; 
    //logo.style.backgroundColor = 'white'; 
    logo.style.backgroundImage = 'url(/images/bursonskull.png)';
    logo.style.backgroundSize = 'contain';
    logo.style.backgroundRepeat = 'no-repeat';
    logo.style.backgroundPosition = 'center';

    // Create row div
    var row = document.createElement("div");
    row.classList.add("row");

    // Create columns
    for (var i = 1; i <= 3; i++) {
        var column = document.createElement("div");
        column.classList.add("column");

      // Add content to each column
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

        // Loop through each list item
    

    // Append row to footer
    footContainer.appendChild(row);

    // Append footer to the body
    //document.body.appendChild(footer);


    /*gridContainer.addEventListener('scroll', function() {
        // Check if scroll position is at the top
        if (gridContainer.scrollTop > 0) {
          showScrollUpArrow();// fires during scroll maybe make arrow visible
          //console.log('we are at the top');

        }else if(gridContainer.scrollTop == 0){
            console.log('ScrollTop = 0');
        }else if(gridContainer.scrollTop > 500){
             console.log('ScrollTop > 50s%');
        }else {
        // Scroll position is at the top, hide arrow
            console.log('Fires when we hit the top');
            //hideScrollUpArrow();
        }

    });*/



    // Search bar neeeds fixed
    createSearchBar(header);
    // use instead  accounts = await window.ethereum.request(); 
    if(isConnected == true && window.ethereum.selectedAddress == RoysWallet){
        createDatabaseUtility(header);
    }else{
        // do nothing
    }
    

    parentElement.appendChild(tree);

    parentElement.appendChild(acceptableCoins);
    parentElement.appendChild(recentSells);
    parentElement.appendChild(unknownDiv);// edit to div you find of interest


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



export async function getNFTs(contractAddress, providerUrl) {
    // Initialize the provider
    const provider = new ethers.providers.JsonRpcProvider(providerUrl);

    // Load the contract ABI
    let abi = await getContractABI(contractAddress); 

    // Create an instance of the contract
    const contract = new ethers.Contract(contractAddress, abi, provider);

    try {
        // Call the contract's function to get the total number of Bored Apes
        const totalNFTs = await contract.totalSupply();

        // Create an array to store the Bored Apes
        const NFTs = [];

        // Loop through each token ID and retrieve the owner's address
        for (let i = 1; i <= totalNFTs; i++) {
            const owner = await contract.ownerOf(i);
            NFTs.push({ tokenId: i, owner: owner });
        }

        return NFTs;
    } catch (error) {
        //console.error('Error fetching tokens:', error);
        return [];
    }
}


    // Function to add message to chat box
export function addMessage(message, username, timestamp) {
    // Create p tag for the message

    //need to get the username of the client and compare to the username being called as a paramater

    msgCount +=1 ; // add 1 to msgCount
    const p = document.createElement('p');
    p.textContent = message;

    // Style the p tag (rest of your styling goes here)
    p.style.height = 'auto'; // Set height to auto
    p.style.position = 'relative'; // Make position relative

                // Create username div
    const usernameDiv = document.createElement('div');
    usernameDiv.textContent = username;
    usernameDiv.style.position = 'absolute'; // Set position to absolute
    usernameDiv.style.top = '0%'; // Align to the top of the message
    usernameDiv.style.left = '0%'; // Align to the left of the message
    usernameDiv.style.padding = '4px'; // Add padding
    usernameDiv.style.backgroundColor = 'transparent'; // Set background color
    usernameDiv.style.color = 'black'; // Set text color
    usernameDiv.style.fontSize = '1.5vh'; // Set font size
    usernameDiv.style.borderTopLeftRadius = '5px'; // Add border radius to top left corner
    usernameDiv.style.borderBottomRightRadius = '5px'; // Add border radius to bottom right corner
    usernameDiv.style.marginBottom = '2vh';
    usernameDiv.classList.add('message-username');

    // Create timestamp div
    const timestampDiv = document.createElement('div');
    timestampDiv.textContent = timestamp;
    timestampDiv.style.position = 'absolute'; // Set position to absolute
    timestampDiv.style.bottom = '0%'; // Align to the bottom of the message
    timestampDiv.style.right = '0%'; // Align to the right of the message
    timestampDiv.style.padding = '0 5px'; // Add padding
    timestampDiv.style.backgroundColor = 'transparent'; // Set background color
    timestampDiv.style.color = 'white'; // Set text color
    timestampDiv.style.fontSize = '1.2vh'; // Set font size
    timestampDiv.style.marginTop = '2vh';

    const localChatBox = document.querySelector('.chatBox');
    localChatBox.appendChild(p);

    p.style.maxWidth = '80%'; // Limit width to 90% of parent
    p.style.wordWrap = 'break-word'; // Wrap text when it reaches parent's width
    p.style.backgroundColor = 'dimgray';
    //p.style.borderRadius = '1vh';
    p.style.fontSize = '1.5vh';
    p.style.marginBottom = '10px'; // Add some space between messages
    p.style.marginTop = '0px';
    p.style.overflowY = 'auto';

    // Set border style for the bottom side only
    p.style.borderBottomStyle = 'solid';
    p.style.borderBottomWidth = '0.2vh'; // Set border width
    p.style.borderBottomColor = 'lightgray'; // Set border color

    p.style.padding = '4vh'; // Adjust the value as needed
    p.style.color = 'white';

    // CSS for customizing scrollbar
    p.style.scrollbarWidth = 'thin'; // Set the width of the scrollbar
    p.style.scrollbarColor = 'transparent dimgray'; // Set the color 
    localChatBox.scrollTop = localChatBox.scrollHeight;

    //p.style.margin = '3px';
    p.classList.add('live-Messages');
    p.setAttribute('id', username + "Message" + msgCount.toString()); // Replace 'uniqueId' with the desired ID value
    // Scroll to bottom of chat box
        

     // Append delete button, username div, and timestamp div to the message p tag
    //p.appendChild(deleteButton);
    p.appendChild(usernameDiv);
    p.appendChild(timestampDiv);
        
}

async function getContractABI(contractAddress) {
    // Etherscan API endpoint for fetching contract ABI
    const apiUrl = `https://api.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=YourApiKeyToken`;

    try {
        // Fetch contract ABI from Etherscan API
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Check if the response is successful and ABI is available
        if (data.status == "1" && data.result != "") {
            // Parse and return the ABI
            return JSON.parse(data.result);
        } else {
            console.error("Error fetching ABI:", data.message);
            return null;
        }
    } catch (error) {
        console.error("Error fetching ABI:", error);
        return null;
    }
}



export async function checkifConnected(){
    // if both are available just log into metmask 
    // add ability to change to coinbase
    // coinbase does not seem safe it wants writeable acess must review

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
            //ethereum.selectedAddress' is deprecated and may be removed in the future. Please use the 'eth_accounts' RPC method instead.
            // checks if wallet has no adress and returns null from extension
            isConnected = true; 
            buttonContainer.appendChild(greenLight);
            buttonContainer.appendChild(loggedInButton);


            const connectButtonPTAG = document.createElement('p');

            connectButtonPTAG.innerHTML = window.ethereum.selectedAddress.substring(0, 8) + '~~~'; // change to current adress
            connectButtonPTAG.classList.add('centered-text'); // Add a class for centering text

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
            // check coinbase is installed before proceeding (is not considered safe yet)!
            // only for firefox (if others fail);

                try {
                    // Request accounts and handle the response asynchronously
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

// Function to create the popup for changing the username
async function createChangeUsernamePopup() {

    // check if popup already exist 
    if(changeUserNamePopUpExist){
        console.log('popup already exist');
    }else{
        // Create the popup container
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
                        // Parse the JSON response
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

                            // Close the popup
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
    // Define an array of strings

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

    // Clear existing content
    div.textContent = "";
    //div.style.textDecoration = 'underline';
    div.style.fontSize = '2.1vh';
    div.style.width = '100%';
    div.style.left = '0%';
    div.style.textAlign = 'center'; // Horizontally center the content
    div.style.fontSize = '2.2vh';
    div.style.color = 'white';

    // Function to print each string with a delay
    function printString(index) {

        // only call if finishedPrinting is true
        var stringToPrint = strings[index];
        if (!stringToPrint) return; // Exit if no more strings to print
        // Loop through each character in the string
        for (var i = 0; i < stringToPrint.length; i++) {
            // Use setTimeout to delay printing each character
            setTimeout(function(char) {
                return function() {
                    div.textContent += char; // Append character to the output div
                };
            }(stringToPrint[i]), i * 200); // Delay each character by 100 milliseconds
        }
        // Schedule the next string to print after the current one
         
        setTimeout(function() {
            div.textContent = '';
            printString(index + 1);
            if(index ==  strings.length-1){
                currentlyPrinted = false;
            }else{

            }
        }, stringToPrint.length * 250); // Delay before printing the next string
    }

    // Start printing the first string
    printString(0);
    currentlyPrinted = true;
}

export async function getVeChainPrice(element) {
    let retryCount = 0; // Track the number of retries
    const maxRetries = 2; // Maximum number of retries
    const retryInterval = 180000; // Interval between retries in milliseconds (3 minutes)

    function fetchVETPrice() {
        // Make an API request to fetch VeChain price from CoinGecko
        fetch('https://api.coingecko.com/api/v3/simple/price?ids=vechain&vs_currencies=usd')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch VeChain price');
                }
                return response.json();
            })
            .then(data => {
                // Extract VeChain price from the response
                const vechainPrice = data.vechain.usd;
                element.textContent = '$' + '  ' + vechainPrice.toFixed(4); // Display the price on the element
                retryCount = 0; // Reset retry count upon successful fetch
            })
            .catch(error => {
                console.error('Error fetching VeChain price:', error);
                // Retry fetching the data if maximum retries haven't been reached
                // If error is due to internet connection, display "error"
                element.textContent = 'error';
                if (retryCount < maxRetries) {
                    retryCount++;
                    setTimeout(fetchVETPrice, retryInterval); // Retry after the specified interval
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
                            element.textContent = '$' +  '  ' +  vechainPrice.toFixed(2); // Display the price on the element
                            console.log('VeChain price:', vechainPrice);
                        })
                        .catch(error => {
                            console.error('Error fetching VeChain price from CoinCap:', error);
                        });
                }
            });
    }

    // Initial fetch of VeChain price
    fetchVETPrice();

    // Set interval to fetch VeChain price every 3 minutes (for testing)
    setInterval(fetchVETPrice, retryInterval);
}

function addSecretMenu() {
    // Menu items array
    const menuItems = ['upload painting', 'remove painting', 'send tracking number'];

    // Create the main menu container
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

    // Create container for cancel button
    const closeButtonContainer = document.createElement('div');
    closeButtonContainer.style.position = 'absolute';
    closeButtonContainer.style.top = '10px';
    closeButtonContainer.style.right = '10px';

    // Create the close button (X emoji)
    const closeButton = document.createElement('div');
    closeButton.textContent = '❌';
    closeButton.style.fontSize = '10px';
    closeButton.style.cursor = 'pointer';

    // Add event listener to remove the menu form when close button is clicked
    closeButton.addEventListener('click', function() {
        document.body.removeChild(secretMenu);
    });

    // Append the close button to its container
    closeButtonContainer.appendChild(closeButton);

    // Append the close button container to the main menu
    secretMenu.appendChild(closeButtonContainer);

    // Create list for menu items
    const itemList = document.createElement('div');
    itemList.style.marginTop = '50px'; // Adjust top margin to separate from the close button

    // Loop through menu items array and create divs for each item
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

          // Add hover effect
        itemDiv.addEventListener('mouseenter', function() {
            itemDiv.style.backgroundColor = '#585858';
        });

        // Remove hover effect
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
                 // Add event listeners for dragging behavior
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
                // Create the form element
                const form = document.createElement('form');
                form.id = 'uploadForm';

                // Create the image input field
                const imageInput = document.createElement('input');
                imageInput.type = 'file';
                imageInput.id = 'imageInput';
                imageInput.accept = 'image/*';
                imageInput.addEventListener('change', function() {
                    // Handle image selection and display preview
                    const file = imageInput.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = function() {
                            preview.src = reader.result;
                        };
                        reader.readAsDataURL(file);
                        exitButton.style.display = 'inline-block'; // Show exit button when image selected
                    }
                });

                // Create the preview area for the image
                const previewContainer = document.createElement('div');
                previewContainer.style.position = 'relative';
                const preview = document.createElement('img');
                preview.id = 'imagePreview';
                preview.style.maxWidth = '25%';
                preview.style.maxHeight = '25%';
                preview.style.marginTop = '10px';
                previewContainer.appendChild(preview);

                // Create the exit button for removing the selected image
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
                exitButton.style.display = 'none'; // Initially hidden
                exitButton.addEventListener('click', function() {
                    preview.src = ''; // Remove the image
                    imageInput.value = ''; // Clear the file input
                    exitButton.style.display = 'none'; // Hide the exit button
                });
                previewContainer.appendChild(exitButton);

                // Create the date input field
                const dateInput = document.createElement('input');
                dateInput.type = 'date';
                dateInput.id = 'dateInput';

                // Create the span tag for "Date created"
                const dateCreatedLabel = document.createElement('span');
                dateCreatedLabel.textContent = 'Date created';
                dateCreatedLabel.style.marginLeft = '10px';

                // Create the boolean input field
                const booleanInput = document.createElement('input');
                booleanInput.type = 'checkbox';
                booleanInput.id = 'booleanInput';

                
                // Create label for the boolean input field
                const availabilityLabel = document.createElement('label');
                availabilityLabel.textContent = 'Available';
                availabilityLabel.htmlFor = 'booleanInput';
                availabilityLabel.style.marginLeft = '10px';


                // Create the text input fields
                const stringInputs = [];
                const placeholders = ['Artist', 'Description', 'LegalContract'];
                for (let i = 0; i < placeholders.length; i++) {
                    const stringInput = document.createElement('input');
                    stringInput.type = 'text';
                    stringInput.id = `stringInput${i + 1}`;
                    stringInput.placeholder = placeholders[i];
                    stringInputs.push(stringInput);
                }


                // Create the price input field
                const uploadName = document.createElement('input');
                uploadName.type = 'text';
                uploadName.id = 'priceInput';
                uploadName.placeholder = 'Painting Name';


                // Create the price input field
                const priceInput = document.createElement('input');
                priceInput.type = 'text';
                priceInput.id = 'priceInput';
                priceInput.placeholder = 'Price in ETH';
                //priceInput.style.display = 'flex-end';

                // Create the price input field
                const uploadPassword = document.createElement('input');
                uploadPassword.type = 'text';
                uploadPassword.id = 'priceInput';
                uploadPassword.placeholder = 'passcode';


                // Create the upload button
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

                // Create the cancel button
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


                // Append all input fields and buttons to the form
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

                //form.action = '/add-painting';
                //form.method = 'post';

                // Append the form to the popup
                popupForm.appendChild(form);

                // Append the popup to the document body
                document.body.appendChild(popupForm);

                // Show the popup
                popupForm.style.display = 'block';

                uploadButton.addEventListener('click', async () =>  {

                    const price = parseFloat(priceInput.value);

                    if (isNaN(price)) {
                        alert('Price must be a valid integer.');
                        //return;
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
                            body: JSON.stringify(thisObj) // Convert object to JSON string
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

                            // Display success message or do something else with the response
                        } else {
                            console.error('Failed to add painting:', response.statusText);
                        }
                    } catch (error) {
                        console.error('Error adding painting:', error);
                    }
                
                });



                // Add event listener to the cancel button
                cancelButton.addEventListener('click', function() {
                    // Close the popup
                    popupForm.style.display = 'none';
                }); 
                
            }else if(item == 'send tracking number'){
                makeConfirmationForm();
            }   
        });

        itemList.appendChild(itemDiv);

        itemDiv.addEventListener('click', function() {
            console.log(`${item} clicked`);
            // You can add specific actions for each menu item here
        });

        itemList.appendChild(itemDiv);
    });

    // Append the list of menu items to the main menu
    secretMenu.appendChild(itemList);

    // Append the secret menu to the body
    document.body.appendChild(secretMenu);
}

function makeConfirmationForm() {
    // Create the form container
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


        // Create the close button (X emoji)
    const closeButton = document.createElement('div');
    closeButton.textContent = '❌';
    closeButton.style.fontSize = '10px';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.color = '#333'; // Change color of X icon

    // Add event listener to remove the form container when close button is clicked
    closeButton.addEventListener('click', function() {
        document.body.removeChild(formContainer);
    });

    // Append the close button to the form container
    formContainer.appendChild(closeButton);
    // Create the form element
    const form = document.createElement('form');
    form.id = 'confirmationForm';
    form.style.display = 'flex';
    form.style.flexDirection = 'column';
    form.style.alignItems = 'center';
    form.style.width = '100%';
    form.style.height = '70%';
    form.style.top = '15%';
    form.style.position = 'absolute';

    // Create the name field

        // Create the email field
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

    // Create the tracking number field
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

    // Create the image field
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

    // Create the passcode field
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

    // Create the submit button
    const submitButton = document.createElement('input');
    submitButton.type = 'submit';
    submitButton.value = 'Submit';
    form.appendChild(submitButton);

    // Append the form to the form container
    formContainer.appendChild(form);

    // Append the form container to the body
    document.body.appendChild(formContainer);

    // Prevent default form submission
    form.addEventListener('submit', function(event) {
        event.preventDefault();
            // Create an object to store form data
                // Create a new FileReader
        const reader = new FileReader();

        // Define a function to handle the FileReader onload event
        reader.onload = function(event) {
            // Create an object to store form data

            // add email ( no need to check if it is valid because i will be sending it)
            const formData = {
                email: emailInput.value,
                name: nameInput.value,
                tracking: trackingInput.value,
                image: event.target.result, // Use event.target.result to get the base64 data
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

                // Create and add the loading icon (GIF)
            const loadingIcon = document.createElement("img");
            loadingIcon.setAttribute("class", "loading-gif");
            loadingIcon.setAttribute("src", "/Gifs/LoadingIcon1/loadingicon1.gif"); // Replace 'path/to/your/loading.gif' with the actual path to your GIF file
            loadingIcon.setAttribute("alt", "Loading..."); // Provide an alternative text for accessibility
            loadingIcon.style.width = "50%"; // Adjust the width as needed
            loadingIcon.style.height = "50%"; // Adjust the width as needed
            // Append the loading icon to the loading container
            loadingContainer.appendChild(loadingIcon);

            // Append the loading container to the form container
            formContainer.appendChild(loadingContainer);

            fetch('/sendConfirmationEmail', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
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
                // Handle the error, notify user accordingly
            }); 

        } 
        // Read the image file as a data URL
        reader.readAsDataURL(imageInput.files[0]);
    });
}
export async function getEthereumPrice(element) {
    let retryCount = 0; // Track the number of retries
    const maxRetries = 2; // Maximum number of retries
    const retryInterval = 180000; // Interval between retries in milliseconds (5 seconds)

    function fetchETHPrice() {
        // Make an API request to fetch Ethereum price from CoinGecko
        fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch Ethereum price');
                }
                return response.json();
            })
            .then(data => {
                // Extract Ethereum price from the response
                const ethereumPrice = data.ethereum.usd;
                element.textContent = '$' + '  ' +  ethereumPrice.toFixed(2); // Display the price on the element
                retryCount = 0; // Reset retry count upon successful fetch
            })
            .catch(error => {
                console.error('Error fetching Ethereum price:', error);
                // Retry fetching the data if maximum retries haven't been reached
                // if error is internet connection then put no connection
                 element.textContent = 'error';
                if (retryCount < maxRetries) {
                    retryCount++;
                    setTimeout(fetchETHPrice, retryInterval); // Retry after the specified interval
                }else{
                    fetch('https://api.coincap.io/v2/assets/ethereum')
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Failed to fetch ethereum price from CoinCap');
                            }
                        return response.json();
                        })
                        .then(data => {
                            // Extract Polygon price from the response
                        const ethereumPrice = parseFloat(data.data.priceUsd);
                            element.textContent = '$' + '  ' +  ethereumPrice.toFixed(2); // Display the price on the element
                        })
                        .catch(error => {
                            console.error('Error fetching Polygon price from CoinCap:', error);
                            // Handle further error handling or fallback mechanisms as needed
                            element.textContent = 'error'; // Display error message on the element
                        });
                }
            });
    }

    // Initial fetch of Ethereum price
    fetchETHPrice();

    
    setInterval(fetchETHPrice, 90000);  
}

export async function getBitcoinPrice(element) {
    let retryCount = 0; // Track the number of retries
    const maxRetries = 2; // Maximum number of retries
    const retryInterval = 180000; // Interval between retries in milliseconds (3 minutes)

    function fetchBTCPrice() {
        // Make an API request to fetch Bitcoin price from CoinGecko
        fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch Bitcoin price');
                }
                return response.json();
            })
            .then(data => {
                // Extract Bitcoin price from the response
                const bitcoinPrice = data.bitcoin.usd;
                element.textContent = '$' +  '  ' +  bitcoinPrice.toFixed(2); // Display the price on the element
                retryCount = 0; // Reset retry count upon successful fetch
            })
            .catch(error => {
                console.error('Error fetching Ethereum price:', error);
                    // Retry fetching the data if maximum retries haven't been reached
                    // if error is internet connection then put no connection
                 element.textContent = 'error';
                if (retryCount < maxRetries) {
                    retryCount++;
                    setTimeout(fetchBTCPrice, retryInterval); // Retry after the specified interval
                }else{
                    fetch('https://api.coincap.io/v2/assets/bitcoin')
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Failed to fetch bitcoin price from CoinCap');
                            }
                            return response.json();
                        })
                        .then(data => {
                            // Extract Polygon price from the response
                            const bitcoinPrice = parseFloat(data.data.priceUsd);
                            element.textContent = '$' + '  ' +  bitcoinPrice.toFixed(2); // Display the price on the element
                        })
                        .catch(error => {
                            console.error('Error fetching Polygon price from CoinCap:', error);
                            // Handle further error handling or fallback mechanisms as needed
                            element.textContent = 'error'; // Display error message on the element
                        });      
                }

            });
    }

    // Initial fetch of Bitcoin price
    fetchBTCPrice();

    // Set interval to fetch Bitcoin price every 3 minutes (for testing)
    setInterval(fetchBTCPrice, retryInterval);
}

export async function getShibaInuPrice(element) {
    let retryCount = 0; // Track the number of retries
    const maxRetries = 2; // Maximum number of retries
    const retryInterval = 180000; // Interval between retries in milliseconds (3 minutes)

    function fetchShibaInuPrice() {
        // Make an API request to fetch Shiba Inu price from CoinGecko
        fetch('https://api.coingecko.com/api/v3/simple/price?ids=shiba-inu&vs_currencies=usd')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch Shiba Inu price');
                }
                return response.json();
            })
            .then(data => {
                // Extract Shiba Inu price from the response
                const shibaInuPrice = data['shiba-inu'].usd;
                element.textContent = '$' +  '  ' +  shibaInuPrice.toFixed(6); // Display the price on the element
                retryCount = 0; // Reset retry count upon successful fetch
            })
            .catch(error => {
                console.error('Error fetching Shiba Inu price:', error);
                // Retry fetching the data if maximum retries haven't been reached
                // If error is due to internet connection, display "error"
                element.textContent = 'error';
                if (retryCount < maxRetries) {
                    retryCount++;
                    setTimeout(fetchShibaInuPrice, retryInterval); // Retry after the specified interval
                }
            });
    }

    // Initial fetch of Shiba Inu price
    fetchShibaInuPrice();

    // Set interval to fetch Shiba Inu price every 3 minutes (for testing)
    setInterval(fetchShibaInuPrice, retryInterval);
}
export async function getDogecoinPrice(element) {
    let retryCount = 0; // Track the number of retries
    const maxRetries = 2; // Maximum number of retries
    const retryInterval = 180000; // Interval between retries in milliseconds (3 minutes)

    function fetchDogecoinPrice() {
        // Make an API request to fetch Dogecoin price from CoinGecko
        fetch('https://api.coingecko.com/api/v3/simple/price?ids=dogecoin&vs_currencies=usd')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch Dogecoin price');
                }
                return response.json();
            })
            .then(data => {
                // Extract Dogecoin price from the response
                const dogecoinPrice = data.dogecoin.usd;
                element.textContent = '$' + '  ' +  dogecoinPrice.toFixed(5); // Display the price on the element
                retryCount = 0; // Reset retry count upon successful fetch
            })
            .catch(error => {
                console.error('Error fetching Dogecoin price from CoinGecko:', error);
                // Retry fetching the data if maximum retries haven't been reached
                // if error is internet connection then put no connection
                element.textContent = 'error';

                if (retryCount < maxRetries) {
                    retryCount++;
                     setTimeout(fetchDogecoinPrice, retryInterval); // Retry after the specified interval
                 }else{
                          // Make an API request to fetch Polygon price from CoinCap
                     fetch('https://api.coincap.io/v2/assets/dogecoin')
                         .then(response => {
                             if (!response.ok) {
                                 throw new Error('Failed to fetch Polygon price from CoinCap');
                             }
                             return response.json();
                         })
                         .then(data => {
                             // Extract Polygon price from the response
                             const dogeCoinPrice = parseFloat(data.data.priceUsd);
                             element.textContent = '$' + '  ' +  dogeCoinPrice.toFixed(2); // Display the price on the element
                         })
                         .catch(error => {
                             console.error('Error fetching Polygon price from CoinCap:', error);
                             // Handle further error handling or fallback mechanisms as needed
                             element.textContent = 'error'; // Display error message on the element
                         });
                 }
            });
    }

    // Initial fetch of Dogecoin price
    fetchDogecoinPrice();

    // Set interval to fetch Dogecoin price every 3 minutes (for testing)
    setInterval(fetchDogecoinPrice, retryInterval);
}
export async function getEthereumClassicPrice(element) {
    let retryCount = 0; // Track the number of retries
    const maxRetries = 2; // Maximum number of retries
    const retryInterval = 180000; // Interval between retries in milliseconds (3 minutes)

    function fetchETCPrice() {
        // Make an API request to fetch Ethereum Classic price from CoinGecko
        fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum-classic&vs_currencies=usd')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch Ethereum Classic price');
                }
                return response.json();
            })
            .then(data => {
                // Extract Ethereum Classic price from the response
                const etcPrice = data['ethereum-classic'].usd;
                element.textContent = '$' + etcPrice.toFixed(2); // Display the price on the element
                retryCount = 0; // Reset retry count upon successful fetch
            })
            .catch(error => {
                console.error('Error fetching Ethereum Classic price:', error);
                // Retry fetching the data if maximum retries haven't been reached
                // If error is due to internet connection, display "error"
                element.textContent = 'error';
                if (retryCount < maxRetries) {
                    retryCount++;
                    setTimeout(fetchETCPrice, retryInterval); // Retry after the specified interval
                }else{
                    console.error('Error fetching Ethereum price from CoinGecko:', error);
                    // Retry fetching the data if maximum retries haven't been reached
                    // if error is internet connection then put no connection
                    element.textContent = 'error';

                    if (retryCount < maxRetries) {
                        retryCount++;
                        setTimeout(fetchPolygonPrice, retryInterval); // Retry after the specified interval
                    }else{
                             // Make an API request to fetch Polygon price from CoinCap
                        fetch('https://api.coincap.io/v2/assets/ethereum-classic')
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Failed to fetch Polygon price from CoinCap');
                                }
                                return response.json();
                            })
                            .then(data => {
                                // Extract Polygon price from the response
                                const etcPrice = parseFloat(data.data.priceUsd);
                                element.textContent = '$' + etcPrice.toFixed(2); // Display the price on the element
                            })
                            .catch(error => {
                                console.error('Error fetching Polygon price from CoinCap:', error);
                                // Handle further error handling or fallback mechanisms as needed
                                element.textContent = 'error'; // Display error message on the element
                            });
                    }
                }
            });
    }

    // Initial fetch of Ethereum Classic price
    fetchETCPrice();

    // Set interval to fetch Ethereum Classic price every 3 minutes (for testing)
    setInterval(fetchETCPrice, retryInterval);
}

export async function getPolygonPrice(element) {
    let retryCount = 0; // Track the number of retries
    const maxRetries = 3; // Maximum number of retries
    const retryInterval = 90000; // Interval between retries in milliseconds (3 minutes)

    function fetchPolygonPrice() {
        // Make an API request to fetch Polygon price from CoinGecko
        fetch('https://api.coingecko.com/api/v3/simple/price?ids=polygon&vs_currencies=usd')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch Polygon price');
                }
                return response.json();
            })
            .then(data => {
                // Extract Polygon price from the response
                const polygonPrice = data.polygon.usd;
                element.textContent = '$' + polygonPrice.toFixed(2); // Display the price on the element
                retryCount = 0; // Reset retry count upon successful fetch
            })
            .catch(error => {
                console.error('Error fetching Polygon price from CoinGecko:', error);
                // Retry fetching the data if maximum retries haven't been reached
                // if error is internet connection then put no connection
                element.textContent = 'error';

                if (retryCount < maxRetries) {
                    retryCount++;
                    setTimeout(fetchPolygonPrice, retryInterval); // Retry after the specified interval
                }else{
                         // Make an API request to fetch Polygon price from CoinCap
                    fetch('https://api.coincap.io/v2/assets/polygon')
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Failed to fetch Polygon price from CoinCap');
                            }
                            return response.json();
                        })
                        .then(data => {
                            // Extract Polygon price from the response
                            const polygonPrice = parseFloat(data.data.priceUsd);
                            element.textContent = '$' + polygonPrice.toFixed(2); // Display the price on the element
                        })
                        .catch(error => {
                            console.error('Error fetching Polygon price from CoinCap:', error);
                            // Handle further error handling or fallback mechanisms as needed
                            element.textContent = 'error'; // Display error message on the element
                        });
                }
            });
    }

    // Initial fetch of Polygon price
    fetchPolygonPrice();

    // Set interval to fetch Polygon price every 3 minutes
    setInterval(fetchPolygonPrice, retryInterval); 
}

export function handleResize() {
    //grab current size and check if less than 921 
    if (window.innerWidth < 921 && window.innerWidth >= 675) {
        console.log("Window width = ", window.innerWidth);
        console.log("if 3 rows arent already present, then call with 3 elements");
        // Select the div element
        const gridDiv = document.querySelector('div[style*="grid-template-columns"]');

        if (gridDiv) {
            // Get the value of grid-template-columns
            const gridColumnValue = gridDiv.style.gridTemplateColumns;
            
            // Check if the value contains "repeat(4,"
            if (gridColumnValue.includes("repeat(4,")) {
                console.log("The grid needs to be updated to 3.");
                // grab current grid and remove it
                // remove grid and call with 3 items instead
                // make build grid function so we dont have to remove the header and recall the main function 
                // build smaller function inside paintGrid() to call it will be faster
            } else {
                console.log("The grid has already been updated do nothing.");
            }
        } else {
            console.log("No div element found with grid-template-columns property.");
        }
        //myfunctions.mmakePaintingPage(mypaintingsArray, document.body, 3);
    }else if(window.innerWidth < 675 && window.innerWidth >= 300){
        console.log("remove the grid elements and refire with 2 items");
        console.log("Window width = ", window.innerWidth);
        console.log("if 3 rows arent already present, then call with 3 elements");
        // Select the div element
        const gridDiv = document.querySelector('div[style*="grid-template-columns"]');

        if (gridDiv) {
            // Get the value of grid-template-columns
            const gridColumnValue = gridDiv.style.gridTemplateColumns;
            
            // Check if the value contains "repeat(4,"
            if (gridColumnValue.includes("repeat(3,")) {
                console.log("The grid needs to be updated to 2.");
            } else {
                console.log("The grid does not have 3 columns.");
            }
        } else {
            console.log("No div element found with grid-template-columns property.");
        }
        //myfunctions.makePaintingPage(mypaintingsArray, document.body, 3);
    }
    // Attach event listener for window resize
    window.addEventListener('resize', handleResize);
}

// Function to fetch the Ethereum price in USD from CoinGecko API
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

function addBuyButton(parentDiv, availabe, buttonClassName) {
    // Create buy-button div
    var buyButton = document.createElement("div");
    buyButton.className =  'buy-button' + buttonClassName;
    buyButton.style.position = "fixed";
    buyButton.style.width = "100%";
    buyButton.style.height = "11.8%";
    buyButton.style.bottom = "0";
    buyButton.style.backgroundColor = "lightgrey";
    buyButton.style.display = "flex";
    buyButton.style.alignItems = "center";
    buyButton.style.justifyContent = "center";
    //buyButton.style.borderTopLeftRadius = '2vh'; // Adjust border radius at the top left corner
    //buyButton.style.borderTopRightRadius = '2vh'; // Adjust border radius at the top right corner
    buyButton.style.backgroundColor = 'lightgray';
    buyButton.style.border = "0.1vh solid black"; // Add border
    buyButton.style.fontSize = '1.8vh';
    // add class ID equivelennt to ID in DB 

    // Create text node for "purchase"
    if(availabe){
        var buttonText = document.createTextNode("Purchase");
    }else{
        var buttonText = document.createTextNode("Unavailable");
    }
   
    buyButton.appendChild(buttonText);

    // Add buy-button div to parent div
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
                // Create the form
                const form = document.createElement("form");
                form.className = "purchase-form";
                // reset id to painting name below 
                // Apply styles to form
                form.style.display = "flex";
                form.style.flexDirection = "column"; // Align inputs vertically
                form.style.alignItems = "center"; // Center inputs horizontally
                form.style.gap = "2px"; // Add space between inputs
                form.style.width = "100%";
                form.style.height = '80%';
                form.style.top = '10%';
                form.style.position = 'absolute';

                // Create the title div
                const titleDiv = document.createElement("div");
                titleDiv.className = "title";
                titleDiv.innerText = "Purchase" + "  " + " " + currentname;// put name here 
                titleDiv.style.fontWeight = "bold";
                titleDiv.style.textAlign = "center";
                titleDiv.style.fontSize = '2vh';

                // Create the inputs
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

                // Create the submit button
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
                                // comment 4970 and uncomment 5004 when sending real purchase
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
                                        // to to make loading icon inside and remove if successful or bad input 
                                        // can make after validateUserInfo
                                        // need to restrict fecthes on server side 
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

                                                    // Create and add the loading icon (GIF)
                                                const loadingIcon = document.createElement("img");
                                                loadingIcon.setAttribute("class", "loading-gif");
                                                loadingIcon.setAttribute("src", "/Gifs/LoadingIcon1/loadingicon1.gif"); // Replace 'path/to/your/loading.gif' with the actual path to your GIF file
                                                loadingIcon.setAttribute("alt", "Loading..."); // Provide an alternative text for accessibility
                                                loadingIcon.style.width = "50%"; // Adjust the width as needed
                                                loadingIcon.style.height = "50%"; // Adjust the width as needed
                                                // Append the loading icon to the loading container
                                                loadingContainer.appendChild(loadingIcon);

                                                // Append the loading container to the form container
                                                formContainer.appendChild(loadingContainer);

                                                try{
                                                    const amountToSendString = parentDiv.className.replace("grid-item", ""); // Removes "grid-item" from the string
                                                    const amountToSendFloat = parseFloat(amountToSendString);

                                                    const conversionFactor = calculateConversionFactor(amountToSendFloat);

                                                    console.log('the conversion factor is', conversionFactor);
                                                    // try to find this one if it fails use the other function 

                                                    if(conversionFactor != null){
                                                        // Request account access if needed
                                                        transactionInProgress = true;
                                                        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                                                        const userWallet = accounts[0];
                                                        const recipientWallet = RoysWallet; 
                                                        const weiParameter = amountToSendFloat*conversionFactor;
                                                        const desiredDecimalPlaces = 7; // Variable for desired decimal places

                                                        // Convert to string to count decimal places
                                                        let weiParameterStr = weiParameter.toString();
                                                        let decimalIndex = weiParameterStr.indexOf('.');

                                                        if (decimalIndex !== -1) {
                                                          let decimalPlaces = weiParameterStr.length - decimalIndex - 1;

                                                          if (decimalPlaces > desiredDecimalPlaces) {
                                                            // Limit to 6 decimal places
                                                            weiParameterStr = weiParameterStr.slice(0, decimalIndex + desiredDecimalPlaces + 1);
                                                          }
                                                        }

                                                        // Convert back to number
                                                        const finalWeiParameter = parseFloat(weiParameterStr);

                                                        const amountInWei = web3.utils.toWei(finalWeiParameter.toString(), 'ether') // Convert amount to wei
                                                        // Construct the transaction object

                                                        const transactionObject = {
                                                            from: userWallet, // deprecated in firefox window.ethereum.selectedAddress,
                                                            to: recipientWallet,
                                                            value: amountInWei
                                                        };
                                                        console.log('trying to send', amountToSendFloat);
                                                        console.log('in WEI', amountInWei);

                                                        // Send the transaction using MetaMask
                                                        const response = await window.ethereum.request({
                                                            method: 'eth_sendTransaction',
                                                            params: [transactionObject]
                                                        });

                                                        if(response.error){
                                                            console.log('an error occured', response.error.message);
                                                        }else if(response.result){
                                                            console.log(response.result);
                                                            console.log('User accepeted the transaction send the hash over to check on server');

                                                            // Prepare data to send to the server
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
                                                                        return response.json(); // Return the promise returned by response.json()
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
                                                                    // Handle the error, notify user accordingly
                                                                });
                                                        }else{
                                                            submitButtonIsClicked = false;
                                                            transactionInProgress = false;
                                                            console.log('an unexpected error occured');
                                                        }

                                                        //console.log('Transaction sent successfully!');
                                                        submitButtonIsClicked = false;
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
                                                                   // added a value but dont warn the user
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
                                                    // Handle errors, such as insufficient balance or user rejection
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
                                            // should never be called if code runs correctly 
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
                                    //alert('maximum number of attempts have been processed please check back in 48 hours');
                                    warningMaxTransactionProcessed();
                                }else if (firstChecker.code == 232111119 ) {
                                    //alert('maximum number of attempts have been processed please check back in 48 hours');
                                    console.log('Item is out of Stock');
                                }else if (firstChecker.code == 6477665555) {
                                    //alert('maximum number of attempts have been processed please check back in 48 hours');
                                    console.log('Cannot Find item in Db maybe the server is down');
                                }                                
                                submitButtonIsClicked = false;
                                // send back error code
                            }
                        })
                        .catch(error => {
                            console.error('Error getting first check from server', error);
                        });
                        
                                        
                    }                
                    
                }); 
                    // Create the cancel button
                    const cancelButton = document.createElement("div");
                    cancelButton.className = "cancelEmail-button";
                    cancelButton.innerText = "X";
                    cancelButton.style.cursor = "pointer";
                    cancelButton.style.position = "absolute"; // Change position to absolute
                    cancelButton.style.top = "0";
                    cancelButton.style.right = "0";
                    cancelButton.style.width = "8vh"; // Adjust width as needed
                    cancelButton.style.height = "10vh"; // Adjust height as needed
                    cancelButton.style.backgroundColor = "none"; // Add red background color
                    cancelButton.style.fontSize = "2vh"; // Adjust font size as needed
                    cancelButton.style.display = "flex"; // Use flexbox
                    cancelButton.style.justifyContent = "center"; // Center content horizontally
                    cancelButton.style.alignItems = "center"; // Center content vertically

                    // Add event listener to cancel button
                    cancelButton.addEventListener("click", function() {
                        // Remove the form from the document
                        document.body.removeChild(formContainer);
                        currentlyTryingToBuy = false;
                    });

                    // Append elements to the form
                    form.appendChild(emailInput);
                    form.appendChild(addressInput);
                    form.appendChild(firstNameInput);
                    form.appendChild(lastNameInput);
                    form.appendChild(submitButton);

                    // Append form elements to form container
                    formContainer.appendChild(titleDiv);
                    formContainer.appendChild(form);
                    formContainer.appendChild(cancelButton);

                    // Append form container to document body
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
       
        // prompt user the it is not avialable
    }
}
function  warningMaxTransactionProcessed(){
        // Create modal elements
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

    // Append elements
    modalContent.appendChild(closeDiv);
    modalContent.appendChild(messageParagraph);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Apply CSS
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
        // Remove the modal from the document
        modal.parentNode.removeChild(modal);
    });

}
function warningTransactionPresent() {
    // Create modal elements
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

    // Append elements
    modalContent.appendChild(closeDiv);
    modalContent.appendChild(messageParagraph);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Apply CSS
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
        // Remove the modal from the document
        modal.parentNode.removeChild(modal);
    });

}


function writeToParentDivWithDelay(text, parentDiv, delay) {

    const repsonseContainer = document.createElement('div');
    repsonseContainer.style.height = 'auto';
    repsonseContainer.style.width = '100%';
    //repsonseContainer.style.position = 'absolute';
    repsonseContainer.style.opacity = '0.73';
    repsonseContainer.style.borderBottom = '0.2vh solid lightgrey';
    //repsonseContainer.style.boxSizing = 'border-box';
    repsonseContainer.style.overflowY = 'scroll';
    repsonseContainer.style.marginBottom = '40px';

    parentDiv.appendChild(repsonseContainer);

    let index = 0;
    const intervalId = setInterval(() => {
        if (index < text.length) {
            repsonseContainer.textContent += text[index];
            index++;
        } else {
            clearInterval(intervalId); // Stop the interval when all characters are appended
        }
    }, delay);

}

// Define getResponse as an asynchronous function
async function getResponse(question) {
    // Simulate an asynchronous operation that takes time
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate 2 seconds delay

    // Convert the question to lowercase for case-insensitive matching
    const lowercaseQuestion = question.toLowerCase();

    try{
        const response = await fetch('/AI-event', {
            method: 'POST', // or 'GET' depending on your server setup
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ question: lowercaseQuestion })
        });

            // Check if the response is successful

            if (!response.ok) {
                console.log('response is not okay');
                return null;
            }else{
                // Parse the JSON response
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
    // Remove all children elements of the form container
    while (formContainer.firstChild) {
        formContainer.removeChild(formContainer.firstChild);
    }

    // Create the container
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
    container.style.position = 'relative'; // Position relative for children positioning
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';
    container.style.backgroundColor = 'lightgray';

        // Add header with Burson-Skull image
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
    header.style.backgroundSize = 'cover'; // Optional: Adjust the size of the background image
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
    exitPurchaseButton.textContent = '❌'; // X emoji
    exitPurchaseButton.style.fontSize = '2vh'; // Adjust font size
    exitPurchaseButton.style.border = 'none'; // Remove border for a cleaner look
    exitPurchaseButton.style.cursor = 'pointer'; // Change cursor to pointer on hover

    exitPurchaseButton.addEventListener('click', function() {
        console.log('trying to remove form');
        formContainer.remove();
    });

  // Add centered container with background image
    const centeredDiv = document.createElement('div');
    centeredDiv.style.backgroundImage = `url(${productImageBase64})`;
    centeredDiv.style.backgroundSize = 'cover'; // Optional: Adjust the size of the background image
    //imageContainer.style.backgroundSize = 'cover';
    centeredDiv.style.width = '14vh';
    centeredDiv.style.height = '14vh';
    centeredDiv.style.borderRadius = '5px';
    centeredDiv.style.zIndex = '1'; // Ensure it's above other elements
    centeredDiv.style.position = 'absolute'; // Position relative for children positioning
    centeredDiv.style.top = '10%'; // Adjust position as needed
    centeredDiv.style.left = '28%';
    centeredDiv.style.marginBottom = '2px';
    centeredDiv.style.backgroundRepeat = 'no-repeat';
    centeredDiv.style.backgroundPosition = 'center'; 
    centeredDiv.style.borderRadius = '.2vh';
    centeredDiv.style.border = '1px solid #ccc';
    centeredDiv.style.borderRadius = '5px';
    container.appendChild(centeredDiv);

    // Add message
    const message = document.createElement('div');
    message.className = 'message';
    message.style.position = 'absolute'; // Position relative for children positioning
    message.style.fontSize = '1.8vh';
    message.style.width = '75%';
    message.style.marginTop = '10px'; // Adjust margin to separate from the image
    message.style.textAlign = 'left';
    message.style.backgroundColor = 'none';
    //message.style.height = '4%';
    message.style.bottom = '0%';
    message.style.top = '37%';
    message.style.left = '12.5%';
    message.style.height = '60%';
    message.style.overflow = 'scroll';

    // Add scrollbar track styling
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
    console.log('trying to make new grid!');
        array.forEach(item => {
        // if viewport is computer fix heigh 
        // otherwise set to relative
        var gridItem = document.createElement('div');
        gridItem.classList.add('grid-item'+item.price.$numberDecimal.toString());// set class 
        gridItem.setAttribute('id', item._id);// set ID
        gridItem.textContent = item; // Set the content of the grid item
        gridItem.style.position = 'relative'; // Position relative for absolute positioning of overlay

        // Apply styles for grid item
        gridItem.style.backgroundColor = '#aaaaaa'; // Set background color for grid item
        gridItem.style.width = '95%'; 
        gridItem.style.left = '2.5%'; 
        gridItem.style.height = '94%'; // Set height of grid item to fill the container
        gridItem.style.top = '3%';
        gridItem.style.display = 'flex';
        gridItem.style.justifyContent = 'center';
        gridItem.style.alignItems = 'center';
        gridItem.style.setProperty('border-radius', '10px', 'important'); // Round corners
        //gridItem.style.boxShadow = '0px 0.8px 5px rgba(0, 0, 0.5, 0.5)'; /* Adding shadow */
        gridItem.style.boxShadow =  '0px 2px 4px rgba(0, 0, 0, 0.7)'; /* Adjust values for your shadow */
        removeString(gridItem, "[object Object]");
        //removeString(gridItem, " ");
        // need to resize image before uplaoding
        //gridItem.style.backgroundImage = 'url("/images/napolean.jpg")';// convert to 600x500 pixels
        gridItem.style.backgroundImage = `url("${item.image}")`;// convert to 600x500 pixels
        gridItem.style.backgroundSize = 'cover'; // Optional: Adjust the size of the background image
        gridItem.style.backgroundRepeat = 'no-repeat';
        gridItem.style.backgroundPosition = 'center'; 
        gridItem.style.backgroundSize = '90% 100%'; // Decreases the width of the background image to 80% of its original size
        // Set height of the grid item
        //gridItem.style.height = '25vh';

        //parentElement.style.backgroundColor = 'dimgray';
        //parentElement.style.backgroundImage = 'url(/images/metalback2.png)';
        //parentElement.style.backgroundSize = 'cover'; 

        // Create a transparent overlay 
        var overlay = document.createElement('div');
        overlay.classList.add('overlay');
        // Style the overlay
        overlay.style.position = 'absolute';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.top = 0;
        overlay.style.left = 0;
        overlay.style.setProperty('border-radius', '10px', 'important'); // Round corners
        overlay.style.backgroundColor = 'dimgray'; // Semi-transparent blue background
        overlay.style.display = 'none'; // Initially hide the overlay
        overlay.style.flexDirection = 'column'; // Stack buttons vertically
        overlay.style.justifyContent = 'flex-end'; // Align buttons to the bottom
        overlay.style.opacity = '.6';

        // add back button to header and reload main website url when clicked

        gridItem.addEventListener('mouseenter', async function() {

            gridItem.style.transform = 'translateY(-5px)';
            // Show the overlay on hover
            overlay.style.display = 'flex';

            // get inStock from currentPaintingArray
            var checkIfInStock = null;
            for(const myObj of currentPaintingArray){
                if(myObj._id == gridItem.id){
                    checkIfInStock = myObj.inStock;
                }else{
                    //checkIfInStock = false;   
                }
            }

            addBuyButton(gridItem, checkIfInStock, gridItem.id);
            // Create a p element for description

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
                    descriptionP.innerHTML =  'Name:' + "    " + painting.name + '<br>'  + 'Approximated Price:' + "    " + painting.price.$numberDecimal + " ETH " +   '<br> <br>' +  painting.description;
                }
            }
            overlay.appendChild(descriptionP);

            // get their Ip adress and only allow 1 time person 
            // add the gridItemnumber and ip to array called viewedPainintgs

            // check if currentViewedPaintings contains {paintingId: gridItem.id}
            // do not send if it contains it 


            // Check if the currentViewedPaintings array contains an item with the given paintingId
            const containsPaintingId = currentViewedPaintings.some(item => item.paintingId === gridItem.id);

            // If the paintingId is not already in the array, push it
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
                           // added a value but dont warn the user
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
                // user has already clicked it while on the website
            }



        });
        gridItem.addEventListener('mouseleave', function() {
            // Restore the original position on mouse leave
            gridItem.style.transform = 'translateY(0)';
            // Hide the overlay on mouse leave
            overlay.style.display = 'none'; 
            const buyButton = document.querySelector('.buy-button' + gridItem.id.toString());
            const descriptionP = document.querySelector('.descriptionPaintingPTAG');
            if (buyButton) {
                buyButton.remove();
                descriptionP.remove();
            } else {
                console.error('Buy button not found');
            }
            //buyButton.style.display = 'hidden';
            //document.remove(buyButton);
            //gridItem.removeChild(buyButton);
        });

        // Append the overlay to the grid item
        gridItem.appendChild(overlay);

        // Append the grid item to the grid container
        grid.appendChild(gridItem);
    });

}

async function organizePaintingArrayByMostRecent(array) {
     // Sort the array by dateCreated attribute in descending order
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



        // Compare dates
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


