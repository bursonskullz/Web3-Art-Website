// Name: Roy Burson 
// Date last modified: 05-25-24
// purpose: Make web3 art website

// to do list 

/*
1) find out how to upload code to digital ocean and cost 
2) fix AI bot response
3) limit fetch request to DB (need to keep track of them per IP) for certain time period (like 48 hours) this prevents clog up or build up in mongo
*/


// local variables to server
const maxNumberAIEvents = 10;
var localAIUsers = [];
let attemptedClients = [];
let globalPurchaseTimerArray = [];
var timerIsAlreadyCalled = false;

// packages
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


// collections db strings 
const paintCollectionString = 'Painting';
const purchasesCollectionString = 'Purchase';
const commissionCollectionString = 'Commission';

// security strings 
const paintingUploadCode = 'Painting-code-here!';
const appPasscode = 'google-app-passcode-here';
const buisnessEmial = 'your-buisiness-email@gmail.com';
const dbURL = 'your-mongoose-db-string';
const googleAPIKEY = 'your-google-api-maps-key';
const myDomain = 'localhost';



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

// Create models 
const paintingModel = mongoose.model(paintCollectionString, paintingSchema); 
const purchaseModel = mongoose.model(purchasesCollectionString, purchaseSchema); 
const commissionModel = mongoose.model(commissionCollectionString, commissionSchema); 

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


const knownDefinitions = [
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
  }
  // Additional entries would follow the same pattern
];
const users = [];

const messageHistory = [];

const updatedViewsHistory = [];

const PORT = process.env.PORT || 27015; // Define the port for the server
const PORT2 = process.env.PORT || 4040; // Define the port for the server

/*
// Load the SSL certificate files
const options = {
    key: fs.readFileSync('path/to/private.key'),
    cert: fs.readFileSync('path/to/certificate.crt')
};


const server = http.createServer(options, (req, res) => {

    handleHttpRequest(req, res, io);
});

*/

try{

    if (cluster.isMaster) {
        const numCPUs = os.cpus().length;

        console.log(`Master ${process.pid} is running`);

        // Fork workers.
        for (let i = 0; i < numCPUs; i++) {
            cluster.fork();
        }

        cluster.on('exit', (worker, code, signal) => {
            console.log(`Worker ${worker.process.pid} died`);
            // Optionally, you can fork a new worker when one dies
            cluster.fork();
        });
    } else {
        const server = http.createServer((req, res) => {
            handleHttpRequest(req, res, io);
        });


        mongoose.set('debug', true);
        mongoose.connect(dbURL)
            .then((result) => server.listen(PORT, myDomain , () => {
                console.log(`Server running really good on port ${PORT}`);
            })).catch((error) => {
                console.error('Error connecting to MongoDB:', error);

                // if error is internet make prompt
                process.exit(1);
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


            //const randomIndex = Math.floor(Math.random() * randomNames.length);
            //const username = randomNames[randomIndex];

            let username;
            let attempts = 0;
            const maxAttempts = 1000;
            // Loop until a unique username is generated
            do {
                const randomIndex = Math.floor(Math.random() * randomNames.length);
                username = randomNames[randomIndex];
                attempts++;
            } while (messageHistory.some(obj => obj.username === username && attempts < maxAttempts));

                // If maxAttempts reached, assign the first name from randomNames
            if (attempts >= maxAttempts) {
                username = randomNames[0];
            }

            const currentUser = { 
                ip: clientIP, 
                user: username, 
                coolDown: 0,
                nameChanges: 0
            };

            users.push(currentUser);

            // Handle incoming messages
            socket.on('message', (message) => {
                const ipAddress = socket.handshake.address;
                const timeSent = new Date().toISOString();
                let clientIP;
                if (ipAddress.includes('::ffff:')) {
                    clientIP = ipAddress.split(':').pop();
                } else {
                    clientIP = ipAddress;
                }
                // need to get ip again 

                const sender = users.find(u => u.ip == clientIP);

                let senderName;

                if (sender) {
                    // Retrieve the name of the sender
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

                    // find username cooldown value and set into each obj to acces

                if(!checkString(obj.msg)){
                    obj.msg = 'Your input contains inappropriate content. Please ensure your message is respectful!';
                }

                if(canSendMessage(messageHistory, obj.username, timeSent)){
                    console.log('user can send message');
                    messageHistory.push(obj);
                    //console.log(obj);
                    // only want to emit object if user can send!! 
                    io.emit('message', obj);
                }else{
                    console.log('Restricted user trying to send message', obj.username);
                }

                if(messageHistory.length > 100){
                    messageHistory.pop();
                    // when it gets to a 100 it will start poping 
                }
               
                
            });


        });
    }
    
}catch(error){
    console.log('Error createServer', error);
}


function checkString(input) {
    // Define patterns for threats, bad language, and sexually explicit language
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

    // Input does not contain any forbidden words or phrases
    return true;
}


function canSendMessage(array, name, time) {
    var ability_to_send = true; 
    console.log(time);
    
    // Convert time parameter to Date object if it's not already
    const currentTime = time instanceof Date ? time : new Date(time);

    array.forEach((obj)=>{
        // Convert obj.time to Date object if it's not already
        const msgTime = obj.time instanceof Date ? obj.time : new Date(obj.time);
        const timeDifference = (currentTime - msgTime) / 1000; // Time difference in seconds
        console.log(timeDifference);

        if (timeDifference < 0.5) {
            const thisSender = users.find(u => u.user == obj.username);
            if (thisSender) {
                thisSender.coolDown += 1;
                if (thisSender.coolDown > 10) {
                    console.log('User has exceeded cooldown limit');
                    ability_to_send = false;
                    // Start a timer to reset cooldown after 10 seconds
                    setTimeout(() => {
                        thisSender.coolDown = 0;
                        console.log('User has ability to send again');
                    }, 24 * 60 * 60 * 1000); // 24 hours in seconds
                }
            }           
        } else {
            console.log('Time difference is okay', timeDifference);
            //const thisSender = users.find(u => u.user == obj.username);  
            //thisSender.coolDown = 0;      
        }
    });

    return ability_to_send;
}

function checkEmailString(email) {
    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Check if the email matches the regular expression
    const isValidEmail = emailRegex.test(email);

    // Return true if the email is valid, false otherwise
    return isValidEmail;
}
async function checkAddressString(address) {
    try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=`+googleAPIKEY);
        const data = await response.json();
        
        // Check if the response contains any results
        if (data.results && data.results.length > 0) {
            // Address is valid if at least one result is returned
            return true;
        } else {
            // No results found, address is invalid
            return false;
        }
    } catch (error) {
        console.error('Error checking address:', error);
        // Return false in case of any errors
        return false;
    }
}


async function checkIfName(string) {
    // Check if the first name is non-empty
    if (!string.trim()) {
        return false; // Empty string is not valid
    }

    
    // Check for inappropriate characters
    const inappropriateRegex = /[^\w\s'-]/; // Allowed characters: letters, digits, spaces, hyphens, and apostrophes
    if (inappropriateRegex.test(string)) {
        return false; // Inappropriate characters found
    }

    // Check for common bad words (you can extend this list)
    const badWords = [
    'niger', 'nigga', 'bitch', 'whore', 'cunt', 'fuck', 'shit', 'motherfucker', 
    'ass', 'bastard', 'dick', 'kill you', 'hurt you', 'endanger you', 'menace you', 'attack you', 
    'assault you', 'intimidate you', 'coerce you', 'terrorize you', 'pussy', 
    'dick', 'cock', 'vagina', 'asshole', 'boobs', 'tits', 'anal', 'cum', 'sex'
    ];

    const lowerCaseFirstName = string.toLowerCase();
    if (badWords.some(word => lowerCaseFirstName.includes(word))) {
        return false; // Bad word found
    }

    const excessiveRepeatingRegex = /(.)\1{5,}/;

    if (excessiveRepeatingRegex.test(string)) {
        return false; // Excessive repeating characters found
    }
    // If none of the above conditions are met, the first name is considered valid
    return true;

    
}



// Function to send email
async function sendEmail(email, address, firstName, lastName, productID, price, productName, productIMG) {
// HTML files to send
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


    // defining host and authentification 

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

    // define mail options
     let mailOptions = {
            from: buisnessEmial, 
            to: email, 
            subject: 'Congrats on your new purchase!', 
            html: HTML
    };

    // try sending email 
    try {

        let result = await transporter.sendMail(mailOptions);
        //console.log('Email sent:', result);
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

// Function to send email
async function sendPaintingTrackingNumberEmail(email, name, trackingNumber, image) {

// HTML files to send
    let atagRef = 'mailto:' + buisnessEmial;
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
                        <p style="font-size: 16px; margin: 10px 0;">If you have any questions or concerns, feel free to <a href="${atagRef}" style="font-size: 16px;">contact us</a>.</p>
                        <p style="font-size: 16px; margin: 0;">Best regards,<br><span class="signature" style="text-indent: 20px;"> &nbsp; &nbsp; Roy Burson</span></p>
                    </div>
                </div>`;


    // defining host and authentification 

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

    // define mail options
     let mailOptions = {
            from: buisnessEmial, 
            to: email, 
            subject: 'Tracking Number', 
            html: HTML
    };

    // try sending email 
    try {

        let result = await transporter.sendMail(mailOptions);
        console.log('Email sent');
        return result;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error; 
    }
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

    const artworkKeywords = ['painting', 'artwork', 'buy', 'purchase'];
    const metamaskKeywords = ['metamask', 'connect', 'wallet'];
    const chatKeywords = ['chat', 'communicate', 'others'];

    const keyWordsForQuestion = ['how', 'where', 'when', 'what', 'why', 'which', 'who', 'whom', 'whose'];

    // Split the question into multiple questions or responses based on keywords
    const parts = [];
    let currentPart = '';

    for (let word of lowercaseQuestion.split(' ')) {
        if (keyWordsForQuestion.includes(word)) {
            // Push the current part to the parts array
            if (currentPart.trim() !== '') {

                // only trim if parts are not related to one another
                // need to have data set of definitions that we can train with
                // look for splitters
                //  and, commmas, ! ... etc others. (indicators to split)
                parts.push(currentPart.trim());
            }
            currentPart = ''; // Reset current part
        }
        // Append the word to the current part
        currentPart += word + ' ';
    }

    // Push the last part to the parts array
    if (currentPart.trim() !== '') {
        parts.push(currentPart.trim());
    }

    // Evaluate each part and build the response string
    let response = '';
    let responseArray = [];

    for (let part of parts) {
        if (artworkKeywords.some(keyword => part.includes(keyword))) {
            response += "To buy a painting, you can visit our website's art gallery section and select the painting you like. Then, follow the instructions to make a purchase.";
        } 
        // Check if the part is related to connecting Metamask
        else if (metamaskKeywords.some(keyword => part.includes(keyword))) {
            response += "To connect your Metamask wallet, please follow these steps: [insert steps here]<br>";
        } 
        // Check if the part is related to chatting with others
        else if (chatKeywords.some(keyword => part.includes(keyword))) {
            response += "You can chat with others on our website by navigating to the chat section and joining a conversation or starting a new one.\n\n";
        }else if (helloPhrases.some(phrase => part.toLowerCase().includes(phrase))) {
            response = "Hello! How can I assist you today?\n\n";
        } else if (part.toLowerCase().includes("what time is it")) {
            const currentTime = new Date().toLocaleTimeString();
            response = `The current time is ${currentTime}.\n\n`;
        } else if (part.toLowerCase().includes("who built this website")) {
            response = "This website was built by [insert name/company].\n\n";
        } else if (part.toLowerCase().includes("thanks") || part.toLowerCase().includes("Thankss")) {
            response = "Your welcome if there is anything else i can assist with let me know!.\n\n";
        } 
        // If the part is not related to any known topic, add an error message
        else {
            response += "I'm sorry, I couldn't understand your question or it's not related to the topics I can assist with.\n\n";
        }

        responseArray.push([{rsp: response.trim()}]);
    }
    return responseArray
}

async function validateTransaction(transactionHash) {
    const apiUrl = `https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${transactionHash}&apikey=YOUR_API_KEY`;

    try {
        // Fetch transaction details from Etherscan API
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Check if the transaction exists
        if (data && data.result) {
            // Access transaction details from the result
            const transaction = data.result;
            const { from, to, value } = transaction;
            if (from && to && value) {
                // Transaction is valid
                console.log('Transaction is valid:', transaction);
                return true;
            } else {
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


const handleHttpRequest = async (req, res, io) => {
    let requestArray = [];
    if (req.method == 'POST' && req.url == '/add-painting') {
        try{
            let body = '';
            // Accumulate incoming data chunks
            req.on('data', (chunk) => {
                body += chunk.toString();
            });

                // Process the completed request
            req.on('end', async () => {
                try {
                    const thisObj = JSON.parse(body);
                    if(thisObj.passcode == paintingUploadCode){// add attempts later and save IP to get em back
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

                            //console.log(newPainting);
                            newPainting.save().then((result)=>{
                                //console.log(result);
                                res.end(JSON.stringify({success: true})); 
                            }).catch((error) =>{
                                console.log(error);
                                res.end(JSON.stringify({success: false})); 
                            });

                    }else{
                        console.log('could not uplaod for unknown reason');
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

                        // users commission was a success and he wants more!
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

    }else if(req.method == 'POST' && req.url == '/AI-event'){
        try{
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });


            // track number of responses and send back null objects if over say 10 and increase to 1000
            // set a date and then allow more and reset number of request if under maxamount (1000)
            // use local array 
            req.on('end', async ()=> {
                const data = JSON.parse(body);
                res.setHeader('Content-Type', 'application/json');
                try {
                    const serverAIResponse = await roulsResponse(data.question);
                    if (serverAIResponse) {
                        res.end(JSON.stringify({ serverAIResponse, code: 0 })); // Include serverAIResponse in the response object
                    } else {
                            res.end(JSON.stringify({ ServerMessage: 'Roul failed miserably', code: 1 })); 
                        }
                } catch (error) {
                        res.end(JSON.stringify({ ServerMessage: 'Try-catch fail', code: 2 })); 
                }
                // grab ip adress 
                // check if user is in localAIUsers by IP attribute 

                
                /*
                const aIUserIp = req.connection.remoteAddress;

                const AiUSer = {
                    ipAddress: aIUserIp ,
                    lastEventdate: new Date(),
                    numberOfEvents: 0
                };

                const userIndex = localAIUsers.findIndex(user => user.ipAddress === aIUserIp);

                if (userIndex !== -1) {
                    const user = localAIUsers[userIndex];

                    // Update last event date
                    user.lastEventDate = new Date();

                    // Increment the number of events
                    user.numberOfEvents += 1;

                    // Check the number of events
                    if (user.numberOfEvents <= maxNumberAIEvents) {
                        console.log('User is all good, send back normal response');
                        
                        try {
                            const serverAIResponse = await roulsResponse(data.question);
                            if (serverAIResponse) {
                                res.end(JSON.stringify({ serverAIResponse, code: 0 })); // Include serverAIResponse in the response object
                            } else {
                                res.end(JSON.stringify({ ServerMessage: 'Roul failed miserably', code: 1 })); 
                            }
                        } catch (error) {
                            res.end(JSON.stringify({ ServerMessage: 'Try-catch fail', code: 2 })); 
                            console.log(error);
                        }
                    } else {
                        res.end(JSON.stringify({ ServerMessage: 'Too many attempts in a short period', code: 3 })); 
                    }
                }else{
                    const newUser = {
                        ipAddress: aIUserIp,
                        lastEventDate: new Date(),
                        numberOfEvents: 1
                    };
                    localAIUsers.push(newUser);

                    try {
                        const serverAIResponse = await roulsResponse(data.question);
                        if (serverAIResponse) {
                            res.end(JSON.stringify({ serverAIResponse, code: 0 })); // Include serverAIResponse in the response object
                        } else {
                            res.end(JSON.stringify({ ServerMessage: 'Roul failed miserably', code: 1 })); 
                        }
                    } catch (error) {
                        res.end(JSON.stringify({ ServerMessage: 'Try-catch fail', code: 2 })); 
                        console.log(error);
                    }
                }
                */
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
                // should return zero length if there is none and create gif on client side
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
                // its working but second time around its not working 
            // so after the reset it doesnt work 
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
                    // add 1 to each element with same ip
                    attemptedClients.forEach(client => {
                        // need to checkIp t
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

                            // add 1 to each element with same ip
                            attemptedClients.forEach(client => {
                                if (client.paintingId === attemptedPurchaseClient.paintingId) {
                                    client.numberOfPurchaseAttempts +=1;
                                }
                            });

                            // each time we send true we need to add 1 to every item in attemptedCLients that match the ip 
                         }else{
                            //const getInstockValue = await paintingModel.find({});

                            const getInstockValue = await paintingModel.findOne(
                                { _id: attemptedPurchaseClient.paintingId }
                            );

                            if (getInstockValue) {
                                if (getInstockValue.inStock) {
                                    console.log('Item is still in stock!');
                                let allInProgressFalse = attemptedClients.filter(client => client.inProgress == true && client.paintingId == attemptedPurchaseClient.paintingId);

                                // every time resonse goes through add 1 to the attempts (only when server sends back true);

                                if(allInProgressFalse.length != 0){
                                    console.log('Someone is already attempted to buy the same exact painting==>');
                                    res.setHeader('Content-Type', 'application/json');
                                    res.end(JSON.stringify({ canUserAttemptPurchase: false, code : 102111}));


                                    // timer resets every object so we can keep local value 
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

                                    // at least 1 person is trying to buy this same painting
                                    console.log('User is okay to purchase painting (but we need to check number of attempts');
                                    res.setHeader('Content-Type', 'application/json');
                                    attemptedClients.push(attemptedPurchaseClient);

                                    attemptedClients.forEach(client => {
                                        if (client.paintingId === attemptedPurchaseClient.paintingId) {
                                            client.numberOfPurchaseAttempts +=1;
                                        }
                                     //client.numberOfPurchaseAttempts += 1;
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

                            //update each attempt
                        }else if(attemptedPurchaseClient.numberOfPurchaseAttempts > maxPurchaseAttempts){
                            console.log('User has exceeded maximum number of attempts');
                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify({ canUserAttemptPurchase: false, code: 232585511 }));   

                            let purchaseTimerIsOn = globalPurchaseTimerArray.filter(obj=> obj.ipAddress == attemptedPurchaseClient.ipAddress);
                            console.log('purchaseTimerIsOn', purchaseTimerIsOn);
                            if(purchaseTimerIsOn.length>0){
                                //timer is already on
                                console.log('item is already present no need to reset timer or push item in array');
                                console.log('we found', purchaseTimerIsOn)
                            }else{
                                 console.log('item is not present but we are adding it and adding a timer');
                                // array is not empty and we cannot find client timer 
                                const timedOutClient ={
                                    ipAddress: attemptedPurchaseClient.ipAddress,
                                    timer: true
                                };
                                globalPurchaseTimerArray.push(timedOutClient);


                                // Set timer wait 10 seconds before resetting cleint attributed in attemptedClientsarray 
                                // we filter through the array named for ip address and objId 
                                // then if we find them we remove them from the array attemptedClients
                                let resetUserTimer = 36000000; // 10 hours in milliseconds
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

                                    // remove client from timedOutClients
                                }, resetUserTimer); // 5-second delay
                            }

                            

                            
                            // filter through array called attemptedClients by attemptedPurchaseClient.ipAddress and attemptedPurchaseClient.paintingId
                            // remove all of them from attemptedClients array 

                            // if hanging metamask on client side over 2 minutes cancel it or make pop up                
                        }else{
                            console.log('An unexexpted error occureed');
                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify({ canUserAttemptPurchase: false, code: 121225511 })); 
                        }

                    }

                   
                    /*
                    for(client of attemptedClients){
                        if(client.paintingId == objectId){
                            currenTransactionInProgress = true;
                        }
                    }*/

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
                // Parse the JSON data from the request body
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

                    // need to validate hash before updating Db and sending back checker!!
                    // for security reasons but not setup yet 
                    const result = await paintingModel.updateOne(
                        { _id: objectId }, 
                        { $set: {
                             inStock: false,
                              dateSold: new Date() // Set dateSold to the current date/time
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
                        res.end(JSON.stringify({
                            updated: true, 
                            Id: objectId,
                            firstName :firstName,
                            lastName: lastName,
                            productID: updatedPainting._id,
                            productName: updatedPainting.name,
                            price: updatedPainting.price, 
                            img: updatedPainting.image,
                            transactionHash: transactionHash,
                        })); 
                        io.emit('updateCurrentPaintings',{updated: true, Id: objectId} );
                        // only send email if purchase is saved 
                        newPurchase.save()
                          .then(savedUser => {
                            attemptedClients = [];
                            sendEmail(email, address, firstName, lastName, objectId, updatedPainting.price, updatedPainting.name, updatedPainting.image)
                                .then(result => {
                                    /*
                                    let foundIndex = -1 ;
                                    for (let thisIndex = 0; thisIndex < attemptedClients.length; thisIndex++) {
                                        thisIndex +=1 ;
                                        if(client.paintingId == attemptedPurchaseClient.paintingId){
                                            foundIndex = thisIndex;                        
                                            if (foundIndex !== -1) {
                                                attemptedClients.splice(foundIndex, 1); // Remove the element at foundIndex
                                                console.log('Client removed:');
                                            } else {
                                                console.log('Client not found:');
                                            }
                                        }else{
                                            console.log('cannot find paiting ID');
                                        }
                                    }*/

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
                    // Parse the JSON data from the request body
                    console.log('trying to parse data to json');
                    const data = JSON.parse(body);
                    verifyUserinputData(data.email, data.address, data.firstName, data.lastName)
                        .then((result) => {

                            //console.log(result);

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

                    // Send the response with the result
                    //res.setHeader('Content-Type', 'application/json');
                } catch (error) {
                    console.error('Error processing request:', error);
                    // If an error occurs, send an error response
                    //res.setHeader('Content-Type', 'application/json');
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

                // check numberOfchangesvalue
                const userIndex = users.findIndex(user => user.ip === clientIP);

                if (userIndex !== -1 && users[userIndex].nameChanges <= 7 && checkString(data.newUsername) && data.newUsername.length >=3) {
                    users[userIndex].nameChanges +=1; 
                    const usersOldName = users[userIndex].user;

                    // change all messages with old name 
                    messageHistory.forEach(message => {
                        if (message.username === usersOldName) {
                            message.username = data.newUsername;
                        }
                    });
                    
                    // reset the name in array
                    // can set a timestamp of last set name
                    // if number of changes >7 and difference between stamps is less then say 1 month 
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

            });

        }catch(error){
            console.log('Error with fetch request /UpdateUsername');
        }

    } else if(req.method == 'POST' && req.url == '/UpdatePaintingViewsValue'){
        try{
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();

            });

            req.on('end', async () => {           

                // might need to prevenet the same person from clicking multiple times 
                // can be added later 
                try {
                    const data = JSON.parse(body);
                    const updaterIPAddress = req.connection.remoteAddress;
                    const updator = {ip: updaterIPAddress, data};
                    const isObjectInArray = updatedViewsHistory.some(obj => obj.ip === updator.ip && obj.data === updator.data);

                    if(isObjectInArray){
                        //console.log('user already viewed the painting', updator.data)
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ success: false, message: 'you already viewed this painting' }));
                    }else{
                        updatedViewsHistory.push(updator);
                        const thispainting = await paintingModel.findOne({ _id: data });
                        
                        if (thispainting) {
                            // Update the views count
                            const result = await paintingModel.updateOne(
                                { _id: data },
                                { $set: { views: thispainting.views + 1 } }
                            );

                            if (result.modifiedCount === 1) {
                                // Send success response if update was successful
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ success: true }));
                            } else {
                                // Send failure response if update was not successful
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ success: false }));
                            }
                        } else {
                            // Send failure response if painting with given ID was not found
                            res.writeHead(404, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ success: false, message: 'Painting not found' }));
                        }
                    }

                } catch (error) {
                    console.log(error);
                    // Send error response if there was an error
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: 'Internal server error' }));
                }

            });

        }catch(error){
            console.log('Error with fetch request /UpdatePaintingViewsValue');
        }
        
    } else {
        try{
            // Handle requests for serving static files
            let filePath = '.' + req.url;
            if (filePath === './') {
                filePath = './index.html'; // change to https://www.bursonskullz.com 
            }
        
            const extname = path.extname(filePath);
            let contentType = 'text/html'; // Default content type
        
            // Set content type based on file extension
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
                if (err) {
                    if (err.code === 'ENOENT') {
                        // File not found
                        res.writeHead(404);
                        res.end('404 Not Found we got this back');
                    } else {
                        // Server error
                        res.writeHead(500);
                        res.end('Internal Server Error: ' + err.code);
                    }
                } else {
                    // Serve the file with appropriate content type
                    res.writeHead(200, { 'Content-Type': contentType });
                    res.end(content, 'utf-8');
                }
            });
        }catch(error){
            console.log('Error with home Fetch');
        }
    }
}
