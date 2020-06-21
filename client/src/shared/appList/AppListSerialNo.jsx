import { useContext } from 'react';
import { AppListContext } from './AppList';

export const AppListSerialNo = ({ index }) => {
    const { currentPage, perPageSize } = useContext(AppListContext);
    return (currentPage - 1) * perPageSize + index + 1;
};
