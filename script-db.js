const dbConnection = window.indexedDB.open('sicktrackdb', 1)
const dbStore = 'sickevent'
var dbCurrentEvent = null
var dbCurrentEventEntryIndex = -1

dbConnection.onupgradeneeded = (event) => {
    const db = event.target.result
    const tr = event.target.transaction
    
    console.log(`Upgrading from version '${event.oldVersion}'' to version '${db.version}'`)
    
    if (event.oldVersion < 1) {
        //version 1: inital release
        db.createObjectStore(dbStore, {keyPath: 'id', autoIncrement: true})
    }
    if (event.oldVersion < 2) {
        //version 2: placeholder
    }    
}

dbConnection.onsuccess = (event) => {
    const today = new Date()
    //today.setHours(0,0,0,0)

    uiUpdate(today)
}

dbConnection.onerror = (event) => {
    alert('Failed to open DB')
    console.log(dbConnection.error)
}

function dbGetEntries() {
    return new Promise((resolve, reject) => {
        const db = dbConnection.result;
        const tr = db.transaction(db.objectStoreNames, 'readonly')
        const store = tr.objectStore(dbStore)
        store.getAll().onsuccess = (event) => {
            const rows = event.target.result
            resolve(rows)            
        }    
    })
}

function dbGetEntryAsync(forDate) {            
    return new Promise((resolve, reject) => {                
        const db = dbConnection.result
        const tr = db.transaction(db.objectStoreNames, 'readonly')
        const store = tr.objectStore(dbStore)
        store.getAll().onsuccess = (event) => {
            const rows = event.target.result
            var found = false
            rows.forEach(row => {
                row.entries.forEach((entry, index) => {                            
                    if (entry.date.getTime() == forDate.getTime() && row.better == false) {
                        found = true
                        resolve({dbEvent: row, dbEntryIndex: index})
                    }
                })
                if (found == false && row.better == false) {
                    found = true
                    var today = new Date()
                    //today.setHours(0,0,0,0)
                    row.entries.push({
                        date: today,
                        feeling: 0,
                        symptoms: [], //TODO: carry over from prev entry?
                        medications: []
                    })
                    resolve({dbEvent: row, dbEntryIndex: row.entries.length - 1})
                }
            })
            if (found == false) {
                if (rows.length > 0) {
                    var last = rows[rows.length - 1]                          
                    resolve({dbEvent: last, dbEntryIndex: 0})
                }
                else {                        
                    reject()
                }
            }
        }
    })
}

function dbStartEvent() {
    const db = dbConnection.result
    const tr = db.transaction(db.objectStoreNames, 'readwrite')
    
    const store = tr.objectStore(dbStore)
    
    /*//note: clear database
    store.getAll().onsuccess = (event) => {
        event.target.result.forEach(item => {store.delete(item.id)})
    }
    */
    
    const today = new Date()
    //today.setHours(0,0,0,0)
    
    dbCurrentEvent = {
        better: false,
        journal: "",
        entries: [{
            date: today,
            feeling: -1,
            symptoms: [],
            medications: []
        }]
    }
    dbCurrentEventEntryIndex = 0
    
    const store_add = store.add(dbCurrentEvent)
    
    store_add.onsuccess = (event) => {
        uiUpdate(today)
    }
}

function dbUpdateEvent() {            
    const db = dbConnection.result
    const tr = db.transaction(db.objectStoreNames, 'readwrite')
    const store = tr.objectStore(dbStore)
    store.put(dbCurrentEvent)
}

function dbUpdateDate(newDate) {
    dbCurrentEvent.entries[dbCurrentEventEntryIndex].date = newDate

    //NOTE: resort
    dbCurrentEvent.entries.sort( (a,b) => a.date.getTime() - b.date.getTime() )
    
    //NOTE: make sure first event feels the worst
    dbCurrentEvent.entries[0].feeling = -2

    dbUpdateEvent()
}

function dbUpdateMood(newMood) {
    dbCurrentEvent.entries[dbCurrentEventEntryIndex].feeling = newMood
    dbUpdateEvent()
}

function dbUpdateSymptoms(newSymptoms) {
    dbCurrentEvent.entries[dbCurrentEventEntryIndex].symptoms = newSymptoms
    dbUpdateEvent()
}

function dbUpdateMedications(newMedications) {
    dbCurrentEvent.entries[dbCurrentEventEntryIndex].medications = newMedications
    dbUpdateEvent()
}

function dbUpdateJournal(newJournal) {
    dbCurrentEvent.journal = newJournal
    dbUpdateEvent()
}

function dbEndEvent() {
    dbCurrentEvent.better = true
    dbUpdateEvent()
}

function dbDeleteEvent() {
    const db = dbConnection.result;
    const tr = db.transaction(db.objectStoreNames, 'readwrite')            
    const store = tr.objectStore(dbStore)
    store.delete(dbCurrentEvent.id)
}