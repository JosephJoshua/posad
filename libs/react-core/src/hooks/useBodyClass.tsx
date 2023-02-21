import clsx, { ClassValue } from 'clsx';
import { useEffect } from 'react';

const useBodyClass = (...className: ClassValue[]) => {
  useEffect(() => {
    if (document == null) return;

    const classes = clsx(className);

    document.body.classList.add(classes);
    return () => document.body.classList.remove(classes);
  }, [className]);
};

export default useBodyClass;
