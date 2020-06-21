import React, { useContext } from 'react';
import { AppListContext } from './AppList';
import { Pagination } from 'react-bootstrap';
import classNames from 'classnames';

export const AppPagination = ({ delta, isMobile }) => {
    const appList = useContext(AppListContext);
    const { pages, data, currentPage, requesting, changePage, next, prev } = appList;
    const paginations = pagination(currentPage, pages, delta);

    if (!data || !data.length) return null;
    return (
        <Pagination
            size={isMobile ? 'lg' : undefined}
            className={classNames({
                'justify-content-center': isMobile,
                'justify-content-end': !isMobile,
            })}>
            <Pagination.First
                onClick={() => changePage(1)}
                className="previous"
                active={currentPage === 1}
                data-linktype="first"
                disabled={requesting || currentPage === 1}
            />
            <Pagination.Prev
                data-linktype="prev"
                className="previous"
                disabled={requesting || currentPage === 1}
                onClick={() => prev()}
            />
            {!isMobile &&
                paginations.map((page, index) =>
                    page === '...' ? (
                        <Pagination.Ellipsis
                            data-linktype="ellipsis"
                            disabled={requesting}
                            key={`${index}_page_${page}`}
                        />
                    ) : (
                        <Pagination.Item
                            key={`page_${page}`}
                            disabled={requesting}
                            data-linktype={page}
                            onClick={() => changePage(page)}
                            active={currentPage === page}>
                            {page}
                        </Pagination.Item>
                    ),
                )}
            {isMobile ? <Pagination.Item active>{currentPage}</Pagination.Item> : null}
            <Pagination.Next
                data-linktype="next"
                className="next"
                disabled={requesting || pages === currentPage}
                onClick={() => next()}
            />

            <Pagination.Last
                data-linktype="last"
                className="next"
                disabled={requesting || currentPage === pages}
                onClick={(e) => changePage(pages)}
            />
        </Pagination>
    );
};

function pagination(currentPage, lastPage, delta = 5) {
    let current = currentPage,
        last = lastPage,
        left = current - delta,
        right = current + delta + 1,
        range = [],
        rangeWithDots = [],
        l;

    for (let i = 1; i <= last; i++) {
        if (i === 1 || i === last || (i >= left && i < right)) {
            range.push(i);
        }
    }

    for (let i of range) {
        if (l) {
            if (i - l === 2) {
                rangeWithDots.push(l + 1);
            } else if (i - l !== 1) {
                rangeWithDots.push('...');
            }
        }
        rangeWithDots.push(i);
        l = i;
    }

    return rangeWithDots;
}
