import {useDroppable} from '@dnd-kit/react'


function DragHoverDetector({ id } : { id: string }) {
    const {ref} = useDroppable({
    id: id,
    type: 'detector'
  })
  return (<div ref={ref} style={{
      width: "250px",
      height: "100%",
      backgroundColor: "lightgray"
    }}/>)
}

export default DragHoverDetector;