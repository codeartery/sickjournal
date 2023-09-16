const dbConnection = window.indexedDB.open('sickjournaldb', 4);
var dbCurrentEvent = null
var dbCurrentEventEntryIndex = -1

dbConnection.onupgradeneeded = (event) => {
    const db = event.target.result;            
    const tr = event.target.transaction;
    
    console.log(`Upgrading from version ${event.oldVersion} to version ${db.version}`)
    //alert(`Upgrading from version '${event.oldVersion}' to version '${db.version}'.`)
    
    if (event.oldVersion < 1) {
        //version one was for testing and was never in production
    }    
    if (event.oldVersion < 2) {
        const store2 = db.createObjectStore('sickevent', {keyPath: 'id', autoIncrement: true})
        console.log('Successfully created store', store2)
    }
    if (event.oldVersion < 4) {        
        
        const store3 = tr.objectStore('sickevent')
        
        //notes added
        store3.getAll().onsuccess = (event3) => {
            event3.target.result.forEach(item3 => {
                item3.journal = ""
                store3.put(item3)
            })
            console.log(`Successfully upgraded to ${db.version}`)
        }
    }
    
}