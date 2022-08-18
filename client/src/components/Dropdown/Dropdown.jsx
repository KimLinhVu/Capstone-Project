import React, { useState, useEffect } from 'react'
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io'
import Tracks from 'utils/tracks'
import './Dropdown.css'

function Dropdown ({
  options,
  selected,
  setSelected,
  setCurrentAddPlaylist,
  refresh,
  isLoading
}) {
  const [isActive, setIsActive] = useState(false)
  const track = new Tracks()

  useEffect(() => {
    if (options?.length !== 0) {
      /* sort options array alphabetically */
      setSelected('Add a playlist')
      if (options?.length > 1) {
        track.sortOptionsTracks(options)
      }
    }
  }, [refresh])

  return (
    <div className="dropdown">
      <div className="dropdown-btn" onClick={options?.length === 0 || isLoading ? () => {} : () => setIsActive(!isActive)}>
        <p>{selected}</p>
        {isActive ? <IoMdArrowDropup size={20} className='icon'/> : <IoMdArrowDropdown size={20} className='icon'/>}
      </div>
      {isActive && (
        <div className="dropdown-content">
          {options.length >= 1 && options.map((option, idx) => (
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
