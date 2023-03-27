import React from 'react'

const Persons = ({props, onClick}) => {
    return (
        <>
        {props.map((person => <div key={person.id}>{person.name} {person.number} <button onClick={() => onClick(person.id)}>delete</button></div>))}
        </>
    )
}

export default Persons 