// src/utils/hasPermission.js

const hasPermission = (accessToken, requiredRoute, requiredAction) => {
    if (!accessToken || !accessToken.role?.permissions) return false;

    const normalizedRoute = requiredRoute.toLowerCase().replace(/\/+$/, '');

    return accessToken.role.permissions.some(perm => {
        const permRoute = perm.route.toLowerCase().replace(/\/+$/, '');
        const routeMatch = permRoute === normalizedRoute;
        const actionMatch = perm.actions.includes(requiredAction);
        return routeMatch && actionMatch;
    });
};

export default hasPermission;
