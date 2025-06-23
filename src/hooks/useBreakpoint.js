import { useState, useEffect } from 'react';

export function useBreakpoint(breakpoint = 768) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const updateSize = () => setIsMobile(window.innerWidth < breakpoint);
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, [breakpoint]);
    return isMobile;
}
