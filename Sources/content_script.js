//newCatList visitedT

var rows = $("tr[data-bull-id]");

var carData = [];
rows.each(function (i) {
    var price = $(this).find('span.f14').first();
  /*  var currency = 'p';

    switch (price.html()[0])
    {
        case '$':
            currency = '$';
            break;
        case '€':
            currency = '€';
            break;
        default:
            currency = 'p';
            break;
    }
    parseInt($(this).find('span.f14').first().html().replace(' ', '')),
    */
    var carMsgData = {
       id: $(this).attr("data-bull-id"),
        currentPrice: parseInt($(this).find('span.f14').first().html().replace(' ', ''))
        //currencyUnit: currency
    }

    chrome.runtime.sendMessage({ action: "CheckPrice", data: carMsgData }, function (response) {
        if (response) {
            var el = $("tr[data-bull-id='" + response.id + "'");
            var change = response.LastPrice - response.LastPriceChange;
            var changeClass = "price-down";
            if (change == 0) {
                changeClass = "price-equal";
            }
            else {
                if (change > 0)
                    changeClass = "price-up";
                else
                    changeClass = "price-down"
            }

            var e = el.find('span.f14').first();

            var flDtStr;
            if (response.FirstLookedDate) {
                flDtStr = getFormatedDate(response.FirstLookedDate)
            }
            var plcDate;
            priceChangeHtml = "<span class='price-ext " + changeClass + "'>" + formatInt(change) + "р. </span>";

            if (response.LastPriceChangeDate)
            {
                plcDate = getFormatedDate(response.LastPriceChangeDate);
                var html = "<small class='price-firstLooked'>Изменение: " + plcDate + "</small><br>";
                priceChangeHtml = html + priceChangeHtml;
            }


            if (e.find('.price-ext').length > 0)
            {
                e.find('.price-ext').replaceWith(priceChangeHtml);
                el.find('.price-firstLooked').html(flDtStr);
            }
            else
            {
                el.find('span.f14').first().append("<br>" +  priceChangeHtml);
                el.children('td').first().prepend("<div class='price-firstLooked'>"+flDtStr+"</div>");
            }
          //  console.log(response);
        }
    });
});

function getFormatedDate(date)
{
    var dt = new Date(date);
    var day = dt.getDate();
    var month = dt.getMonth()+1;
    var flDtStr = (day < 10?'0':'') + day + '.'
    + (month < 10 ? '0' : '') + month ;
    // + '.' + dt.getFullYear();
    return flDtStr;
}
function formatInt(num) {
    var n = num.toString(), p = n.indexOf('.');
    return n.replace(/\d(?=(?:\d{3})+(?:\.|$))/g, function ($0, i) {
        return p < 0 || i < p ? ($0 + ' ') : $0;
    });
}