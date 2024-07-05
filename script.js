// Date initialized: March 20 2024
// Author: Roy Burson 
// Purpose: Selling painting via crytpo, NFTs on seperate contract, math research, ... etc   


// Non-Global variables
import * as myfunctions from './myfunctions.js';

const paintingElement = document.querySelector('.Physical_art');
const updatesElements = document.querySelector('.Upcoming_events'); 
const digitalElement = document.querySelector('.Digitial_art'); 
const mathElement = document.querySelector('.Math_research'); 
export const gridNavigator = document.querySelector('.Navigation_section'); 
const header = document.querySelector('.Header'); 

//   notes 
//1) need to fix server response for RoulsResponse (train from database) and possible socket names acting funny
//2) start NFT section. Make contract, read from contract, add ability to interact with contract
//3) keep track of number of fetches per IP adress in time interval to limite request to DB\


// global variables
window.GridWidth = '65%';
window.gridItemWidth = '95%';
window.rowWidth = '25%';
window.sideElementsWidthPercent = '15%'; 
window.paintingDivOverlay = false; 
window.NFTDivOverlay = false;     
window.mathOverlay = false; 
window.updatesOverlay = false;
window.isConnected = false;
window.didGridChange = false;
window.transactionInProgress = false;
window.paintingClicked = false;
window.currentPaintingArray = [];
window.currentPurchaseArray = [];
window.currentViewedPaintings = [];
window.currentNFTArray = [];
// Define the ABI of your contract
window.contractAddress = '0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8';
window.BursonSkullzContractAbi = [];


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

    myfunctions.addPaintingElementListener(paintingElement).then(()=>{
        console.log('we added the listener to the painting element');
    });
    myfunctions.addDigitalElementListener(digitalElement).then(()=>{
        console.log('we added the listener to the digital element');
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


