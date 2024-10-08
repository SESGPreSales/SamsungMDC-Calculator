
// consts
const req = new XMLHttpRequest;
let res = new Object;
let hexOutputArray = [];
const version = "Version 1.1.0 (db1.0.2)"

//selectors
const table = document.querySelector('.main_table');
const hexoutputFinal = document.querySelector('.result h1');
const title = document.querySelector('.command_name p');
const desc = document.querySelector('.command_description p');
const moreinfo = document.querySelector('.command_moreinfo');
const selects = document.querySelector('#options');
const selectsFull = document.querySelector('.selects');
const input_id = document.querySelector('.id_input');
const openInput = document.querySelector('.open_input');
const dInputs = document.querySelectorAll('.d');
const imagediv = document.querySelector('.image');
const search = document.querySelector('.search-input');
const appVersion = document.querySelector('.header p');
const popup = document.querySelector('.popup');
const toClip = document.querySelector('.copy');
// const checkbox = checkbox1.checked;
const checkbox = document.querySelector('.switch input');


//eventlisteners
table.addEventListener('click', selectItem );
search.addEventListener('input', filter);
toClip.addEventListener('click', toClipboard);
toClip.addEventListener('mouseout', outFunc);

let tr = [];

if (hexoutputFinal.innerHTML == "") {
    console.log('empty result')
    toClip.classList.add('hidden')} 
    else {
        console.log('NOT empty result')
        toClip.classList.remove('hidden')}

function getData() {
    
    // Define the URL to fetch the data from
    const url = "/api/tablecontent";
    
    // Perform the fetch
    fetch(url)
    .then((response) => {
        // Check if the fetch was successful
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        //console.log(res)
        return response.json();
    })
    .then( (data) => {
        data.forEach(e => createTable(e));
        hover();
        removePopup();
    })
    .catch((error) => {
        console.error('Fetch error!!!:', error);
    });
}
function createTable(e){ 
    
    const newTr = document.createElement('tr');
    
    const command = document.createElement('td');
    const newTd1 = document.createElement('td');
    const newTd2 = document.createElement('td');
    
    command.innerText= e._id;
    newTd1.innerText= e.name;
    newTd2.innerText= e.Description;
    
    newTr.classList.add('table_item')
    command.classList.add('command')
    
    newTr.appendChild(command);
    newTr.appendChild(newTd1);
    newTr.appendChild(newTd2);
    
    table.appendChild(newTr);
    
    tr = document.querySelectorAll('.table_item')
}
function selectItem(e) {
    let comm ="";
    comm = e.target.parentElement.childNodes[0].innerText;
    //console.log(comm)
    
    fetchDetails(comm);
}
function fetchDetails(val) {

    fetch(`/api/tablecontent/${val}`)
    .then((response) => {
        // Check if the fetch was successful
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        //console.log(res)
    return response.json();
})
.then((data) => {
    // console.log( "currentData:", data);
    showDetails(data);
})
.catch((error) => {
    console.error('Fetch error!!!:', error);
});
}
function showDetails(data) {
    toClip.classList.remove('hidden')
    //get all needed data
    let hasFixedValues = data[0].hasfixedvalues || false;
    let hasSubCmd = data[0].hassubcmd || false;
    let subCmd = data[0].subcmd || "";
    let dataLength = data[0].datalength === "variable" ? null : parseInt(data[0].datalength,16);
    let image = data[0].image;
    let command = data[0].command;
    let values = data[0].values || [] ;
    let moreInfo = data[0].moreinfo || "";
    let outData = [];
    let canSet = data[0].canSet || false;
    //INFO: using parseInt(datalength, 16) to convert HEX to DEC
    
    checkbox.addEventListener('change', showSetDetails)
    
    //showing or hidding parts based on selectors:
    
    if (canSet) {
        checkbox.checked = true;
        checkbox.disabled =false;        
    } else {
        checkbox.checked = false;
        checkbox.disabled= true;
    }
    //show inputField for non fixed values
    let neededFiels ="";
    
    function showSetDetails() {
        dataLength = data[0].datalength === "variable" ? null : parseInt(data[0].datalength,16);
        //hide all d input fields as long as they arent needed
        document.querySelectorAll('.d-div').forEach(e => e.classList.add('hidden'));
        document.querySelector('.open').classList.add('hidden');
        //hasFixedValues ? (createOptionsSelect(values), selectsFull.classList.remove('hidden')): selectsFull.classList.add('hidden')
        //show or remove the more info box
        moreInfo ? moreinfo.classList.remove('hidden') : moreinfo.classList.add('hidden')
        
        if (checkbox.checked) {
            if(hasFixedValues) {
                //show Fixed Value Selector and refresh Options
                createOptionsSelect(values);
                selectsFull.classList.remove('hidden'); 
                // add needed elements for Set sitation

                neededFiels = !hasSubCmd ? dataLength -1 : dataLength -2
                } 
                else {
                    selectsFull.classList.add('hidden');
                    neededFiels = !hasSubCmd ? dataLength : dataLength -1} ;   //create if to decide when to remove 1 or 2 based on hasSubCmd
            }
        else {
            neededFiels = "0"; 
            hasSubCmd ? dataLength = "01" : dataLength = "00";
            // remove unused elements for get sitation
            document.querySelector('.open').classList.add('hidden');
            //openInput.classList.add('hidden')
            selectsFull.classList.add('hidden')
        }

        console.log('needed Fields: ',neededFiels)
        
        if (neededFiels > 0) {
            for (let i=1; i <= neededFiels; i++) {
                document.querySelector('.d'+i).classList.remove('hidden')
            }
        }
        
        !dataLength ? document.querySelector('.open').classList.remove('hidden') : document.querySelector('.open').classList.add('hidden');
        // show
        calculate();
        
    }
    
    showSetDetails();
    calculate();
    
    // show already known Data:
    title.innerText = `Function: ${data[0].name}` ;
    desc.innerText = data[0].Description;
    moreinfo.innerText = moreInfo;
    imagediv.src = image;


    //Eventlisteners 
    selects.addEventListener('input', calculate);
    input_id.addEventListener('input', calculate);
    openInput.addEventListener('input', calculate);
    dInputs.forEach( e => e.addEventListener('input', calculate));


    function calculate(){
        //
        if (!checkbox.checked) {
            if(!hasSubCmd) {
                // calculate if openInput fiels are needes (-1 because this is from the selector)
                outData = [command, two(input_id.value),'00']

                if (neededFiels == 0) showHEX(outData)
                if (neededFiels > 0) {
                    for (let i=1; i<=neededFiels; i++) { 
                        let val = document.querySelector('#d'+i).value;
                        let hexString= parseInt(val).toString(16).toUpperCase();
                        outData.push(two(hexString)) 
                    }
                    showHEX(outData)
                }
            }       
            if(hasSubCmd) {
                // calculate if openInput fiels are needes (-1 because this is from the selector)
                outData = [command, two(input_id.value),'01', subCmd]
                showHEX(outData)
                }
            } 
        
        if (checkbox.checked) {
            if(hasFixedValues && !hasSubCmd && dataLength) {
                // calculate if openInput fiels are needes (-1 because this is from the selector)
                outData = [command, two(input_id.value),two(dataLength),selects.value]

                if (neededFiels == 0) showHEX(outData)
                if (neededFiels > 0) {
                    for (let i=1; i<=neededFiels; i++) { 
                        let val = document.querySelector('#d'+i).value;
                        let hexString= parseInt(val).toString(16).toUpperCase();
                        outData.push(two(hexString)) 
                    }
                    showHEX(outData)
                }
            }       
            if(hasFixedValues && hasSubCmd && dataLength) {
                // console.log("Case2: fixed values AND subCmd")
                
                outData = [command, two(input_id.value),two(dataLength), subCmd ,selects.value]
                
                if (neededFiels == 0) showHEX(outData)
                if (neededFiels > 0) {
                    for (let i=1; i<=neededFiels; i++) { 
                        let val = document.querySelector('#d'+i).value;
                        let hexString= parseInt(val).toString(16).toUpperCase();
                        outData.push(two(hexString)) 
                    }
                    showHEX(outData)
                }
            }      
            if(!hasFixedValues && hasSubCmd && !dataLength) {
                
                let openVal = openInput.value; 

                outData = [command, two(input_id.value), two((openVal.length + 1).toString(16)), subCmd];
                
                Array.from(openVal).forEach( e => {
                    let val = two(e.charCodeAt().toString(16).toUpperCase());
                    outData.push(val);
                })   
                showHEX(outData);
            }     
            if(!hasFixedValues && !hasSubCmd && !dataLength) {
                
                let openVal = openInput.value; 

                outData = [command, two(input_id.value), two((openVal.length).toString(16))];
                
                Array.from(openVal).forEach( e => {
                    let val = two(e.charCodeAt().toString(16).toUpperCase());
                    outData.push(val);
                })   
                showHEX(outData);
            }   
            if(!hasFixedValues && !hasSubCmd && dataLength)  {
                outData = [command, two(input_id.value),two(dataLength)]

                if (neededFiels == 0) showHEX(outData)
                if (neededFiels > 0) {
                    for (let i=1; i<=neededFiels; i++) { 
                        let val = document.querySelector('#d'+i).value;
                        let hexString= parseInt(val).toString(16).toUpperCase();
                        outData.push(two(hexString)) 
                    }
                    showHEX(outData)
                }
            }
            
            //this is the working thing for the Network Configuration thing. not working.

            if(!hasFixedValues && hasSubCmd && dataLength) {
                
                outData = [command, two(input_id.value),two(dataLength), subCmd]

                if (neededFiels == 0) showHEX(outData)
                if (neededFiels > 0) {
                    for (let i=1; i<=neededFiels; i++) { 
                        let val = document.querySelector('#d'+i).value;
                        let hexString= parseInt(val).toString(16).toUpperCase();
                        outData.push(two(hexString)) 
                    }
                    showHEX(outData)
                    
            }

        }}
    }; 
};
function two(val){
        val = val.toString();
        while (val.length < 2) val = `0${val}`;
        return val.toUpperCase(); 
}
function createOptionsSelect(values){
    
    const val = document.querySelector('#options')
    removeAllChildNodes(val);
    
    let res =  values.forEach( e => {
        const newOption = document.createElement('option')  
        newOption.value = e.value;
        newOption.innerText = e.name
        val.appendChild(newOption)
    })
    // return res
}
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}
//filter Table by Name
function filter() {
    // Declare variables
    var input, filter, tr, td, i, txtValue;
    input = search;
    filter = input.value.toUpperCase();
    console.log(filter)
    tr = table.querySelectorAll(".table_item");
    
    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        td = tr[i].querySelectorAll('td')[1];
        if (td) {
            txtValue = td.textContent || td.innerText;
            console.log(txtValue)
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}
// Adds AA and the checksum to the HEX and shows the result 
function showHEX(val) {
    
    //output Resule
    let totalForChecksumDec = 0;
    val.forEach( e => {totalForChecksumDec += parseInt(e,16)})

    let checksum = Math.abs(totalForChecksumDec).toString(16).toUpperCase().slice(-2);
    
    val.push(checksum);
    val.unshift('AA');
    let outputresult = val.join(' ');
    hexoutputFinal.innerText = outputresult;
    
}
function toClipboard() {
    // Get the text field
    var copyText = hexoutputFinal.innerText;
    console.log(copyText)
    
  
     // Copy the text inside the text field
    navigator.clipboard.writeText(copyText);
  
    // Alert the copied text
      
  var tooltip = document.getElementById("myTooltip");
  tooltip.innerHTML = "Copied: </br>" + copyText;
}

function outFunc() {
  var tooltip = document.getElementById("myTooltip");
  tooltip.innerHTML = "Copy to clipboard";
}
// Data from JSON is fetched once on pageload
getData();