// Example: ./hooks/useShowTabHeader.js or ./TabHeader.js
import { useLocation } from 'react-router-dom';

export const useShowTabHeader = () => {
    const location = useLocation();

    return (
        location.pathname.startsWith('/employee/update') ||
        location.pathname.startsWith('/employee/create')
    );
};
