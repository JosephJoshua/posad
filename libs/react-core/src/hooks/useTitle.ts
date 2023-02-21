import { useEffect } from 'react';

const useTitle = (title: string) => {
  useEffect(() => {
    if (document == null) return;
    document.title = title;
  }, [title]);
};

export default useTitle;
