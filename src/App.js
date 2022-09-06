/* eslint-disable no-unused-vars */
/* eslint-disable react/button-has-type */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-no-literals */
/* eslint-disable react/no-multi-comp */
/* eslint-disable react/prop-types */
import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import './App.css'


const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query='

const useSemiPersistentState = (key, intialState) => {
  const [value, setValue] = useState(localStorage.getItem(key) || intialState)
  console.log('App render')

  useEffect(() => {
    console.log('useEffect')
    localStorage.setItem(key, value)
  }, [value, key])

  return [value, setValue]
}


const storiesReducer = (state, action) => {

  switch (action.type) {
    case 'STORIES_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case 'STORIES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true
      }
    case 'REMOVE_STORY':
      console.log('remove', state.data, action.payload.objectID)
      return {
        ...state,
        data: state.data.filter(
          (story) => action.payload.objectID !== story.objectID
        )
      }
    default:
      throw new Error()
  }
}


function App() {
  const [searchTerm, setSearchTerm] = useSemiPersistentState(
    'search', 'React')
  const [stories, dispatchStories] = React.useReducer(storiesReducer,
    { data: [], isLoading: false, isError: true })


  const handleFetchStories = React.useCallback(() => {

    if (!searchTerm) return;

    dispatchStories({ type: 'STORIES_FETCH_INIT' })

    fetch(`${API_ENDPOINT}${searchTerm}`)
      .then((response) => response.json())
      .then((result) => {
        dispatchStories({
          type: 'STORIES_FETCH_SUCCESS',
          payload: result.hits,
        })
      }).catch(() => dispatchStories({ type: 'STORIES_FETCH_FAILURE' }))
  }, [searchTerm])

  useEffect(() => {
    handleFetchStories()
  }, [handleFetchStories])




  const handleRemoveStory = (item) => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

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
      {stories.isError ? <p> Some thing went wrong ...</p> : null}
      {stories.isLoading ? (
        <p>Loading...</p>
      ) : (

        <List
          list={stories.data}
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
