import { useEffect, useRef, useState } from 'react';

interface Options extends IntersectionObserverInit {
  /** Stop observing after the first intersection — for one-shot reveals. */
  once?: boolean;
}

export function useIntersectionObserver<T extends Element = HTMLDivElement>(
  { once = false, root = null, rootMargin = '0px', threshold = 0 }: Options = {}
) {
  const ref = useRef<T | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && once) observer.disconnect();
      },
      { root, rootMargin, threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [once, root, rootMargin, threshold]);

  return { ref, isIntersecting };
}
