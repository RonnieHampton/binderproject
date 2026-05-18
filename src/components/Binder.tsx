import {useDroppable} from '@dnd-kit/react';

type BinderProps = {
  id: string;
  children?: React.ReactNode;
}

function Binder({id, children}: BinderProps) {
  const {ref} = useDroppable({
    id,
  });

  return (
    <div ref={ref} style={{width: 300, height: 300, backgroundColor: 'lightgray'}}>
      {children}
    </div>
  );
}

export default Binder