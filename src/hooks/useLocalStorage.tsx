import React from 'react';

export const useLocalStorage = (storageKey:string, fallbackState:any) => {
    const [value, setValue] = React.useState<any>(
      localStorage.getItem(storageKey) ?? fallbackState
    );
  
    React.useEffect(() => {
      localStorage.setItem(storageKey, value);
    }, [value, storageKey]);
  
    return [value, setValue];
  };
  