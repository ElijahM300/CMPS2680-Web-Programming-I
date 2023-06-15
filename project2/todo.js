var tasks = {
    todo: [],
    done: []
};
const enterKey = 13;

function pad(val, min = 10, c = '0'){
    if(val < min){
        return c + val;
    }
    return "" + val;
}

function formatDate(){
    let d = new Date();
    let y = d.getFullYear();
    let m = d.getMonth() + 1;
    let day = d.getDate();
    let h  = d.getHours();
    let minute = pad(d.getMinutes());
    let s = pad(d.getSeconds());
    return y + "-" + m + "-" + day + " " + h + ":" + minute + ":" + s; 
}
function refreshList(list){
    let listdiv = document.getElementById(list);
    let listarr = tasks[list];
    listdiv.innerHTML = "";
    for(let i = 0; i < listarr.length; i++){
        let item = listarr[i];
        let newitem = document.createElement("p");
        newitem.innerHTML = item.item + "(added " + item.added + ")";
        if(list == "todo"){
            newitem.innerHTML = item.item + "(added " + item.added + ")";
        }
        if(list == "done"){
            newitem.innerHTML = item.item + "(completed " + item.completed + ")";
            newitem.className = "doneitem";
        }
        newitem.onclick = function(){
            if(list == "todo"){
                item.completed = formatDate();
                tasks.done.push(item);
                tasks.todo.splice(i, 1);
            }
            else if(list == "done"){
                tasks.todo.push(item);
                tasks.done.splice(i, 1);
            }
            refresh();
        }
        listdiv.appendChild(newitem);
    }
}
function refresh(){
    refreshList("todo");
    refreshList("done");
}
function addItem(){
    let input = document.getElementById("todo_items");
    let value = input.value;
    if(value == ""){
        return;
    }
    tasks.todo.push({
        added: formatDate(),
        item: value
    });
    input.value = "";
    refresh();
}
function clearItems(list){
    let warning = confirm("Are you sure you want to clear " + list + "?");
    if(warning){
        tasks[list] = [];
        refresh();
    }
}
function checkForItem(event){
    if(event.keyCode == enterKey){
        addItem();
    }

}
function initialize(){
    loadLocalStoarge();
    window.addEventListener("beforeunload", function(){
        saveLocalStorage();
    });
    let input = document.getElementById("todo_items");
    let fileloader = document.getElementById("load_file");
    fileloader.addEventListener("change", function(event){
        if(event.target.files.length > 0){
            loadFromFile(event.target.files[0]);
        }
    });
    input.addEventListener("keyup", function(event){
        checkForItem(event);
    });
}
const keyname = "emorris_project2";

function saveLocalStorage(){
    let strg = JSON.stringify(tasks);
    localStorage.setItem(keyname, strg);
}
function loadLocalStoarge(){
    let strg = localStorage.getItem(keyname);
    if(strg){
        tasks = JSON.parse(strg);
        refresh();
    }
}
function saveToFile(){
    let strg = JSON.stringify(tasks, null, 4);
    let a = document.createElement("a");
    let file = new Blob([strg], {type: "application/json"});
    a.href = URL.createObjectURL(file);
    a.download = "todo.json";
    a.click();
}
function loadFromFile(file){
    if(!file){
        return;
    }
    let r = new FileReader();
    r.onload = function(e){
        tasks = JSON.parse(e.target.result);
        refresh();
    }
    r.readAsText(file);
}
function clearAll(){
    let warning = confirm("Are you sure you want to clear all items?");
    if(warning){
        localStorage.removeItem(keyname);
        tasks.todo = [];
        tasks.done = [];
        refresh();
    }
}


