// Random order generation functions


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


// define a constructor to create CD objects
let Order = function (pStoreID, pSalesPersonID, pCdId, pPricePaid, pDate) {
    this.ID = Math.random().toString(16).slice(5)  // tiny chance could get duplicates!
    this.StoreID = pStoreID;
    this.SalesPersonID = pSalesPersonID;
    this.CdId = pCdId;
    this.PricePaid = pPricePaid;
    this.Date = pDate;
};

document.addEventListener("DOMContentLoaded", function () {

    //get input objects
    inStoreID = document.getElementById("inStoreID");
    inSPID = document.getElementById("inSalesPersonID");
    inCdID = document.getElementById("inCdID");
    inPPaid = document.getElementById("inPricePaid");
    inDate = document.getElementById("inDate");

// add button events ************************************************************************
    
    //Create button will take a random CD Order and post it to the webpage
    document.getElementById("btnCreate").addEventListener("click", function (){
       let order = new Order;
       fetch('/Create') //Should This Be a GET fetch?
        .then(response => response.json())
        .then(reponseData => {
            inStoreID.value =  order.StoreID;
            inSPID.value = order.SalesPersonID;
            inCdID.value = order.CdID;
            inPPaid.value = order.PricePaid;
            inDate.value = order.Date;
        })      
            .catch(err => console.log(err));
    });

    //Used to 
    document.getElementById("btnAddOne").addEventListener("click", function (){
        fetch('/users/SubmitOne', {
            method: "POST",
            })
            .then(response => response.json()) 
            .then(json => console.log(json))
            .catch(err => console.log(err));
    });

    document.getElementById("btnAllOrders").addEventListener("click", function (){
        fetch('/Submit500', {
            method: "POST",
            })
            .then(response => response.json()) 
            .then(json => console.log(json),
            )
            .catch(err => console.log(err));
    });
  

});  
// end of wait until document has loaded event  *************************************************************************