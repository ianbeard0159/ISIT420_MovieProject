var express = require('express');
var router = express.Router();
var fs = require("fs");
var path = require("path");

let OrderObject = function (_StoreID, _SalesPersonID, _CdID, _PricePaid, _Date) {
  this.StoreID = _StoreID;
  this.SalesPersonID = _SalesPersonID;
  this.CdID = _CdID;
  this.PricePaid = _PricePaid;
  this.Date = _Date;
}

// Add 5 to 30 minutes to the input date object
function IncreaseDateValue(_prevDate) {
  const rndTime = 5 + Math.floor(Math.random() * 26);
  const returnDate = new Date();
  returnDate.setMinutes(_prevDate.getMinutes() + rndTime);
  return returnDate;
}

// Create a single random order
function CreateRandomOrder(_date) {
  // Arrays of valid IDs that can be randomly picked from
  const validStores = [
    {id: 98053, employees: [1, 2, 3, 4]},
    {id: 98007, employees: [5, 6, 7, 8]}, 
    {id: 98077, employees: [9, 10, 11, 12]}, 
    {id: 98055, employees: [13, 14, 15, 16]}, 
    {id: 98011, employees: [17, 18, 19, 20]}, 
    {id: 98064, employees: [21, 22, 23, 24]}
  ];
  const validCdIDs = [123456, 123654, 321456, 321654, 654123, 654321, 543216, 354126, 621453, 623451];
  
  // Generate random indexes for choosing random values from arrays
  const rndStoreIndex = Math.floor(Math.random() * validStores.length);
  const rndCdIndex = Math.floor(Math.random() * validCdIDs.length);
  const rndSalesPersonIndex = Math.floor(Math.random() * 4);

  // Generate random values for the new order object
  const rndStoreId = validStores[rndStoreIndex].id;
  const rndCdId = validCdIDs[rndCdIndex];
  const rndSalesPersonId = validStores[rndStoreIndex].employees[rndSalesPersonIndex];
  const rndPricePaid = 5 + Math.floor(Math.random() * 11);

  return new OrderObject(rndStoreId, rndSalesPersonId, rndCdId, rndPricePaid, _date);
}

// Generate an array of random entries
function GenerateEntries(_numEntries) {
  // Set the initial date to the current date/time
  let date = new Date();
  let entries = [];

  // Add a given number of random entries to the array
  for (let i = 0; i < _numEntries; i++) {
    entries.push(CreateRandomOrder(date));
    date = IncreaseDateValue(date);
  }

  return entries;

}

/* GET users listing. */
/*router.get('/', function(req, res, next) {
  res.sendFile(path.join(`${__dirname}/../public/users.html`));
});

router.post('/Create', function(req, res) {
  let order = CreateRandomOrder(new Date());
  console.log(order);

});

router.post('/SubmitOne', function(req, res) {
  console.log(req.body);
});

router.post('/Submit500', function(req, res) {
  let data = JSON.stringify(req.body);
  fs.writeFileSync('entries.json', data);
}); */


//************Mongo System******************* */

const mongoose = require("mongoose");
const OrderSchema = require("../Schema")
const dbURI = "mongodb+srv://JunkLinda:NotFake2@isit420.8prru.mongodb.net/CDs?retryWrites=true&w=majority";

mongoose.set("useFindAndModify", false);

const options = {
  reconnectTries: Number.MAX_VALUE,
  poolSize: 10
}

mongoose.connect(dbURI, options).then(
  () => {
    console.log("Database connection established!");
  },
  err => {
    console.log("Error connecting Database instance due to: ", err);
  }
);

router.get('/', function(req, res, next) {
  res.sendFile(path.join(`${__dirname}/../public/users.html`));
});

router.get('/getAllOrders', function(req, res){
  OrderSchema.find({}, (err, allOrders) => {
    if(err) {
      console.log(err)
      res.status(500).send(err);
    }
    res.status(200).json(allOrders);
  })
})

router.post('/Submit500', function(req, res) {
  let data = JSON.stringify(req.body);
  let newOrder = new OrderSchema(data);
  console.log(req.body);
  newOrder.save((err) => {
    if (err) {
      res.status(500).send(err)
    }
    var response = {
      status : 200,
      success : 'Added Successfully' 
    }
    res.end(JSON.stringify(response));

  })
}); 

//employee sold most cd
//employee made the most money

module.exports = router;
