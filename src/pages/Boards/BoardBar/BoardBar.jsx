import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { capitalizeFirstLetter } from '~/utils/formatters'


const MENU_STYLES = {
  color: 'white',
  bgcolor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '.MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}

function BoardBar({ board }) {
  //const {board} = props //Object destructuring
  //const board = props.board
  return (
    <Box sx={{
      width: '100%',
      height: (theme) => theme.trello.boardBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      paddingX: 2,
      overflowX: 'auto',
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Chip
          sx={MENU_STYLES}
          icon={<DashboardIcon />}
          label={board?.title}
          //clickable
          onClick={() => { }}
        />
        <Chip
          sx={MENU_STYLES}
          icon={<VpnLockIcon />}
          label={capitalizeFirstLetter(board?.type)}
          //clickable
          onClick={() => { }}
        />
        <Chip
          sx={MENU_STYLES}
          icon={<AddToDriveIcon />}
          label="Add To Google Drive"
          //clickable
          onClick={() => { }}
        />
        <Chip
          sx={MENU_STYLES}
          icon={<BoltIcon />}
          label="Automation"
          //clickable
          onClick={() => { }}
        />
        <Chip
          sx={MENU_STYLES}
          icon={<FilterListIcon />}
          label="Filters"
          //clickable
          onClick={() => { }}
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<PersonAddIcon />}
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': { borderColor: 'white' }
          }}
        >
          Invite
        </Button>
        <AvatarGroup
          max={5}
          sx={{
            gap: '10px',
            '& .MuiAvatar-root': {
              width: 34,
              height: 34,
              fontSize: 16,
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              '&:first-of-type': { bgcolor: '#a4b0be' }
            }
          }}
        >
          <Tooltip title="PhanDinhDung">
            <Avatar alt="PhanDinhDung" src="https://avatars.githubusercontent.com/u/195135390?v=4" />
          </Tooltip>
          <Tooltip title="PhanDinhDung">
            <Avatar alt="PhanDinhDung" src="https://lh3.googleusercontent.com/ogw/AF2bZyguGjCQbnIs6A395vN9GhGKAXWNgP1fOkFB42P7JSmGdQ=s32-c-mo" />
          </Tooltip>
          <Tooltip title="PhanDinhDung">
            <Avatar alt="PhanDinhDung" src="https://scontent.fsgn15-1.fna.fbcdn.net/v/t39.30808-1/331532302_1576000779545463_8345452007401581764_n.jpg?stp=c0.210.1536.1536a_dst-jpg_s200x200_tt6&_nc_cat=102&ccb=1-7&_nc_sid=e99d92&_nc_ohc=kTxvqV1URLUQ7kNvgER5WND&_nc_zt=24&_nc_ht=scontent.fsgn15-1.fna&_nc_gid=AIQVWygpJ87j0my_NjeawuO&oh=00_AYCIGpOXCVyYA5dpqvrOEJsZd3egEYzpirTZMzbJX_lmCw&oe=6790D6C8" />
          </Tooltip>
          <Tooltip title="PhanDinhDung">
            <Avatar alt="PhanDinhDung" src="https://scontent.fsgn15-1.fna.fbcdn.net/v/t39.30808-1/464442001_525736466979053_7636825643550885846_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=106&ccb=1-7&_nc_sid=e99d92&_nc_ohc=m-5jiqHtiZcQ7kNvgEdayI3&_nc_zt=24&_nc_ht=scontent.fsgn15-1.fna&_nc_gid=AXbhdH-XlUSZfvDMyO-uhDw&oh=00_AYBkqyluy1XGMp59w9qRkpSElTi_1roLSm2tYf-z6bujlA&oe=6790F5AE" />
          </Tooltip>
          <Tooltip title="PhanDinhDung">
            <Avatar alt="PhanDinhDung" src="https://lh3.googleusercontent.com/ogw/AF2bZyguGjCQbnIs6A395vN9GhGKAXWNgP1fOkFB42P7JSmGdQ=s32-c-mo" />
          </Tooltip>
          <Tooltip title="PhanDinhDung">
            <Avatar alt="PhanDinhDung" src="https://lh3.googleusercontent.com/ogw/AF2bZyguGjCQbnIs6A395vN9GhGKAXWNgP1fOkFB42P7JSmGdQ=s32-c-mo" />
          </Tooltip>
          <Tooltip title="PhanDinhDung">
            <Avatar alt="PhanDinhDung" src="https://lh3.googleusercontent.com/ogw/AF2bZyguGjCQbnIs6A395vN9GhGKAXWNgP1fOkFB42P7JSmGdQ=s32-c-mo" />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar
