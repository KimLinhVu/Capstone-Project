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
  const [displayOptions, setDisplayOptions] = useState(options)
  const track = new Tracks()

  useEffect(() => {
    if (options.length === 0) {
      setSelected('No playlist available')
    } else {
      /* sort options array alphabetically */
      setSelected('Add a playlist')
      track.sortOptionsTracks(options)
    }
  }, [refresh])

  useEffect(() => {
    /* filter out option that is selected */
    if (options.length > 1) {
      const temp = options?.filter(item => item.label !== selected)
      setDisplayOptions(temp)
    }
  }, [selected])

  return (
    <div className="dropdown">
      <div className="dropdown-btn" onClick={options.length === 0 || isLoading ? () => {} : () => setIsActive(!isActive)}>
        <p>{selected}</p>
        {isActive ? <IoMdArrowDropup size={20} className='icon'/> : <IoMdArrowDropdown size={20} className='icon'/>}
      </div>
      {isActive && (
        <div className="dropdown-content">
          {displayOptions.length >= 1 && displayOptions.map((option, idx) => (
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
