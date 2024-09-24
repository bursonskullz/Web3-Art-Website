# Web3-Art-Website

1. First, create a free mongoose Database, gather a Google Maps API key, a google app passcode under the google apps section (you may need to enable two factor authentication), a business email, and a private code only you have access to, as well as an Merriam webstter dictionary APi key and a OPENAI API key. 

2. Change the constants in the `server.js` file:

    ```javascript
    const paintingUploadCode = 'Painting-code-here!';
    const appPasscode = 'google-app-passcode-here';
    const buisnessEmial = 'your-buisiness-email@gmail.com';
    const dbURL = 'your-mongoose-db-string';
    const googleAPIKEY = 'your-google-api-maps-key';
    const MERRIAM_WEBSTER_API_KEY = 'YOUR-WEBSTER_API_KEY';
    const OPENAI_API_KEY = 'YOUR-OPENAI-API-KEY;
    const addNFTCollectionDataPasscode = 'your-passcode-to-add-nfts';
    const deployableContractPasscode = 'passcode-to-deploy-contract';
    ```

3. Change Roy's wallet address to your wallet address in the `myfunction.js` file (it must be a MetaMask wallet for time being):

    ```javascript
    const RoysWallet = '0x5cdad7876270364242ade65e8e84655b53398b76';
    ```

4. Install necessary packages using the terminal command:

    ```bash
    npm install
    ```

5. Make sure Node.js is installed. You can check by running:

    ```bash
    node -v
    ```

6. Compile the server in your same directory as the code:

    ```bash
    node server.js
    ```

7. Navigate to the localhost URL to view the code http://localhost:27015/ or associated port number.

8. Add artwork using the add button at the top right or manually in the database.

9. After uploading an efficient amount of artwork, you can connect to a domain and server provider like Digital Ocean.

10. Do not claim ownership of the code as it is under an MIT license.

11. Give attribution and credit to the creator.
