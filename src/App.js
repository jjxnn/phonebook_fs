import React, { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import phoneService from './services/notes' 
import Notification from './components/Notification'
import './index.css'

// Header component 
const Header = ({name}) => {
  return (
    <h1>{name}</h1>
  )
}

/*
 * isEqual function - If the new created object (string1) 
 * is equals to one of the existing object in useState(persons)
 * Then, set the the id of string1 to string2 in case the user want to update it 
 * If we don't update the id, the existing phone book user will have a new id 
 * This is basically .filter() function 
*/ 
function isEqual(string1, string2) {
  for (let i = 0; i < string2.length; i++) {
    if(JSON.stringify(string1.name) === JSON.stringify(string2[i].name)) {
      string1.id = string2[i].id
      return true; 
    }
  }
  return false; 
}
// * The main component 
const App = () => {


  // 1st. fetching data from db.json 
  useEffect(() => {
    phoneService.getAll().then(initialNotes => {
      setPersons(initialNotes)
      setCopyPersons(initialNotes)
    })
  }, [])


// Use state const 
  const [persons, setPersons] = useState([]) //Main db.json data 
  const [copypersons, setCopyPersons] = useState(persons) //copy of db.json data 

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchName, setSearchName] = useState('')
  const [confirmMessage, setconfirmMessage] = useState('')

  const handleNameChange = (event) => {
      setNewName(event.target.value)
      }
    
      const handleNumberChange = (event) => {
        setNewNumber(event.target.value)
      } 


    // Add user / update user 
    const addInfo = (event) => {
        event.preventDefault()
        const noteObject = {
          name: newName,
          number: newNumber
          //it is better for the program to determine the app to prevent duplicate
        }

          if(isEqual(noteObject, persons) === true) {
            if(window.confirm(`${noteObject.name} is already added to the phonebook, replace the old number with a new one?`)) {
              phoneService.update(noteObject.id, noteObject).then(returnPerson => {
                /*
                 * If the user confirm to update their name in the phone
                 * Then, call axios update function in notes.js to delete the person
                 * Then return every other person that does not match the noteObject id in new array
                 * Otherwise, return the existing noteObject (returnPerson)
                 */
                setCopyPersons(copypersons.map(person => person.id !== noteObject.id ? person : returnPerson))
                setPersons(persons.map(person => person.id !== noteObject.id ? person : returnPerson))
                setconfirmMessage(`${noteObject.name} change has been implemented.`) })} 
            /**
             * Else, add the new person to the phonebook using the create method 
             * then concat the new person to the useState of persons and copy persons 
             * in order to display it under <Person/> for render 
             * Then reset the default useState to empty 
             */
           } else {
            phoneService.create(noteObject).then(returnedPhone => {
              setPersons(persons.concat(returnedPhone))
              setCopyPersons(copypersons.concat(returnedPhone))
              setconfirmMessage(`${noteObject.name} added to the phonebook`)
            })
            setNewName('')
            setNewNumber('')
          }
    } //End of addInfo

    // Name Search 
    const handleNameSearch = (event) => {
        setSearchName(event.target.value) //Set the search name value to user input 
        // Filter every person name until it matches the searchName value 
        const searchPerson = () => persons.filter(person => person.name.toLowerCase().includes(searchName))
        // Then set the matched value finds in person to set it in set copy persons 
        setCopyPersons(searchPerson);
        // If user delete the search bar, which makes it null/empty, then revert back to the original phonebook 
        if(event.target.value === '') {
          setCopyPersons(persons)
        }
      }



      //Delete phonebook T_T 
      const deletePerson = id => {
        const filteredPerson = persons.find(person => person.id === id)
        const personName = filteredPerson.name
        const personId = filteredPerson.id

        if (window.confirm(`Delete ${personName} ?`)) {
          phoneService.delPerson(personId).catch(error => {
            setconfirmMessage(`${personName} already deleted!`) 
            setTimeout(() => {
              setconfirmMessage(null)
            }, 5000)
          })
          setPersons(persons.filter(person => person.id !== personId))
          setCopyPersons(persons.filter(person => person.id !== personId))
        } 
      }

    // Renders 
    return (
      <div>
        <Notification message={confirmMessage}/>
        <Header name="Phonebook"/>
        <div>
          <Filter onChange={handleNameSearch}/>
        </div>
        <Header name="Add a new"/>
        <PersonForm addInfo={addInfo} newNumber={newNumber} newName={newName} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange}/>
        <Header name="Numbers"/>
        <Persons props={copypersons} onClick={deletePerson}/> 
      </div>
    )
}
export default App
/*
Phonebook Part 1 


*/