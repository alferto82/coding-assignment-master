import { useState, useEffect } from 'react';

const useInfiniteScroll = (callback) => {
  const [isFetching, setIsFetching] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.offsetHeight;

      if (scrollPosition >= scrollHeight && !isFetching && !showLoading) {
        setShowLoading(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isFetching, showLoading]);

  useEffect(() => {
    if (!showLoading) return;

    const timer = setTimeout(() => {
      setIsFetching(true);
      setShowLoading(false);
    }, 500); 

    return () => clearTimeout(timer);
  }, [showLoading]);

  useEffect(() => {
    if (!isFetching) return;

    const fetchData = async () => {
      await callback();
      setIsFetching(false);
    };

    fetchData();
  }, [isFetching, callback]);

  return [showLoading, isFetching];
};

export default useInfiniteScroll;
