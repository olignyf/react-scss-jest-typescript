import { useState } from 'react';

/**
 * Usage: 
 * const [modalShown, showModal, hideModal] = useModal(); * 
 * JSX:
 * <button onClick={showModal}>Open Modal</button>
 * {modalShown && <MyModal onClose={hideModal}/>}

 * @param initialSate Optional parameter to set the initial display state of the modal
 */
export const useModal = (initialSate?: boolean): [boolean, () => void, () => void] => {
  const [shown, setShown] = useState<boolean>(initialSate == null ? false : initialSate);
  return [
    shown,
    () => {
      setShown(true);
    },
    () => {
      setShown(false);
    },
  ];
};
