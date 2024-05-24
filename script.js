// Date initialized: March 20 2024
// Author: Roy Burson 
// Purpose: Selling painting via crytpo, NFTs on seperate contract, math lectures, ... etc   


// Non-Global variables
import * as myfunctions from './myfunctions.js';

const paintingElement = document.querySelector('.Physical_art');
const updatesElements = document.querySelector('.Upcoming_events'); 
const digitalElement = document.querySelector('.Digitial_art'); 
const mathElement = document.querySelector('.Math_research'); 
export const gridNavigator = document.querySelector('.Navigation_section'); 
const header = document.querySelector('.Header'); 
var contractAddress = "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D"; // example change to Burson Skullz when finished
var sideElementsWidthPercent = '15%'; 
var GridWidth = '65%';
var gridItemWidth = '95%';
var rowWidth = '25%';
//var providerURL = "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID";
// node to call functions on contract 
//Infura provides a service that allows you to interact with the Ethereum blockchain without running your own Ethereum node



//   notes 
//1) need to fix server response for RoulsResponse 
//2) need to fix other div elements 
//3) test mobile on Jasmine or Mocha 
//4) use notes to upload to digital ocean or AWS 


// global variables
window.paintingDivOverlay = false; 
window.NFTDivOverlay = false;     
window.mathOverlay = false; 
window.updatesOverlay = false;
window.isConnected = false;
window.didGridChange = false;
window.transactionInProgress = false;
window.currentPaintingArray = [];
window.currentPurchaseArray = [];
window.currentViewedPaintings = [];

window.paintingClicked = false;

window.myCurrentClick = {
    // empty object we fill in later to pass into function 
    // this be current object attached to
};


document.addEventListener('DOMContentLoaded', function(){

    myfunctions.checkifConnected().then(() => {
        if(!isConnected){ 
            const thisConnectBUtton =  document.querySelector(".connect-button");

            if(thisConnectBUtton){
                thisConnectBUtton.addEventListener("click", async function() {
                     myfunctions.makeConnection(); 
                     myfunctions.addMetaMaskListener();
                    //myfunctions.addCoinbaseListener();
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

    const greenLight = document.querySelector('.green-light');

    if(greenLight){
        if(window.innerWidth <= 1300 && window.innerWidth >= 919 ){
            greenLight.style.right = '21vh';
        }else if(window.innerWidth <= 920 && window.innerWidth >= 820 ){
            greenLight.style.right = '19.5vh';
        }else if(window.innerWidth <= 819 && window.innerWidth >= 710 ){
            greenLight.style.right = '18.5vh';
        }else if(window.innerWidth <= 709 && window.innerWidth >= 610 ){
            greenLight.style.right = '17.3vh';
        }else if(window.innerWidth <= 609 && window.innerWidth >= 431 ){
            greenLight.style.right = '16vh';
        }else if(window.innerWidth <= 499 && window.innerWidth >= 350){
           greenLight.style.display = 'none';
        }else if(window.innerWidth <= 349) {
            window.location.href = 'unsupported.html'; 
        }
    }


    paintingElement.addEventListener('click',  function() { 

        if(!paintingClicked){
            paintingClicked = true;
            ////////////////////////////////////DO NOT REMOVE FOR DEV/////////////////////////////////////////////////
            // add loading animation to the left side of screen
            // send request to server to get paintings and save as mypaintingsArray
            // may need to send 1 at  time to ensure the user doesnt get overloaded once it reaches say 10,000 items 
            // when user recieved all paintings remove animation and call lines 67-79
            ////////////////////////////////////DO NOT REMOVE FOR DEV/////////////////////////////////////////////////

            myfunctions.painting_section_click(paintingElement)
              .then(() => {
                setTimeout(async () => { 
                    if(window.innerWidth >= 1301 ){
                        sideElementsWidthPercent = '15%'; 
                        GridWidth = '65%';
                        gridItemWidth = '100%';
                        rowWidth = '10%';

                        if(currentPaintingArray.length >= 24){
                            myfunctions.makePaintingPage(currentPaintingArray.slice(0,24), currentPurchaseArray,  document.body, 4, sideElementsWidthPercent, GridWidth, gridItemWidth);
                        }else{
                             myfunctions.makePaintingPage(currentPaintingArray, currentPurchaseArray,  document.body, 4, sideElementsWidthPercent, GridWidth, gridItemWidth);
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
                            myfunctions.makePaintingPage(currentPaintingArray.slice(0,24), currentPurchaseArray,  document.body, 4, sideElementsWidthPercent, GridWidth, gridItemWidth);
                        }else{
                             myfunctions.makePaintingPage(currentPaintingArray, currentPurchaseArray,  document.body, 4, sideElementsWidthPercent, GridWidth, gridItemWidth);
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
                            myfunctions.makePaintingPage(currentPaintingArray.slice(0,24), currentPurchaseArray,  document.body, 3, sideElementsWidthPercent, GridWidth, gridItemWidth);
                        }else{
                             myfunctions.makePaintingPage(currentPaintingArray, currentPurchaseArray,  document.body, 3, sideElementsWidthPercent, GridWidth, gridItemWidth);
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
                            myfunctions.makePaintingPage(currentPaintingArray.slice(0,24), currentPurchaseArray,  document.body, 2, sideElementsWidthPercent, GridWidth, gridItemWidth);
                        }else{
                             myfunctions.makePaintingPage(currentPaintingArray, currentPurchaseArray,  document.body, 2, sideElementsWidthPercent, GridWidth, gridItemWidth);
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
                            myfunctions.makePaintingPage(currentPaintingArray.slice(0,24), currentPurchaseArray,  document.body, 2, sideElementsWidthPercent, GridWidth, gridItemWidth);
                        }else{
                             myfunctions.makePaintingPage(currentPaintingArray, currentPurchaseArray,  document.body, 2, sideElementsWidthPercent, GridWidth, gridItemWidth);
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

                    //myfunctions.handleResize(); // get working before uplading code 
                    gridNavigator.style.display = 'none';

                    let msgHisotry = await myfunctions.getMessageHistory();

                    for(const element of msgHisotry){
                        myfunctions.addMessage(element.msg, element.username, element.time);
                    }

                }, 101); 
              })
              .catch((error) => {
                // Handle any errors that occurred during the asynchronous operation
                console.error('Error:', error);
              });
            //myfunctions.painting_section_click(paintingElement); // have this function return all the paintings in

            // const mypaintingsArray  = myfunctions.painting_section_click(paintingElement);
            //paintingClicked = false;
        }else{
            console.log('we already clicked the painting section');
        }
    }); 



    digitalElement.addEventListener('click', function() {
        if(!NFTDivOverlay){
            NFTDivOverlay = true;
            myfunctions.nft_section_click(digitalElement);
            
        }
    }); 



    mathElement.addEventListener('click', function() {
        if(!mathOverlay){
            mathOverlay = true;
            myfunctions.math_section_click(mathElement);
            
        }
    }); 



    updatesElements.addEventListener('click', function() {
        if(!updatesOverlay){
            mathOverlay = true;
            myfunctions.upcoming_section_click(updatesElements);
        }
    }); 



});


