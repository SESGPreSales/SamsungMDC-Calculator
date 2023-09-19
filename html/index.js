
// consts
const req = new XMLHttpRequest;
let res = new Object;
let hexOutputArray = [];
const version = "Version 0.9 beta"
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
//eventlisteners
table.addEventListener('click', selectItem );
search.addEventListener('input', filter);
appVersion.innerText = version;
let tr = [];


function hover() {
    tr.forEach( e => e.addEventListener('mouseover', changeBg ));
    tr.forEach( e => e.addEventListener('mouseout', changeBg ));
    tr.forEach( e => e.addEventListener('click', changeBgFix ));
};

function changeBg(e) {
    const item = e.target;
    const itemParent = item.parentElement
    itemParent.classList.toggle('over')
}

function changeBgFix(e) {
    const item = e.target;
    tr.forEach( e => e.classList.remove('selected'));
    const itemParent = item.parentElement ;
    itemParent.classList.add('selected');
}

function getData() {
    
    req.open('get','./data/mdc.commands.json')
    req.onload = () => {
        res = JSON.parse(req.response);
        // console.log(res)
        res.forEach(e => createTable(e));
        hover();
    }
    req.send();
}
function createTable(e){ 
    
    const newTr = document.createElement('tr');
    
    const command = document.createElement('td');
    const newTd1 = document.createElement('td');
    const newTd2 = document.createElement('td');
    
    command.innerText= e.command;
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
    comm = e.target.parentElement.childNodes[1].innerText;

    const currentData = res.filter((e) => e.name == `${comm}`);
    
    //console.log( "currentData:", currentData);
    showDetails(currentData);
}
function showDetails(data) {
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

    //INFO: using parseInt(datalength, 16) to convert HEX to DEC

    //showing or hidding parts based on selectors:
        //hide all d input fields as long as they arent needed
        document.querySelectorAll('.d-div').forEach(e => e.classList.add('hidden'));
        document.querySelector('.open').classList.add('hidden');
        //show Fixed Value Selector and refresh Options
        hasFixedValues ? (createOptionsSelect(values), selectsFull.classList.remove('hidden')): selectsFull.classList.add('hidden')
        //show or remove the more info box
        moreInfo ? moreinfo.classList.remove('hidden') : moreinfo.classList.add('hidden')
        //show inputField for non fixed values
        
        let neededFiels ="";

        if(hasFixedValues) { neededFiels = !hasSubCmd ? dataLength -1 : dataLength -2} 
        else {neededFiels = !hasSubCmd ? dataLength : dataLength -1} ;   //create if to decide when to remove 1 or 2 based on hasSubCmd
        if (neededFiels > 0) {
            for (let i=1; i <= neededFiels; i++) {
                document.querySelector('.d'+i).classList.remove('hidden')
            }
        }

        !dataLength ? document.querySelector('.open').classList.remove('hidden') : document.querySelector('.open').classList.add('hidden');
        // show
    
    // show already known Data:
    title.innerText = `Function: ${data[0].name}` ;
    desc.innerText = data[0].Description;
    moreinfo.innerText = moreInfo;
    imagediv.src = image;

    calculate();
    //Eventlisteners (fixed values, no subCmd)
    selects.addEventListener('input', calculate);
    input_id.addEventListener('input', calculate);
    openInput.addEventListener('input', calculate);
    dInputs.forEach( e => e.addEventListener('input', calculate));


    function calculate(){
        if(hasFixedValues && !hasSubCmd && dataLength) {
            // calculate if openInput fiels are needes (-1 because this is from the selector)
            outData = [command, input_id.value,dataLength,selects.value]

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
            
            outData = [command, input_id.value,two(dataLength), subCmd ,selects.value]
            
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
            outData = [command, input_id.value, two(openVal.length + 1), subCmd];
            
            Array.from(openVal).forEach( e => {
                let val = two(e.charCodeAt().toString(16).toUpperCase());
                outData.push(val);
            })   
            showHEX(outData);
        }     
        if(!hasFixedValues && !hasSubCmd && !dataLength) {
            
            let openVal = openInput.value; 

            outData = [command, input_id.value, two(openVal.length)];
            
            Array.from(openVal).forEach( e => {
                let val = two(e.charCodeAt().toString(16).toUpperCase());
                outData.push(val);
            })   
            showHEX(outData);
        }   
        if(!hasFixedValues && !hasSubCmd && dataLength)  {
            outData = [command, input_id.value,two(dataLength)]

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
            
            outData = [command, input_id.value,two(dataLength), subCmd]

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
    }; 
};
function two(val){
        val = val.toString();
        while (val.length < 2) val = `0${val}`;
        return val; 
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
// Data from JSON is fetched once on pageload
getData();