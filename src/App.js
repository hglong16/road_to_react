/* eslint-disable no-unused-vars */
/* eslint-disable react/button-has-type */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-no-literals */
/* eslint-disable react/no-multi-comp */
/* eslint-disable react/prop-types */
import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import './App.css'


const initialStories = [
  {
    url: '#',
    objectId: '1',
    title: 'Redux',
    author: 'Dan',
    num_comments: 9,
    points: 10
  },
  {
    url: '#',
    objectId: '23',
    title: 'React',
    author: 'Dsxan',
    num_comments: 29,
    points: 130
  }
]

const useSemiPersistentState = (key, intialState) => {
  const [value, setValue] = useState(localStorage.getItem(key) || intialState)
  console.log('App render')

  useEffect(() => {
    console.log('useEffect')
    localStorage.setItem(key, value)
  }, [value, key])

  return [value, setValue]
}

const getAsyncStories = () => new Promise((resolve) => {
  setTimeout(() => resolve({ data: { stories: initialStories } }), 2000)
})

const storiesReducer = (state, action) => {

  switch (action.type) {
    case 'SET_STORIES':
      return action.payload
    case 'REMOVE_STORIES':
      return state.filter(
        (story) => action.payload.objectID !== story.objectID
      )
    default:
      throw new Error()
  }
}


function App() {
  const [searchTerm, setSearchTerm] = useSemiPersistentState(
    'search', 'React')
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [stories, dispatchStories] = React.useReducer(storiesReducer, [])

  useEffect(() => {
    setIsLoading(true)

    getAsyncStories().then((res) => {
      dispatchStories({
        type: 'SET_STORIES',
        payload: res.data.stories,
      })
      setIsLoading(false)
    }).catch(() => setIsError(true))
  }, [])




  const handleRemoveStory = (item) => {
    dispatchStories({
      type: 'REMOVE_STORIES',
      payload: item,
    });
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  const searchedStories = stories.filter((story) => {
    return story.title.toLowerCase().includes(searchTerm.toLowerCase())
  })
  return (
    <div>
      <h1>Hacker New Stories</h1>
      <hr />
      <InputWithLabel
        id="search"
        label="Search"
        onInputChange={handleSearch}
        type='text'
        value={searchTerm} >
        <strong>{"Search: "}</strong>

      </InputWithLabel>
      {isError ? <p> Some thing went wrong ...</p> : null}
      {isLoading ? (
        <p>Loading...</p>
      ) : (

        <List
          list={searchedStories}
          onRemoveItem={handleRemoveStory}
        />
      )}
    </div>
  )
}

function InputWithLabel({
  id, label,
  type,
  value,
  isFocused,
  onInputChange,
  children

}) {
  const inputRef = useRef()


  useEffect(() => {
    console.log('Effect on input')
    if (isFocused && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isFocused])
  return (<>
    <label htmlFor={id}>{children}</label>
    &nbsp;
    <input
      autoFocus={isFocused}
      id={id}
      onChange={onInputChange}
      ref={inputRef}
      type={type}
      value={value}
    />
  </>)
}

function List({ list, onRemoveItem }) {
  console.log('List render')
  return (
    <ul>
      {list.map((item) => (
        <Item handleRemoveItem={onRemoveItem}
          item={item}
          key={item.objectId} />
      ))}
    </ul>
  )
}

function Item({ item, handleRemoveItem }) {
  return (
    <li>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
      <span>
        <button onClick={() => handleRemoveItem(item)}> Dismiss </button>
      </span>

    </li>
  )
}

export default App
