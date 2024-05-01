import dotenv from "dotenv"; 
import algosdk from "algosdk"; 
dotenv.config(); 
//don’t forget to add your mnemonic 
let myaccount = algosdk.mnemonicToSecretKey("special armor duck uphold hollow reflect supreme high swallow crawl awkward man risk theme keep shrug luggage cart either announce trend remain across abandon sock");
const baseServer = "https://testnet-api.algonode.cloud"; 
const algodClient = new algosdk.Algodv2("", baseServer, ""); 
// This variable is our client. It is the link between our code and the 
blockchain
(async () => { 
try { 
let params = await algodClient.getTransactionParams().do(); 
// reciever will be some random address.
const receiver =
"HZ57J3K46JIJXILONBBZOHX6BKPXEM2VVXNRFSUED6DKFD5ZD24PMJ3MVA"; 
const enc = new TextEncoder(); 
const note = enc.encode("My first transaction on Algo!"); 
let amount = 100000; // equals .1 ALGO
let sender = myaccount.addr; 
let txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({ 
from: sender, 
to: receiver, 
amount: amount, 
node: note, 
suggestedParams: params, 
 }); 
console.log("HERE3"); 
let accountInfo = await
algodClient.accountInformation(myaccount.addr).do(); 
console.log("Account balance: %d microAlgos", accountInfo.amount); 
// sign transaction
let signedTxn = txn.signTxn(myaccount.sk); 
let txId = txn.txID().toString(); 
console.log("Signed transaction with txID: %s", txId); 
await algodClient.sendRawTransaction(signedTxn).do(); 
// Wait for confirmation
let confirmedTxn = await algosdk.waitForConfirmation(algodClient, 
txId, 4); 
accountInfo = await
algodClient.accountInformation(myaccount.addr).do(); 
console.log("Transaction Amount: %d microAlgos", 
confirmedTxn.txn.txn.amt); 
console.log("Transaction Fee: %d microAlgos", 
confirmedTxn.txn.txn.fee); 
console.log("Account balance: %d microAlgos", accountInfo.amount); 
 } catch (err) { 
console.error("Failed to get apps from the sdk", err); 
process.exit(1); 
 } 
})();