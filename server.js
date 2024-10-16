// Name: Roy Burson 
// Date last modified: 10-16-24
// purpose: Make web3 art website to coincide with research related life

const maxNumberOfAIEventsPerClient = 100;
const max_array_length = 3294967295;
var localAIUsers = [];
let attemptedClients = [];
let globalPurchaseTimerArray = [];
let AIEventTimers = [];
var timerIsAlreadyCalled = false;
var userAIQuestions = [];
var previousQuestion0 = [];
var previousQuestion1 = [];
let uniqueChars = [];
let uniqueChars2 = [];
let uniqueChars3 = [];
let uniqueCharsInverse = [];
let uniqueChars2Inverse = [];
let globalSpiralData = [];
let stringChunk = '';
let soliditychunk;

let Series2Holders = ["0x21331", "0x1122222"];
let Series1Holders = []; 

const http = require('http');
const fs = require('fs');
const path = require('path');
const socketIo = require('socket.io');
const cluster = require('cluster');
const os = require('os');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const puppeteer = require('puppeteer');
const zlib = require('zlib');
var inlineBase64 = require('nodemailer-plugin-inline-base64');
const bodyParser = require('body-parser');
const axios = require('axios');
const OpenAI = require('openai');
const solc = require('solc');

require('dotenv').config();
const paintCollectionString = 'Painting';
const purchasesCollectionString = 'Purchase';
const commissionCollectionString = 'Commission';
const bursonSkullzModelString = 'Burson Skullz';
const contractCollectionString = 'NFT Contracts';
const reportString = 'Reports Filed';

const paintingUploadCode = 'Painting-code-here!';
const appPasscode = 'google-app-passcode-here';
const buisnessEmial = 'your-buisiness-email@gmail.com';
const dbURL = 'your-mongoose-db-string';
const googleAPIKEY = 'your-google-api-maps-key';
const MERRIAM_WEBSTER_API_KEY = 'YOUR-WEBSTER_API_KEY';
const OPENAI_API_KEY = 'YOUR-OPENAI-API-KEY;
const addNFTCollectionDataPasscode = 'your-passcode-to-add-nfts';
const deployableContractPasscode = 'passcode-to-deploy-contract';

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const myDomain = undefined;
const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
});

const paintingSchema = new mongoose.Schema({
    image: String,
    name: String,
    dateCreated: Date,
    inStock: Boolean,
    artist: String,
    description: String,
    legalContract: String,
    price: {type: mongoose.Types.Decimal128},
    dateSold: { type: Date, default: null },
    dateUploaded: { type: Date, default: Date.now }, 
    views: {type: Number, default: 0}
}); 

const purchaseSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    address: String,
    datePurchased: Date,
    legalContract: String,
    transactionHash: String,
    price: {type:mongoose.Types.Decimal128}, 
    productID: String, 
    productIMG: String
}); 


const commissionSchema = new mongoose.Schema({
    address: String,
    artworkMedium: String,
    artworkSize:String,
    artworkTitle:String,
    comments:String,
    details:String,
    email:String,
    firstName:String,
    lastName:String,
    phone:String,
    ipAddress: String,
    isActive: Boolean
});

const tokenSchema = new mongoose.Schema({
    contractName: String,
    contractAddress: String,
    tokenID:  Number, 
    image: String
}); 

const collectionSchema = new mongoose.Schema({
    contractName: { type: String, required: true },
    ERCStandard: { type: String, required: true },  
    contractAddress: { type: String, required: true },
    contractABI: { type: String, required: true },
    collectionBackgroundImage: String
});

const reportSchema = new mongoose.Schema({
    clientWallet: String,
    ipAddress: String,
    contractName: String,
    ERCStandard: String,
    tokenID: String,
    email: String,
    message: String
}); 

const paintingModel = mongoose.model(paintCollectionString, paintingSchema); 
const purchaseModel = mongoose.model(purchasesCollectionString, purchaseSchema); 
const commissionModel = mongoose.model(commissionCollectionString, commissionSchema); 
const collectionModel = mongoose.model(contractCollectionString, collectionSchema); 
const reportModel = mongoose.model(reportString, reportSchema); 


const basicDefinitions = ['to', 'from', 'why', 'his', 'her', 'this','dad', 'mom',
  'and', 'the', 'a', 'an', 'in', 'on', 'at', 'with', 'he', 'she',
  'it', 'we', 'they', 'you', 'I', 'me', 'us', 'them', 'my', 'your',
  'our', 'their', 'who', 'what', 'when', 'where', 'how', 'can', 'will',
  'would', 'could', 'should', 'do', 'did', 'does', 'is', 'are', 'was',
  'were', 'be', 'being', 'been', 'have', 'has', 'had', 'not', 'no',
  'yes', 'please', 'thank', 'good', 'bad', 'up', 'down', 'left', 'right',
  'day', 'night', 'now', 'then', 'soon', 'later', 'before', 'after',
  'come', 'go', 'see', 'look', 'watch', 'listen', 'hear', 'speak',
  'say', 'tell', 'ask', 'answer', 'think', 'know', 'understand',
  'want', 'need', 'like', 'love', 'hate', 'find', 'get', 'give', 'make',
  'take', 'use', 'work', 'play', 'run', 'walk', 'eat', 'drink', 'sleep',
  'read', 'write', 'open', 'close', 'start', 'stop', 'begin', 'end',
  'big', 'small', 'large', 'tiny', 'huge', 'fast', 'slow', 'quick', 'easy',
  'hard', 'difficult', 'simple', 'complicated', 'good', 'bad', 'beautiful',
  'ugly', 'pretty', 'handsome', 'ugly', 'nice', 'mean', 'kind', 'friendly',
  'happy', 'sad', 'angry', 'excited', 'bored', 'tired', 'hungry', 'thirsty',
  'hot', 'cold', 'warm', 'cool', 'bright', 'dark', 'light', 'heavy', 'strong',
  'weak', 'healthy', 'sick', 'safe', 'dangerous', 'clean', 'dirty', 'fresh',
  'stale', 'loud', 'quiet', 'silent', 'noisy', 'rich', 'poor', 'expensive',
  'cheap', 'free', 'busy', 'calm', 'peaceful', 'violent', 'dangerous', 'safe',
  'open', 'closed', 'empty', 'full', 'sharp', 'dull', 'straight', 'curved',
  'round', 'square', 'triangular', 'circular', 'oval', 'regular', 'irregular',
  'smooth', 'rough', 'soft', 'hard', 'wet', 'dry', 'liquid', 'solid', 'gas',
  'visible', 'invisible', 'clear', 'cloudy', 'foggy', 'sunny', 'rainy', 'windy',
  'stormy', 'thunderous', 'bright', 'dark', 'day', 'night', 'morning', 'afternoon',
  'evening', 'night', 'yesterday', 'today', 'tomorrow', 'next', 'last', 'first',
  'second', 'third', 'final', 'early', 'late', 'soon', 'now', 'immediately', 'suddenly',
  'gradually', 'quickly', 'slowly', 'carefully', 'recklessly', 'happily', 'sadly',
  'angrily', 'patiently', 'impatiently', 'politely', 'rudely', 'kindly', 'cruelly',
  'freely', 'easily', 'difficultly', 'hardly', 'mostly', 'partly', 'completely',
  'exactly', 'approximately', 'precisely', 'perfectly', 'properly', 'wrongly', 'rightly',
  'fairly', 'unfairly', 'justly', 'unjustly', 'clearly', 'vaguely', 'directly',
  'indirectly', 'locally', 'globally', 'nationally', 'internationally', 'publicly',
  'privately', 'officially', 'unofficially', 'formally', 'informally', 'technically',
  'casually', 'seriously', 'sincerely', 'formally', 'politically', 'religiously',
  'spiritually', 'scientifically', 'philosophically', 'historically', 'culturally',
  'socially', 'economically', 'emotionally', 'mentally', 'physically', 'personally',
  'professionally', 'financially', 'legally', 'illegally', 'morally', 'immorally',
  'ethically', 'unethically', 'safely', 'unsafely', 'effectively', 'ineffectively',
  'efficiently', 'inefficiently', 'successfully', 'unsuccessfully', 'randomly',
  'regularly', 'frequently', 'rarely', 'occasionally', 'periodically', 'continuously',
  'constantly', 'consistently', 'often', 'seldom', 'hardly', 'scarcely', 'barely',
  'virtually', 'literally', 'figuratively', 'truly', 'really', 'apparently', 'seemingly',
  'obviously', 'clearly', 'apparently', 'reportedly', 'allegedly', 'presumably', 'supposedly',
  'hopefully', 'thankfully', 'fortunately', 'unfortunately', 'sadly', 'luckily', 'coincidentally',
  'strangely', 'oddly', 'weirdly', 'curiously', 'interestingly', 'amazingly', 'astonishingly',
  'incredibly', 'surprisingly', 'shockingly', 'unbelievably', 'honestly', 'frankly', 'truly',
  'sincerely', 'genuinely', 'earnestly', 'faithfully', 'trustworthily', 'loyally', 'disloyally',
  'faithlessly', 'honorably', 'dishonorably', 'disgracefully', 'shamefully', 'blatantly',
  'brazenly', 'openly', 'publicly', 'privately', 'secretly', 'covertly', 'stealthily',
  'furtively', 'sneakily', 'slyly', 'craftily', 'deviously', 'diplomatically', 'tactfully',
  'delicately', 'sensitively', 'respectfully', 'disrespectfully', 'casually', 'informally',
  'easily', 'quickly'];

const helloPhrases = [
    "hello", 
    "hi", 
    "hey", 
    "howdy", 
    "greetings", 
    "good day", 
    "salutations", 
    "hola", 
    "bonjour", 
    "ciao", 
    "hallo", 
    "aloha", 
    "namaste", 
    "sup", 
    "yo", 
    "what's up", 
    "hiya", 
    "good morning", 
    "good afternoon", 
    "good evening", 
    "welcome", 
    "how's it going", 
    "nice to see you", 
    "pleased to meet you", 
    "how are you doing", 
    "how do you do", 
    "how's everything", 
    "how's life", 
    "how are things", 
    "how's your day", 
    "what's new", 
    "how's your day going", 
    "how's your day been", 
    "long time no see", 
    "how have you been", 
    "what have you been up to", 
    "good to see you", 
    "nice to meet you", 
    "it's nice to meet you", 
    "how's the weather", 
    "what's happening", 
    "what's going on", 
    "what's cooking", 
    "what's cracking", 
    "what's the news", 
    "what's the latest", 
    "what's popping",
    "sup my nigga",
    "yo yo yo",
    "hey boy",
    'yolo',
    'hello sir',
    'whats up',
    'good day',
    'are you awake'
];

const randomNames = [
    'BananaSlipper', 'SuckerFish', 'DiscoNinja', 'FunkyMonkey', 'CaptainSquishy', 'DancingPenguin', 'SillyGoose', 'JellybeanJuggler',
    'PizzaPirate', 'SneakySquirrel', 'WhisperingWhale', 'CandyCarnivore', 'FuzzyWombat', 'GigglingGiraffe', 'LaughingLlama',
    'ElectricEel', 'MoonlightMystic', 'ThunderBolt', 'NeonNinja', 'JazzHands', 'SpacePirate', 'MysticalMermaid', 'RainbowRider',
    'SugarSphinx', 'MidnightMarauder', 'FireflyFrenzy', 'VelvetVampire', 'SilverSerpent', 'TropicalTornado', 'WhistlingWombat',
    'ShimmeringShark', 'DiscoDiver', 'GalacticGuru', 'MysticMongoose', 'CherryChampion', 'EmeraldEnigma', 'PixelPenguin', 'DizzyDragon',
    'CosmicCoyote', 'WhimsicalWizard', 'DreamyDolphin', 'SpaceSorcerer', 'JungleJester', 'BubblyBandit', 'CrimsonComet', 'SapphireSailor',
    'GlitteringGriffin', 'MagentaMagician', 'BlazingBard', 'ElectricEagle', 'EmeraldEmpress', 'WhisperingWolverine', 'MysticalMimic',
    'StarlightSwan', 'NeonNomad', 'SizzlingSpecter', 'LuminousLion', 'CrystalCobra', 'MysteriousMinstrel', 'FlamingFalcon', 'TwinklingTiger',
    'ShootingStar', 'GlowingGazelle', 'PsychedelicPhoenix', 'CrimsonCheetah', 'FrostyFox', 'MoonlitMystic', 'GalacticGazelle', 'AstralApe',
    'FunkyFlamingo', 'VelvetVoyager', 'GlitteringGrizzly', 'MysticalMongoose', 'WhistlingWolf', 'DreamyDingo', 'FrostbiteFeline', 'ElectricElk',
    'CosmicCheetah', 'WhimsicalWombat', 'JungleJaguar', 'SapphireSphinx', 'StarryStallion', 'FlamingFerret', 'TwinklingTurtle', 'ShootingShark',
    'GlowingGriffin', 'PsychedelicPanda', 'CrimsonCobra', 'FrostyFalcon', 'GalacticGorilla', 'AstralAlpaca', 'FunkyFennec', 'VelvetViper',
    'GlitteringGorilla', 'MysticalMole', 'WhistlingWasp', 'DreamyDingo', 'FrostyFrog', 'ElectricElephant', 'CosmicCoyote', 'WhimsicalWeasel',
    'JungleJellyfish', 'SapphireSnail', 'StarrySalamander', 'FlamingFlamingo', 'TwinklingTiger', 'ShootingStarfish', 'GlowingGorilla',
    'PsychedelicPenguin', 'CrimsonCrab', 'FrostyFly', 'GalacticGoat', 'AstralArmadillo', 'FunkyFalcon', 'VelvetVole', 'GlitteringGecko',
    'MysticalMule', 'WhistlingWalrus', 'DreamyDragonfly', 'FrostyFrog', 'ElectricEmu', 'CosmicCaterpillar', 'WhimsicalWhale', 'JungleJackal',
    'SapphireStingray', 'StarryScorpion', 'FlamingFox', 'TwinklingToucan', 'ShootingSquirrel', 'GlowingGuppy', 'PsychedelicPelican',
    'CrimsonCockroach', 'FrostyFinch', 'GalacticGiraffe', 'AstralAxolotl', 'FunkyFirefly', 'VelvetVulture', 'GlitteringGiraffe', 'MysticalMoth',
    'WhistlingWarthog', 'DreamyDove', 'FrostyFerret', 'ElectricEchidna', 'CosmicCamel', 'WhimsicalWolf', 'JungleJabiru', 'SapphireSeahorse',
    'StarryStarfish', 'FlamingFalcon', 'TwinklingTurtle', 'ShootingShark', 'GlowingGriffin', 'PsychedelicPanda', 'CrimsonCobra', 'FrostyFalcon',
    'GalacticGorilla', 'AstralAlpaca', 'FunkyFennec', 'VelvetViper', 'GlitteringGorilla', 'MysticalMole', 'WhistlingWasp', 'DreamyDingo',
    'FrostyFrog', 'ElectricElephant', 'CosmicCoyote', 'WhimsicalWeasel', 'JungleJellyfish', 'SapphireSnail', 'StarrySalamander',
    'FlamingFlamingo', 'TwinklingTiger', 'ShootingStarfish', 'GlowingGorilla', 'PsychedelicPenguin', 'CrimsonCrab', 'FrostyFly',
    'GalacticGoat', 'AstralArmadillo', 'FunkyFalcon', 'VelvetVole', 'GlitteringGecko', 'MysticalMule', 'WhistlingWalrus', 'DreamyDragonfly',
    'FrostyFrog', 'ElectricEmu', 'CosmicCaterpillar', 'WhimsicalWhale', 'JungleJackal', 'SapphireStingray', 'StarryScorpion', 'FlamingFox',
    'TwinklingToucan', 'ShootingSquirrel', 'GlowingGuppy', 'PsychedelicPelican', 'CrimsonCockroach', 'FrostyFinch', 'GalacticGiraffe',
    'AstralAxolotl', 'FunkyFirefly', 'VelvetVulture', 'GlitteringGiraffe', 'MysticalMoth', 'WhistlingWarthog', 'DreamyDove', 'FrostyFerret',
    'ElectricEchidna', 'CosmicCamel', 'WhimsicalWolf', 'JungleJabiru', 'SapphireSeahorse', 'StarryStarfish', 'FlamingFalcon', 'TwinklingTurtle',
    'ShootingShark', 'GlowingGriffin', 'PsychedelicPanda', 'CrimsonCobra', 'FrostyFalcon', 'GalacticGorilla', 'AstralAlpaca', 'FunkyFennec',
    'VelvetV', 'weirdCat', 'donkeyLover', 'theChosenOne','youFuckingLucky', 'bigBaller', 'WhisperingWillow', 'MysticalMoth', 'VelvetVixen', 'FunkyFerret', 'JungleJaguar', 'AstralAlbatross', 'CosmicCoyote', 'ShimmeringSphinx', 'ElectricElk', 'PsychedelicPanda',
  'StarrySeahorse', 'GlowingGriffin', 'SapphireSerpent', 'DreamyDragonfly', 'GalacticGazelle', 'TwinklingToucan', 'FrostyFox', 'WhimsicalWalrus', 'FlamingFalcon', 'CrimsonCobra',
  'WhistlingWombat', 'MysticalMole', 'VelvetViper', 'FunkyFennec', 'JungleJester', 'AstralArmadillo', 'CosmicCaterpillar', 'ShootingStarling', 'ElectricEmu', 'PsychedelicPelican',
  'StarrySalamander', 'GlowingGorilla', 'SapphireSnail', 'DreamyDolphin', 'GalacticGoose', 'TwinklingTiger', 'FrostyFalcon', 'WhimsicalWhale', 'FlamingFerret', 'CrimsonCrab',
  'WhistlingWolf', 'MysticalMongoose', 'VelvetVole', 'FunkyFirefly', 'JungleJackal', 'AstralAxolotl', 'CosmicCamel', 'ShimmeringShark', 'ElectricEchidna', 'PsychedelicPhoenix',
  'StarryStingray', 'GlowingGuppy', 'SapphireSalamander', 'DreamyDingo', 'GalacticGorilla', 'TwinklingTurtle', 'FrostyFalcon', 'WhimsicalWeasel', 'FlamingFlamingo', 'CrimsonCheetah',
  'WhistlingWasp', 'MysticalMule', 'VelvetVulture', 'FunkyFalcon', 'JungleJabiru', 'AstralAntelope', 'CosmicCoyote', 'ShimmeringSiren', 'ElectricEmu', 'PsychedelicPenguin',
  'StarryStallion', 'GlowingGazelle', 'SapphireSeahorse', 'DreamyDolphin', 'GalacticGorilla', 'TwinklingToucan', 'FrostyFrog', 'WhimsicalWalrus', 'FlamingFalcon', 'CrimsonCobra',
  'WhistlingWolf', 'MysticalMongoose', 'VelvetVole', 'FunkyFirefly', 'JungleJackal', 'AstralAxolotl', 'CosmicCamel', 'ShimmeringShark', 'ElectricEchidna', 'PsychedelicPhoenix',
  'StarryStingray', 'GlowingGuppy', 'SapphireSalamander', 'DreamyDingo', 'GalacticGorilla', 'TwinklingTurtle', 'FrostyFalcon', 'WhimsicalWeasel', 'FlamingFlamingo', 'CrimsonCheetah',
  'WhistlingWasp', 'MysticalMule', 'VelvetVulture', 'FunkyFalcon', 'JungleJabiru', 'AstralAntelope', 'CosmicCoyote', 'ShimmeringSiren', 'ElectricEmu', 'PsychedelicPenguin',
  'StarryStallion', 'GlowingGazelle', 'SapphireSeahorse', 'DreamyDolphin', 'GalacticGorilla', 'TwinklingToucan', 'FrostyFrog', 'WhimsicalWalrus', 'FlamingFalcon', 'CrimsonCobra',
  'WhistlingWolf', 'MysticalMongoose', 'VelvetVole', 'FunkyFirefly', 'JungleJackal', 'AstralAxolotl', 'CosmicCamel', 'ShimmeringShark', 'ElectricEchidna', 'PsychedelicPhoenix',
  'StarryStingray', 'GlowingGuppy', 'SapphireSalamander', 'DreamyDingo', 'GalacticGorilla', 'TwinklingTurtle', 'FrostyFalcon', 'WhimsicalWeasel', 'FlamingFlamingo', 'CrimsonCheetah',
  'WhistlingWasp', 'MysticalMule', 'VelvetVulture', 'FunkyFalcon', 'JungleJabiru', 'AstralAntelope', 'CosmicCoyote', 'ShimmeringSiren', 'ElectricEmu', 'PsychedelicPenguin',
  'StarryStallion', 'GlowingGazelle', 'SapphireSeahorse', 'DreamyDolphin', 'GalacticGorilla', 'TwinklingToucan', 'FrostyFrog', 'WhimsicalWalrus', 'FlamingFalcon', 'CrimsonCobra',
  'WhistlingWolf', 'MysticalMongoose', 'VelvetVole', 'FunkyFirefly', 'JungleJackal', 'AstralAxolotl', 'CosmicCamel', 'ShimmeringShark', 'ElectricEchidna', 'PsychedelicPhoenix',
  'StarryStingray', 'GlowingGuppy', 'SapphireSalamander', 'DreamyDingo', 'GalacticGorilla', 'TwinklingTurtle', 'FrostyFalcon', 'WhimsicalWeasel', 'FlamingFlamingo', 'CrimsonCheetah',
  'WhistlingWasp', 'MysticalMule', 'VelvetVulture', 'FunkyFalcon', 'JungleJabiru', 'AstralAntelope', 'CosmicCoyote', 'ShimmeringSiren', 'ElectricEmu', 'PsychedelicPenguin',
  'StarryStallion', 'GlowingGazelle', 'SapphireSeahorse', 'DreamyDolphin', 'GalacticGorilla', 'TwinklingToucan', 'FrostyFrog', 'WhimsicalWalrus', 'FlamingFalcon', 'CrimsonCobra',
  'WhistlingWolf', 'MysticalMongoose', 'VelvetVole', 'FunkyFirefly', 'JungleJackal', 'AstralAxolotl', 'CosmicCamel', 'ShimmeringShark', 'ElectricEchidna', 'PsychedelicPhoenix',
  'StarryStingray', 'GlowingGuppy', 'SapphireSalamander', 'DreamyDingo', 'GalacticGorilla', 'TwinklingTurtle', 'FrostyFalcon', 'WhimsicalWeasel', 'FlamingFlamingo', 'CrimsonCheet'];


var knownDefinitions = [
  {
    word: 'cat',
    definition1: `a small domesticated carnivorous mammal with soft fur, a short snout, and retractable claws. 
                  It is widely kept as a pet or for catching mice, and many breeds have been developed.`,
    definition2: 'a dumb animal with 4 legs that makes the meow sound',
    definition3: 'a really dumb mammal',
    definition4: null,
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Noun',
    type: "Living Organism"
  },
  {
    word: 'dog',
    definition1: `A domesticated carnivorous mammal that typically has a long snout, an acute sense of smell, 
                  non-retractable claws, and a barking, howling, or whining voice. 
                  It is widely kept as a pet or for work such as hunting or herding animals.`,
    definition2: 'An intelligent animal with four legs that makes the bark sound.',
    definition3: 'a dumb animal with 4 legs that makes the barking sound',
    definition4: null,
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Noun',
    type: 'Living Organism'
  },
  {
    word: 'train',
    definition1: `A series of connected vehicles that run along a track and transport people or goods. 
                  Trains are commonly used for long-distance travel and freight transport.`,
    definition2: 'A mode of transportation consisting of a series of connected cars that run on rails.',
    definition3: 'A vehicle that runs on tracks and is used for transporting passengers and cargo over long distances.',
    definition4: null,
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Noun',
    type: 'Non-living'
  },
  {
    word: 'how',
    definition1: 'In what manner or way; by what means.',
    definition2: 'To what extent, degree, or amount?',
    definition3: null,
    definition4: null,
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Adverb',
    type: 'identifier'
  },
  {
    word: 'big',
    definition1: 'of considerable size, extent, or intensity.',
    definition2: 'of considerable importance or seriousness.',
    definition3: null,
    definition4: null,
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Adjective',
    type: 'describer'
  },
  {
    word: 'at',
    definition1: 'expressing location or arrival in a particular place or position.',
    definition2: 'expressing the time when an event takes place.',
    definition3: null,
    definition4: null,
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Preposition',
    type: 'connector'
  },
  {
    word: 'a',
    definition1: 'used when referring to someone or something for the first time in a text or conversation.',
    definition2: 'used to indicate membership of a class of people or things.',
    definition3: null,
    definition4: null,
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Determiner',
    type: 'possession'
  },
  {
    word: 'but',
    definition1: 'used to introduce a phrase or clause contrasting with what has already been mentioned.',
    definition2: 'used to indicate the impossibility of anything other than what is being stated.',
    definition3: 'no more than; only.',
    definition4: 'an argument against something; an objection.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: ['Conjunction', 'Preposition', 'Adverb', 'Noun'],
    type: null
  },
  {
    word: 'he',
    definition1: 'used to refer to a man, boy, or male animal previously mentioned or easily identified.',
    definition2: 'a male; a man.',
    definition3: null,
    definition4: null,
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: ['Pronoun', 'Noun'], 
    type: 'describer'
  },
  {
    word: 'oh',
    definition1: 'used to express a range of emotions including surprise, anger, disappointment, or joy, or when reacting to something that has just been said.',
    definition2: null,
    definition3: null,
    definition4: null,
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Interjection', 
    type: 'expression'
  },
  {
    word: 'apple',
    definition1: 'the round fruit of a tree of the rose family, which typically has thin green or red skin and crisp flesh.',
    definition2: 'a tech company based in Cupertino, California, known for products such as the iPhone and Mac computers.',
    definition3: 'a red or green fruit that is typically round and eaten raw or cooked.',
    definition4: null,
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Noun',
    type: 'Living Organism'
  },
  {
    word: 'run',
    definition1: 'move at a speed faster than a walk, never having both or all the feet on the ground at the same time.',
    definition2: 'manage or be in charge of (a business, organization, etc.).',
    definition3: 'an act or spell of running.',
    definition4: null,
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: ['Verb', 'Noun'],
    type: null
  },
  {
    word: 'happy',
    definition1: 'feeling or showing pleasure or contentment.',
    definition2: 'fortunate and convenient.',
    definition3: null,
    definition4: null,
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Adjective',
    type: 'describer'
  },
  {
    word: 'blue',
    definition1: 'of a color intermediate between green and violet, as of the sky or sea on a sunny day.',
    definition2: 'melancholic, sad, or depressed.',
    definition3: 'a color, as seen in the sky or ocean.',
    definition4: null,
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: ['Adjective', 'Noun'],
    type: null
  },
  {
    word: 'fast',
    definition1: 'moving or capable of moving at high speed.',
    definition2: 'securely fixed in place.',
    definition3: 'to abstain from all or some kinds of food or drink, especially as a religious observance.',
    definition4: 'a period during which one abstains from all or some kinds of food or drink, especially for religious reasons.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: ['Adjective', 'Adverb', 'Verb', 'Noun'],
    type: null
  },
  {
    word: 'water',
    definition1: 'a clear, colorless, odorless, and tasteless liquid that is essential for most plant and animal life.',
    definition2: 'a body of water such as a river, sea, or lake.',
    definition3: 'to sprinkle or pour water over (a plant or an area of ground), typically in order to encourage plant growth.',
    definition4: 'a transparent fluid that forms the seas, lakes, rivers, and rain and is the basis of the fluids of living organisms.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: ['Noun', 'Verb'],
    type: 'Non-living'
  },
  {
    word: 'book',
    definition1: 'a set of written, printed, or blank pages fastened together along one side and encased between protective covers.',
    definition2: 'to arrange for someone to have a seat on a plane, a room in a hotel, etc.',
    definition3: 'a written work or composition that has been published (printed on pages bound together).',
    definition4: null,
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: ['Noun', 'Verb'],
    type: 'Non-living'
  },
  {
    word: 'quick',
    definition1: 'moving fast or doing something in a short time.',
    definition2: 'prompt to understand, learn, or respond.',
    definition3: null,
    definition4: null,
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Adjective',
    type: 'describer'
  },
  {
    word: 'light',
    definition1: 'the natural agent that stimulates sight and makes things visible.',
    definition2: 'an expression in someone’s eyes indicating a particular emotion or mood.',
    definition3: 'provide with light or lighting; illuminate.',
    definition4: 'having a considerable or sufficient amount of natural light; not dark.',
    definition5: 'not heavy or weighing much.',
    definition6: 'a device that makes a room or building bright.',
    definition7: null,
    definition8: null,
    usage: ['Noun', 'Verb', 'Adjective'],
    type: null
  },
  {
    word: 'play',
    definition1: 'engage in activity for enjoyment and recreation rather than a serious or practical purpose.',
    definition2: 'take part in (a sport).',
    definition3: 'a dramatic work for the stage or to be broadcast.',
    definition4: 'to perform on a musical instrument.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: ['Verb', 'Noun'],
    type: null
  },
  {
    word: 'circle',
    definition1: 'a round plane figure whose boundary (the circumference) consists of points equidistant from a fixed center.',
    definition2: 'a group of people with shared professions, interests, or acquaintances.',
    definition3: 'move all the way around (someone or something), especially more than once.',
    definition4: 'to surround or enclose on all sides.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: ['Noun', 'Verb'],
    type: 'Non-living'
  },{
    word: 'abate',
    definition1: 'to become less intense or widespread.',
    definition2: 'to reduce in amount, degree, or severity.',
    definition3: null,
    definition4: null,
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Verb',
    type: null
  },
  {
    word: 'acumen',
    definition1: 'the ability to make good judgments and quick decisions, typically in a particular domain.',
    definition2: 'keen insight; shrewdness.',
    definition3: null,
    definition4: null,
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Noun',
    type: null
  },
  {
    word: 'altruistic',
    definition1: 'showing a disinterested and selfless concern for the well-being of others; unselfish.',
    definition2: 'motive or behavior characterized by selflessness.',
    definition3: null,
    definition4: null,
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Adjective',
    type: null
  },
  {
    word: 'boisterous',
    definition1: 'noisy, energetic, and cheerful; rowdy.',
    definition2: 'loud, clamorous, or unrestrained.',
    definition3: null,
    definition4: null,
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Adjective',
    type: null
  },
  {
    word: 'catalyst',
    definition1: 'a substance that increases the rate of a chemical reaction without itself undergoing any permanent chemical change.',
    definition2: 'a person or thing that precipitates an event.',
    definition3: null,
    definition4: null,
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Noun',
    type: null
  },
  {
    word: 'debilitate',
    definition1: 'to make (someone) weak and infirm.',
    definition2: 'to impair the strength of.',
    definition3: null,
    definition4: null,
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Verb',
    type: null
  },
  {
    word: 'ebullient',
    definition1: 'cheerful and full of energy.',
    definition2: 'boiling or agitated as if boiling.',
    definition3: null,
    definition4: null,
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Adjective',
    type: null
  },
  {
    word: 'facilitate',
    definition1: 'to make (an action or process) easy or easier.',
    definition2: 'to help (something) run more smoothly and effectively.',
    definition3: null,
    definition4: null,
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Verb',
    type: null
  },
  {
    word: 'gregarious',
    definition1: 'fond of company; sociable.',
    definition2: 'living in flocks or loosely organized communities.',
    definition3: null,
    definition4: null,
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Adjective',
    type: null
  },
  {
    word: 'hackneyed',
    definition1: 'lacking significance through having been overused; unoriginal and trite.',
    definition2: 'made commonplace or trite; stale.',
    definition3: null,
    definition4: null,
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Adjective',
    type: null
  },{
    word: 'abate',
    definition1: 'to become less intense or widespread.',
    definition2: 'to reduce in amount, degree, or severity.',
    definition3: null,
    definition4: null,
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Verb',
    type: null
  },
  {
    word: 'acumen',
    definition1: 'the ability to make good judgments and quick decisions, typically in a particular domain.',
    definition2: 'keen insight; shrewdness.',
    definition3: null,
    definition4: null,
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Noun',
    type: null
  },
  {
    word: 'altruistic',
    definition1: 'showing a disinterested and selfless concern for the well-being of others; unselfish.',
    definition2: 'motive or behavior characterized by selflessness.',
    definition3: null,
    definition4: null,
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Adjective',
    type: null
  },
  {
    word: 'boisterous',
    definition1: 'noisy, energetic, and cheerful; rowdy.',
    definition2: 'loud, clamorous, or unrestrained.',
    definition3: null,
    definition4: null,
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Adjective',
    type: null
  },
  {
    word: 'catalyst',
    definition1: 'a substance that increases the rate of a chemical reaction without itself undergoing any permanent chemical change.',
    definition2: 'a person or thing that precipitates an event.',
    definition3: null,
    definition4: null,
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Noun',
    type: null
  },
  {
    word: 'debilitate',
    definition1: 'to make (someone) weak and infirm.',
    definition2: 'to impair the strength of.',
    definition3: null,
    definition4: null,
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Verb',
    type: null
  },
  {
    word: 'ebullient',
    definition1: 'cheerful and full of energy.',
    definition2: 'boiling or agitated as if boiling.',
    definition3: null,
    definition4: null,
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Adjective',
    type: null
  },
  {
    word: 'facilitate',
    definition1: 'to make (an action or process) easy or easier.',
    definition2: 'to help (something) run more smoothly and effectively.',
    definition3: null,
    definition4: null,
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Verb',
    type: null
  },
  {
    word: 'gregarious',
    definition1: 'fond of company; sociable.',
    definition2: 'living in flocks or loosely organized communities.',
    definition3: null,
    definition4: null,
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Adjective',
    type: null
  },
  {
    word: 'hackneyed',
    definition1: 'lacking significance through having been overused; unoriginal and trite.',
    definition2: 'made commonplace or trite; stale.',
    definition3: null,
    definition4: null,
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Adjective',
    type: null
  },{
    word: 'love',
    definition1: 'an intense feeling of deep affection.',
    definition2: 'a person or thing that one loves.',
    definition3: 'a great interest and pleasure in something.',
    definition4: 'a deep romantic or sexual attachment to someone.',
    definition5: 'a feeling of strong or constant affection for a person.',
    definition6: null,
    definition7: null,
    definition8: null,
    usage: ['Noun', 'Verb'],
    type: 'Emotion'
  },
  {
    word: 'friend',
    definition1: 'a person with whom one has a bond of mutual affection, typically one exclusive of sexual or family relations.',
    definition2: 'a person whom one knows and with whom one has a bond of mutual affection, typically exclusive of sexual or family relations.',
    definition3: 'a person attached to another by feelings of affection or personal regard.',
    definition4: 'a person who gives assistance; patron; supporter.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Noun',
    type: 'Relationship'
  },
  {
    word: 'happy',
    definition1: 'feeling or showing pleasure or contentment.',
    definition2: 'fortunate and convenient.',
    definition3: 'characterized by or indicative of pleasure, contentment, or joy.',
    definition4: 'delighted, pleased, or glad, as over a particular thing.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Adjective',
    type: 'Emotion'
  },
  {
    word: 'sad',
    definition1: 'affected by unhappiness or grief; sorrowful or mournful.',
    definition2: 'expressive of or characterized by sorrow.',
    definition3: 'causing sorrow; sorrowful; distressing.',
    definition4: 'deplorably bad, sorry, or pitiful.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Adjective',
    type: 'Emotion'
  },
  {
    word: 'friendship',
    definition1: 'the emotions or conduct of friends; the state of being friends.',
    definition2: 'a relationship between friends.',
    definition3: 'the state of being a friend; association as friends.',
    definition4: 'a friendly relation or intimacy.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Noun',
    type: 'Relationship'
  },
  {
    word: 'family',
    definition1: 'a group consisting of parents and children living together in a household.',
    definition2: 'all the descendants of a common ancestor.',
    definition3: 'a group of people united by certain convictions or a common affiliation.',
    definition4: 'a group of people related to one another by blood or marriage.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Noun',
    type: 'Relationship'
  },
  {
    word: 'health',
    definition1: 'the state of being free from illness or injury.',
    definition2: 'a person\'s mental or physical condition.',
    definition3: 'a person\'s mental or physical condition as monitored by medical professionals.',
    definition4: 'the condition of being sound in body, mind, or spirit; especially : freedom from physical disease or pain.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Noun',
    type: 'State'
  },
  {
    word: 'money',
    definition1: 'a current medium of exchange in the form of coins and banknotes; coins and banknotes collectively.',
    definition2: 'the assets, property, and resources owned by someone or something; wealth.',
    definition3: 'financial gain; the profit earned from an investment or business venture.',
    definition4: 'capital; property or assets with a monetary value.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Noun',
    type: 'Resource'
  },
  {
    word: 'work',
    definition1: 'activity involving mental or physical effort done in order to achieve a purpose or result.',
    definition2: 'a task or tasks to be undertaken; something a person or thing has to do.',
    definition3: 'the place where one is employed.',
    definition4: 'a job or occupation, especially one requiring effort and skill.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: ['Noun', 'Verb'],
    type: null
  },
  {
    word: 'home',
    definition1: 'the place where one lives permanently, especially as a member of a family or household.',
    definition2: 'an institution for people needing professional care or supervision.',
    definition3: 'a place where something flourishes, is most typically found, or from which it originates.',
    definition4: 'a person\'s place of origin, habitat, or base of operations.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Noun',
    type: 'Location'
  },{
    word: 'atom',
    definition1: 'the basic unit of a chemical element, consisting of a nucleus containing protons and neutrons, surrounded by electrons.',
    definition2: 'the basic unit of a chemical element, a particle composed of a nucleus of neutrons and protons and orbiting electrons.',
    definition3: 'a particle of matter indivisible by chemical means, consisting of a nucleus surrounded by electrons.',
    definition4: 'the smallest particle of a chemical element that can exist.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Noun',
    type: 'Particle'
  },
  {
    word: 'molecule',
    definition1: 'a group of atoms bonded together, representing the smallest fundamental unit of a chemical compound that can take part in a chemical reaction.',
    definition2: 'the smallest physical unit of a substance that can exist independently, consisting of one or more atoms held together by chemical forces.',
    definition3: 'the smallest particle of a substance that retains all the properties of the substance and is composed of one or more atoms.',
    definition4: 'a group of two or more atoms held together by chemical bonds.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Noun',
    type: 'Particle'
  },
  {
    word: 'gene',
    definition1: 'a unit of heredity that is transferred from a parent to offspring and is held to determine some characteristic of the offspring.',
    definition2: 'a segment of DNA that contains the instructions for building a particular protein or performing a specific function.',
    definition3: 'the basic physical and functional unit of heredity, made up of DNA and located on a chromosome.',
    definition4: 'a molecular unit of heredity of a living organism.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Noun',
    type: 'Genetics'
  },
  {
    word: 'DNA',
    definition1: 'deoxyribonucleic acid, a self-replicating material present in nearly all living organisms as the main constituent of chromosomes.',
    definition2: 'the molecule that carries the genetic instructions for growth, development, functioning, and reproduction in all known living organisms and many viruses.',
    definition3: 'the chemical that contains information that determines an organism\'s traits.',
    definition4: 'a molecule that carries most of the genetic instructions used in the growth, development, functioning, and reproduction of all known living organisms and many viruses.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Noun',
    type: 'Molecule'
  },
  {
    word: 'electron',
    definition1: 'a stable subatomic particle with a negative electric charge, found in all atoms and acting as the primary carrier of electricity in solids.',
    definition2: 'a subatomic particle with a negative electric charge, typically found orbiting the nucleus of an atom.',
    definition3: 'a subatomic particle that orbits the nucleus of an atom and carries a negative electric charge.',
    definition4: 'a negatively charged subatomic particle that orbits the nucleus of an atom.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Noun',
    type: 'Particle'
  },
  {
    word: 'neutron',
    definition1: 'a subatomic particle of about the same mass as a proton but without an electric charge, present in all atomic nuclei except those of ordinary hydrogen.',
    definition2: 'a subatomic particle found in the nucleus of an atom, having a mass close to that of the proton but with no electrical charge.',
    definition3: 'an elementary particle found in atomic nuclei with a mass close to that of the proton but lacking an electric charge.',
    definition4: 'a subatomic particle found in the nucleus of an atom that has a mass nearly equal to that of the proton but lacks an electric charge.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Noun',
    type: 'Particle'
  },
  {
    word: 'proton',
    definition1: 'a stable subatomic particle occurring in all atomic nuclei, with a positive electric charge equal in magnitude to that of an electron, but of opposite sign.',
    definition2: 'a subatomic particle found in the nucleus of an atom, with a positive electric charge equal in magnitude to that of an electron.',
    definition3: 'a positively charged subatomic particle found in the nucleus of an atom.',
    definition4: 'a stable subatomic particle occurring in all atomic nuclei, with a positive electric charge equal in magnitude to that of an electron, but of opposite sign.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Noun',
    type: 'Particle'
  },
  {
    word: 'chemical',
    definition1: 'a substance produced by or used in a chemical process.',
    definition2: 'a substance with a distinct molecular composition that is produced by or used in a chemical process.',
    definition3: 'a substance produced by a chemical reaction.',
    definition4: 'a substance made by or used in a chemical process.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Noun',
    type: 'Substance'
  },{
    word: 'quantum',
    definition1: 'the smallest quantity of radiant energy, representing the energy of an electromagnetic wave proportional to its frequency.',
    definition2: 'a discrete quantity of energy proportional in magnitude to the frequency of the radiation it represents.',
    definition3: 'the basic unit of electromagnetic energy.',
    definition4: 'a discrete packet or unit of energy associated with electromagnetic radiation.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Noun',
    type: 'Physics'
  },
  {
    word: 'fusion',
    definition1: 'the process or result of joining two or more things together to form a single entity.',
    definition2: 'the process of combining atoms under extremely high temperatures and pressures to produce nuclear energy.',
    definition3: 'the process or result of joining two or more things together to form a single entity, especially the nuclei of atoms.',
    definition4: 'the combining of atoms to produce nuclear energy.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Noun',
    type: 'Physics'
  },
  {
    word: 'relativity',
    definition1: 'the dependence of various physical phenomena on relative motion of the observer and the observed objects, especially regarding the nature and behavior of space, time, and gravity.',
    definition2: 'the principle that all laws of physics are the same in all inertial frames and that the speed of light is always constant.',
    definition3: 'the state or quality of being relative.',
    definition4: 'the theory developed by Albert Einstein to explain the effects of motion on the perception of time and space.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Noun',
    type: 'Physics'
  },
  {
    word: 'gene',
    definition1: 'a unit of heredity that is transferred from a parent to offspring and is held to determine some characteristic of the offspring.',
    definition2: 'a segment of DNA that contains the instructions for building a particular protein or performing a specific function.',
    definition3: 'the basic physical and functional unit of heredity, made up of DNA and located on a chromosome.',
    definition4: 'a molecular unit of heredity of a living organism.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Noun',
    type: 'Biology'
  },
  {
    word: 'neuron',
    definition1: 'a specialized cell transmitting nerve impulses; a nerve cell.',
    definition2: 'a nerve cell; the basic building block of the nervous system.',
    definition3: 'a specialized cell that transmits nerve impulses.',
    definition4: 'a nerve cell that transmits electrical impulses throughout the body.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Noun',
    type: 'Biology'
  },
  {
    word: 'enzymes',
    definition1: 'a substance produced by a living organism that acts as a catalyst to bring about a specific biochemical reaction.',
    definition2: 'a substance produced by a living organism that acts as a catalyst to bring about a specific biochemical reaction, especially in the breakdown of food into simpler substances.',
    definition3: 'biological molecules that act as catalysts and help complex reactions occur everywhere in life.',
    definition4: 'biological catalysts that speed up the rate of chemical reactions in living organisms.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Noun',
    type: 'Biology'
  },
  {
    word: 'bacteria',
    definition1: 'single-celled microorganisms that lack a nucleus and are capable of causing disease.',
    definition2: 'microscopic living organisms, usually one-celled, that can be found everywhere.',
    definition3: 'microscopic organisms that can be found virtually everywhere on Earth, including in extreme environments.',
    definition4: 'microorganisms that are typically single-celled and can be found in various habitats.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Noun',
    type: 'Microbiology'
  },
  {
    word: 'cell',
    definition1: 'the smallest structural and functional unit of an organism, typically microscopic and consisting of cytoplasm and a nucleus enclosed in a membrane.',
    definition2: 'the basic structural, functional, and biological unit of all known living organisms.',
    definition3: 'the smallest unit of life that can replicate independently.',
    definition4: 'the fundamental structural and functional unit of all living organisms.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Noun',
    type: 'Biology'
  },
  {
    word: 'evolution',
    definition1: 'the process by which different kinds of living organisms are thought to have developed and diversified from earlier forms during the history of the Earth.',
    definition2: 'the change in the heritable characteristics of biological populations over successive generations.',
    definition3: 'the gradual development of something, especially from a simple to a more complex form.',
    definition4: 'the process of change in all forms of life over generations.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Noun',
    type: 'Biology'
  },{
    word: 'lit',
    definition1: 'excellent, amazing, or exciting.',
    definition2: 'impressive or exciting.',
    definition3: 'outstanding or excellent.',
    definition4: 'something that is amazing or exciting.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Adjective',
    type: 'Informal'
  },
  {
    word: 'woke',
    definition1: 'aware of and actively attentive to important facts and issues (especially issues of racial and social justice).',
    definition2: 'alert to injustice in society, especially racism.',
    definition3: 'socially and politically conscious.',
    definition4: 'aware of and engaged in social and political issues.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Adjective',
    type: 'Informal'
  },
  {
    word: 'bae',
    definition1: 'a term of endearment for one\'s romantic partner.',
    definition2: 'a significant other or romantic partner.',
    definition3: 'an affectionate term for one\'s boyfriend or girlfriend.',
    definition4: 'an acronym for "before anyone else," used to refer to one\'s romantic partner.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Noun',
    type: 'Informal'
  },
  {
    word: 'savage',
    definition1: 'fierce, violent, and uncontrolled.',
    definition2: 'brutal, fierce, and unrelenting.',
    definition3: 'fearless and unstoppable.',
    definition4: 'aggressive and uncompromising.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Adjective',
    type: 'Informal'
  },
  {
    word: 'chill',
    definition1: 'relaxed and easygoing.',
    definition2: 'calm and composed.',
    definition3: 'relaxed or easygoing in manner or style.',
    definition4: 'unexcited or unimpressed.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Adjective',
    type: 'Informal'
  },
  {
    word: 'lit',
    definition1: 'drunk or intoxicated.',
    definition2: 'under the influence of alcohol or drugs.',
    definition3: 'intoxicated, especially with alcohol.',
    definition4: 'inebriated or intoxicated, especially from alcohol.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Adjective',
    type: 'Informal'
  },
  {
    word: 'fam',
    definition1: 'one\'s close friends or family.',
    definition2: 'one\'s inner circle of close friends or relatives.',
    definition3: 'a term used to refer to one\'s close friends or family.',
    definition4: 'one\'s immediate family or closest friends.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Noun',
    type: 'Informal'
  },
  {
    word: 'lit',
    definition1: 'excited or enthusiastic.',
    definition2: 'full of energy and enthusiasm.',
    definition3: 'very exciting or thrilling.',
    definition4: 'enthusiastic or exhilarated.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Adjective',
    type: 'Informal'
  },
  {
    word: 'salty',
    definition1: 'angry, irritated, or bitter, especially as a result of losing or being slighted.',
    definition2: 'upset or annoyed, especially when something doesn\'t go as planned.',
    definition3: 'resentful or bitter, especially when someone feels slighted or cheated.',
    definition4: 'feeling bitter or resentful about something.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Adjective',
    type: 'Informal'
  },
  {
    word: 'lit',
    definition1: 'excellent or impressive.',
    definition2: 'exciting or fun.',
    definition3: 'very enjoyable or entertaining.',
    definition4: 'awesome or amazing.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Adjective',
    type: 'Informal'
  },
  {
    word: 'thirsty',
    definition1: 'eager or desperate for attention, validation, or approval.',
    definition2: 'craving attention or validation from others.',
    definition3: 'desperate for attention or approval.',
    definition4: 'seeking attention or validation, especially on social media.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Adjective',
    type: 'Informal'
  },
  {
    word: 'savage',
    definition1: 'a person who is fierce, violent, and uncontrolled.',
    definition2: 'someone who is brutally honest or blunt in their words and actions.',
    definition3: 'a person who is aggressive and unrelenting in their behavior.',
    definition4: 'someone who is fearless and unstoppable.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Noun',
    type: 'Informal'
  },
  {
    word: 'squad',
    definition1: 'a close-knit group of friends who are always together.',
    definition2: 'a tight-knit group of people who hang out together regularly.',
    definition3: 'a group of friends who are always there for each other.',
    definition4: 'a group of people who share a strong bond and spend a lot of time together.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Noun',
    type: 'Informal'
  },
  {
    word: 'fire',
    definition1: 'excellent, outstanding, or amazing.',
    definition2: 'exciting, intense, or thrilling.',
    definition3: 'impressive or remarkable.',
    definition4: 'outstandingly good or exciting.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Adjective',
    type: 'Informal'
  },{
    word: 'yeet',
    definition1: 'an exclamation of excitement, approval, surprise, or all-around energy, often as issued when doing a dance move or throwing something.',
    definition2: 'a versatile word that can be used to convey excitement, enthusiasm, or approval.',
    definition3: 'an exclamation used to express excitement, approval, or joy.',
    definition4: 'a word used to express excitement, triumph, or joy, especially when dancing or throwing something.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Interjection',
    type: 'Informal'
  },
  {
    word: 'flex',
    definition1: 'to show off one\'s accomplishments, skills, or possessions, often in a boastful or exaggerated manner.',
    definition2: 'to display one\'s superiority or success in a way that is intended to impress others.',
    definition3: 'to show off or boast about one\'s abilities, achievements, or possessions.',
    definition4: 'to demonstrate one\'s strength, skill, or prowess, often in a showy or boastful manner.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Verb',
    type: 'Informal'
  },
  {
    word: 'fomo',
    definition1: 'the fear of missing out, characterized by anxiety or unease about not being included in something enjoyable or interesting.',
    definition2: 'a feeling of anxiety or insecurity caused by the belief that one is missing out on something exciting or interesting happening elsewhere.',
    definition3: 'anxiety or apprehension that others might be having rewarding experiences from which one is absent.',
    definition4: 'anxiety or apprehension caused by the belief that others are having fun or experiencing exciting things without you.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Noun',
    type: 'Informal'
  },
  {
    word: 'chillax',
    definition1: 'to relax or calm down, often used as a command or suggestion to someone who is stressed or agitated.',
    definition2: 'to chill out and relax, especially when feeling stressed or tense.',
    definition3: 'to take it easy or unwind, especially when feeling tense or anxious.',
    definition4: 'to calm down or take a break from stress, especially by relaxing and unwinding.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Verb',
    type: 'Informal'
  },
  {
    word: 'lit',
    definition1: 'turned up or excited, often as a result of alcohol or drugs.',
    definition2: 'intoxicated or under the influence of alcohol or drugs.',
    definition3: 'excited or enthusiastic, especially after consuming alcohol or drugs.',
    definition4: 'highly energetic or enthusiastic, often due to the consumption of alcohol or drugs.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Adjective',
    type: 'Informal'
  },
  {
    word: 'thicc',
    definition1: 'used to describe a person (usually a woman) with a curvaceous and voluptuous figure, especially one with a large buttocks and thighs.',
    definition2: 'describing a person, usually a woman, who has a voluptuous and curvy figure, especially with thick thighs and buttocks.',
    definition3: 'having a curvaceous and attractive figure, especially with full hips and thighs.',
    definition4: 'having a shapely and curvaceous body, especially with a full and rounded buttocks and thighs.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Adjective',
    type: 'Informal'
  },
  {
    word: 'lit',
    definition1: 'something that is exciting, impressive, or outstanding.',
    definition2: 'an event or experience that is fun, exciting, or highly enjoyable.',
    definition3: 'a situation or event that is highly enjoyable or entertaining.',
    definition4: 'a party, gathering, or event that is highly enjoyable and exciting.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Noun',
    type: 'Informal'
  },
  {
    word: 'woke',
    definition1: 'informed and aware of social and political issues, especially regarding racism and social justice.',
    definition2: 'conscious and aware of social and political issues, especially those related to race and inequality.',
    definition3: 'alert to injustices and inequalities in society, especially those related to race, gender, and class.',
    definition4: 'aware and informed about social and political issues, particularly those related to racism and inequality.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Adjective',
    type: 'Informal'
  },{
    word: 'strategic',
    definition1: 'relating to the identification of long-term goals and the means of achieving them.',
    definition2: 'concerned with the formulation and implementation of plans or strategies.',
    definition3: 'pertaining to the planning and execution of long-term objectives.',
    definition4: 'related to the development and implementation of strategies for achieving long-term goals.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Adjective',
    type: 'Business'
  },
  {
    word: 'innovative',
    definition1: 'introducing or using new ideas, methods, or technologies.',
    definition2: 'characterized by the creation or introduction of new ideas, methods, or products.',
    definition3: 'marked by the adoption or implementation of new methods or ideas.',
    definition4: 'associated with the introduction of new ideas, methods, or technologies.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Adjective',
    type: 'Business'
  },
  {
    word: 'efficiency',
    definition1: 'the ability to accomplish a task with minimal waste of time, effort, or resources.',
    definition2: 'the quality or degree of being efficient in the use of resources, time, or effort.',
    definition3: 'the effectiveness and productivity of a process or system in using resources.',
    definition4: 'the ratio of output to input in a process, system, or organization.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Noun',
    type: 'Business'
  },
  {
    word: 'leadership',
    definition1: 'the action of leading a group of people or an organization.',
    definition2: 'the ability to guide, direct, or influence people to achieve a common goal.',
    definition3: 'the act of providing direction, guidance, and motivation to a group of individuals.',
    definition4: 'the capacity to inspire and influence others towards the achievement of a common objective.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Noun',
    type: 'Business'
  },
  {
    word: 'synergy',
    definition1: 'the interaction or cooperation of two or more organizations, substances, or other agents to produce a combined effect greater than the sum of their separate effects.',
    definition2: 'the combined power of a group of people or things that is greater than the sum of their individual powers.',
    definition3: 'the interaction or cooperation of two or more elements to produce a combined effect that is greater than the sum of their separate effects.',
    definition4: 'the combined effort or cooperation of multiple elements to achieve a greater result than individual efforts could produce.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Noun',
    type: 'Business'
  },
  {
    word: 'proactive',
    definition1: 'creating or controlling a situation by causing something to happen rather than responding to it after it has happened.',
    definition2: 'taking action in advance to prevent a problem from occurring or to create a favorable outcome.',
    definition3: 'anticipating and taking steps to influence or control future events or situations.',
    definition4: 'acting in anticipation of future problems or opportunities rather than reacting to them after they occur.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Adjective',
    type: 'Business'
  },
  {
    word: 'productivity',
    definition1: 'the measure of efficiency in completing a task, typically expressed as the ratio of output to input.',
    definition2: 'the rate at which goods or services are produced per unit of input.',
    definition3: 'the effectiveness of effort, especially in industry, as measured in terms of the rate of output per unit of input.',
    definition4: 'the efficiency with which resources are used in producing goods or services.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Noun',
    type: 'Business'
  },
  {
    word: 'collaboration',
    definition1: 'the action of working with someone to produce or create something.',
    definition2: 'the process of two or more people or organizations working together to achieve a common goal.',
    definition3: 'the act of cooperating or working together with others to achieve a common objective.',
    definition4: 'the joint effort of multiple individuals or groups to accomplish a shared goal.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Noun',
    type: 'Business'
  },
  {
    word: 'analytics',
    definition1: 'the systematic computational analysis of data or statistics.',
    definition2: 'the process of analyzing data to uncover meaningful patterns, trends, and insights.',
    definition3: 'the use of data analysis techniques to extract useful information and insights from large datasets.',
    definition4: 'the examination and interpretation of data to understand patterns and trends.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Noun',
    type: 'Business'
  },
  {
    word: 'efficacy',
    definition1: 'the ability to produce a desired or intended result.',
    definition2: 'the degree to which something is effective in achieving its intended purpose.',
    definition3: 'the effectiveness or success of something in producing a desired or intended result.',
    definition4: 'the capability of producing a desired or intended effect or result.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Noun',
    type: 'Business'
  },
  {
    word: 'resilience',
    definition1: 'the capacity to recover quickly from difficulties; toughness.',
    definition2: 'the ability to bounce back from adversity, hardship, or setbacks.',
    definition3: 'the ability to withstand and adapt to challenges, stressors, or changes.',
    definition4: 'the psychological strength to cope with stress and adversity.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Noun',
    type: 'Business'
  },{
    word: 'chair',
    definition1: 'a separate seat for one person, typically with a back and four legs.',
    definition2: 'a piece of furniture for one person to sit on, with a back, a seat, and four legs.',
    definition3: 'a piece of furniture consisting of a seat, legs, back, and often arms, designed to accommodate one person.',
    definition4: 'a movable seat with a back, for a single person.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Noun',
    type: 'Furniture'
  },
  {
    word: 'table',
    definition1: 'a piece of furniture with a flat top and one or more legs, providing a level surface on which objects may be placed, and that can be used for such purposes as eating, writing, working, or playing games.',
    definition2: 'a piece of furniture with a flat top and one or more legs, providing a level surface on which objects may be placed, and that can be used for such purposes as eating, writing, working, or playing games.',
    definition3: 'a piece of furniture with a flat top and one or more legs, providing a level surface on which objects may be placed, and that can be used for such purposes as eating, writing, working, or playing games.',
    definition4: 'a piece of furniture with a flat top and one or more legs, providing a level surface on which objects may be placed, and that can be used for such purposes as eating, writing, working, or playing games.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Noun',
    type: 'Furniture'
  },{
    word: 'door',
    definition1: 'a hinged, sliding, or revolving barrier at the entrance to a building, room, or vehicle, or in the framework of a cupboard.',
    definition2: 'a hinged, sliding, or revolving barrier at the entrance to a building, room, or vehicle, or in the framework of a cupboard.',
    definition3: 'a hinged, sliding, or revolving barrier at the entrance to a building, room, or vehicle, or in the framework of a cupboard.',
    definition4: 'a hinged, sliding, or revolving barrier at the entrance to a building, room, or vehicle, or in the framework of a cupboard.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Noun',
    type: 'Construction'
  },
  {
    word: 'window',
    definition1: 'an opening in the wall or roof of a building or vehicle that is fitted with glass or other transparent material in a frame to admit light or air and allow people to see out.',
    definition2: 'an opening in the wall or roof of a building or vehicle that is fitted with glass or other transparent material in a frame to admit light or air and allow people to see out.',
    definition3: 'an opening in the wall or roof of a building or vehicle that is fitted with glass or other transparent material in a frame to admit light or air and allow people to see out.',
    definition4: 'an opening in the wall or roof of a building or vehicle that is fitted with glass or other transparent material in a frame to admit light or air and allow people to see out.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Noun',
    type: 'Construction'
  },
  {
    word: 'computer',
    definition1: 'an electronic device for storing and processing data, typically in binary form, according to instructions given to it in a variable program.',
    definition2: 'an electronic device that accepts data, processes it, stores it, and produces an output (results).',
    definition3: 'a programmable electronic device designed to accept data, perform prescribed mathematical and logical operations at high speed, and display the results of these operations.',
    definition4: 'an electronic device that manipulates information or data.',
    definition5: 'a device that can be instructed to carry out sequences of arithmetic or logical operations automatically via computer programming.',
    definition6: 'a device capable of performing a variety of operations automatically.',
    definition7: 'an electronic machine that can store and process large amounts of data and perform complex calculations.',
    definition8: null,
    usage: 'Noun',
    type: 'Technology'
  },
  {
    word: 'phone',
    definition1: 'a telephone.',
    definition2: 'a system that converts acoustic vibrations to electrical signals in order to transmit sound, typically voices, over a distance using wire or radio.',
    definition3: 'a device used for transmitting sound or speech to a distant point, especially by telephone, radio, or television.',
    definition4: 'a system for transmitting voices over a distance using wire or radio, by converting acoustic vibrations to electrical signals.',
    definition5: 'a device for transmitting sound over long distances, especially one that converts sound into electrical signals and transmits them to a distant point.',
    definition6: 'a system for transmitting voices over long distances, especially one that converts sound into electrical signals and transmits them to a distant point.',
    definition7: null,
    definition8: null,
    usage: 'Noun',
    type: 'Technology'
  },
  {
    word: 'clock',
    definition1: 'an instrument for measuring and indicating time, typically by hands moving over a dial or series of marks.',
    definition2: 'a mechanical or electrical device for measuring time, indicating hours, minutes, and sometimes seconds, typically by hands on a round dial or by displayed figures.',
    definition3: 'a timepiece that shows the time of day.',
    definition4: 'a device for measuring time, typically with hands or numbers to indicate the hour and minute.',
    definition5: 'a device that measures and displays the time.',
    definition6: 'a device used for measuring and indicating time, typically by hands on a dial or by numbers.',
    definition7: 'an instrument for measuring time, typically with hands or digital representation of numbers.',
    definition8: null,
    usage: 'Noun',
    type: 'Technology'
  },{
    word: 'time',
    definition1: 'the indefinite continued progress of existence and events in the past, present, and future, regarded as a whole.',
    definition2: 'the continued progress of existence and events in the past, present, and future.',
    definition3: 'the measurement of the indefinite and continuous progress of existence and events in the past, present, and future.',
    definition4: 'a system of measuring and organizing existence and events in the past, present, and future.',
    definition5: 'a dimension in which events can be ordered from the past through the present into the future.',
    definition6: 'the duration of an event, action, or process.',
    definition7: 'a point at which a specified period begins or ends; the moment something occurs.',
    definition8: 'an instance or occasion when something occurs.',
    usage: 'Noun',
    type: 'General'
  },
  {
    word: 'work',
    definition1: 'activity involving mental or physical effort done in order to achieve a purpose or result.',
    definition2: 'a task or tasks to be undertaken; something a person or machine has to do.',
    definition3: 'a job or profession.',
    definition4: 'a place or premises for industrial activity, typically manufacturing.',
    definition5: 'a place or premises for carrying out a particular activity or function.',
    definition6: 'effort expended on a particular task or goal.',
    definition7: 'a product or result of action, effort, or activity.',
    definition8: null,
    usage: 'Noun',
    type: 'General'
  },
  {
    word: 'home',
    definition1: 'the place where one lives permanently, especially as a member of a family or household.',
    definition2: 'a house, apartment, or other shelter that is the usual residence of a person, family, or household.',
    definition3: 'a place where something flourishes, is most typically found, or from which it originates.',
    definition4: 'the social unit formed by a family living together.',
    definition5: 'a dwelling place; a house or place of residence.',
    definition6: 'a place where something is discovered, founded, developed, or promoted; a headquarters.',
    definition7: 'the place where something is invented, founded, or developed.',
    definition8: null,
    usage: 'Noun',
    type: 'General'
  },
  {
    word: 'money',
    definition1: 'a current medium of exchange in the form of coins and banknotes; coins and banknotes collectively.',
    definition2: 'a means of payment, especially coins or banknotes.',
    definition3: 'the assets, property, and resources owned by someone or something; wealth.',
    definition4: 'a medium of exchange; something generally accepted as a medium of exchange, a measure of value, or a means of payment.',
    definition5: 'assets, property, and resources that are owned by a person or organization.',
    definition6: 'currency and other financial assets collectively.',
    definition7: 'something that is generally accepted as a medium of exchange, a measure of value, or a means of payment.',
    definition8: null,
    usage: 'Noun',
    type: 'General'
  },
  {
    word: 'family',
    definition1: 'a group of one or more parents and their children living together as a unit.',
    definition2: 'a group consisting of parents and children living together in a household.',
    definition3: 'a group of people related by blood or marriage.',
    definition4: 'a group consisting of one or two parents and their children living together in a household.',
    definition5: 'a social unit consisting of parents and their children, considered as a group, whether dwelling together or not.',
    definition6: 'a group of people united by certain convictions or a common affiliation.',
    definition7: 'a group of individuals living under one roof and usually under one head; household.',
    definition8: null,
    usage: 'Noun',
    type: 'General'
  },
  {
    word: 'school',
    definition1: 'an institution for educating children.',
    definition2: 'a place where children go to learn.',
    definition3: 'an institution for instruction in a particular skill or field.',
    definition4: 'an educational institution designed to provide learning spaces and learning environments for teaching students under the direction of teachers.',
    definition5: 'a place where young people receive education, especially secondary education.',
    definition6: 'a place where children receive education; an institution for teaching children.',
    definition7: 'an establishment for teaching and learning; a place where instruction is given in a particular discipline.',
    definition8: null,
    usage: 'Noun',
    type: 'General'
  },
  {
    word: 'friend',
    definition1: 'a person with whom one has a bond of mutual affection, typically one exclusive of sexual or family relations.',
    definition2: 'a person whom one knows and with whom one has a bond of mutual affection, typically exclusive of sexual or family relations.',
    definition3: 'a person with whom one has a mutual bond of affection, typically one not related to family or romantic relationships.',
    definition4: 'a person whom one knows and trusts; a person with whom one has a mutual bond of affection and trust.',
    definition5: 'a person who is a trusted companion or with whom one shares a bond of mutual affection.',
    definition6: 'a person with whom one has a bond of friendship; a person whom one knows well and is fond of.',
    definition7: 'a person who is not related by blood or marriage but is considered to be close to oneself.',
    definition8: null,
    usage: 'Noun',
    type: 'General'
  },
  {
    word: 'love',
    definition1: 'an intense feeling of deep affection.',
    definition2: 'a deep and tender feeling of affection for or attachment to someone.',
    definition3: 'a profoundly tender, passionate affection for another person.',
    definition4: 'a feeling of warm personal attachment or deep affection, as for a friend, a parent, or a child.',
    definition5: 'a strong feeling of affection, warmth, fondness, and regard toward someone or something.',
    definition6: 'a strong positive emotion of regard and affection; an intense feeling of deep affection or fondness.',
    definition7: 'a deep, tender, ineffable feeling of affection and solicitude toward a person, such as that arising from kinship, recognition of attractive qualities, or a sense of underlying oneness.',
    definition8: null,
    usage: 'Noun',
    type: 'General'
  }, {
    word: 'Bitcoin',
    definition1: 'the first decentralized digital currency, created in 2009 by an unknown person or group using the name Satoshi Nakamoto.',
    definition2: 'a digital currency that operates on a decentralized network of computers.',
    definition3: 'a type of digital currency in which a record of transactions is maintained and new units of currency are generated by the computational solution of mathematical problems, and which operates independently of a central bank.',
    definition4: 'a decentralized digital currency without a central bank or single administrator, that can be sent from user to user on the peer-to-peer bitcoin network without the need for intermediaries.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Noun',
    type: 'Cryptocurrency'
  },
  {
    word: 'Ethereum',
    definition1: 'a decentralized, open-source blockchain system that features smart contract functionality.',
    definition2: 'a decentralized platform that enables smart contracts and decentralized applications (DApps) to be built and operated without any downtime, fraud, control, or interference from a third party.',
    definition3: 'a decentralized, open-source blockchain featuring smart contract functionality.',
    definition4: 'an open-source, blockchain-based platform that enables the creation of smart contracts and decentralized applications (DApps).',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Noun',
    type: 'Cryptocurrency'
  },
  {
    word: 'Blockchain',
    definition1: 'a decentralized, distributed ledger technology that records all transactions across multiple computers in a way that prevents them from being tampered with or deleted.',
    definition2: 'a digital ledger in which transactions made in bitcoin or another cryptocurrency are recorded chronologically and publicly.',
    definition3: 'a digital database containing information (such as records of financial transactions) that can be simultaneously used and shared within a large decentralized, publicly accessible network.',
    definition4: 'a distributed, decentralized, public ledger that records transactions across a network of computers.',
    definition5: 'a system in which a record of transactions made in bitcoin or another cryptocurrency is maintained across several computers that are linked in a peer-to-peer network.',
    definition6: 'a system of recording information in a way that makes it difficult or impossible to change, hack, or cheat the system.',
    definition7: null,
    definition8: null,
    usage: 'Noun',
    type: 'Technology'
  },
  {
    word: 'Cryptocurrency',
    definition1: 'a digital or virtual currency that uses cryptography for security and operates independently of a central bank.',
    definition2: 'a digital or virtual form of currency that uses cryptography for security and operates independently of a central authority or government.',
    definition3: 'a digital or virtual currency that uses cryptography for security and operates on a decentralized network of computers.',
    definition4: 'a type of digital or virtual currency that uses cryptography for security and operates on a decentralized network of computers.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Noun',
    type: 'Finance'
  },
  {
    word: 'Wallet',
    definition1: 'a digital or physical device used to store, send, and receive cryptocurrencies like Bitcoin.',
    definition2: 'a software program or hardware device that allows users to store, send, and receive digital currencies like Bitcoin.',
    definition3: 'a digital or physical container used to store, send, and receive cryptocurrencies such as Bitcoin.',
    definition4: 'a digital or physical tool that allows users to manage their cryptocurrencies like Bitcoin by storing private keys and facilitating transactions.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Noun',
    type: 'Technology'
  },
  {
    word: 'Mining',
    definition1: 'the process of validating transactions and adding them to a blockchain ledger by solving complex mathematical problems.',
    definition2: 'the process of adding transaction records to a blockchain ledger by solving complex mathematical problems.',
    definition3: 'the process of creating new units of a cryptocurrency, such as Bitcoin, by solving complex mathematical problems.',
    definition4: 'the process of verifying and recording transactions on a blockchain ledger by solving complex mathematical problems.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Noun',
    type: 'Technology'
  },
  {
    word: 'Altcoin',
    definition1: 'any cryptocurrency other than Bitcoin.',
    definition2: 'any digital currency other than Bitcoin.',
    definition3: 'any cryptocurrency that is not Bitcoin.',
    definition4: 'any digital or virtual currency that is not Bitcoin.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Noun',
    type: 'Cryptocurrency'
  },
  {
    word: 'Smart Contract',
    definition1: 'self-executing contracts with the terms of the agreement between buyer and seller written directly into code.',
    definition2: 'a computer protocol intended to digitally facilitate, verify, or enforce the negotiation or performance of a contract.',
    definition3: 'self-executing contracts with the terms of the agreement between buyer and seller written directly into code.',
    definition4: 'a digital contract that automatically executes, enforces, or verifies the terms of an agreement using computer code.',
    definition5: null,
    definition6: null,
    definition7: null,
    definition8: null,
    usage: 'Noun',
    type: 'Technology'
  }
];
const users = [];

const messageHistory = [];
const updatedViewsHistory = [];
const PORT = process.env.PORT || 27015; 

try{
    if (cluster.isMaster) {
        const numCPUs = os.cpus().length;
        console.log(`Master ${process.pid} is running`);
        mongoose.set('debug', true);
        mongoose.connect(dbURL)
        .then(async (result) => {
            const server = http.createServer((req, res) => {
                handleHttpRequest(req, res, io);
            });

            server.listen(PORT, myDomain, () => {
                console.log(`Server running on port ${PORT}`);
            });

            const io = socketIo(server);

            io.on('connection', (socket) => {
                console.log('A user connected');
                const ipAddress = socket.handshake.address;
                let clientIP;
                if (ipAddress.includes('::ffff:')) {
                    clientIP = ipAddress.split(':').pop();
                } else {
                    clientIP = ipAddress;
                }
                const sender = users.find(u => u.ip == clientIP);
                if(sender){

                }else{
                    let username;
                    do {
                        const randomIndex = Math.floor(Math.random() * randomNames.length);
                        username = randomNames[randomIndex];
                    } while (isUsernameTaken(username, users)); 
                        const currentUser = { 
                        ip: clientIP, 
                        user: username, 
                        coolDown: 0,
                        nameChanges: 0
                    };
                    users.push(currentUser);
                }
                socket.on('message', (message) => {
                    console.log('A user connected');
                    const timeSent = new Date().toISOString();
                    const forwarded = socket.handshake.headers['x-forwarded-for'];
                    const ipAddress = forwarded ? forwarded.split(',')[0] : socket.handshake.address;  // Prefer X-Forwarded-For if available
                    let clientIP;
                    if (ipAddress.includes('::ffff:')) {
                        clientIP = ipAddress.split(':').pop();
                    } else {
                        clientIP = ipAddress;
                    }
                    console.log('client IP', clientIP);
                    const sender = users.find(u => u.ip == clientIP);

                    let senderName;

                    if (sender) {
                        senderName = sender.user;
                    } else {
                        senderName = 'noName';
                    }

                    const obj = {
                        msg: message,
                        username: senderName,
                        time: timeSent, 
                        coolDown: sender.coolDown,
                        nameChanges:0 
                    };
                    if(!checkString(obj.msg)){
                        obj.msg = 'Your input contains inappropriate content. Please ensure your message is respectful!';
                    }
                    if(canSendMessage(messageHistory, obj.username, timeSent)){
                        console.log('user can send message');
                        messageHistory.push(obj);
                        io.emit('message', obj);
                    }else{
                        console.log('Restricted user trying to send message', obj.username);
                    }
                    if(messageHistory.length > 200){
                        messageHistory.pop();
                    }                
                });   
            });

            console.log('setting custom symbols . . . ');

            let mainBase = 26; 
            let digitBase = 10;
            let modulus = 4;  // to implement 5-char or 6 char increase here. May experience memory issues. 
            let mainAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            const startTime = performance.now();
            let customSymbolArray = setMainUniquebaseCharMapping(modulus, mainAlphabet); // this creates as many symbols as we need but will fail when modulus is to large i.e 6-8
            const endTime = performance.now();
            const duration = endTime - startTime;

            console.log(`Initializing base set symbols time:  ${duration.toFixed(2)} milliseconds.`);
            let kmferChars = setUniquePermutationMapping(modulus);

            console.log('setting unique digit mapping');
            let japaneseChars = setUniqueDigitCharsMapping(modulus, digitBase); 
            uniqueChars = customSymbolArray;

            for (const kmferChar of kmferChars) {
                uniqueChars2.push(kmferChar);
            }
            for (const jChar of japaneseChars) {
                uniqueChars3.push(jChar);
            }

            console.log(`inverse of ${modulus}-char base map`, uniqueCharsInverse); // has been verified uncomment to check again
            console.log('inverse permutations ', uniqueChars2Inverse); // has been verified uncomment to check again
            console.log('japaneseChars max of 4-char reduction (unique symbols not working) ', uniqueChars3); // has been verified uncomment to check again

            //const duplicator = hasDuplicates(uniqueChars);
            var base64TestString = `data:image/png;base64,ABCDAAA232223322AAAAAAAAAAAAAAAAAAAABCDAAA232223322AAAAAAAAAAAAAAAAAAAABCDAAA232223322AAAAAAAAAAAAAAAAAAAA
            BCDAAA232223322AAAAAAAAAAAAAAAAAAAABCDAAA232223322AAAAAAAAAAAAAAAAAAAABCDAAA232223322AAAAAAAAAAAAAAAAAAAABCDAAA232223322AAAAAAAAAAAAAAAAAAAABCDAAA23222332
            2AAAAAAAAAAAAAAAAAAAABCDAAA232223322AAAAAAAAAAAAAAAAAAAabVYKLIqWEAabVYKLIqWEAabVYKLIqWEAabVYKLIqWEAabVYKLIqWEAabVYKLIqWEAabcDabcD`;
            if(uniqueChars.length >= mainBase**modulus){
                console.log('calling compressor using unique set of symbols generated with length:', uniqueChars.length);
                console.log(`Calling burson encryption using a ${modulus}-char reduction technique`);
                const encryptedStringTest = BursonBase64Encrypted(base64TestString, modulus);

                // issue with bijection starting point

                // before callin
                console.log(`Compression amount = ${(base64TestString.length/encryptedStringTest.length).toFixed(3)}x`);
                const decryptionTestStringTest = BursonBase64Decrypt(encryptedStringTest, modulus);

                console.log('decryptedString length', decryptionTestStringTest.length);
                console.log('Image base 64 representation after decompression', decryptionTestStringTest);
            }else if(duplicator){
                console.warn(`duplicator is true spirals are not unique`, uniqueChars);
            } else{
                 console.warn(`Error unique char array length is not long enough `);
                console.log('unique symbol length for main base:', customSymbolArray.length);
            }
            
            await addBasicDefinitions(basicDefinitions);
            console.log('Done adding definitions, launching workers');

            for (let i = 0; i < numCPUs; i++) {
                cluster.fork();
            }
        })
        .catch((error) => {
            console.error('Error connecting to MongoDB:', error);
            process.exit(1);
        });

        cluster.on('exit', (worker, code, signal) => {
          console.log(`Worker ${worker.process.pid} died, forking a new one`);
          cluster.fork();
        });
    } else {
      console.log(`Worker ${process.pid} started`);
    }
    
}catch(error){
    console.log('Error creating the Server', error);
}

function hasDuplicates(uniqueChars) {
    for (var i = 0; i < uniqueChars.length; i++) {
        for (var j = i + 1; j < uniqueChars.length; j++) {
            if (uniqueChars[i] === uniqueChars[j]) {
                return true; // Found a duplicate
            }
        }
    }
    return false; // No duplicates found
}
const getPrice = async (chainlinkAbi, address) => {
  try {
    return price = '100'; 
  } catch (error) {
    console.error(`Error fetching price for address ${address}:`, error);
    return 'Failed'; 
  }
};

async function addBasicDefinitions(array) {
  for (const word of array) {
    const checkIfWordExist = knownDefinitions.find(item => item.word === word);
    if (checkIfWordExist === undefined) {
      const addThisWord = await getNewDefinition(word);
      if (addThisWord !== null) {
        knownDefinitions.push(addThisWord);
      }
    }
  }
}
function checkString(input) {
    const badLanguagePatterns = ['niger','nigger', 'niggger', 'niggggger','niiiggeer', 'nigga', 'bitch', 'whore', 'cunt', 'fuck', 'fucckk','fucck', 'fucckkk', 'shit', 'motherfucker', 'ass', 'bastard', 'dick'];
    const threatPatterns = ['kill you', 'hurt you', 'endanger you', 'menace you', 'attack you', 'assault you', 'intimidate you', 'coerce you', 'terrorize you'];
    const sexuallyExplicitPatterns = ['pussy', 'dick', 'cock', 'vagina', 'asshole', 'boobs', 'tits', 'anal', 'cum', 'sex'];
    for (const pattern of badLanguagePatterns) {
        if (input.includes(pattern)) {
            console.log("Matched bad language pattern:", pattern);
            return false;
        }
    }
    for (const pattern of threatPatterns) {
        if (input.includes(pattern)) {
            console.log("Matched threat pattern:", pattern);
            return false;
        }
    }

    for (const pattern of sexuallyExplicitPatterns) {
        if (input.includes(pattern)) {
            console.log("Matched sexually explicit pattern:", pattern);
            return false;
        }
    }
    return true;
}

function canSendMessage(array, name, time) {
    var ability_to_send = true; 
    const currentTime = time instanceof Date ? time : new Date(time);
    array.forEach((obj)=>{
        const msgTime = obj.time instanceof Date ? obj.time : new Date(obj.time);
        const timeDifference = (currentTime - msgTime) / 1000; 
        if (timeDifference < 0.5) {
            const thisSender = users.find(u => u.user == obj.username);
            if (thisSender) {
                thisSender.coolDown += 1;
                if (thisSender.coolDown > 10) {
                    console.log('User has exceeded cooldown limit');
                    ability_to_send = false;
                    setTimeout(() => {
                        thisSender.coolDown = 0;
                        console.log('User has ability to send again');
                    }, 24 * 60 * 60 * 1000); // 24 hours in seconds
                }
            }           
        } else { 
        }
    });

    return ability_to_send;
}

function checkEmailString(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex.test(email);
    return isValidEmail;
}

async function checkAddressStringTest(address) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
        const data = await response.json();
        if (data.length > 0) {
            return true;
        } else {
            console.log('Address could not be found. Please review before proceeding.');
            return false;
        }
    } catch (error) {
        console.log('Error checking address:', error);
        return false;
    }
}

async function checkAddressString(address) {
    try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=`+googleAPIKEY);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            return true;
        } else {
            return true;
            console.log('The shipping address you entered could not be detected from google maps please make sure to review before proceeding');
        }
    } catch (error) {
        console.log('Error checking address:', error);
        console.log('The shipping address you entered could not be detected from google maps please make sure to review before proceeding');
        return false;
    }
}
async function checkIfName(string) {
    if (!string.trim()) {
        return false; 
    }
    const inappropriateRegex = /[^\w\s'-]/;
    if (inappropriateRegex.test(string)) {
        return false; 
    }
    const badWords = [
    'niger', 'nigga', 'bitch', 'whore', 'cunt', 'fuck', 'shit', 'motherfucker', 
    'ass', 'bastard', 'dick', 'kill you', 'hurt you', 'endanger you', 'menace you', 'attack you', 
    'assault you', 'intimidate you', 'coerce you', 'terrorize you', 'pussy', 
    'dick', 'cock', 'vagina', 'asshole', 'boobs', 'tits', 'anal', 'cum', 'sex'
    ];

    const lowerCaseFirstName = string.toLowerCase();
    if (badWords.some(word => lowerCaseFirstName.includes(word))) {
        return false; 
    }
    const excessiveRepeatingRegex = /(.)\1{5,}/;
    if (excessiveRepeatingRegex.test(string)) {
        return false; 
    }
    return true;

    
}

async function sendEmail(email, address, firstName, lastName, productID, price, productName, productIMG) {
    let atagRef = 'mailto:' + buisnessEmial;
    let HTML = `<div class="container" style="width: 100%; max-width: 600px; background-color: #ffffff; border: 1px solid #ccc; border-radius: 5px; padding: 20px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); margin: 0 auto;">
                    <div class="header" style="width: 100%; margin-bottom: 20px; text-align: center;">
                        <img src="https://i.ibb.co/kmVWh5p/Burson-SKull-Text.png" alt="Burson-SKull-Text" style="width: 100%; height: auto; max-height: 200px;">
                    </div>
                    <div class="product-image" style="width: 100%; margin-bottom: 20px; text-align: center;">
                        <img src="${productIMG}" alt="Product Image" style="width: 80%; height: auto; max-height: 300px;">
                    </div>
                    <div class="message" style="font-size: 16px; width: 100%; text-align: left;">
                        <p style="font-size: 16px; margin: 0;">Thank you ${firstName} ${lastName} for choosing Burson Skullz. We're excited to have you on board!</p>
                        <p style="font-size: 16px; margin: 10px 0;">Here are the details of your purchase:</p>
                        <ul style="font-size: 16px; padding-left: 20px; margin: 0;">
                            <li style="margin-bottom: 5px;">Product Name: ${productName}</li>
                            <li style="margin-bottom: 5px;">Price: ${price}</li>
                            <li style="margin-bottom: 5px;">Order ID: ${productID}</li>
                        </ul>
                        <p style="font-size: 16px; margin: 10px 0;">If you have any questions or concerns, feel free to <a href="${atagRef}" style="font-size: 16px;">contact us</a>.</p>
                        <p style="font-size: 16px; margin: 0;">Best regards,<br><span class="signature" style="text-indent: 20px;"> &nbsp; &nbsp; Roy Burson</span></p>
                    </div>
                </div>`;

    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465, 
        secure: true,
        auth: {
            user: buisnessEmial, 
            pass: appPasscode
        }

    });

    transporter.use('compile', inlineBase64({cidPrefix: 'somePrefix_'}));

     let mailOptions = {
            from: buisnessEmial, 
            to: email, 
            subject: 'Congrats on your new purchase!', 
            html: HTML
    };

    try {

        let result = await transporter.sendMail(mailOptions);
        return result;
    } catch (error) {
        console.error('Error sending email', error);
        throw error; 
    }
}


function getMaxValueofPurchases(attemptedClientsArray) {
    let maxValue = 0;

    if(attemptedClientsArray.length == 0){

    }else{
        let lastelement = attemptedClientsArray[0];
        attemptedClientsArray.forEach(element => {
            // if first index dont do anything bec
            if(lastelement.numberOfPurchaseAttempts<= element.numberOfPurchaseAttempts){
                maxValue = element.numberOfPurchaseAttempts;
            }else{
                 maxValue = lastelement.numberOfPurchaseAttempts
            }
            lastelement = element;
        });
    }


    return maxValue;
}

async function sendPaintingTrackingNumberEmail(email, name, trackingNumber, image) {

// HTML files to send
    let HTML = `<div class="container" style="width: 100%; max-width: 600px; background-color: #ffffff; border: 1px solid #ccc; border-radius: 5px; padding: 20px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); margin: 0 auto;">
                    <div class="header" style="width: 100%; margin-bottom: 20px; text-align: center;">
                        <img src="https://i.ibb.co/kmVWh5p/Burson-SKull-Text.png" alt="Burson-SKull-Text" style="width: 100%; height: auto; max-height: 200px;">
                    </div>
                    <div class="product-image" style="width: 100%; margin-bottom: 20px; text-align: center;">
                        <img src="${image}" alt="Product Image" style="width: 80%; height: auto; max-height: 300px;">
                    </div>
                    <div class="message" style="font-size: 16px; width: 100%; text-align: left;">
                        <p style="font-size: 16px; margin: 0;">Thank you ${name} for your purchase! </p>
                        <p style="font-size: 16px; margin: 10px 0;">Here is your tracking number:</p>
                        <ul style="font-size: 16px; padding-left: 20px; margin: 0;">
                            <li style="margin-bottom: 5px;">Tracking Number: ${trackingNumber}</li>
                        </ul>
                        <p style="font-size: 16px; margin: 10px 0;">If you have any questions or concerns, feel free to <a href="mailto:bursodevelopments@gmail.com" style="font-size: 16px;">contact us</a>.</p>
                        <p style="font-size: 16px; margin: 0;">Best regards,<br><span class="signature" style="text-indent: 20px;"> &nbsp; &nbsp; Roy Burson</span></p>
                    </div>
                </div>`;

    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465, 
        secure: true,
        auth: {
            user: buisnessEmial, 
            pass: appPasscode
        }

    });

    transporter.use('compile', inlineBase64({cidPrefix: 'somePrefix_'}));
     let mailOptions = {
            from: buisnessEmial, 
            to: email, 
            subject: 'Tracking Number', 
            html: HTML
    };

    try {

        let result = await transporter.sendMail(mailOptions);
        console.log('Email sent');
        return result;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error; 
    }
}

function isUsernameTaken(username, users) {
    return users.some(user => user.user === username);
}

function drawSpiralSymbol(index ,base, modulus) {
    var newSpiralData = [];
    if(index == 0){
        const canvasSize = 500;
        const spiral = [];
        const centerX = canvasSize / 2;
        const centerY = canvasSize / 2;
        const radius = canvasSize + (index % 10) * 3;
        const angleIncrement = 0.1 + (index % 5) * 0.02;
        const numSpiralPoints = 100;
        for (let i = 0; i < numSpiralPoints; i++) {
            const angle = i * angleIncrement; 
            const x = centerX + radius * angle * (i / numSpiralPoints);
            const y = centerY + radius * angle * (i / numSpiralPoints);
            spiral.push({ x, y });
        }

        const numTicks = 20;
        for (let j = 0; j < numTicks; j++) {
            const tickX = centerX + (radius + 5) * Math.cos(j * Math.PI / 4);
            const tickY = centerY + (radius + 5) * Math.sin(j * Math.PI / 4);
            spiral.push({ x: tickX, y: tickY, isTick: true });
        }
        globalSpiralData = spiral;
        return spiral;
    }else{
        let point = globalSpiralData[globalSpiralData.length-1];
        point.x += index/(base**modulus);
        point.y += index/(base**modulus);
        let newPoint = point;
        NewSpiralData = globalSpiralData;
        newSpiralData[newSpiralData.length-1] = newPoint;
        return newSpiralData;
    }
}

function createCustomSymbol(index, base, modulus) {
    const symbolData = drawSpiralSymbol(index, base, modulus); 
    const encodedData = btoa(JSON.stringify(symbolData)); 
    return { 
        char: String.fromCharCode(0xE000 + index), 
        data: encodedData
    };
}

function drawStringFromSymbols(symbols) {
    if (!Array.isArray(symbols)) {
        throw new Error('Expected an array of symbols'); 
    }
    const symbolChars = []; 
    symbols.forEach((symbol) => {
        const canvasSize = 10; 
        const canvas = Array.from({ length: canvasSize }, () => Array(canvasSize).fill(' ')); 

        const points = JSON.parse(atob(symbol.data)); 
        points.forEach(point => {
            const x = Math.round(point.x / (100 / canvasSize)); 
            const y = Math.round(point.y / (100 / canvasSize)); 
            if (x >= 0 && x < canvasSize && y >= 0 && y < canvasSize) {
                canvas[y][x] = point.isTick ? '+' : '*'; 
            }
        });
        const stringRepresentation = canvas.map(row => row.join('')).join('\n');
        symbolChars.push(symbol.char); 
    });
    return symbolChars; 
}

function setMainUniquebaseCharMapping(modulus, alphabetBase)  {
    /*
        let baseLength = alphabetBase.length;
    const totalCount = baseLength**modulus;
    let chunkSize = 0;
    console.log(`setting ${totalCount} element inside main base`);
    if(totalCount > 100000*5){
        chunkSize = 100000;  
    }else if(totalCount >12000){
        chunkSize = 5000;  
    }
    let customs = [];
    for (let i = 0; i < totalCount; i += chunkSize) {
        const currentChunkSize = Math.min(chunkSize, totalCount - i);
        let customSpiralSymbols = [];
        for (let j = 0; j < currentChunkSize; j++) {
            const normalizedIndex = (i + j) / totalCount; 
            const index = normalizedIndex + Math.sin(normalizedIndex * 2 * Math.PI) * 0.1; 
            const customSymbol = createCustomSymbol(index, baseLength, modulus);
            customSpiralSymbols.push(customSymbol); 
        }
        const newSymbols = drawStringFromSymbols(customSpiralSymbols);
        customs.push(...newSymbols); 
    }
    console.log(`Total custom symbols created: ${customs.length}`);
    console.log(`Total inverse symbols: ${uniqueCharsInverse.length}`);
    for (var i = 0; i<customs.length; i++) {
        let InvSym = getModCharInverse(i, modulus, alphabetBase); // returns string of length M
        uniqueCharsInverse.push(InvSym); 
    }
    return customs;
    */
    let baseLength = alphabetBase.length;
    let uniqueChars = [];
    const totalCharsNeeded = baseLength ** modulus;
    const excludedRanges = [
        [0x3040, 0x309F], // Hiragana
        [0x30A0, 0x30FF], // Katakana
        [0x4E00, 0x9FFF], // Kanji
        [0x1780, 0x17FF], // Khmer
        [0x005E, 0x005E], // "^" symbol
        [0x007C, 0x007C], // "|" symbol
        [0x0024, 0x0024], // "$" symbol
        [0x005B, 0x005B], // "[" symbol
        [0x0030, 0x0039], // Digits "0-9"
        [0x0041, 0x005A], // Uppercase English letters (A-Z)
        [0x0061, 0x007A]  // Lowercase English letters (a-z)
    ];
    function isExcluded(codePoint) {
        for (let range of excludedRanges) {
            if (codePoint >= range[0] && codePoint <= range[1]) {
                return true;
            }
        }
        return false;
    }
    for (let i = 0x0000; i <= 0x10FFFF; i++) {
        if (!isExcluded(i) && (i <= 0xFFFF || i >= 0x10000)) {
            try {
                let char = String.fromCodePoint(i);
                if (!/\d/.test(char)) {
                    uniqueChars.push(char);
                }

                let InvSym = getModCharInverse(i, modulus, alphabetBase); // returns string of length M
                uniqueCharsInverse.push(InvSym); 
            } catch (e) {
                console.log('Error adding symbols', e);
            }
        }
        if (uniqueChars.length >= totalCharsNeeded) {
            break;
        }
    }
    console.log(`Unique character set length: ${uniqueChars.length}`);
    return uniqueChars;
}
function getModCharInverse(x, modulus, mainBase) {
    let myArray = [];
    let baseLength = mainBase.length;
    if (x === 0) {
        myArray = Array(modulus).fill(1); 
    } else {
        for (let i = modulus; i > 0; i--) {
            let lowerBound = Math.pow(baseLength, i - 1);
            let upperBound = Math.pow(baseLength, i);
            if (lowerBound <= x && x < upperBound) {
                let vector = [];
                for (let j = i; j > 0; j--) {
                    let divisor = Math.pow(baseLength, j - 1);
                    let q = Math.floor(x / divisor);
                    x = x % divisor;
                    vector.push(q + 1);
                }
                while (vector.length < modulus) {
                    vector.unshift(1);
                }
                myArray = vector;
                break;
            }
        }
    }
    let modChar = '';
    for (let i = 0; i < myArray.length; i++) {
        let charIndex = myArray[i] - 1; 
        if (charIndex >= 0 && charIndex < baseLength) {
            modChar += mainBase[charIndex];
        } else {
            console.log('char index out of range, cannot set data');
        }
    }

    return modChar; // Return the final character string
}
function setUniquePermutationMapping(modulus) {
    // use index formula to set permutation depending on index 
    let khmerChars = [];  
    let base = "01";
    const start = 0x1780; 
    const end = 0x17FF;   
    let permutationLimit = base.length ** modulus - 2; // minus 2 because we do not need the 
    let khmfersLimit = 48; // max rank 6 vector is using Cambodian symbols (Khmer chars)
    if (permutationLimit > khmfersLimit) {
        console.warn(`Capping permutation limit to khmfersLimit (${khmfersLimit})`);
        permutationLimit = khmfersLimit; 
    }

    var counter = 0;     
    for (let i = start; i <= end; i++) {
        if (counter >= permutationLimit) {
            break;
        } else {
            khmerChars.push(String.fromCharCode(i));
            let permStringInverse = getModCharInverse(counter, modulus, base); 
            uniqueChars2Inverse.push(permStringInverse);
            counter += 1;
        }
    }
    
    return khmerChars;
}
function setUniqueDigitCharsMapping(modulus,baseLength) {
    // use japanese symbols

    /*
    const totalCount = baseLength**modulus;
    console.log(`setting ${totalCount} elements to map the digit chunks to`);
    const chunkSize = 5000; 
    let customs = [];
    for (let i = 0; i < totalCount; i += chunkSize) {
        const currentChunkSize = Math.min(chunkSize, totalCount - i);
        let customSpiralSymbols = [];
        for (let j = 0; j < currentChunkSize; j++) {
            const normalizedIndex = (2*i + 3*j) / totalCount+ Math.sin(i+j); 
            const index = normalizedIndex + Math.sin(normalizedIndex * 2 * Math.PI) * 0.1; 
            const customSymbol = createCustomSymbol(index, baseLength, modulus);
            customSpiralSymbols.push(customSymbol); 
        }
        const newSymbols = drawStringFromSymbols(customSpiralSymbols);
        customs.push(...newSymbols);
    }
    console.log(`Total custom symbols to map digit chunks: ${customs.length}`);
    return customs;

    */
    let jpanChars = [];  
    let limit = baseLength ** modulus;

    // Define the ranges for Hiragana, Katakana, and a limited set of Kanji (for example)
    const hiraganaStart = 0x3040; // Hiragana range starts at 0x3040
    const hiraganaEnd = 0x309F;   // Hiragana range ends at 0x309F

    const katakanaStart = 0x30A0; // Katakana range starts at 0x30A0
    const katakanaEnd = 0x30FF;   // Katakana range ends at 0x30FF

    const kanjiStart = 0x4E00;    // Kanji range starts at 0x4E00
    const kanjiEnd = 0x9FAF;      // Kanji range ends at 0x9FAF

    // Calculate the total number of characters in all three ranges
    const totalHiragana = hiraganaEnd - hiraganaStart + 1;
    const totalKatakana = katakanaEnd - katakanaStart + 1;
    const totalKanji = kanjiEnd - kanjiStart + 1;
    const totalCharsInRange = totalHiragana + totalKatakana + totalKanji;

    // Throw an error if the limit exceeds the available characters in the combined ranges
    if (limit > totalCharsInRange) {
        throw new Error(`Symbol limit of ${limit} exceeds the available range of ${totalCharsInRange} characters.`);
    }

    var counter = 0;     
    // Add Hiragana characters
    for (let i = hiraganaStart; i <= hiraganaEnd && counter < limit; i++) {
        jpanChars.push(String.fromCharCode(i));
        counter++;
    }

    // Add Katakana characters
    for (let i = katakanaStart; i <= katakanaEnd && counter < limit; i++) {
        jpanChars.push(String.fromCharCode(i));
        counter++;
    }

    // Add Kanji characters
    for (let i = kanjiStart; i <= kanjiEnd && counter < limit; i++) {
        jpanChars.push(String.fromCharCode(i));
        counter++;
    }
    
    return jpanChars;
}

async function getNewDefinition(word) {
  const apiUrl =`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${MERRIAM_WEBSTER_API_KEY}`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    const data = await response.json();
    if (data.length === 0) {
      console.log('No definition found.');
      return null;
    }
    const entry = data[0];
    const wordInfo = {
      word: word,
      definition1: entry.shortdef[0] ? entry.shortdef[0] : null,
      definition2: entry.shortdef[1] ? entry.shortdef[1] : null,
      definition3: entry.shortdef[2] ? entry.shortdef[2] : null,
      definition4: entry.shortdef[3] ? entry.shortdef[3] : null,
      definition5: entry.shortdef[4] ? entry.shortdef[4] : null,
      definition6: entry.shortdef[5] ? entry.shortdef[5] : null,
      definition7: entry.shortdef[6] ? entry.shortdef[6] : null,
      definition8: entry.shortdef[7] ? entry.shortdef[7] : null,
      usage: entry.fl || 'Unknown',
      type: 'Unknown' 
    };
    return wordInfo;
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
}
async function getAllCollections() {
    try {
        const collections = await mongoose.connection.db.listCollections().toArray();
        return collections.map(col => col.name);
    } catch (error) {
        console.error('Error fetching collections:', error);
        return [];
    }
}
async function getAllModels() {
    const collectionNames = await getAllCollections();
    const models = {};
    collectionNames.forEach(name => {
        try {
            if (mongoose.models[name]) {
                models[name] = mongoose.models[name];
            } else {
                const schema = new mongoose.Schema({}, { strict: false }); 
                models[name] = mongoose.model(name, schema);
            }
        } catch (error) {
            console.error(`Error handling model for collection "${name}":`, error);
        }
    });
    return models;
}
async function verifyUserinputData(email, address, firstName, lastName){
    const isEmail = checkEmailString(email);
    const isAddress = await checkAddressString(address);
    const isFirstName = await checkIfName(firstName);
    const isLastName = await checkIfName(lastName);
    var localObjectVerifier = {
        email: isEmail,
        address: isAddress, 
        firstName: isFirstName, 
        lastName: isLastName,
    }
    return localObjectVerifier;
}

async function roulsResponse(question) {
    const lowercaseQuestion = question.toLowerCase(); // Convert question to lowercase

    const artworkPurchaseKeywords = [
      'buy a painting',
      'buy art',
      'purchase a painting',
      'buy a painting',
      'purchase artwork',
      'buy art',
      'purchase art',
      'acquire a painting',
      'acquire artwork',
      'acquire art',
      'get a painting',
      'get artwork',
      'get art',
      'obtain a painting',
      'obtain artwork',
      'obtain art',
      'invest in a painting',
      'invest in artwork',
      'invest in art',
      'procure a painting',
      'procure artwork',
      'procure art',
      'secure a painting',
      'secure artwork',
      'secure art',
      'own a painting',
      'own artwork',
      'own art',
      'purchase a masterpiece',
      'buy a masterpiece',
      'acquire a masterpiece',
      'get a masterpiece',
      'obtain a masterpiece',
      'invest in a masterpiece',
      'procure a masterpiece',
      'secure a masterpiece',
      'own a masterpiece',
      'how can i buy art',
      'how can i purchase art',
      'how can i get art',
      'how can i buy artwtwork',
      'How do I go about buying art?',
      'What is the process for purchasing art?',
      'How can I acquire artwork?',
      'What steps should I take to buy art?',
      'How do I purchase artwork?',
      'How can I get my hands on some art?',
      'How do I buy artwork?',
      'How can I get some artwork?',
      'Where do I start if I want to buy art?',
      'How do I begin the process of buying art?',
      'Where can I buy art?',
      'How can I start collecting art?',
      'What are the steps to buying art?',
      'How can I invest in art?',
      'How can I buy art as an investment without breaking the bank?',
      'What are the risks involved in buying art?',
      'How can I buy art that will appreciate in value?',
      'What are the advantages of buying art from galleries versus online?',
      'How can I find reputable art dealers?',
      'What should I know about buying art from private sellers?',
      'How can I buy art on a payment plan?',
      'What are the tax implications of buying art?',
      'How can I insure the art I buy?',
      'What are the legal considerations when buying art?',
      'How can I transport the art I buy safely?',
      'What are the costs associated with buying art?',
      'How can I store the art I buy properly?',
      'What are the best practices for maintaining the art I buy?',
      'How can I display the art I buy effectively?',
      'What are the trends in buying art currently?',
      'How can I find out about upcoming art events where I can buy art?',
      'What are the pitfalls to avoid when buying art?',
      'How can I educate myself about buying art?',
      'What are the common mistakes people make when buying art?',
      'How can I buy art with a social or environmental conscience?',
      'What are the benefits of buying art directly from artists versus through galleries?',
      'How can I buy art as a form of cultural investment?',
      'What role does technology play in buying art?',
      'How can I navigate the art market when buying art?',
      'What are the different approaches to buying art as an investment?',
      'How can I buy art that reflects my personal values?',
      'What are the advantages of buying art from emerging artists?',
      'How can I assess the quality of art before buying it?',
      'What are the best ways to discover new artists when buying art?',
      'How can I support diversity and inclusion when buying art?',
      'What are the implications of buying art on the secondary market?',
      'How can I buy art that aligns with my cultural heritage?',
      'What are the long-term considerations when buying art?',
      'How can I buy art that sparks conversation and dialogue?',
      'What are the ethical considerations when buying art from indigenous artists?',
      'How can I buy art that contributes to social change?',
      'What are the best strategies for building a diverse art collection?',
      'How can I incorporate digital art into my collection?',
      'What role does provenance play when buying art?',
      'How can I buy art in a way that supports sustainable practices?',
      'What are the benefits of buying art from local artists?',
      'How can I buy art that tells a story?',
      'What are the implications of buying art from non-traditional sources?',
      'How can I buy art as a means of preserving cultural heritage?',
      'What are the considerations when buying art for public spaces?',
      'How can I buy art that challenges conventional notions?',
      'What are the potential risks and rewards of buying art online versus in person?',
      'How can I buy art that captures the spirit of a specific time or place?',
      'What are the advantages of buying art from diverse perspectives?',
      'How can I buy art that fosters inclusivity and representation?',
      'What are the considerations when buying art for investment versus personal enjoyment?',
      'How can I buy art that resonates with contemporary issues?',
      'What are the implications of buying art from international artists?',
      'How can I buy art that promotes cultural exchange and understanding?',
      'What are the best ways to support emerging artists when buying art?',
      'How can I buy art that challenges stereotypes and biases?',
      'What are the considerations when buying art as a form of political expression?',
      'How can I buy art that contributes to community development?',
      'How do I go about buying art?',
      'What is the process for purchasing art?',
      'How can I acquire artwork?',
      'What steps should I take to buy art?'
];
    const metamaskKeywords = ['metamask', 'connect', 'wallet'];
    const chatKeywords = ['chat', 'communicate', 'others'];

    const keyWordsForQuestion = ['how', 'where', 'when', 'what', 'why', 'which', 'who', 'whom', 'whose'];

    const askingDefinition = ['definition of', 'meaning of', 'defintion of', 'defnition of', 'defition of', 
                              'what is a', 'what is the meaning of', 'what is the definition of', 
                              'what is the meaning of the word', 'what is a', 'definition of a', 'what does the word'];
    const parts = [];
    let currentPart = '';


    for (let word of lowercaseQuestion.split(' ')) {
        if (keyWordsForQuestion.includes(word)) {
            if (currentPart.trim() !== '') {
                parts.push(currentPart.trim());
            }
            currentPart = ''; 
        }
        currentPart += word + ' ';
    }

    if (currentPart.trim() !== '') {
        parts.push(currentPart.trim());
    }

    // Extract the word from the parts
    let targetWord = '';
    for (let part of parts) {
        const match = part.match(/(?:of|mean\s*)\s+["']?(.*?)[?"']?$/);
        if (match && match[1]) {
            targetWord = match[1];
            break; // Stop searching once the word is found
        }
    }
    let response = '';
    let responseArray = [];
    let partIndex = -1;

    // Array of similar time phrases
    const similarTimePhrases = [
        "what time is it",
        "current time",
        "time right now",
        "time is it",
        "what's the time",
        "what hour is it",
        "what's the current time",
        "time now",
        "tell me the time",
        "what is the time",
        "what's the current time",
        "what is the current hour",
        "tell me what time it is",
        "can you tell me the time",
        "what is the hour",
        "do you know what time it is",
        "time at the moment",
        "please tell me the time",
        "what time is it now",
        "current hour",
        "could you tell me the time",
        "what is the present time",
        "time currently",
        "time it is",
        "tell me the current time",
        "time now please",
        "what time it is right now",
        "current time please",
        "what's the time now",
        "can you tell me what time it is",
        "time right now please",
        "could you tell me what time it is now",
        "please tell me what time it is",
        "what time is it at the moment",
        "could you please tell me the time",
        "what is the time now",
        "can you tell me the current time",
        "what hour is it now",
        "what's the hour",
        "do you know the time",
        "what's the current time please",
        "tell me what time it is now",
        "what is the time at present",
        "what is the time currently",
        "what is the current time now",
        "tell me the time right now"
    ];

    for (let part of parts) {
      partIndex +=1;
      if(checkString(part)){
        let currentWords = part.split(" ");
        for(const word of currentWords){
          let matchingObj = knownDefinitions.find(obj => obj.word === word);
          if(matchingObj){
          }else{
              getNewDefinition(word).then((result)=>{
                if(result !== null){
                    //console.log('trying to save new definition into local array on server', result);
                    knownDefinitions.push(result);
                }else{
                  //console.log('getNewDefinition() function returned null instead of object to push to array');
                }
              }).catch(error=>{
                  console.log('Error calling  getNewDefinition() function near line 2485', error);
              });
          }
        }

        //2) determine if basic question and use easy statement returns below

        //3) else 
        // determine if question, command, or statement before executing commands from memory. 

        if (artworkPurchaseKeywords.some(keyword => part.includes(keyword))) {
            response = "To buy a painting, you can visit our website's art gallery section and select the painting you like. Then, follow the instructions to make a purchase. Make sure metamask is installed and the extension is available.";
        } 
        else if (metamaskKeywords.some(keyword => part.includes(keyword))) {
            response = "To connect your Metamask wallet, please click the connect button on the top right corner of the webpage.";
        } 
        else if (chatKeywords.some(keyword => part.includes(keyword))) {
            response = "You can chat with others on our website by navigating to the chat section and joining a conversation or starting a new one.\n\n";
        }else if (helloPhrases.some(phrase => part.toLowerCase().includes(phrase))) {

            var professionalGreetings = [
                "Hello, how may I assist you?",
                "Welcome, how may I be of service?",
                "Greetings, how can I assist you today?",
                "Hello there, what can I help you with?",
                "Hi, how may I assist you today?",
                "Hello, what can I do for you today?",
                "Hi there, how can I help you?",
                "Hello, how can I be of assistance?",
                "Welcome, how may I assist you?",
                "Hello, what brings you here today?",
                "Hi, how may I help you?",
                "Hello there, how can I be of assistance?",
                "Hi, how can I assist you?",
                "Hello, how may I assist you right now?",
                "Greetings, how can I assist you right away?"
            ];
            var randomIndex = Math.floor(Math.random() * professionalGreetings.length);
            response = professionalGreetings[randomIndex];

        } else if (similarTimePhrases.some(phrase => part.toLowerCase().includes(phrase))) {
            const currentTime = new Date().toLocaleTimeString();
            response = `The current time is ${currentTime}.\n\n`;
        } else if (part.toLowerCase().includes("who built this website")) {
            response = "This website was built by [Roy Burson].\n\n";
        } else if (part.toLowerCase().includes("thanks") || part.toLowerCase().includes("Thankss")|| part.toLowerCase().includes("thank you")) {
            response = "Your welcome if there is anything else i can assist with let me know!.\n\n";
        }else if(askingDefinition.some(phrase => part.toLowerCase().includes(phrase))){
          const thisWord = targetWord;
          //const thisWord = part.substring(part.lastIndexOf(" ")+1);
          const stripedWord = thisWord.replace(/\s/g, "");
          //console.log(' seems like the user is asking for a definition of:', stripedWord);
          
          let matchingObj = knownDefinitions.find(obj => obj.word === stripedWord);

          if (matchingObj) {
              //console.log('We found a matching word:', matchingObj);

              let formattedString = Object.entries(matchingObj)
                  .filter(([key, value]) => value !== null) 
                  .map(([key, value]) => `${key}: ${value}`)
                  .join('\n\n'); 

              response = formattedString + '\n';
              //console.log('we formatted the json object to string:', response);
          } else {
              response = 'We could not find the word you are looking for.\n\n';
          }
          
        } else {
            const questionHasAlreadyBeenAsked0 = previousQuestion0.findIndex(obj=> obj.question == part);
            const questionHasAlreadyBeenAsked1 = previousQuestion1.findIndex(obj=> obj.question == part);
            if(questionHasAlreadyBeenAsked0 !== -1){
                response = previousQuestion0[questionHasAlreadyBeenAsked0].response;
            }else if(questionHasAlreadyBeenAsked1 !== -1){
                response = previousQuestion1[questionHasAlreadyBeenAsked1].response;
            }else{
                response = await fetchOpenAIResponse(part);
                const AIeventObject = {
                    question: part,
                    response: response
                };

                if(questionHasAlreadyBeenAsked0.length <= max_array_length){
                    previousQuestion0.push(AIeventObject);     
                }else if(questionHasAlreadyBeenAsked1.length <= max_array_length){
                    previousQuestion1.push(AIeventObject);
                }else{
                    console.log('Memory system full do not push to array');
                }
            }
        }
      }else{
        response = 'Sorry I do not accept inappropriate input and bad words!';
      }

        responseArray.push([{rsp: response.trim()}]);
    }
    return responseArray
}

async function fetchOpenAIResponse(question) {
    try {
        const stream = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: question }],
            stream: true,
        });
        let aiResponse = '';
        for await (const chunk of stream) {
            aiResponse += chunk.choices[0]?.delta?.content || "";
        }
        return aiResponse.trim();
    } catch (error) {
        console.error('Error fetching AI response:', error.response ? error.response.data : error.message);
        return "I'm sorry, I couldn't understand your question or it's not related to the topics I can assist with.\n\n";
        console.log('openAI failed', error);
    }
}


function getUniquePermutationSymbol(word, khmerChars, modulus) {
    if (word.length !== modulus) {
        throw new Error(`Word must be exactly ${modulus} characters long.`);
    }
    let permutation = []; const baseLength = 2;
    for(const char of word){
        if(char === char.toUpperCase()){
            permutation.push(1);
        }else{
            permutation.push(0);
        }
    }
    let index = 0;
    let base = '01';
    // use Euclidean algo to get back unique M-char string that is in base 2 that correspond to the permutation
    // i.e if it returns the 4 char word in base 2 "1011" this correspind to (1,0,1,1) permutation (we can turn it into one);
    for(var k =1; k<=permutation.length; k++){
        let digit = permutation[k];
        let indexOfDigitInBase = base.indexOf(digit)+1; 
        if(k!= permutation.length) {
            baseLength** (modulus-k) * (indexOfDigitInBase -1);
        }else{
            index += (indexOfDigitInBase);
        }
    }
    return khmerChars[index]; 
}

function separateIntoBestChunk(base64String, chunkLength) {
    const chunks = [];
    let buffer = "";
    let i = 0;
    const pushBuffer = () => {
        if (buffer.length) {
            chunks.push(buffer);
            buffer = ""; 
        }
    };
    const charType = (char) => {
        if (/[A-Z]/.test(char)) return 'upper';
        if (/[a-z]/.test(char)) return 'lower';
        if (/[0-9]/.test(char)) return 'number';
        return 'other';
    };

    while (i < base64String.length) {
        let char = base64String[i];
        let type = charType(char);

        if (type === 'upper' || type === 'lower') {
            let letterChunk = "";
            while (i < base64String.length && /[A-Za-z]/.test(base64String[i]) && letterChunk.length < chunkLength) {
                letterChunk += base64String[i];
                i++;
            }
            if (letterChunk.length === 3 || i === base64String.length || charType(base64String[i]) !== 'number') {
                chunks.push(letterChunk);
            } else {
                chunks.push(letterChunk.slice(0, 3)); 
                buffer = letterChunk.slice(3); 
            }
        } else if (type === 'number') {
            let numChunk = "";
            while (i < base64String.length && charType(base64String[i]) === 'number' && numChunk.length < chunkLength) {
                numChunk += base64String[i];
                i++;
            }
            chunks.push(numChunk);
        } else {
            pushBuffer();
            chunks.push(char);
            i++;
        }
    }
    pushBuffer();
    return chunks;
}

function BursonBase64Encrypted(base64String, modulus) {
    base64String = base64String.replace(/^data:image\/[a-z]+;base64,/, '');
    let bestChunks = separateIntoBestChunk(base64String, modulus);
    console.log('Image length before compression applied', base64String.length);
    console.log('best chunks length (how many loops inside compressor):', bestChunks.length);
    console.log('Image in base 64):', base64String);
    let encryptedString = '';
    let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let processedIndices = new Set(); 
    for(var i = 0; i< bestChunks.length; i++){
        const chunk = bestChunks[i];
        let currentIndex = i;
        if (processedIndices.has(currentIndex)) return;
        let maxCount = getMaxChunkCount(chunk, bestChunks); 
        let frontEncryption;
        if (maxCount > 1 && chunk.length === modulus) {
            let isUpperCase = chunk === chunk.toUpperCase();
            let isLowerCase = chunk === chunk.toLowerCase();
            let isEnglishChunk = [...chunk].every(char => alphabet.includes(char));
            let isStringDigits = parseInt(chunk); 
            let encryptedChunk;
            if (maxCount === 1) {
                if ((isUpperCase || isLowerCase) && isEnglishChunk && chunk.length === modulus) {
                    uniqueSymbol = getUniqueModulusChar(chunk.toUpperCase(), uniqueChars, modulus);
                    frontEncryption = `${uniqueSymbol}`;
                } else if (!isUpperCase && !isLowerCase && isEnglishChunk) {
                    uniqueSymbol = getUniquePermutationSymbol(chunk, uniqueChars2, modulus);
                    frontEncryption = `${uniqueSymbol}`;
                } else if (!isUpperCase && !isLowerCase && !isEnglishChunk && !isStringDigits) {
                    frontEncryption = `${chunk}`;
                }else if(isStringDigits){
                    let indexOfJapanChar = isStringDigits ;
                    let uniqueJapanChar = uniqueChars3[indexOfJapanChar];
                    frontEncryption = `${uniqueJapanChar}`;
                }else{
                    frontEncryption = `${chunk}`;
                }
                frontEncryption = chunk; 
            } else if(maxCount!=0) {
                let uniqueSymbol;
                if (isUpperCase && isEnglishChunk && chunk.length === modulus) {
                    uniqueSymbol = getUniqueModulusChar(chunk.toUpperCase(), uniqueChars, modulus);
                    frontEncryption = `~${maxCount}|${uniqueSymbol}`; // tilda seperates from other numbers when decrypting we need this 
                } else if(isLowerCase && isEnglishChunk && chunk.length === modulus) {
                    uniqueSymbol = getUniqueModulusChar(chunk.toUpperCase(), uniqueChars, modulus);
                    frontEncryption = `~${maxCount}|${uniqueSymbol}^`;
                } else if (!isUpperCase && !isLowerCase && isEnglishChunk) {
                    uniqueSymbol = getUniquePermutationSymbol(chunk, uniqueChars2, modulus);
                    frontEncryption = `${maxCount}|${uniqueSymbol}`;
                }else if(isStringDigits){
                    let indexOfJapanChar = isStringDigits;
                    let uniqueJapanChar = uniqueChars3[indexOfJapanChar];
                    frontEncryption = `~${maxCount}|${uniqueJapanChar}`;
                } else if (!isUpperCase && !isLowerCase && !isEnglishChunk) {
                    frontEncryption = `~${maxCount}|${chunk}`;
                }else{
                    frontEncryption = `~${maxCount}|${chunk}`;
                }
            }else{ // this should never fire unless max chunk is undefined
                frontEncryption+= chunk;
            }
            encryptedString += frontEncryption; 
            for (let i = 1; i < maxCount; i++) {
                if (currentIndex + i < bestChunks.length) {
                    processedIndices.add(currentIndex + i);
                }
            }
        }else if(chunk.includes('+') || chunk.includes('-')) {
            if(maxCount > 1){
                for(var i=0; i< maxCount; i++){
                    encryptedString+= chunk;
                }
            }else{
                encryptedString += chunk;
            }
        }else if(maxCount == 1 && chunk.length === modulus){
            let isUpperCase = chunk === chunk.toUpperCase();
            let isLowerCase = chunk === chunk.toLowerCase();
            let isEnglishChunk = [...chunk].every(char => alphabet.includes(char));
            let isStringDigits = parseInt(chunk); 
            let encryptedChunk;
            if (isUpperCase && isEnglishChunk && chunk.length === modulus) {
                uniqueSymbol = getUniqueModulusChar(chunk.toUpperCase(), uniqueChars, modulus);
                frontEncryption = `${uniqueSymbol}`;
            }else if (isLowerCase && isEnglishChunk && chunk.length === modulus) {
                uniqueSymbol = getUniqueModulusChar(chunk.toUpperCase(), uniqueChars, modulus);
                frontEncryption = `${uniqueSymbol}^`;
            } else if (!isUpperCase && !isLowerCase && isEnglishChunk) {
                let permutationFrontEncryption =  getUniqueModulusChar(chunk.toUpperCase(), uniqueChars, modulus);
                uniqueSymbol = getUniquePermutationSymbol(chunk, uniqueChars2, modulus);
                frontEncryption = `${uniqueSymbol}${permutationFrontEncryption}`;
            } else if (!isUpperCase && !isLowerCase && !isEnglishChunk) {
                frontEncryption = `${chunk}`;
            }else if(isStringDigits){
                let indexOfJapanChar = isStringDigits ;
                let uniqueJapanChar = uniqueChars3[indexOfJapanChar];
                frontEncryption = `${uniqueJapanChar}`;
            }else{
                frontEncryption = `${chunk}`;
            }
            encryptedString += frontEncryption;
        }else{
            encryptedString += chunk;
        }
        if(maxCount >1){
            i += maxCount - 1;
        }
    }
    console.log('Image length before Owlphaloop', encryptedString.length);
    console.log('Image base representation after encryption', encryptedString);

    let owlphaString = performOwlphaLoop(encryptedString);
    console.log('Image length after owl compression', owlphaString.length);
     console.log('Image representation after after Owlphaloop', owlphaString);
    return owlphaString;
}
function performOwlphaLoop(encryptedString) {
    let result = '';
    let i = 0;
    function findPattern(str, startIndex) {
        for (let patternLength = Math.floor((str.length - startIndex) / 2); patternLength >= 1; patternLength--) {
            let pattern = str.substring(startIndex, startIndex + patternLength);
            let repeatCount = 1;
            let j = startIndex + patternLength;
            while (str.substring(j, j + patternLength) === pattern) {
                repeatCount++;
                j += patternLength;
            }
            if (repeatCount > 1) {
                return { pattern, repeatCount, patternLength };
            }
        }
        return null;
    }
    while (i < encryptedString.length) {
        let patternData = findPattern(encryptedString, i);
        if (patternData) {
            let { pattern, repeatCount, patternLength } = patternData;
            let compressedLength = `[${repeatCount}$${pattern}$`.length;
            let originalLength = repeatCount * patternLength;

            if (compressedLength < originalLength) {
                result += `[${repeatCount}$${pattern}$`;
                i += repeatCount * patternLength; 
            } else {
                result += encryptedString.substring(i, i + patternLength);
                i += patternLength;
            }
        } else {
            result += encryptedString[i];
            i++;
        }
    }
    return result;
}
function reverseOwlphaLoop(encryptedString) {
    let lastDollarPosition = null;
    let intgerChunk = ''; 
    let intermediateString = '';
    let skipMode = false; 
    for (var i = 0; i < encryptedString.length; i++) {
        let currentChunk = '';
        if (encryptedString[i] === '$') {
            skipMode = false; 
            intgerChunk = '';
            if (lastDollarPosition) {
                for (var k = i - 1; k >= lastDollarPosition; k--) {
                    if (encryptedString[k] === '[') {
                        break;
                    } else {
                        intgerChunk = encryptedString[k] + intgerChunk;
                    }
                }               
            } else {
                for (var k = i - 1; k >= 0; k--) {
                    if (encryptedString[k] === '[') {
                        break;
                    } else {
                        intgerChunk = encryptedString[k] + intgerChunk; 
                    }
                }
            }
            let chunk = '';
            for (var l = i + 1; l < encryptedString.length; l++) {
                if (encryptedString[l] === '$') {
                    lastDollarPosition = l;
                    break;
                } else {
                    chunk += encryptedString[l];
                }
            }
            let loopLength = parseInt(intgerChunk);
            if (!isNaN(loopLength)) {
                for (var q = 0; q < loopLength; q++) {
                    currentChunk += chunk;
                }
                intermediateString += currentChunk;
            }
            let difference = lastDollarPosition - i;
            i += difference;
        } else if (encryptedString[i] === '[') {
            skipMode = true; 
        } else if (!skipMode) {
            intermediateString += encryptedString[i];
        }
    }
    return intermediateString;
}
function getUniqueModulusChar(word, charArray, modLength) {
    if (word.length !== modLength) {
        throw new Error(`Input word must be exactly ${modLength} characters long`);
    }
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let base = alphabet.length;    
    let calculatedIndex = 0;

    /* we go left to right:  AAB  -> 2 , AAAC -> 3, ...  ZZZZ -> 26^4 


                                    AAAB -> 26^3(indexOf[A]-1)+26^2(indexOf[A]-1)+26 (indexOf[A]-1) + (indexOf[B]) 
                                            = 26^3*0 + 26^2*0 + 26*0 + 2
                                            = 2 

        Proof: 
           Assume it hold for (A,B,C,D) show it hold for (A + I, B + J, C + K, D + L) for arbitrary (I, J, K, L)

    */ 
    for (var i = 1; i<= modLength; i++) {
        if(i != modLength){
            calculatedIndex += (alphabet.length ** (modLength-i)) * (alphabet.indexOf(word[i-1])+1)
        }else{
            calculatedIndex += alphabet.indexOf(word[i-1])+1 
        }

    }
    
    let uniqueIndex = calculatedIndex;
    if (uniqueIndex >= 0 && uniqueIndex <= charArray.length) {
        return charArray[uniqueIndex]; 
    } else {
        console.log('Error index out of boundary', calculatedIndex);
        throw new Error("Unique index is out of bounds of the character array");
    }
}

function getMaxChunkCount(chunk, bestChunks) {
    let maxCount = 0;
    let startIndex = bestChunks.indexOf(chunk);
    if (startIndex === -1) {
        return maxCount;
    }
    for (let i = startIndex; i < bestChunks.length; i++) {
        if (bestChunks[i] === chunk) {
            maxCount += 1;
        } else {
            break; 
        }
    }
    return maxCount;
}

function mapCharsToTransformedWord(chineseChar, khmerChar) {
    let indexOfChineseChar = uniqueChars.indexOf(chineseChar);
    const reverseChinaChunk = uniqueCharsInverse[indexOfChineseChar];
    let caseValues = []; 
    let transformedWord = '';
    if (!reverseChinaChunk) {
        throw new Error("Chinese character not found in reverse mapping.");
    }
    if (typeof reverseChinaChunk !== 'string') {
        throw new Error("Retrieved value is not a string.");
    }
    const khmerIndex = uniqueChars2.indexOf(khmerChar);
    if (khmerIndex === -1) {
        throw new Error("Khmer character not found in uniqueKhmerChars array.");
    }
    let stringPerm = uniqueChars2Inverse[khmerIndex];
    for(var i = 0; i< stringPerm.length; i++ ){
        caseValues.push(parseInt(stringPerm[i]));
    }

    for(var i = 0; i<reverseChinaChunk.length; i++){
        let char = reverseChinaChunk[i];
        if(caseValues[i] == 0){
            transformedWord+= char.toLowerCase();
        }else{
           transformedWord+= char.toUpperCase();
        }
    }
    //console.log('word before being permuted ', reverseChinaChunk);
    //console.log('transformedWord from map chars to transformedWord', transformedWord);
    return transformedWord;
}
function getBarNumberAttachment(i, encryptedString){
    let repeatCount = '';
    for (let j = i - 1; j >= 0; j--) {
        const previousChar = encryptedString[j];
        if (!isNaN(previousChar)) {
            repeatCount = previousChar + repeatCount;
        } else {
            break;
        }
    }   
    return repeatCount;
}
function isInMainBase(char){
    const uniqueCharsSet = new Set(uniqueChars);
    return uniqueCharsSet.has(char);
}
function isbaseDigit(char){
    const uniqueCharsSet = new Set(uniqueChars3);
    return uniqueCharsSet.has(char);
}
function isAKMfer(char){
    const uniqueCharsSet = new Set(uniqueChars2);
    return uniqueCharsSet.has(char);
}
function numberToLetters(num, baseLength) {
    let letters = [];
    for (let i = 0; i < 3; i++) {
        let remainder = num % baseLength; 
        letters.push(String.fromCharCode(remainder + 'A'.charCodeAt(0))); 
        num = Math.floor(num / baseLength); 
    }
    return letters.reverse().join('');
}

function BursonBase64Decrypt(encryptedString, modulus) {
    //console.log('unique chars inverse', uniqueCharsInverse);
    console.log('Calling Burson decompression with length', encryptedString.length);
    let decryptedString = ''; 
    let alphabet = `ABCDEFGHIJKLMNOPQRSTUVWXYZ`;

    encryptedString = reverseOwlphaLoop(encryptedString);
    console.log('Image length after reversing owlphaLoop', encryptedString.length);
    console.log('Image to decrypt:', encryptedString);

    for (let i = 0; i < encryptedString.length; i++) {
        const char = encryptedString[i];

        // Handle the "|" case for repeating characters
        if (char === '|') {
            let repeatCount = getBarNumberAttachment(i, encryptedString); 
            const repeatCountNumber = parseInt(repeatCount) || 1;
            let nextChar = encryptedString[i + 1]; 
            let decryptedKMFERString = '';
            let newString = '';

            if (isInMainBase(nextChar)) {
                if (i != encryptedString.length) {
                    const getKmferChar = encryptedString[i + 1];

                    if (isAKMfer(getKmferChar)) {
                        decryptedKMFERString = mapCharsToTransformedWord(nextChar, getKmferChar);
                        i += 2;
                    } else {
                        let index = uniqueChars.indexOf(nextChar);
                        //console.log('Index for char', nextChar, ':', index);  // Debug index
                        let modCharInverse = uniqueCharsInverse[index];
                        //console.log('Inverse for char', nextChar, ':', modCharInverse);  // Debug inverse
                        decryptedKMFERString += modCharInverse;
                        i += 1;
                    }
                } else {
                    let index = uniqueChars.indexOf(nextChar);
                    //console.log('Index for char', nextChar, ':', index);  // Debug index
                    let modCharInverse = uniqueCharsInverse[index];
                    //console.log('Inverse for char', nextChar, ':', modCharInverse);  // Debug inverse
                    decryptedKMFERString += modCharInverse;
                }
            } 
            else if (isbaseDigit(nextChar)) {
                let jpanIntegerString = uniqueChars3.indexOf(nextChar).toString();
                decryptedKMFERString += jpanIntegerString;
            } 
            else {
                let parts = '';
                for (let m = 1; m <= modulus; m++) {
                    parts += encryptedString[i + m];
                }
                decryptedKMFERString += parts;
                i += modulus;
            }

            for (let k = 0; k < repeatCountNumber; k++) {
                newString += decryptedKMFERString;
            }
            decryptedString += newString;
        }
        // Handle characters in the main base alphabet
        else if (isInMainBase(char)) {
            let decryptedKMFERString = '';
            let index = uniqueChars.indexOf(char);
            //console.log('Index for char', char, ':', index);  // Debug index
            let modCharInverse = uniqueCharsInverse[index];
            //console.log('Inverse for char', char, ':', modCharInverse);  // Debug inverse

            if (i != encryptedString.length) {
                const nextChar = encryptedString[i + 1];

                if (isAKMfer(nextChar)) {
                    decryptedKMFERString += mapCharsToTransformedWord(char, nextChar);
                    i += 1;
                } else if (nextChar === '^') {
                    decryptedKMFERString += modCharInverse.toLowerCase();
                } else {
                    decryptedKMFERString += modCharInverse;
                }
            } else if (char === '^') {
                // Do nothing for "^"
            } else {
                decryptedKMFERString = modCharInverse;
            }

            decryptedString += decryptedKMFERString;
        } 
        else if (isbaseDigit(char)) {
            decryptedString += uniqueChars3.indexOf(char).toString();
        } 
        else if (char != '^' && !parseInt(char)) {
            decryptedString += char;
        } 
        else if (parseInt(char)) {
            let nextChar = encryptedString[i]; 
            let skipperRouny = 0;

            if (nextChar != '|') {
                let newStringint = '';
                for (let j = 0; j < decryptedString.length; j++) {
                    let nextCharInt = decryptedString[j];
                    if (!parseInt(nextCharInt)) {
                        break;
                    } else {
                        newStringint += nextCharInt;
                        skipperRouny += 1;
                    }
                }
                if (newStringint != '') {
                    let stringInt = parseInt(newStringint);
                    i += skipperRouny;  // Skip past integer sequence
                }
            }
        }
    }
    
    return decryptedString;
}
function isDigit(char) {
    return /\d/.test(char);
}
async function validateTransaction(transactionHash) {
    const apiUrl = `https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${transactionHash}&apikey=YOUR_API_KEY`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data && data.result) {
            const transaction = data.result;
            const { from, to, value } = transaction;
            if (from && to && value) {
                // Transaction is valid
                console.log('Transaction is valid:', transaction);
                return true;
            } else {
                // Transaction is missing required properties
                console.error('Transaction is missing required properties:', transaction);
                return false;
            }
        } else {
            // Transaction not found
            console.error('Transaction not found:', transactionHash);
            return false;
        }
    } catch (error) {
        console.error('Error validating transaction:', error);
        return false;
    }
}
function compileContract(contractSource, contractName) {
    console.log('trying to compile into bytcode');
    try{
        const input = {
            language: 'Solidity',
            sources: {
                'Contract.sol': {
                    content: contractSource,
                },
            },
            settings: {
                outputSelection: {
                    '*': {
                        '*': ['abi', 'evm.bytecode.object'],
                    },
                },
            },
        };
        const output = JSON.parse(solc.compile(JSON.stringify(input)));
        if (output.errors) {
            output.errors.forEach(err => {
                console.error(err.formattedMessage);
            });
            return {abi: null, bytecode: null};
        }else{
            const contract = output.contracts['Contract.sol'][Object.keys(output.contracts['Contract.sol'])[0]];
            return {abi: contract.abi, bytecode: contract.evm.bytecode.object};
        }
        console.log('compiled contract successfully');
    }catch(error){
        console.log("Error calling the function compileContract(contractSource, contractName)", error);
    }
}
async function makeDeployableContract(contractData) {
    console.log('Attempting to call use data', contractData);
    
    try {
        const { solidityContract, name, token, options } = contractData;
        const { abi, bytecode } = compileContract(solidityContract, name);
        return {
            abi,
            bytecode,
        };
    } catch (error) {
        console.error('Error deploying contract:', error);
        return {
            abi: null,
            bytecode: null
        };
    }
}
const handleHttpRequest = async (req, res, io) => {
    let requestArray = [];
    if (req.method == 'POST' && req.url == '/add-painting') {
        try{
            let body = '';
            req.on('data', (chunk) => {
                body += chunk.toString();
            });

            req.on('end', async () => {
                try {
                    const thisObj = JSON.parse(body);
                    if(thisObj.passcode == paintingUploadCode){
                            const newPainting = new paintingModel({
                                image: thisObj.image,
                                name: thisObj.name,
                                dateCreated: thisObj.dateCreated,
                                inStock: thisObj.inStock,
                                artist: thisObj.artist,
                                description: thisObj.description,
                                legalContract: thisObj.legalContract,
                                price: thisObj.price,
                                dateSold : thisObj.dateSold,
                                dateUploaded: thisObj.dateUploaded,
                                views: 0

                            });  
                            newPainting.save().then((result)=>{
                                console.log('trying to call large emit to all clients');
                                const paintingString = JSON.stringify(newPainting);
                                const chunkSize = 1024;
                                let chunks = [];
                                for (let i = 0; i < paintingString.length; i += chunkSize) {
                                    chunks.push(paintingString.substring(i, i + chunkSize));
                                }
                                chunks.forEach((chunk, index) => {
                                    io.emit('updatePaintingChunk', { chunk, index, total: chunks.length });
                                });
                                io.emit('updatePaintingComplete');
                                console.log('console went through check on client side');
                                res.end(JSON.stringify({ success: true }));
                            }).catch((error) =>{
                                console.log(error);
                                res.end(JSON.stringify({success: false})); 
                            });
                    }else{
                        console.log('could not uplaod because passcode was not correct ');
                        res.end(JSON.stringify({success: false})); 
                    }
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Bad Request' }));
                }
            });
        }catch(error){
            console.log('Error with fetch request /add-painting request');
        }
    } else if (req.method === 'GET' && Series2Holders.includes(req.url.slice(1)) || Series1Holders.includes(req.url.slice(1)) ) {
        try {
            const userHTMLPAGE = '';
            console.log(`Accessing data for wallet address: ${req.url.slice(1)}`);
        } catch (error) {
            console.log('Error with fetch request:', req.url);
        }
    }else if (req.method === 'GET' && req.url == '/getALLDeployedCollections') {

        try{
            const contracts = async () => {
                const contracts = await collectionModel.find({});
                return contracts
            };
            contracts().then((result) => {
                const data = zlib.gzipSync(JSON.stringify(result))
                if (result.length > 0) {
                    res.setHeader('Content-Encoding', 'gzip');
                    res.end(data);
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({success: false})); 
                }
            }).catch((error) => {
                console.error(error); 
                console.log('There was an error calling the paintings() function, if  errno: -3008,the error is internet');
            });

        }catch(error){
            console.log('Error with fetch request /getALL-paintings');
        }

    }else if(req.method == 'GET' && req.url == '/getALL-paintings'){
        try{
            const paintings = async () => {
                const paintings = await paintingModel.find({});
                return paintings
            };
            paintings().then((result) => {
                if (result.length > 0) {
                    const paintingsData = zlib.gzipSync(JSON.stringify(result)); 
                    res.setHeader('Content-Encoding', 'gzip');
                    res.end(paintingsData);
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false })); 
                }
            }).catch((error) => {
                // if  errno: -3008,the error is internet connection 
                console.error(error); 
                console.log('There was an error calling the paintings() function, if  errno: -3008,the error is internet');
            });

        }catch(error){
            console.log('Error with fetch request /getALL-paintings');
        }

    }else if(req.method == 'POST' && req.url == '/saveNFTCollection'){
        try {
            let body = '';
            req.on('data', (chunk) => {
                body += chunk.toString();
            });

            req.on('end', async () => {
                try {
                    const data = JSON.parse(body);
                    console.log('Attempting to save data to database -->', data);
                    const collectionModelInstance = new collectionModel({
                        contractName: data.contractName,
                        ERCStandard: data.ERCStandard,
                        contractAddress: data.contractAddress,
                        contractABI: JSON.stringify(data.contractABI), 
                        collectionBackgroundImage: data.collectionBackground 
                    });
                    try {
                        await collectionModelInstance.save();
                        console.log('Item saved to database');
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: true, code: 100 }));
                    } catch (error) {
                        console.error('Error saving item:', error);
                        res.writeHead(210, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: false, code: 121 , error: error.message}));
                    }
                } catch (error) {
                    console.error("Error saving item to database", error);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, code: 102, error: error.message }));
                }
            });
            req.on('error', (error) => {
                console.error('Request error:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, code: 103, error: error.message }));
            });
        } catch (error) {
            console.error('Error handling fetch request /saveNFTCollection', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, code: 104, error: error.message }));
        }

    }else if(req.method == 'POST' && req.url == '/deploy-a-contract'){
        console.log('calling to deploy contract');
        try{
            let body = '';
            req.on('data', (chunk) => {
                body += chunk.toString();
            });
            req.on('end', async () => {
                const data = JSON.parse(body);
                if(data.passcode === deployableContractPasscode){
                    if(data.lastChunk == true){                  
                        stringChunk += data.backgroundImage;
                        data.backgroundImage = stringChunk;
                        data.solidityContract = soliditychunk;
                        stringChunk = '';
                        soliditychunk = '';
                        console.log('trying to make contract using data', data);  
                        console.log('trying to call makeDeployableContract() function inside server');
                        const deployableContract = await makeDeployableContract(data); 
                        console.log("deployableContract returns", deployableContract);
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: true, contractABI: deployableContract.abi, bytecode: deployableContract.bytecode, error: null })); 
                    }else{
                        stringChunk += data.backgroundImage;
                        soliditychunk += data.solidityContract;
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({success: false, contractABI: null, bytecode: null, error: 10200299222222 }));
                    }
                }else{
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({success: false, contractABI: null, bytecode: null, error: 10983838122 }));
                }
            });
        }catch(error){
            console.log('Error with fetch request /deploy-a-contract');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, contractABI: null, bytecode: null, error: 1020202022222 })); 
        }

    }else if (req.method === 'POST' && req.url === '/getALL-NFTs') {
        let body = '';
        
        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                const getNFTs = async (name) => {
                    try {
                        const allModels = await getAllModels();
                        const specificModel = allModels[name] || mongoose.model(name, tokenSchema);
                        
                        if (specificModel) {
                            const pageSize = 100; 
                            const docs = await specificModel.find({})
                                .limit(pageSize)  // Limit to 50 documents
                                .lean();
                            if (docs.length > 0) {
                                const gzip = zlib.createGzip();
                                res.writeHead(200, { 'Content-Encoding': 'gzip', 'Content-Type': 'application/json' });
                                gzip.pipe(res);
                            
                                for(var i = 0; i < docs.length; i++){
                                    let imageDecoder = BursonBase64Decrypt(docs[i].image);
                                    docs[i].image = imageDecoder;
                                }
                                gzip.write(JSON.stringify(docs));
                                gzip.end();  
                            } else {
                                res.writeHead(204, { 'Content-Type': 'application/json' }); 
                                res.end(JSON.stringify({ success: true, message: 'No documents available' }));
                            }
                        } else {
                            res.writeHead(400, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ success: false, error: 'Model not found' }));
                        }
                    } catch (err) {
                        console.error('Error retrieving NFTs:', err);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: false, error: 'Internal server error' }));
                    }
                };

                await getNFTs(data.contractName);
            } catch (err) {
                console.error('Error parsing request body:', err);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: 'Invalid request' }));
            }
        });

        req.on('error', (error) => {
            console.error('Request error', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: 'Request error' }));
        });
    }else if(req.method == 'POST' && req.url == '/add-commission'){
        try{
            let body = '';

            req.on('data', chunk => {
                body += chunk.toString();
            });

            req.on('end', async ()=> {
                const data = JSON.parse(body);
                const commissionerIPAddress = req.connection.remoteAddress;

                const commissionValidator = await commissionModel.findOne({ipAddress: commissionerIPAddress});
                if(commissionValidator != null){
                    res.setHeader('Content-Type', 'application/json');
                    if(commissionValidator.isActive){
                        res.end(JSON.stringify({ success: false, code: 230 })); 
                    }else{
                        const newCommissionObject = {
                                address: data.address,
                                artworkMedium: data.artworkMedium,
                                artworkSize:data.artworkSize,
                                artworkTitle: data.artworkTitle,
                                comments: data.comments,
                                details: data.details,
                                email: data.email,
                                firstName: data.firstName,
                                lastName: data.lastName,
                                phone: data.phone,
                                ipAddress: commissionerIPAddress,
                                isActive: true
                        };
                            commissionModel.save().then(result =>{
                                if(result){
                                    console.log(result);
                                    res.end(JSON.stringify({ success: true, code: -1 })); 
                                }else{
                                    res.end(JSON.stringify({ success: false, code: -2 })); 
                                }
                            }).catch(error =>{
                                console.log(error);
                                res.end(JSON.stringify({ success: false, code: -3 })); 
                            });
                        }
                }else{
                    const newCommissionObject = new commissionModel({
                            address: data.address,
                            artworkMedium: data.artworkMedium,
                            artworkSize:data.artworkSize,
                            artworkTitle: data.artworkTitle,
                            comments: data.comments,
                            details: data.details,
                            email: data.email,
                            firstName: data.firstName,
                            lastName: data.lastName,
                            phone: data.phone,
                            ipAddress: commissionerIPAddress,
                            isActive: true
                    });

                    console.log('trying to save commission to DB!');
                        newCommissionObject.save().then(result =>{
                            if(result){
                                res.end(JSON.stringify({ success: true, code: -11 })); 
                            }else{
                                console.log('result failed');
                                res.end(JSON.stringify({ success: false, code: -22 })); 
                            }
                        }).catch(error =>{
                            console.log(error);
                            res.end(JSON.stringify({ success: false, code: -33 })); 
                        });
                }
            });

        }catch(error){
            console.log('Error with fetch request /add-commission');   
        }

    }else if(req.method == 'POST' && req.url == '/UpdateInProgressAttribute'){
        try{
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', async ()=> {
                const data = JSON.parse(body);
                const clientIP = req.connection.remoteAddress;
                try {
                    console.log('trying to reset attempted clients with objectId:', data.objectId);
                    for(const element of attemptedClients){
                        if(element.paintingId == data.objectId && element.ipAddress == clientIP && element.inProgress == true){
                            element.inProgress = false;
                        }
                    }
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({success: true, code: -3900113 })); 
                } catch (error) {
                    res.end(JSON.stringify({success: false, code: 220211 })); 
                }

             });   
        }catch(error){
            console.log('Error with fetch request /UpdateInProgressAttribute');
        }   

    }else if (req.method === 'POST' && req.url === '/file-a-report') {
        try {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });

            req.on('end', async () => {
                const data = JSON.parse(body);
                const clientIP = req.connection.remoteAddress;
                if(checkEmailString(data.email)){
                    console.log('Trying to save data to report database', data);
                    console.log('Client IP', clientIP);
                    try {
                        const existingReport = await reportModel.findOne({ ipAddress: clientIP });
                        console.log('exisiting report', existingReport);
                        if (existingReport) {
                            console.log('Sending back false with code: 1000202');
                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify({ success: false, code: 1000202 }));
                        } else {
                            console.log('Sending back true with code: -22131');
                            const newReport = new reportModel({
                                ipAddress: clientIP,
                                ...data
                            });
                            await newReport.save();
                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify({ success: true, code: -22131 }));
                        }
                    } catch (error) {
                        console.error('Error with database operation', error);
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ success: false, code: 3433444 }));
                    }
                }else{
                    console.log('Invalid email sending back code: 10002444222202');
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ success: false, code: 10002444222202 }));
                }

            });
        } catch (error) {
            console.error('Error handling the request', error);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, code: 34444411 }));
        }
    }else if(req.method == 'POST' && req.url == '/AI-event'){
        try{
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', async ()=> {
                const data = JSON.parse(body);
                res.setHeader('Content-Type', 'application/json');
            try {
              const clientIP = req.connection.remoteAddress;
              const existingItems = userAIQuestions.filter(item => item.ipAddress === clientIP);
              
              if (existingItems.length > 0) {
                const maxEventsItem = existingItems.reduce((maxItem, currentItem) => {
                  return maxItem.numberOfEvents > currentItem.numberOfEvents ? maxItem : currentItem;
                });

                const timeDifference = Math.abs(new Date() - new Date(maxEventsItem.lastEventDate));
                const hoursDifference = Math.ceil(timeDifference / (1000 * 60 * 60));
                const testTimeoutDuration = 48 * 60 * 60 * 1000;

                if (hoursDifference <= 48 && maxEventsItem.numberOfEvents > maxNumberOfAIEventsPerClient) {
                  console.log('User exceeded max number of events within 48 hours. Check if timer is on. If not, set timer.');
                  const checkAITimerIndex = AIEventTimers.findIndex(person => person.ipAddress === clientIP);

                  if (checkAITimerIndex !== -1) {
                    if (!AIEventTimers[checkAITimerIndex].value) {
                      AIEventTimers[checkAITimerIndex].value = true; 
                      setTimeout(() => {
                        userAIQuestions = userAIQuestions.filter(item => item.ipAddress !== clientIP);
                        AIEventTimers.splice(checkAITimerIndex, 1);
                        console.log(`Timer expired for IP ${clientIP}. Resetting user events and removing timer.`);
                      }, testTimeoutDuration); // Test timeout duration

                      res.end(JSON.stringify({ serverMessage: 'User exceeds number of allotted responses', code: 4 }));
                    } else {
                      console.log('Person is already in array and timer is already on, need to wait for reset.');
                      res.end(JSON.stringify({ serverMessage: 'User exceeds number of allotted responses', code: 4 }));
                    }
                  } else {
                    const timedOutAIUser = {
                      ipAddress: clientIP,
                      value: true
                    };
                    AIEventTimers.push(timedOutAIUser);

                    setTimeout(() => {
                      userAIQuestions = userAIQuestions.filter(item => item.ipAddress !== clientIP);
                      const timerIndex = AIEventTimers.findIndex(person => person.ipAddress === clientIP);
                      if (timerIndex !== -1) {
                        AIEventTimers.splice(timerIndex, 1);
                      }
                      console.log(`Timer expired for IP ${clientIP}. Resetting user events and removing timer.`);
                    }, testTimeoutDuration); // Test timeout duration

                    res.end(JSON.stringify({ serverMessage: 'User exceeds number of allotted responses', code: 4 }));
                  }
                } else {
                  const Aievent = {
                    ipAddress: clientIP,
                    lastEventDate: new Date(),
                    numberOfEvents: maxEventsItem.numberOfEvents + 1
                  };
                  userAIQuestions.push(Aievent);
                  const serverAIResponse = await roulsResponse(data.question);
                  if (serverAIResponse) {
                    res.end(JSON.stringify({ serverAIResponse, code: 0 }));
                  } else {
                    res.end(JSON.stringify({ serverMessage: 'Roul failed miserably', code: 1 }));
                  }
                }
              } else {
                console.log('User\'s first time sending AI fetch.');
                const Aievent = {
                  ipAddress: clientIP,
                  lastEventDate: new Date(),
                  numberOfEvents: 1
                };
                userAIQuestions.push(Aievent);
                const serverAIResponse = await roulsResponse(data.question);
                if (serverAIResponse) {
                  res.end(JSON.stringify({ serverAIResponse, code: 0 }));
                } else {
                  res.end(JSON.stringify({ serverMessage: 'Roul failed miserably', code: 1 }));
                }
              }
            } catch (error) {
              console.log('Error on server AI-event', error);
              res.end(JSON.stringify({ serverMessage: 'Try-catch fail', code: 2 }));
            }
            });
        }catch(error){
            console.log('Error with fetch request /AI-event ');
        }

    }else if(req.method == 'GET' && req.url == '/getALL-purchases'){
        try{
            const purchases = async () => {
                const purchases = await purchaseModel.find({});
                return purchases
            };

            purchases().then((result) => {
                const purhcaseData = zlib.gzipSync(JSON.stringify(result)); 
                res.setHeader('Content-Encoding', 'gzip');
                res.end(purhcaseData);

            }).catch((error) => {
                // if  errno: -3008,the error is internet connection 
                console.error(error); 
                console.log('There was an error calling the purchases() function, if  errno: -3008,the error is internet');
                res.end(JSON.stringify({success: false}));
            });
        }catch(error){
            console.log('Error with fetch request /getALL-purchases ');
        }

    }else if(req.method == 'POST' && req.url == '/sendConfirmationEmail'){
        try{
            let body = '';

            req.on('data', chunk => {
                body += chunk.toString();
            });

            req.on('end', async ()=> {
                const data = JSON.parse(body);

                console.log('we recieved the data from the client ', data);

                if(data.passcode == paintingUploadCode){
                    sendPaintingTrackingNumberEmail(data.email, data.name, data.tracking, data.image)
                        .then(result => {
                                console.log('Email sent successfully:', result);     
                                res.setHeader('Content-Type', 'application/json');
                                res.end(JSON.stringify({updated: true}));
                        })
                        .catch(error => {
                                console.error('Error sending email:', error);
                                res.setHeader('Content-Type', 'application/json');
                                res.end(JSON.stringify({updated: false}));
                        });
                }else{
                    console.log('user recieved incorrect passcode need to check IP and maybe Restrict user if 3 failed attempts');
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({updated: false}));
                }

            });

        }catch(error){
            console.log('Error with fetch request /sendConfirmationEmail');
        }

    } else if(req.method == 'POST' && req.url == '/checkForAttemptedPurchases'){
        try{
            let body = '';
            req.on('data', chunk =>{
                body += chunk.toString()
            });

            req.on('end', async ()=> {
                const data = JSON.parse(body);
                const { transactionHash, objectId, address, email, firstName, lastName } = data;
                const clientIP = req.connection.remoteAddress;
                const maxPurchaseAttempts = 17;
                let thisAttemptedClientArray = attemptedClients.filter(obj=> obj.ipAddress == clientIP);
                const attemptedPurchaseClient = {
                        ipAddress: clientIP,
                        inProgress: true,
                        paintingId: objectId,
                        buyerFirstName: firstName,
                        buyerLastName: lastName,
                        numberOfPurchaseAttempts: getMaxValueofPurchases(thisAttemptedClientArray),
                        istimerPresent: null
                    };

                console.log('the user has send this many attempts',  attemptedPurchaseClient.numberOfPurchaseAttempts);
                const maxResetValue = 60000; // Maximum reset value (60 seconds)
                const minResetValue = 30000;  // Minimum reset value (30 seconds)
                let randomNumberreset = Math.floor(Math.random() * (maxResetValue - minResetValue + 1)) + minResetValue;

                if (attemptedClients.length == 0) {
                    console.log('array is empty all good to try warn user to send request to metamask');
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ canUserAttemptPurchase: true }));
                    attemptedClients.push(attemptedPurchaseClient);
                    attemptedClients.forEach(client => {
                        if (client.paintingId === attemptedPurchaseClient.paintingId && client.ipAddress == clientIP) {
                            client.numberOfPurchaseAttempts +=1;
                        }
                    });            
                }else{
                    if(thisAttemptedClientArray.length != 0 && attemptedPurchaseClient.numberOfPurchaseAttempts<= maxPurchaseAttempts){
                        let matchingClients = attemptedClients.filter(element => element.paintingId == objectId);
                        if(matchingClients.length == 0){
                            console.log('cannot find anyone trying to purchase this painting in local array');
                            console.log('This is Users first time attempt to purchase sending back true');
                            res.setHeader('Content-Type', 'application/json');
                            attemptedClients.push(attemptedPurchaseClient);
                            res.end(JSON.stringify({ canUserAttemptPurchase: true, code: 232121311 }));
                            attemptedClients.forEach(client => {
                                if (client.paintingId === attemptedPurchaseClient.paintingId) {
                                    client.numberOfPurchaseAttempts +=1;
                                }
                            });
                         }else{
                            const getInstockValue = await paintingModel.findOne(
                                { _id: attemptedPurchaseClient.paintingId }
                            );

                            if (getInstockValue) {
                                if (getInstockValue.inStock) {
                                    console.log('Item is still in stock!');
                                let allInProgressFalse = attemptedClients.filter(client => client.inProgress == true && client.paintingId == attemptedPurchaseClient.paintingId);
                                if(allInProgressFalse.length != 0){
                                    console.log('Someone is already attempted to buy the same exact painting==>');
                                    res.setHeader('Content-Type', 'application/json');
                                    res.end(JSON.stringify({ canUserAttemptPurchase: false, code : 102111}));
                                    if(timerIsAlreadyCalled){
                                        console.log('no need to set timer because its active');
                                    }else{
                                        timerIsAlreadyCalled = true;
                                        setTimeout(function () {
                                            attemptedClients.forEach(client => {
                                                if (client.paintingId === attemptedPurchaseClient.paintingId) {
                                                    client.inProgress = false;
                                                }
                                                timerIsAlreadyCalled = false;
                                            });
                                        },randomNumberreset);
                                    }
                                }else{
                                    console.log('User is okay to purchase painting (but we need to check number of attempts');
                                    res.setHeader('Content-Type', 'application/json');
                                    attemptedClients.push(attemptedPurchaseClient);

                                    attemptedClients.forEach(client => {
                                        if (client.paintingId === attemptedPurchaseClient.paintingId) {
                                            client.numberOfPurchaseAttempts +=1;
                                        }
                                    });
                                    res.end(JSON.stringify({ canUserAttemptPurchase: true, code : 10213321}));
                                }                 
                                } else {
                                    console.log('Item is not in stock; sending back first checker is false');
                                    res.setHeader('Content-Type', 'application/json');
                                    res.end(JSON.stringify({ canUserAttemptPurchase: false, code :  232111119}));
                                }
                            } else {
                                console.log('Painting not found; handle this case appropriately');
                                res.setHeader('Content-Type', 'application/json');
                                res.end(JSON.stringify({ canUserAttemptPurchase: false, code :  6477665555}));
                            }
                        }
                    }else{
                        if(thisAttemptedClientArray.length == 0){
                            console.log('Users first time sending attempts');
                            attemptedClients.push(attemptedPurchaseClient);
                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify({ canUserAttemptPurchase: true, code: 2322225511 })); 
                        }else if(attemptedPurchaseClient.numberOfPurchaseAttempts > maxPurchaseAttempts){
                            console.log('User has exceeded maximum number of attempts');
                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify({ canUserAttemptPurchase: false, code: 232585511 }));   

                            let purchaseTimerIsOn = globalPurchaseTimerArray.filter(obj=> obj.ipAddress == attemptedPurchaseClient.ipAddress);
                            console.log('purchaseTimerIsOn', purchaseTimerIsOn);
                            if(purchaseTimerIsOn.length>0){
                                console.log('item is already present no need to reset timer or push item in array');
                                console.log('we found', purchaseTimerIsOn)
                            }else{
                                 console.log('item is not present but we are adding it and adding a timer');
                                const timedOutClient ={
                                    ipAddress: attemptedPurchaseClient.ipAddress,
                                    timer: true
                                };
                                globalPurchaseTimerArray.push(timedOutClient);
                                let resetUserTimer = 36000000;
                                console.log('trying to set timer');
                                setTimeout(function () {
                                    console.log('fireing function after timeoout delay');
                                    for (let i = attemptedClients.length - 1; i >= 0; i--) {
                                        const attemptedClient = attemptedClients[i];
                                        if (attemptedClient.ipAddress === attemptedPurchaseClient.ipAddress && attemptedClient.paintingId === attemptedPurchaseClient.paintingId) {
                                            attemptedClients.splice(i, 1);
                                        }
                                    }
                                    for (let i = globalPurchaseTimerArray.length - 1; i >= 0; i--) {
                                        const currentTimedOutUser = globalPurchaseTimerArray[i];

                                        if (currentTimedOutUser.ipAddress === attemptedPurchaseClient.ipAddress) {
                                            globalPurchaseTimerArray.splice(i, 1); // Remove 1 item at index i
                                        }
                                    }
                                }, resetUserTimer); 
                            }                                                               
                        }else{
                            console.log('An unexexpted error occureed');
                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify({ canUserAttemptPurchase: false, code: 121225511 })); 
                        }
                    }
                }
            });
        }catch(error){
            console.log('Error Handling Fetch Request /checkForAttemptedPurchases');
        }
        
    } else if(req.method == 'POST' && req.url == '/UpdateDB'){
        try{
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });

            req.on('end', async ()=> {
                const data = JSON.parse(body);
                 try{ 
                    const { transactionHash, objectId, address, email, firstName, lastName } = data;
                    const clientIP = req.connection.remoteAddress;

                    const attemptedPurchaseClient = {
                        ipAddress: clientIP,
                        inProgress: true,
                        paintingId : objectId,
                        buyerFirstName : firstName,
                        buyerLastName : lastName 
                    };
                    const result = await paintingModel.updateOne(
                        { _id: objectId }, 
                        { $set: {
                             inStock: false,
                              dateSold: new Date() 
                            }
                        } 
                    );
                    const updatedPainting = await paintingModel.findById(objectId);
                    const price = updatedPainting.price;
                    const productIMage = updatedPainting.image;

                    const newPurchase = new purchaseModel({
                      firstName: firstName,
                      lastName: lastName,
                      email: email,
                      address: address,
                      datePurchased: new Date(),
                      legalContract: 'none',
                      price: price, 
                      productID: updatedPainting._id, 
                      transactionHash: transactionHash,
                      productIMG: productIMage 
                    });
                    if(result.modifiedCount == 1){
                        let thisObj = {
                            updated: true, 
                            Id: objectId,
                            firstName: firstName,
                            lastName: lastName,
                            productID: updatedPainting._id,
                            productName: updatedPainting.name,
                            price: updatedPainting.price, 
                            img: updatedPainting.image,
                            transactionHash: transactionHash,
                        };
                        res.setHeader('Content-Encoding', 'gzip'); 
                        res.end(zlib.gzipSync(JSON.stringify(thisObj)));
                        io.emit('updateCurrentPaintings',{updated: true, Id: objectId});
                        newPurchase.save()
                          .then(savedUser => {
                            attemptedClients = [];
                            sendEmail(email, address, firstName, lastName, objectId, updatedPainting.price, updatedPainting.name, updatedPainting.image)
                                .then(result => {
                                  
                                })
                                .catch(error => {
                                     attemptedClients = [];
                                    console.error('Error sending email:', error);
                                });
                          })
                          .catch(error => {
                            attemptedClients = [];
                            console.error('Error saving user:', error);
                          });
                    }else{
                        console.log('cannot update the data');
                        res.end(JSON.stringify({updated: false}));
                    }
                 }catch(error){
                    console.log(error);
                 }
                
            });
        }catch(error){
            console.log('Error Handling Fetch Request /UpdateDB');
        }
        
    }else if(req.method == 'POST' && req.url == '/validate_info'){
        try{
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });

            req.on('end', async () => {
                try {
                    console.log('trying to parse data to json');
                    const data = JSON.parse(body);
                    verifyUserinputData(data.email, data.address, data.firstName, data.lastName)
                        .then((result) => {
                            let verifiedValue = null; 
                            if (result.email == true && result.address == true && result.firstName == true && result.lastName == true) {
                                verifiedValue = true;
                            } else {
                                verifiedValue = false;
                            }
                            const newData = {
                                verified: verifiedValue,
                                email: result.email,
                                address: result.address, 
                                firstName: result.firstName, 
                                lastName: result.lastName,
                            };
                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify(newData));
                            console.log('we send the data to user');
                        })
                        .catch((error) => {
                            console.log('there was an error sending the Newdata array to client or the return of verifyUserinputData() function');
                        });
                } catch (error) {
                    console.error('Error processing request:', error);
                    res.statusCode = 500;
                    res.end(JSON.stringify({verified: false}));
                }
            });

        }catch(error){
            console.log('Error with fetch request /validate_info');
        }
        
    }else if(req.method == 'GET' && req.url == '/GetMessageHistory'){
        try{
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();

            });
            req.on('end', async () => {           
                res.writeHead(200, { 'Content-Type': 'application/json' });
                // may need to send one at a time
                res.end(JSON.stringify(messageHistory)); 
            });
        }catch(error){  
            console.log('Error with fetch request /GetMessageHistory');
        }

    } else if(req.method == 'POST' && req.url == '/UpdateUsername'){
        try{
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();

            });
            req.on('end', async () =>{
                const data = JSON.parse(body);
                const clientIP = req.connection.remoteAddress;

                const userIndex = users.findIndex(user => user.ip === clientIP);
                if(userIndex!=-1){
                    if (users[userIndex].nameChanges <= 7 && checkString(data.newUsername) && data.newUsername.length >=3) {
                        users[userIndex].nameChanges +=1; 
                        const usersOldName = users[userIndex].user;

                        messageHistory.forEach(message => {
                            if (message.username === usersOldName) {
                                message.username = data.newUsername;
                            }
                        });
                        
                        users[userIndex].user = data.newUsername;
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({success: true, oldName: usersOldName, newName: users[userIndex].user})); 
                        console.log('We found a match and reset the username to ', users[userIndex].user);
                    } else {
                        if(users[userIndex].nameChanges > 7){
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({success: false, code: 101}));        
                        }else if(!checkString(data.newUsername)){
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({success: false, code: 201}));  
                        }else if(data.newUsername.length <3){
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({success: false, code: 301}));  
                        }else{
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({success: false, code: 401}));     
                        }
                    }
                }else{
                    console.log('this console log should never print');
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({success: false, code: 501}));    
                }
            });

        }catch(error){
            console.log('Error with fetch request /UpdateUsername', error);
        }

    } else if(req.method == 'POST' && req.url == '/UpdatePaintingViewsValue'){
        try{
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();

            });

            req.on('end', async () => {           
                try {
                    const data = JSON.parse(body);
                    const updaterIPAddress = req.connection.remoteAddress;
                    const updator = {ip: updaterIPAddress, data};
                    const isObjectInArray = updatedViewsHistory.some(obj => obj.ip === updator.ip && obj.data === updator.data);
                    if(isObjectInArray){
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ success: false, message: 'you already viewed this painting' }));
                    }else{
                        updatedViewsHistory.push(updator);
                        const thispainting = await paintingModel.findOne({ _id: data });  
                        if (thispainting) {
                            const result = await paintingModel.updateOne(
                                { _id: data },
                                { $set: { views: thispainting.views + 1 } }
                            );
                            if (result.modifiedCount === 1) {
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ success: true }));
                            } else {
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ success: false }));
                            }
                        } else {
                            res.writeHead(404, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ success: false, message: 'Painting not found' }));
                        }
                    }

                } catch (error) {
                    console.log(error);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: 'Internal server error' }));
                }

            });

        }catch(error){
            console.log('Error with fetch request /UpdatePaintingViewsValue');
        }
        
    }else if(req.method == 'POST' && req.url == '/add-token-to-collection'){
        try{
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });

            req.on('end', async ()=> {
                const data = JSON.parse(body);
                try {
                    if(data.passcode == addNFTCollectionDataPasscode){
                        let specificModel;
                        console.log('trying to access model');
                        const allModels = await getAllModels();
                        specificModel = allModels[data.contractName];
                        //console.log('we found models', allModels);
                        if(specificModel){
                            console.log('successfully accessed model successfully', specificModel);
                        }else{
                            console.log('we had to make a new model');
                           specificModel = mongoose.model(data.contractName, tokenSchema); 
                        }
                        let encryptedImage = BursonBase64Encrypted(data.tokenURI);

                        const thisNFT = new specificModel({
                            contractName: data.contractName,
                            contractAddress: data.contractAddress,
                            tokenID: data.tokenID,
                            image: encryptedImage, 
                        });

                        thisNFT.save().then((result)=>{
                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify({ success: true, code: 222102999221121, tokenID: data.tokenID}));
                        }).catch((error) =>{
                            console.log("Error saving data to database check erro to see if it is internet", error);
                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify({success: false, code: 21202021122344, tokenID: data.tokenID})); 
                        });
                    }else{
                        console.log("passcode is incorrect");
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({success: false, code: 83939111110001, tokenID: data.tokenID})); 
                    }
                } catch (error) { 
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({success: false, code: 29292929100999, tokenID: data.tokenID})); 
                }

             });   
        }catch(error){
            console.log('Error with fetch request /add-token-to-collection');
        }   
    }else {
        try{
            let filePath = '.' + req.url;
            if (filePath === './') {
                filePath = './index.html'; 
            }

            const extname = path.extname(filePath);
            let contentType = 'text/html'; 
    
            switch (extname) {
                case '.js':
                    contentType = 'text/javascript';
                    break;
                case '.css':
                    contentType = 'text/css';
                    break;
                case '.json':
                    contentType = 'application/json';
                    break;
                case '.png':
                    contentType = 'image/png';
                    break;
                case '.jpg':
                    contentType = 'image/jpg';
                    break;
            }
        
            fs.readFile(filePath, (err, content) => {
                console.log('err from filepath gives', err);
                console.log('content varibale gives', content);
                if (err) {
                    if (err.code === 'ENOENT') {
                        res.writeHead(404, { 'Content-Type': 'text/html' });
                        res.write(`
                            <!DOCTYPE html>
                            <html>
                            <head>
                                <title>List of Endpoints</title>
                                <style>
                                    body {
                                        font-family: Arial, sans-serif;
                                        text-align: center;
                                        margin-top: 50px; /* Adjust as needed */
                                    }
                                    ul {
                                        list-style-type: none;
                                        padding: 0;
                                    }
                                    li {
                                        font-size: 18px;
                                        margin-bottom: 10px;
                                    }
                                </style>
                            </head>
                            <body>
                                <h1>List of Endpoints</h1>
                                <ul>
                                    <li>/add-painting</li>
                                    <li>/getALL-paintings</li>
                                    <li>/add-commission</li>
                                    <li>/UpdateInProgressAttribute</li>
                                    <li>/AI-event</li>
                                    <li>/sendConfirmationEmail</li>
                                    <li>/UpdateDB</li>
                                    <li>/validate_info</li>
                                    <li>/UpdateUsername</li>
                                    <li>/UpdatePaintingViewsValue</li>
                                </ul>
                            </body>
                            </html>
                        `);
                        res.end();
                    } else {
                        res.writeHead(500);
                        res.end('Internal Server Error: ' + err.code);
                    }
                } else {
                    res.writeHead(200, { 'Content-Type': contentType });
                    res.end(content, 'utf-8');
                }
            });
        }catch(error){
            console.log('Error with home Fetch');
        }
    }
}
