var dbRow = {
    FirstLookedDate: 0,
    LastPriceChange: 0,
    LastPriceChangeDate: 0,
    LastPrice: 0
};


//Message Listener
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
      if (request.action) {
          switch (request.action) {
              case "CheckPrice":
                  ActionCheckPrice(request.data).then(function(data){
                      sendResponse(data);
                  });
                  return true;
                  break;
          }
      }
  });
// Check price Action
function ActionCheckPrice(inpData) { 
    var data = inpData;
    var stor = new Promise(function (resolve, reject) {
        chrome.storage.local.get(data.id, function (items) {
            resolve(items);
        });

    });
    return stor.then(function (items) {
        var item;
        if (items.hasOwnProperty(data.id)) {
            item = items;
            if (data.currentPrice && item[data.id].LastPrice != data.currentPrice) {
                item[data.id].LastPriceChange = item[data.id].LastPrice;
                item[data.id].LastPrice = data.currentPrice;
                item[data.id].LastPriceChangeDate = Date.now();
                chrome.storage.local.set(item);
            }
        }
        else {
            item = {};
            item[data.id] = {
                id: data.id,
                LastPrice: data.currentPrice,
                LastPriceChange: data.currentPrice
            };
            item[data.id].FirstLookedDate = Date.now();

            chrome.storage.local.set(item);
        }
        return item[data.id];
    });
}
