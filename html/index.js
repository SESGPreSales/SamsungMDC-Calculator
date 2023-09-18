
// consts
const req = new XMLHttpRequest;
let res = new Object;
let hexOutputArray = [];
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

//eventlisteners
table.addEventListener('click', selectItem )

function getData() {
    req.open('get','../data/mdc.commands.json')
    req.onload = () => {
         res = JSON.parse(req.response);
        // console.log(res)
    res.forEach(e => createTable(e))
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


    // const useButton = document.createElement('button')
    // useButton.innerHTML= '<i class="fa-regular fa-hand-pointer"></i>';
    // useButton.classList.add('use-btn')

    newTr.appendChild(command);
    newTr.appendChild(newTd1);
    newTr.appendChild(newTd2);


    table.appendChild(newTr);
}
function selectItem(e) {
    let comm ="";
    comm = e.target.parentElement.childNodes[1].innerText;

    const currentData = res.filter((e) => e.name == `${comm}`);
    
    console.log( "currentData:", currentData);
    showDetails(currentData);
}
function showDetails(data) {
    //get all needed data
    let hasFixedValues = data[0].hasfixedvalues || false;
    let hasSubCmd = data[0].hassubcmd || false;
    let subCmd = data[0].subcmd || "";
    let dataLength = data[0].datalength === "variable" ? null : data[0].datalength;
    let image = data[0].image;
    let command = data[0].command;
    let values = data[0].values || [] ;
    let moreInfo = data[0].moreinfo || "";
    let outData = [];

    //showing or hidding parts based on selectors:
        //hide all d inout fields as long as they arent needed
        document.querySelectorAll('.d-div').forEach(e => e.classList.add('hidden'));
        //show Fixed Value Selector and refresh Options
        hasFixedValues ? (createOptionsSelect(values), selectsFull.classList.remove('hidden')): selectsFull.classList.add('hidden')
        //show or remove the more info box
        moreInfo ? moreinfo.classList.remove('hidden') : moreinfo.classList.add('hidden')
        //show inputField for non fixed values
        let neededFiels = dataLength -1;   //create if to decide when to remove 1 or 2 based on hasSubCmd
        if (neededFiels > 0) {
            for (let i=1; i <= neededFiels; i++) {
                document.querySelector('.d'+i).classList.remove('hidden')
            }
        }

        // show
    
    // show already known Data:
    title.innerText = `Function: ${data[0].name}` ;
    desc.innerText = data[0].Description;
    moreinfo.innerText = moreInfo;
    
    //outData Format AA, command, id, Datalenght, (subcmd), D1 -N, Checksum

    calculate();
    //Eventlisteners (fixed values, no subCmd)
    selects.addEventListener('input', calculate);
    input_id.addEventListener('input', calculate);
    openInput.addEventListener('input', calculate);

    function calculate(){
        if(hasFixedValues && !hasSubCmd && dataLength) {
            // calculate if openInput fiels are needes (-1 because this is from the selector)
            outData = [command, input_id.value,dataLength,selects.value]

            if (neededFiels == 0) showHEX(outData)
            if (neededFiels > 0) {

                for (let i=1; i<=neededFiels; i++) { outData.push(document.querySelector('#d'+i).value) }
                showHEX(outData);
            }
        }

        if(hasFixedValues && hasSubCmd && dataLength) {
            console.log("Case2: fixed values AND subCmd")

            outData = [command, input_id.value,dataLength, subCmd ,selects.value]
            
            showHEX(outData)
            console.log(dataLength)

        }

        if(!hasFixedValues && !hasSubCmd)  {
            console.log("Case3: NO fixed values AND NO subCmd")

            console.log(dataLength)


        }


        if(!hasFixedValues && hasSubCmd) {
            console.log("Case4: NO fixed values but has subCmd")
            console.log(dataLength)

        }
    };
    
};


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

getData();