import {useDroppable} from '@dnd-kit/react'
import styles from "./DragHoverDetector.module.css";


function DragHoverDetector({ id } : { id: string }) {
    const {ref} = useDroppable({
    id: id,
    type: 'detector'
  })
  return (<div ref={ref} className={styles.dragHoverDetector}/>)
}

export default DragHoverDetector;
