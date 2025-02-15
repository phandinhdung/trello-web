// Board Details
import Container from '@mui/material/Container'
import AppBar from '../../components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { mockData, mockDataBoard } from '~/apis/mock-data'
import { useEffect, useState } from 'react'
import { fetchBoardDetailsAPI } from '~/apis'

function Board() {
  // const [board, setBoard] = useState(null);

  // useEffect(() => {
  //   const boardId = '67b079a3a969da906a759e5a'
  //   fetchBoardDetailsAPI(boardId).then(board => {
  //     setBoard(board);
  //   })
  // }, [])
  
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={mockData?.board} />
      <BoardContent board={mockData?.board} />
      {/* <BoardBar board={mockDataBoard} />
      <BoardContent board={mockDataBoard} /> */}

      {/* <BoardBar board={board} />
      <BoardContent board={board} /> */}
    </Container>
  )
}

export default Board
