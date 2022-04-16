// Random order generation functions

// import { response } from "../../app";


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
// End random order generation files


//document functions
document.addEventListener("DOMContentLoaded", function () {

  //
  // Entry Submission
  //

  //get input objects
  inStoreID = document.getElementById("inStoreID");
  inSPID = document.getElementById("inSalesPersonID");
  inCdID = document.getElementById("inCdID");
  inPPaid = document.getElementById("inPricePaid");
  inDate = document.getElementById("inDate");

// add button events ************************************************************************
  
  //Create button will take a random CD Order and post it to the webpage
  document.getElementById("btnCreate").addEventListener("click", function (){
     let order = CreateRandomOrder(new Date());
          inStoreID.value =  order.StoreID;
          inSPID.value = order.SalesPersonID;
          inCdID.value = order.CdID;
          inPPaid.value = order.PricePaid;
          inDate.value = order.Date;
  });

  //Used to submit one CD order temporally
  document.getElementById("btnAddOne").addEventListener("click", function (){
    let order = CreateRandomOrder(new Date());
      fetch('/users/SubmitOne', {
          method: "POST",
          body: JSON.stringify(order),
          headers: {"Content-type": "application/json; charset=UTF-8"}
          })
          .then(response => response.json()) 
          .then(json => console.log(json))
          .catch(err => console.log(err));
  });

  //used to submit 500 orders to a writen file.
  document.getElementById("btnAllOrders").addEventListener("click", function (){
      let orders = GenerateEntries(500);
      for (let i = 0; i < orders.length; i++) {
      fetch('/users/Submit500', {
        method: "POST",
        body: JSON.stringify(orders[i]),
        headers: {"Content-type": "application/json; charset=UTF-8"}
      })
          .then(response => response.json()) 
          .then(json => console.log(json),
          )
          .catch(err => console.log(err));
  }});

  //
  // Database Query Response
  //
  const queryResContainer = document.getElementById("query-response-container")

  // "Who sold the most" clicked
  document.getElementById("btn-most-sold").addEventListener("click", function () {
    fetch('/users/mostCDs', {
      method: "GET"
    }).then(function(response) {
      return response.json();
    }).then(function(json) {
      // Display the employee who made the most
      let employeeString = '';
      for (let i = 0; i < json.employees.length; i++) {
        if (i != 0) employeeString += " and ";
        employeeString += `Employee # ${json.employees[i]}`;
      }
      const headerString = `<p><b>Employee(s) who made sold the most CDs:</b> ${employeeString}</p>`;
      const numString = `<p><b>CDs sold:</b> ${json.numSales} CDs</p>`;
      let salesString = `<p><b>Sales Records:</b></p>`;
      for(let sale in json.sales) {
        salesString += `<p><b>StoreID:</b> ${json.sales[sale].StoreID} | <b>SalesPersonID:</b> ${json.sales[sale].SalesPersonID} | <b>CdID:</b> ${json.sales[sale].CdID} | <b>PricePaid:</b> ${json.sales[sale].PricePaid} | <b>Date:</b> ${json.sales[sale].Date}</p>`;
      }

      queryResContainer.innerHTML = headerString + numString + salesString;
    });
  });
  
  // "Who made the most money" clicked
  document.getElementById("btn-most-money").addEventListener("click", function () {
    fetch('/users/mostMoney', {
      method: "GET"
    }).then(function(response) {
      return response.json();
    }).then(function(json) {
      // Display the employee who made the most
      let employeeString = '';
      for (let i = 0; i < json.employees.length; i++) {
        if (i != 0) employeeString += " and ";
        employeeString += `Employee # ${json.employees[i]}`;
      }
      const headerString = `<p><b>Employee(s) who made the most money:</b> ${employeeString}</p>`;
      const totalString = `<p><b>Money earned:</b> $${json.total}</p>`;
      let salesString = `<p><b>Sales Records:</b></p>`;
      for(let sale in json.sales) {
        salesString += `<p><b>StoreID:</b> ${json.sales[sale].StoreID} | <b>SalesPersonID:</b> ${json.sales[sale].SalesPersonID} | <b>CdID:</b> ${json.sales[sale].CdID} | <b>PricePaid:</b> ${json.sales[sale].PricePaid} | <b>Date:</b> ${json.sales[sale].Date}</p>`;
      }

      queryResContainer.innerHTML = headerString + totalString + salesString;
    });
  });

});  
// end of wait until document has loaded event  *************************************************************************