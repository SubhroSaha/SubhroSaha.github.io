//Find max 10 call oi data
const getMax = function (action, color, attribute) {
    let openInterests = {};
    let classText = "." + attribute + "." + action;
    document.querySelectorAll(classText).forEach(x => {
        // console.log(x.classList[1]);
        openInterests[x.classList[1]] = parseInt(x.innerText);
    })

    let maxSpeed = openInterests;
    let sortable = [];
    for (var vehicle in maxSpeed) {
        sortable.push([vehicle, maxSpeed[vehicle]]);
    }

    sortable.sort(function (a, b) {
        return b[1] - a[1];
    });
    sortable.splice(7, sortable.length - 1);
    sortable.forEach(x => {
        let classText = "." + attribute + "." + x[0] + "." + action;
        $(classText).css("background-color", color);
        if ($(classText).siblings(".strikePrice").css("background-color") == "rgb(220, 20, 60)") {
            $(classText).siblings(".strikePrice").css("background-color", "YELLOW");
        } else {
            $(classText).siblings(".strikePrice").css("background-color", color);
        }
        // console.log(x);
    })
}

const getData = function (index) {
    $.ajax({
        url: 'https://www.nseindia.com/api/option-chain-indices?symbol=' + index,
        method: 'GET',
        success: function (res) {
            let data = res;
            console.log(res);

            // Clear table
            document.querySelector("tbody").innerText = "";
            let tBody = document.querySelector("tbody");

            // Present the data in table
            data.filtered.data.forEach(x => {
                let tr = document.createElement('tr');
                tr.classList.add(x.strikePrice);
                // tr.innerText = x.strikePrice;
                tBody.appendChild(tr);
                for (let y in x.CE) {
                    if (y == "openInterest" || y == "changeinOpenInterest" || y == "pchangeinOpenInterest" || y == "totalTradedVolume" || y == "impliedVolatility" || y == "lastPrice" || y == "change" || y == "pChange" || y == "bidQty" || y == "bidprice" || y == "askQty" || y == "askPrice") {
                        let td = document.createElement('td');
                        td.classList.add(y, x.CE.strikePrice, "call");
                        td.innerText = x.CE[y].toFixed(2);
                        tr.appendChild(td);
                    }
                }

                for (let y in x.PE) {
                    if (y == "strikePrice") {
                        let td = document.createElement('td');
                        td.classList.add(y);
                        td.innerText = x.PE[y].toFixed(2);
                        tr.appendChild(td);
                    }
                }

                function dict_reverse(obj) {
                    let new_obj = {}
                    let rev_obj = Object.keys(obj).reverse();
                    rev_obj.forEach(function (i) {
                        new_obj[i] = obj[i];
                    })
                    return new_obj;
                }

                let reversedY = dict_reverse(x.PE);

                for (let y in reversedY) {
                    if (y == "openInterest" || y == "changeinOpenInterest" || y == "pchangeinOpenInterest" || y == "totalTradedVolume" || y == "impliedVolatility" || y == "lastPrice" || y == "change" || y == "pChange" || y == "bidQty" || y == "bidprice" || y == "askQty" || y == "askPrice") {
                        let td = document.createElement('td');
                        td.classList.add(y, x.PE.strikePrice, "put");
                        td.innerText = x.PE[y].toFixed(2);
                        tr.appendChild(td);
                    }
                }
            })
            console.log('rendered!');

            getMax("call", "crimson", "openInterest");
            getMax("put", "OLIVEDRAB", "openInterest");
            getMax("call", "crimson", "totalTradedVolume")
            getMax("put", "OLIVEDRAB", "totalTradedVolume");
            // getMax("call", "crimson", "bidQty")
            // getMax("put", "OLIVEDRAB", "bidQty");
            // getMax("call", "crimson", "askQty")
            // getMax("put", "OLIVEDRAB", "askQty");
        },

        error: function (error) {
            console.log(error.status);
        }
    })
}

// setInterval(getData, 1000);


var e = document.getElementById("equity_optionchain_select");
function onChange() {
    var value = e.value;
    var text = e.options[e.selectedIndex].text;
    console.log(value, text);
    getData(value);
}
e.onchange = onChange;

onChange();