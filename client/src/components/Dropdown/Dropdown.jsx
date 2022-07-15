import React from 'react'
import { useState, useEffect } from 'react'
import {IoMdArrowDropdown, IoMdArrowDropup} from 'react-icons/io'
import { sortOptionsTracks } from '../../utils/playlist'
import "./Dropdown.css"

function Dropdown({
  options,
  selected,
  setSelected,
  setCurrentAddPlaylist
}) {
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    if (options.length === 0) {
      setSelected("No playlists available")
    } else {
      /* sort options array alphabetically */
      sortOptionsTracks(options)
    }
  }, [])

  return (
    <div className="dropdown">
      <div className="dropdown-btn" onClick={options.length === 0 ? () => {} : () => setIsActive(!isActive)}>
        {selected}
        {isActive ? <IoMdArrowDropup size={20} className='icon'/> : <IoMdArrowDropdown size={20} className='icon'/>}
      </div>
      {isActive && (
        <div className="dropdown-content">
          {options?.map((option, idx) => (
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
