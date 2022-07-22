import React from 'react'
import { useState, useEffect } from 'react'
import {IoMdArrowDropdown, IoMdArrowDropup} from 'react-icons/io'
import Tracks from 'utils/tracks'
import "./Dropdown.css"

function Dropdown({
  options,
  selected,
  setSelected,
  setCurrentAddPlaylist,
  refresh
}) {
  const [isActive, setIsActive] = useState(false)
  const track = new Tracks()

  useEffect(() => {
    if (options.length === 0) {
      setSelected("No playlist available")
    } else {
      /* sort options array alphabetically */
      setSelected("Add a playlist")
      track.sortOptionsTracks(options)
    }
  }, [refresh])

  return (
    <div className="dropdown">
      <div className="dropdown-btn" onClick={options.length === 0 ? () => {} : () => setIsActive(!isActive)}>
        <p>{selected}</p>
        {isActive ? <IoMdArrowDropup size={20} className='icon'/> : <IoMdArrowDropdown size={20} className='icon'/>}
      </div>
      {isActive && (
        <div className="dropdown-content">
          {options && options.map((option, idx) => (
            <div
              onClick={() => {
                setSelected(option.label)
                setCurrentAddPlaylist(option.value)
                setIsActive(false)
              }} 
              className="dropdown-item"
              key={idx}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dropdown

