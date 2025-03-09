const symptomItems = []        
const symptomSuggestions = [
    "Fever",
    "Dizzy",
    "Nausea",
    "Headache",
    "Runny nose",
    "Stuffy nose",
    "Cough",
    "Itchy throat",
    "Sore throat",
    "Wheezy",
    "Fatigue",
    "Chills"
    // Add more symptoms as needed
]        

const medicationItems = []
const medicationSuggestions = [
    "Aspirin",  
    "Ibuprofen",
    "Benadryl",    
    "DayQuil/NyQuil"
    // Add more medications as needed
]

var happyTimerId = null
var happyItemsPtr = 0
const happyItems = [
    "feeling great!",
    "healthy living!",
    "strong body!",
    "sick free!",
    "happy and healthy!",
    "fit and fine!",
    // Add more phrases as needed
]

updateSymptomSuggestions()
updateMedicationSuggestions()

//NOTE: allows better behavior of CSS :active state on touch devices
document.addEventListener("touchstart", (event)=>{}, {capture: true})
document.addEventListener("touchend", (event)=>{}, {capture: true})
        
function changePage(elem) {
    if (elem.classList.contains('link')) {
        document.querySelectorAll('.link').forEach(e => e.classList.remove('link-selected'))
        elem.classList.add('link-selected')
    }
    document.querySelectorAll('.page').forEach(e => e.style.display = 'none')
    document.querySelectorAll(elem.dataset.page).forEach(e => e.style.display = 'block')
    if (elem.dataset.pagestate != null) {
        changePageState(elem.dataset.pagestate)
    }
}

function changePageState(state) {
    document.querySelectorAll('.pagestate').forEach(e => e.style.display = 'none')
    document.querySelectorAll(state).forEach(e => e.style.display = 'block')
    
    if (state == '.pagestate-sick') {
        document.getElementById('home_header_days').classList.add('fgcolor-red')
        document.getElementById('home_header_days').classList.remove('fgcolor-green')
    }
    else {
        document.getElementById('home_header_days').classList.remove('fgcolor-red')
        document.getElementById('home_header_days').classList.add('fgcolor-green')
    }
}

function changeMood(elem) {
    document.querySelectorAll('.mood').forEach(e => e.classList.remove('mood-selected'))
    elem.classList.add('mood-selected')
    dbUpdateMood(elem.dataset.mood)    
}

function toggleHappiness() {
    clearTimeout(happyTimerId)
    const icon = document.querySelector('.happy-icon')
    const label = document.querySelector('.happy-label')
    label.textContent = happyItems[happyItemsPtr]
    happyItemsPtr = (happyItemsPtr + 1) % happyItems.length
    
    label.classList.add('fgcolor-green')
    label.classList.add('animate-pop')
    icon.classList.add('fgcolor-green')
    icon.classList.add('animate-wiggle')
    icon.textContent = 'sentiment_very_satisfied'
    
    happyTimerId = setTimeout(() => {
        icon.textContent = 'sentiment_satisfied'            
        icon.classList.remove('animate-wiggle')
        icon.classList.remove('fgcolor-green')
        label.classList.remove('fgcolor-green')
        label.classList.remove('animate-pop')     
    }, 1500)
}

function handleDateChange() {
    
    dbUpdateDate(document.getElementById('home_header_date').valueAsDate)
    

}

function handleSymptomKeyDown(event) {
    if (event.key === "Enter" || event.key === "," || event.key === "Tab") {
        event.preventDefault() 
        handleSymptomAdd()
    }      
}

function handleSymptomAdd() {
  const input = document.getElementById("symptom_input")
  addSymptom(input.value.trim())
  input.value = ""
}

function addSymptom(value) {            
    value = value.trim().toLowerCase()            
    if (value == "" || symptomItems.includes(value)) {
        return
    }            
    symptomItems.push(value)
    updateSymptomSuggestions()
    dbUpdateSymptoms(symptomItems)
    
    const elemTemplate = document.getElementById('symptom_item')
    const elemContainer = document.getElementById('symptom_items')            
    const elemItem = elemTemplate.content.cloneNode(true)
    elemItem.querySelector('.item-value').innerText = value
    elemContainer.appendChild(elemItem)          
}

function deleteSymptom(elem) {
    const elemItem = elem.parentNode
    const elemItems = elemItem.parentNode
    elemItems.removeChild(elemItem)
    
    var value = elemItem.querySelector('.item-value').innerText            
    value = value.trim().toLowerCase()            
    
    const index = symptomItems.indexOf(value)
    if (index !== -1) {
        symptomItems.splice(index, 1)
        updateSymptomSuggestions()
        dbUpdateSymptoms(symptomItems)
    }            
}

function updateSymptomSuggestions() {
    const datalist = document.getElementById("symptom_suggestions")
    const filteredSuggestions = symptomSuggestions.filter(suggestion => !symptomItems.includes(suggestion.toLowerCase()))
    
    datalist.innerHTML = ""
    filteredSuggestions.forEach(suggestion => {
        const option = document.createElement("option")
        option.value = suggestion.toLowerCase()
        datalist.appendChild(option)
    })
}

function handleMedicationKeyDown(event) {
    if (event.key === "Enter" || event.key === "," || event.key === "Tab") {
        event.preventDefault() 
        handleMedicationAdd()
    }      
}

function handleMedicationAdd() {
  const input = document.getElementById("medication_input")
  addMedication(input.value.trim())
  input.value = ""
}

function addMedication(value) {            
    value = value.trim().toLowerCase()            
    if (value == "" || medicationItems.includes(value)) {
        return
    }            
    medicationItems.push(value)    
    updateMedicationSuggestions()
    dbUpdateMedications(medicationItems)
    
    const elemTemplate = document.getElementById('medication_item')
    const elemContainer = document.getElementById('medication_items')            
    const elemItem = elemTemplate.content.cloneNode(true)
    elemItem.querySelector('.item-value').innerText = value
    elemContainer.appendChild(elemItem)            
}

function deleteMedication(elem) {
    const elemItem = elem.parentNode
    const elemItems = elemItem.parentNode
    elemItems.removeChild(elemItem)
    
    var value = elemItem.querySelector('.item-value').innerText            
    value = value.trim().toLowerCase()            
    
    const index = medicationItems.indexOf(value)
    if (index !== -1) {
        medicationItems.splice(index, 1)
        updateMedicationSuggestions()
        dbUpdateMedications(medicationItems)
    }            
}

function updateMedicationSuggestions() {
    const datalist = document.getElementById("medication_suggestions")
    const filteredSuggestions = medicationSuggestions.filter(suggestion => !medicationItems.includes(suggestion.toLowerCase()))
    
    datalist.innerHTML = ""
    filteredSuggestions.forEach(suggestion => {
        const option = document.createElement("option")
        option.value = suggestion.toLowerCase()
        datalist.appendChild(option)
    })
}

function handleJournalSave(elem) {
    var textArea = document.getElementById('journal_input')
    dbUpdateJournal(textArea.value)    
    elem.classList.add('fgcolor-green')
    setTimeout(()=> elem.classList.remove('fgcolor-green'), 800)
}

function adjustJournalTypingArea(elem) {
    elem.style.height = 'auto'
    elem.style.height = elem.scrollHeight + 'px'
}

function openConfirmEventEdit(elem) {
    const diag = document.getElementById('diag_confirm_event_edit')
    if (diag.open == false) {
        diag.showModal()
    }
}

function closeConfirmEventEdit() {
    const diag = document.getElementById('diag_confirm_event_edit')
    diag.close()
}

function openConfirmEventEnd() {
    const diag = document.getElementById('diag_confirm_event_end')            
    if (diag.open == false) {
        diag.showModal()
    }
}

function closeConfirmEventEnd() {
    const diag = document.getElementById('diag_confirm_event_end')
    diag.close()
}

function openConfirmEventStart() {
    const diag = document.getElementById('diag_confirm_event_start')            
    if (diag.open == false) {
        diag.showModal()
    }
}

function closeConfirmEventStart() {
    const diag = document.getElementById('diag_confirm_event_start')
    diag.close()
}

function startEvent(elem) {
    
    dbStartEvent()
    
    const diag = document.getElementById('diag_confirm_event_start')
    const diagSeparator = diag.querySelector('.diag-confirm-separator')
    diagSeparator.classList.add('animate-grow-green')
    diag.querySelectorAll('button').forEach(e => e.disabled = true)
    setTimeout(() => {                
        diag.close()
        diagSeparator.classList.remove('animate-grow-green')
        diag.querySelectorAll('button').forEach(e => e.disabled = false)
        changePage(elem)
    }, 800)
}

function endEvent(elem) {
    
    dbEndEvent()
    
    const diag = document.getElementById('diag_confirm_event_end')
    const diagSeparator = diag.querySelector('.diag-confirm-separator')
    diagSeparator.classList.add('animate-grow-green')
    diag.querySelectorAll('button').forEach(e => e.disabled = true)
    setTimeout(() => {                
        diag.close()
        diagSeparator.classList.remove('animate-grow-green')
        diag.querySelectorAll('button').forEach(e => e.disabled = false)
        changePage(elem)
    }, 800)
}

function deleteEvent(elem) {
    
    dbDeleteEvent()
    
    const diag = document.getElementById('diag_confirm_event_end')
    const diagSeparator = diag.querySelector('.diag-confirm-separator')
    diagSeparator.classList.add('animate-grow-red')
    diag.querySelectorAll('button').forEach(e => e.disabled = true)
    setTimeout(() => {                
        diag.close()
        diagSeparator.classList.remove('animate-grow-red')
        diag.querySelectorAll('button').forEach(e => e.disabled = false)
        changePage(elem)
    }, 800)
}


function expandEntries(elem) {
    const elemAdd = elem.previousElementSibling
    const elemEntries = elem.parentElement.nextElementSibling
    if (elemAdd.style.opacity === '' || elemAdd.style.opacity === '0') {
        elem.innerText = 'expand_less'
        elemEntries.style.maxHeight = elemEntries.scrollHeight + 'px'
        elemAdd.style.opacity = '100%'
    }
    else {
        elem.innerText = 'expand_more'
        elemEntries.style.maxHeight = '0px'
        elemAdd.style.opacity = '0'
    }
}

function addEntry(elem) {
    //TODO: use diag_confirm_event_edit for this maybe have a separate diag for editEntry()
    
    const elemEntries = elem.parentNode.nextElementSibling    
    const elemTemplate = document.getElementById('history_entry')    
    const elemItem = elemTemplate.content.cloneNode(true)
    
    // Modify content if needed (e.g., update text content)
    //const currentDate = new Date().toDateString()
    //const dateElement = elemItem.querySelector('.entry-date')
    //dateElement.textContent = currentDate
    
    elemEntries.appendChild(elemItem)
    elemEntries.style.maxHeight = elemEntries.scrollHeight + 'px'
}

function saveEntry(elem) {    
    const diag = document.getElementById('diag_confirm_event_edit')
    const diagSeparator = diag.querySelector('.diag-confirm-separator')
    diagSeparator.classList.add('animate-grow-green')
    diag.querySelectorAll('button').forEach(e => e.disabled = true)
    setTimeout(() => {                
        diag.close()
        diagSeparator.classList.remove('animate-grow-green')
        diag.querySelectorAll('button').forEach(e => e.disabled = false)        
    }, 800)
}

function deleteEntry(elem) {
    const diag = document.getElementById('diag_confirm_event_edit')
    const diagSeparator = diag.querySelector('.diag-confirm-separator')
    diagSeparator.classList.add('animate-grow-red')
    diag.querySelectorAll('button').forEach(e => e.disabled = true)
    setTimeout(() => {                
        diag.close()
        diagSeparator.classList.remove('animate-grow-red')
        diag.querySelectorAll('button').forEach(e => e.disabled = false)        
    }, 800)
}

function uiUpdate() {

    const today = new Date()
    today.setHours(0,0,0,0)
    
    dbGetEntries().then((result) => {
        uiUpdateHistory(result)
    })
    
    dbGetEntryAsync(today)
        .then((result) => {
            dbCurrentEvent = result.dbEvent
            dbCurrentEventEntryIndex = result.dbEntryIndex
            
            var pagestate = dbCurrentEvent.better ? '.pagestate-healthy' : '.pagestate-sick'           
            changePageState(pagestate)
            
            uiUpdateDays()
            uiUpdateMoods()
            uiUpdateSymptoms()
            uiUpdateMedications()
            uiUpdateJournal()
            
        })
        .catch(() => {
            dbCurrentEvent = null
            dbCurrentEventEntryIndex = -1   
        })
        
}

function uiUpdateDays() {
    var today = new Date()
    today.setHours(0,0,0,0)
    var start = today
    if (dbCurrentEvent.better) {
        start = dbCurrentEvent.entries[dbCurrentEvent.entries.length -1].date
    }
    else {
        start = dbCurrentEvent.entries[0].date
    }
    var days = Math.trunc((today.getTime() - start.getTime()) / (1000 * 3600 * 24))
    document.getElementById('home_header_date').valueAsDate = start;
    document.getElementById('home_header_days').innerText = days
}

function uiUpdateMoods() {
    var entry = dbCurrentEvent.entries[dbCurrentEventEntryIndex]
    document.querySelectorAll('.mood').forEach(mood => {
        mood.classList.remove('mood-selected')
        
        if (mood.dataset.mood == entry.feeling) {
            mood.classList.add('mood-selected')                    
        }
        else if (dbCurrentEventEntryIndex <= 0) {
            mood.style.display = 'none'                
        }
    })   
}

function uiUpdateSymptoms() {
    
    var itemsElem = document.getElementById('symptom_items')
    while(itemsElem.lastElementChild) {
        itemsElem.removeChild(itemsElem.lastChild)
    }
    
    var items = dbCurrentEvent.entries[dbCurrentEventEntryIndex].symptoms
    
    for (let i = 0; i < items.length; i++) {                
        addSymptom(items[i])        
    }    
}

function uiUpdateMedications() {
    
    var itemsElem = document.getElementById('medication_items')
    while(itemsElem.lastElementChild) {
        itemsElem.removeChild(itemsElem.lastChild)
    }
    
    var items = dbCurrentEvent.entries[dbCurrentEventEntryIndex].medications
    
    for (let i = 0; i < items.length; i++) {                
        addMedication(items[i])        
    }    
}

function uiUpdateJournal() {
    document.getElementById('journal_input').value = dbCurrentEvent.journal
}

function uiUpdateHistory(items) {

    var itemsElem = document.getElementById('historical_items')
    while (itemsElem.lastElementChild) {
        itemsElem.removeChild(itemsElem.lastChild)
    }
    
    const templateEvent = document.getElementById('history_entries')
    const templateEntry = document.getElementById('history_entry')
    
    var count = items.length
    var sum = 0
    var shortest = 0
    var longest = 0
    
    var firstLoop = true    
    
    for (let i = 0; i < items.length; i++) {                
        var item = templateEvent.content.cloneNode(true)
        item.querySelector('.entries-container').dataset.id = items[i].id
        
        for (let e = 0; e < items[i].entries.length; e++) {
            var entry = templateEntry.content.cloneNode(true)
            entry.querySelector('.entry').dataset.index = e
            entry.querySelector('.entry-date').innerText = items[i].entries[e].date.toDateString()
            item.querySelector('.entries').appendChild(entry)
        }
        
        days = Math.trunc((items[i].entries[items[i].entries.length - 1].date.getTime() - items[i].entries[0].date.getTime()) / (1000 * 3600 * 24)) + 1
        
        sum += days
        
        if (firstLoop) {
            firstLoop = false
            shortest = days
            longest = days
        }
        
        if (days < shortest) {
            shortest = days
        }
        if (days > longest) {
            longest = days
        }
        
        item.querySelector('.entries-desc').innerText = days + ' day sickness'
        item.querySelector('.entries-date').innerText = items[i].entries[0].date.toDateString()
        
        itemsElem.appendChild(item);
    }
    
    document.getElementById('hist_header_records').innerText = count
    if (count > 0) {
        document.getElementById('hist_header_average').innerText = Math.round(sum / count)
        document.getElementById('hist_header_shortest').innerText = shortest
        document.getElementById('hist_header_longest').innerText = longest
    }
    
}