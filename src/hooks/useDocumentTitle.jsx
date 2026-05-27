import { useEffect } from 'react';

const useDocumentTitle = (title) => {
  useEffect(() => {
    document.title = title ? `${title} | StudyNook` : 'StudyNook – Library Study Room Booking';
  }, [title]);
};

export default useDocumentTitle;
