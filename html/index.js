
// consts
const req = new XMLHttpRequest;
let res = new Object;

//selectors
const table = document.querySelector('.main_table');

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
    // console.log(data)
    //Selectors
    const title = document.querySelector('.command_name p')
    const desc = document.querySelector('.command_description p')
    const input_id = document.querySelector('.id_input')
    const moreinfo = document.querySelector('.command_moreinfo')
    const selects = document.querySelector('.selects')
    
    let hasFixedValues = data[0].hasfixedvalues || false;
    let hasSubCmd = data[0].hassubcmd || false;
let dataLength = data[0].datalength;
let image = data[0].image;
let command = data[0].command;
let values = data[0].values || [] ;
let moreInfo = data[0].moreinfo || "";

console.log( )

hasFixedValues ? (createOptionsSelect(values), selects.classList.remove('hidden')): selects.classList.add('hidden')
moreInfo ? moreinfo.classList.remove('hidden') : moreinfo.classList.add('hidden')

// Definers
title.innerText = data[0].name;
desc.innerText = data[0].Description;
data[0].moreinfo != null ? moreinfo.innerText = data[0].moreinfo : moreinfo.innerText = "";
// console.log(data)
};


function createOptionsSelect(values){
    
    const val = document.querySelector('#values')
    
    let res =  values.forEach( e => {
        const newOption = document.createElement('option')  
        newOption.value = e.value;
        newOption.innerText = e.name
        val.appendChild(newOption)
    })
// return res
}

getData();