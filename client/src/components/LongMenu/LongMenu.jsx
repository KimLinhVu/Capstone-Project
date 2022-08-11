import * as React from 'react'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { IoMdMore } from 'react-icons/io'
import { makeStyles } from '@mui/styles'
import './LongMenu.css'

const ITEM_HEIGHT = 48

const useStyles = makeStyles({
  root: {
    padding: '2px'
  }
})

export default function LongMenu ({
  removeComment,
  commentId,
  setEdit
}) {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const classes = useStyles()
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        className={classes.root}
      >
        <IoMdMore className='long-menu-icon'/>
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button'
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '13ch'
          }
        }}
      >
        <MenuItem onClick={() => {
          setEdit(true)
          handleClose()
        }}>Edit</MenuItem>
        <MenuItem onClick={() => removeComment(commentId)}>Delete</MenuItem>
      </Menu>
    </div>
  )
}
