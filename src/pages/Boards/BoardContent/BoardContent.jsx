
import ListColumns from './ListColumns/ListColumns'
import Box from '@mui/material/Box'
import { mapOrder } from '~/utils/sorts'
import { arrayMove } from '@dnd-kit/sortable'
import { useEffect, useState } from 'react'
import {
  DndContext,
  // PointerSensor,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  DragOverlay,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core'

import { cloneDeep } from 'lodash'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE'
}
function BoardContent({ board }) {
  // Để khắc phục lỗi không click được button trong các đối tượng kéo thả. Cách giải quyết là  chỉ xử lí hàm kéo thả khi di chuyển nhiều
  // , còn không di chuyển nhiều thì khỏi xử lí, và lúc đó sẽ click được.
  //const pointerSensor = useSensor(PointerSensor, {activationConstraint: {distance: 10}})
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } })

  const sensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumns] = useState([])

  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)

  //hàm mapOrder bên dưới là hàm tự định nghĩa, hiện tại bên dưới là đang đùng để sắp xếp vị trí các cột theo mảng chứa thứ tự các cột
  useEffect(() => { setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id')) }
    , [board])

  const findColumnByCardId = (cardId) => {
    return orderedColumns.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
  }
  const handleDragStart = (event) => {
    console.log('handleDragStart: ', event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)
  }

  const handleDragOver = (event) => {
    //không làm gì nếu kéo column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return
    const { active, over } = event //lấy 2 đối tượng trong đối tượng event ra

    // Nếu over không có giá trị (kéo linh tinh), thì trả về luôn (để tránh lỗi).
    if (!active || !over) return

    // id là một phần tử trong active, gán tên cho id là activeDragingItemId, tương tự cho các phần tử khác
    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    const { id: overCardId } = over

    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    if (!activeColumn || !overColumn) return

    if (activeColumn._id !== overColumn._id) {
      setOrderedColumns(prevColumns => {
        const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)

        let newCardIndex
        const isBelowOverItem =
          active.rect.current.translated &&
          active.rect.current.translated.top >
          over.rect.top + over.rect.height;

        const modifier = isBelowOverItem ? 1 : 0;

        newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1;

        const nextColumns = cloneDeep(prevColumns);
        const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id);
        const nextOverColumn = nextColumns.find(column => column._id === overColumn._id);

        if (nextActiveColumn) {
          nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId);
          nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id);
        }

        if (nextOverColumn) {
          nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId);
          nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, activeDraggingCardData);

          nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id);
        }


        return nextColumns
      })
    }

  }
  const handleDragEnd = (event) => {
    console.log('handleDragEnd: ', event)

    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      return
    }

    const { active, over } = event //lấy 2 đối tượng trong đối tượng event ra

    // Nếu over không có giá trị (kéo linh tinh), thì trả về luôn (để tránh lỗi).
    if (!active || !over) return

    if (active.id !== over.id) {
      //tìm vị trí (index) đầu tiên của phần tử column trong mảng orderedColumns thõa mãn điều kiện _id của nó bằng với id của đối tượng active
      const oldIndex = orderedColumns.findIndex(c => c._id === active.id)

      //tìm vị trí (index) đầu tiên của phần tử column trong mảng orderedColumns thõa mãn điều kiện _id của nó bằng với id của đối tượng over
      const newIndex = orderedColumns.findIndex(c => c._id === over.id)

      const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex)
      setOrderedColumns(dndOrderedColumns)
    }

    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
  }

  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5'
        }
      }
    })
  }
  return (
    <DndContext
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
      sensors={sensors}
    >
      <Box sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        p: '10px 0'
      }}>
        <ListColumns columns={orderedColumns} />
        <DragOverlay dropAnimation={customDropAnimation}>
          {!activeDragItemType && null}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData} />}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Card card={activeDragItemData} />}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
