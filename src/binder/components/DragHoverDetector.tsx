import {useDroppable} from '@dnd-kit/react'
import styles from "./DragHoverDetector.module.css";


function DragHoverDetector({ id, enabled = true } : { id: string; enabled?: boolean }) {
    const {ref} = useDroppable({
    id: id,
    type: 'detector',
    disabled: !enabled,
  })
  return (<div ref={ref} className={styles.dragHoverDetector}/>)
}

export default DragHoverDetector;
