var express = require('express');
var router = express.Router();
var fs = require("fs");
var path = require("path");
const mongoose = require("mongoose");
const OrderSchema = require("../Schema");

let OrderObject = function (_StoreID, _SalesPersonID, _CdID, _PricePaid, _Date) {
  this.StoreID = _StoreID;
  this.SalesPersonID = _SalesPersonID;
  this.CdID = _CdID;
  this.PricePaid = _PricePaid;
  this.Date = _Date;
}

// Publicly accesible list of valid stores with their employees
const validStores = [
  {id: 98053, employees: [1, 2, 3, 4]},
  {id: 98007, employees: [5, 6, 7, 8]}, 
  {id: 98077, employees: [9, 10, 11, 12]}, 
  {id: 98055, employees: [13, 14, 15, 16]}, 
  {id: 98011, employees: [17, 18, 19, 20]}, 
  {id: 98064, employees: [21, 22, 23, 24]}
];
// Publicly accesibloe list of valid CDs
const validCdIDs = [123456, 123654, 321456, 321654, 654123, 654321, 543216, 354126, 621453, 623451];


//************Mongo System******************* */

// A diferent connection string will need to be used if your IP address is not on the approved list
const ianConnectionString = "mongodb+srv://nodeUser:nodePass@cluster0.509yd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const dbURI = "mongodb+srv://JunkLinda:NotFake2@isit420.8prru.mongodb.net/OrdersCD?retryWrites=true&w=majority";

mongoose.set("useFindAndModify", false);

const options = {
  reconnectTries: Number.MAX_VALUE,
  poolSize: 10
}

mongoose.connect(ianConnectionString, options).then(
  () => {
    console.log("Database connection established!");
  },
  err => {
    console.log("Error connecting Database instance due to: ", err);
  }
);

// Retrieve data for a single employee from the database
function GetEmployeeSales(employeeID) {
  return new Promise(function(resolve) {
    OrderSchema.find({SalesPersonID: employeeID}, function(err, orders) {
      if(err) {
        console.log(err)
        res.status(500).send(err);
      }
      console.log("Orders for: " + employeeID);

      resolve(orders);
    });
  });
}

// Returns an object with the employee(s) who sold the most CDs and their sales records
function GetMostSales() {
  // Promise uses 'async' function so that it can 'await' responses from other functions
  return new Promise(async function(resolve) {
    let returnData = {
      employees: [],
      numSales: 0,
      sales: {}
    }
    for (let store in validStores) {
      for (let employee in validStores[store].employees) {
        // Wait for response from GetEmployeeSales before next iteration
        await GetEmployeeSales(validStores[store].employees[employee]).then(function(promiseRes) {
          // Find out how many CDs this employee sold
          let numEntries = Object.keys(promiseRes).length;
          // If they sold the most CDs so far
          if (numEntries > returnData.numSales) {
            returnData.numSales = numEntries;
            returnData.employees = [validStores[store].employees[employee]];
            returnData.sales = promiseRes;
          }
          // If there is a tie for first
          else if (numEntries == returnData.numSales) {
            returnData.employees.push(validStores[store].employees[employee]);
            // Add new sales data to existinf sales JSON object
            for (let entry in promiseRes)
            returnData.sales.push(promiseRes[entry]);
          }
        });
      }
    }
    // Return
    resolve(returnData);
  });
}

// Return an object with info about the employee who made the most money off of their sales
function GetMostMoney() {
  return new Promise(async function(resolve) {
    let returnData = {
      employees: [],
      total: 0,
      sales: {}
    }
    for (let store in validStores) {
      for (let employee in validStores[store].employees) {
        // Wait for response from GetEmployeeSales before next iteration
        await GetEmployeeSales(validStores[store].employees[employee]).then(function(promiseRes) {
          // Add up all of the employee's sales
          let tempTotal = 0;
          for (let entry in promiseRes) {
            tempTotal += promiseRes[entry].PricePaid;
          }
          // If they made more than anyone else so far
          if (tempTotal > returnData.total) {
            console.log(tempTotal);
            returnData.employees = [validStores[store].employees[employee]];
            returnData.total = tempTotal;
            returnData.sales = promiseRes;
          }
          // If there is a tie for first
          else if (tempTotal == returnData.total) {
            returnData.employees.push(validStores[store].employees[employee]);
            // Add new sales data to existinf sales JSON object
            for (let entry in promiseRes)
            returnData.sales.push(promiseRes[entry]);
          }
        });
      }
    }
    // Return
    resolve(returnData);

  });
}

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
  });
});

router.post('/Submit500', function(req, res) {

    let newOrder = new OrderSchema(req.body);
    console.log(req.body);
    console.log(newOrder);
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

// Employee who sold the most CDs
router.get('/mostCDs', async function(req, res) {
  await GetMostSales().then(function(promiseRes) {
    res.status(200).json(promiseRes);
  });
});
// Employee made the most money
router.get('/mostMoney', async function(req, res) {
  await GetMostMoney().then(function(promiseRes) {
    res.status(200).json(promiseRes);
  });
});

module.exports = router;
