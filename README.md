# Bitcoin Scaling Hackthon: Wooy

![wooy](https://ipfs.io/ipfs/Qmb7mU9CiYr8dMNpUf1TZzapcZeNPHYaf6XzZ1aQRUU44U)

### **In Wooy, your help is rewarded with an exclusive POD (Proof of Donation). A unique piece of art designed especially for you.**

### **What is it for?**

It is a digital certificate of your support for a charitable cause. Everyone who has contributed to an impactful cause can obtain it.

---

### **Installation:**

To use this application, you must first clone this repository to your local machine.

> git clone https://github.com/Javpod/Wooy-bitcoin-Scaling-Hackathon.git
> 

Then make sure you have the following tools installed:

- Visual Studio Code
- Node.JS

To start the web page, follow these steps:

1. Open a terminal and navigate to the folder where you cloned this repository.
2. Run **`npm install`** to install the required dependencies, including express, mongoose, web3, mongoDB, nodemon, and dotenv.
3. Run **`npm start`** to start the application.
4. Access the local domain through the URL: **`https://localhost:3000`**
5. If you want to emulate a database that represents the information provided by NGOs, access the local domain: **`https://localhost:3000/register`** and complete the form.

If you have followed these steps correctly, the web page should operate fully.

---

### **Usage**

Below, we will detail how to use the project and access its functionalities.

We work with NGOs to gift NFT PODs (Proof of Donations) to donors on their platforms, thus fostering loyalty. The NGO sends us a ***database*** with the emails of their donors, and we mint the POD to our wallet and link it to their ***email***. Users can view their POD on our website and, if desired, transfer it to their wallet.

We will provide exhaustive steps of the process to deepen your understanding of the project.

1. An NGO joins our initiative.
2. We implement the smart contract in Hardhat.
3. The NGO provides us with their donor database via email on a weekly basis (provided that the user accepts their email being shared in a Wooy database).
4. We generate a hash of the received emails.
5. If our database consists of, for example, 5 emails, we create 5 unique tokens called PODs, each associated with its corresponding email hash.
6. An email with the POD is sent to the user, inviting them to claim it on the Wooy website.
7. Users can access the website and search for their POD by entering their email in the corresponding search field.
8. Once found, the user can choose to transfer their POD to their digital wallet by completing the POD transfer request form through the following link:

> www.localhost:3000/pages/ongs/{POD-name}.html
> 
1. In the form, the user must provide their email and wallet information to complete the transfer.
2. WOOY transfers the requested POD from the organization's wallet to the user's wallet using a unique identification code.

---

### **Built with:**

- Hardhat
- Web3
- Visual Studio Code
- Node.JS
- MongoDB
- Bootstrap
- jQuery
- Ajax

### **Authors**

- Joaquin Alvarez Vitale
- Agustin Villalba Orue
- Franco Cornejo 
- Juan Nielsen 
