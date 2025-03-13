//1. 유저가 값을 입력한다.
//2. '+'버튼을 클릭하면, 할일이 추가된다.
//3. 'delete'버튼을 누르면 할일이 삭제된다.
//4. 'check'버튼을 누르면 할일이 끝나면서 밑줄이 생긴다.
//4-1. 'check'버튼을 클릭하는 순간 false를 true로 변경한다.
//4-2. true이면 끝난걸로 간주하고 밑줄 긋기
//4-3. false이면 안끝난걸로 간주하고 그대로 두기
//5. 'Not Done','Done' 탭을 누르면, 언더바가 이동한다.
//6. 'Done'탭은 완료된 아이템만, 'Not Done'탭은 진행중인 아이템만 모은다.
//7. 'ALL'탭을 누르면 다시 전체 아이템이 나온다.
//https://noona-todolist.netlify.app/

let taskInput = document.getElementById("task_input");
let addButton = document.getElementById("button_add");
let tabs = document.querySelectorAll(".task_tabs div");
let underLine = document.getElementById("under_line");
let taskList = [];
let mode='all';
let filterList=[];

addButton.addEventListener("click",addTask);
taskInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addTask(event);
    }
});
for (let i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener("click", function (event) {
        filter(event);
    });
}

for(let i=1;i<tabs.length;i++){
    tabs[i].addEventListener("click",function(event){
        filter(event);
    });
}

function addTask(){
    let taskValue = taskInput.value;
    if (taskValue === "") return alert("할일을 입력해주세요");
    let task = { //객체 생성(입력받은 내용과 그 내용의 완료 체크여부, 각 객체마다 고유의 값 주기)
        id : randomID(),
        taskContent : taskValue,
        isComplete : false
    };
    taskList.push(task);
    taskInput.value = ""; //taskInput.value-"";는 입력 필드 초기화, taskValue="";는 단순히 변수 값을 변경
    render();
}

function render(){
    //1. 내가 선택한 탭에 따라서
    //2. 리스트를 달리 보여준다. all - taskList, ongoing,done - filterList
    let list=[]
    if(mode==="all"){
        //taskList
        list=taskList;
    }
    else{
        //filterList
        list=filterList;
    }
    let resultHTML='';
    for(let i=0;i<list.length;i++){
        if(list[i].isComplete == true){
            resultHTML += `<div class="task">
                    <div class="task_done">
                        <span>${list[i].taskContent}</span>
                    </div>
                    <div class="button_box">
                        <button onclick="CompleteCheck('${list[i].id}')" >
                        <i class="fas fa-undo-alt" aria-hidden="true"></i>
                        </button>
                        
                        <button onclick="deleteTask('${list[i].id}')">
                        <i class="fa fa-trash" aria-hidden="true"></i>
                        </button>
                        
                    </div>
                </div>`;
        }
        else{
            resultHTML += `<div class="task">
                    <div>
                        <span>${list[i].taskContent}</span>
                    </div>
                    <div class="button_box">
                        <button onclick="CompleteCheck('${list[i].id}')" >
                        <i class="fa fa-check" aria-hidden="true"></i>
                        </button>

                        <button onclick="deleteTask('${list[i].id}')">
                        <i class="fa fa-trash" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>`;
        }
        
    }

    document.getElementById("task_board").innerHTML = resultHTML;
}

function CompleteCheck(id){
    for(let i=0;i<taskList.length;i++){
        if(taskList[i].id==id){
            taskList[i].isComplete=!taskList[i].isComplete;
            break;
        }
    }
    filter();
}

function deleteTask(id) {
    //taskList = taskList.filter(task => task.id !== id);
    for(let i=0;i<taskList.length;i++){
        if(taskList[i].id==id){
            taskList.splice(i,1);
            break;
        }
    }
    filter();
}

function filter(event){
    if (event) {
        mode = event.target.id;
        underLine.style.width = event.target.offsetWidth + "px";
        underLine.style.left = event.target.offsetLeft + "px";
        underLine.style.top =
        event.target.offsetTop + (event.target.offsetHeight - 4) + "px";
      } // 진행중 상태에서 끝남으로 표시하면 바로 사라지는 부분은 event가 없음 그래서 조건추가

    filterList=[];
    if(mode==="all"){
        //전체 리스트를 보여준다.
        render();
    }
    else if(mode==="ongoing"){
        //진행 중인 리스트를 보여준다. taskList.isComplete=false
        for(let i=0;i<taskList.length;i++){
            if(taskList[i].isComplete===false){
                filterList.push(taskList[i]);
            }
        }
        render();
    }
    else{
        //완료된 리스트를 보여준다. taskList.isComplete=true
        for(let i=0;i<taskList.length;i++){
            if(taskList[i].isComplete===true){
                filterList.push(taskList[i]);
            }
        }
        render();
    }
}

function randomID(){
    return Math.random().toString(36).substr(2, 16);
}