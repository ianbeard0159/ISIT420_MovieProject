
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
        fetch('/SubmitOne', {
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