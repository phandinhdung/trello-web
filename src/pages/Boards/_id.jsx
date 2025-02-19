// Board Details
import Container from '@mui/material/Container'
import AppBar from '../../components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { mockData, mockDataBoard } from '~/apis/mock-data'
import { useEffect, useState } from 'react'
import {
  fetchBoardDetailsAPI, createNewColumnAPI,
  createNewCardAPI, updateBoardDetailsAPI,
  updateColumnDetailsAPI, moveCardToDifferentColumnAPI,
  deleteColumnDetailsAPI
} from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'
import { mapOrder } from '~/utils/sorts'
import { Box, Typography } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress';
import { toast } from 'react-toastify'

function Board() {
  const [board, setBoard] = useState(null);
  const boardId = '67b2fb1e62a48e198ccdf262';

  const loadBoard = () => {
    fetchBoardDetailsAPI(boardId).then(board => {
      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id');
      //console.log('chay qua day ');
      // Xử lí kéo thả cho column rỗng
      board.columns.forEach(column => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)];
          column.cardOrderIds = [generatePlaceholderCard(column)._id];
        } else {
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id');
        }
      })

      setBoard(board);
    })
  }

  useEffect(() => {
    fetchBoardDetailsAPI(boardId).then(board => {
      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id');
      //console.log('chay qua day ');
      // Xử lí kéo thả cho column rỗng
      board.columns.forEach(column => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)];
          column.cardOrderIds = [generatePlaceholderCard(column)._id];
        } else {
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id');
        }
      })

      setBoard(board);
    })
  }, [])

  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    });

    //console.log('createdColumn: ', createdColumn);
    createdColumn.cards = [generatePlaceholderCard(createdColumn)];
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id];

    const newBoard = { ...board }
    newBoard.columns.push(createdColumn);
    newBoard.columnOrderIds.push(createdColumn._id);
    setBoard(newBoard);

    // const boardId = '67b2fb1e62a48e198ccdf262'
    // await fetchBoardDetailsAPI(boardId).then(board => {
    //   setBoard(board);
    // })
  }

  const createNewCard = async (newCardData) => {
    // const createdCard = await createNewCardAPI({
    //   ...newCardData,
    //   boardId: board._id
    // });

    //console.log('createdCard: ', createdCard)

    // const newBoard = { ...board };
    // const columnToUpdate = newBoard.columns.find(column => column._id === createdCard.columnId)
    // if (columnToUpdate) {
    //   if (columnToUpdate.cards.some(card => card.FE_PlaceholderCard)) {
    //     columnToUpdate.cards = [createdCard];
    //     columnToUpdate.cardOrderIds = [createdCard._id];
    //   } else {
    //     columnToUpdate.cards.push(createdCard);
    //     columnToUpdate.cardOrderIds.push(createdCard._id);
    //   }
    // }

    // setBoard(newBoard);


    // CÁCH XỬ LÍ KHÁC KHI TẠO CARD MOWISf
    await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    });

    loadBoard();
  }

  const moveColumn = async (dndOrderedColumns) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id);

    //const newBoard = { ...board }
    //newBoard.columns = dndOrderedColumnsIds;
    //newBoard.columnOrderIds = dndOrderedColumnsIds;
    //setBoard(newBoard);

    await updateBoardDetailsAPI(board._id, { columnOrderIds: dndOrderedColumnsIds });
    loadBoard();
  }

  const moveCardInTheSameColumn = async (dndOrderedCards, dndOrderedCardsIds, columnId) => {
    const newBoard = { ...board };
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards;
      columnToUpdate.cardOrderIds = dndOrderedCardsIds;
    }

    setBoard(newBoard);

    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardsIds });
  }

  const moveCardToDifferentColumn = async (currentCardId, prevColumnId, nextColumnId, dndOrderedColumns) => {
    //const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id);
    // const newBoard = { ...board }
    // newBoard.columns = dndOrderedColumnsIds;
    // newBoard.columnOrderIds = dndOrderedColumnsIds;
    //setBoard(newBoard);

    let prevCardOrderIds = dndOrderedColumns.find(c => c._id === prevColumnId)?.cardOrderIds;
    if (prevCardOrderIds[0].includes('placeholder-card')) {
      prevCardOrderIds = [];
    }

    await moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find(c => c._id === nextColumnId)?.cardOrderIds
    })

    loadBoard();
  }

  const deleteColumnDetails = (columnId) => {
    const newBoard = { ...board }
    newBoard.columns = newBoard.columns.filter(c => c._id !== columnId);
    newBoard.columnOrderIds = newBoard.columnOrderIds.filter(_id => _id !== columnId);
    setBoard(newBoard);

    deleteColumnDetailsAPI(columnId).then(res => {
      toast.success(res?.deleteResult)
      //console.log('sau khi xoa cot: ', res);
    })
  }

  if (!board) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          width: '100vw',
          height: '100vh'
        }}>
        <CircularProgress />
        <Typography>Loading Board...</Typography>
      </Box>
    );
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      {/* <BoardBar board={mockData?.board} />
      <BoardContent board={mockData?.board} /> */}

      <BoardBar board={board} />
      <BoardContent board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumn={moveColumn}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
        deleteColumnDetails={deleteColumnDetails} />
    </Container>
  )
}

export default Board
