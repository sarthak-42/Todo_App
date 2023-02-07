let addbtn = document.querySelector('.add-btn')
let modalcnt = document.querySelector('.modal-cont')
let mainCont = document.querySelector('.main-cont')
let addflag = false
let colors =['lightpink','lightgreen', 'lightblue', 'black']
let modalPriorityColor = colors[colors.length-1]//color4 default set

let allPriorityColors = document.querySelectorAll('.priority-color')
let textAreaCont = document.querySelector('.textarea-cont')
let removeBtn = document.querySelector('.remove-btn')
let removeFlag = false
let lockClass = 'fa-lock'
let unlockClass = 'fa-lock-open'

let ticketsArr = []; // which will store all the tickets as objects

//let deleteElements = []

//Filter tickets with respect to colors


// get all tickets from local Storage

if (localStorage.getItem('tickets')) {
    ticketsArr = JSON.parse(localStorage.getItem('tickets'))
    ticketsArr.forEach(function (ticket) {
        createTicket(ticket.ticketColor, ticket.ticketTask, ticket.ticketID)
    })
}

for (let i = 0; i < toolBoxColors.length; i++) {
    toolBoxColors[i].addEventListener("click", function (e) {
        let currentToolBoxColor = toolBoxColors[i].classList[0]; // color
        //console.log(currentToolBoxColor)

        let filteredTickets = ticketsArr.filter(function (ticketObj) {
            return currentToolBoxColor === ticketObj.ticketColor;
        });

        // remove previous Tickets
        let allTickets = document.querySelectorAll(".ticket-cont");

        for (let i = 0; i < allTickets.length; i++) {
            allTickets[i].remove();
        }
        // filtered tickets Di
        filteredTickets.forEach(function (filteredObj) {
            createTicket(
                filteredObj.ticketColor,
                filteredObj.ticketTask,
                filteredObj.ticketID
            );
        });
    });

    toolBoxColors[i].addEventListener('dblclick', function (e) {
        let allTickets = document.querySelectorAll(".ticket-cont");

        for (let i = 0; i < allTickets.length; i++) {
            allTickets[i].remove();
        }

        ticketsArr.forEach(function (ticketObj) {
            createTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketID)

        })
    })
}




addbtn.addEventListener('click', function (e) {
    // Display modal

    // addflag = true Display
    // addflag = false hide

    addflag = !addflag
    if (addflag) {
        modalcnt.style.display = 'flex'
    } else {
        modalcnt.style.display = 'none'

    }
})
//Changing Priority Color


allPriorityColors.forEach(function(colorElem){
    colorElem.addEventListener('click',function(e){
        allPriorityColors.forEach(function(priorityColorElem){
            priorityColorElem.classList.remove('active')
        })
        colorElem.classList.add('active')
        modalPriorityColor = colorElem.classList[0]
    })
})
// Generate a Tkt

modalcnt.addEventListener('keydown', function (e) {
    let key = e.key
    if (key == 'Shift') {
        createTicket(modalPriorityColor, textAreaCont.value)//this fn will generate tkt .value gives the value present in that element
        modalcnt.style.display='none'
        addflag = false
        textAreaCont.value =''// empty because
    }
})


function createTicket(ticketColor, ticketTask, ticketID ) {
    let id = ticketID || shortid();
    let ticketCont = document.createElement('div')
    ticketCont.setAttribute('class', 'ticket-cont')
    ticketCont.innerHTML = ` <div class="ticket-color ${ticketColor}"></div>
    <div class="ticket-id">#${id}</div>
    <div class="text-area">${ticketTask}</div> <div class="ticket-lock">
    <i class="fa-solid fa-lock"></i>
</div>`
    mainCont.appendChild(ticketCont)
    handleRemoval(ticketCont, id);
    handleColor(ticketCont, id);

    handleLock(ticketCont, id);

    if (!ticketID) {
        ticketsArr.push({ ticketColor, ticketTask, ticketID: id });
        localStorage.setItem('tickets', JSON.stringify(ticketsArr))
    }
}

removeBtn.addEventListener('click', function(){
    removeFlag =!removeFlag
    if(removeFlag){
        removeBtn.style.color = 'red'
    }else{
        removeBtn.style.color = 'white'
    }
})
// Remove tickets fn
function handleRemoval(ticket, id){
    ticket.addEventListener('click',function(){
        if(removeFlag)
            return

        let idx = getTicketIdx(id) // idx


        // localStorgae removal of ticket

        let deletedElement = ticketsArr.splice(idx, 1)

        //deleteElements.push(deletedElement)



        let strTicketArray = JSON.stringify(ticketsArr)

        localStorage.setItem('tickets', strTicketArray)


            ticket.remove()
        
    })
}
function handleLock(ticket , id) {
    let ticketLockElem = ticket.querySelector(".ticket-lock");
  
    let ticketLock = ticketLockElem.children[0];
  
    let ticketTaskArea = ticket.querySelector(".task-area");
  
    ticketLock.addEventListener("click", function (e) {
        if (ticketLock.classList.contains(lockClass)) {
        ticketLock.classList.remove(lockClass);
        ticketLock.classList.add(unlockClass);
        ticketTaskArea.setAttribute("contenteditable", "true");
      } else {
        ticketLock.classList.remove(unlockClass);
        ticketLock.classList.add(lockClass);
        ticketTaskArea.setAttribute("contenteditable", "false");
      }
      ticketsArr[ticketIdx].ticketTask = ticketTaskArea.innerText
      localStorage.setItem('tickets', JSON.stringify(ticketsArr))
    })
}
function handleColor(ticket , id) {
    let ticketColorBand = ticket.querySelector(".ticket-color");
  
    ticketColorBand.addEventListener("click", function (e) {
      let currentTicketColor = ticketColorBand.classList[1];
  
      let ticketIdx = getTicketIdx(id)
  
      let currentTicketColoridx = colors.findIndex(function (color) {
        return currentTicketColor === color;
      });
  
      currentTicketColoridx++;
  
      let newTicketColorIdx = currentTicketColoridx % colors.length;
      let newTicketColor = colors[newTicketColorIdx];
  
      ticketColorBand.classList.remove(currentTicketColor);
      ticketColorBand.classList.add(newTicketColor);

      ticketsArr[ticketIdx].ticketColor = newTicketColor
        localStorage.setItem('tickets', JSON.stringify(ticketsArr))
    });
}

function getTicketIdx(id) {
    let ticketIdx = ticketsArr.findIndex(function (ticketObj) {
        return ticketObj.ticketID === id
    })

    return ticketIdx
}