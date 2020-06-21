import React, { useContext, useEffect } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { AppListContext } from './AppList';

export const AppListLoadMore = ({
    className,
    waitLabel = 'Loading...',
    children,
    label = 'Load More',
}) => {
    const { requesting, next, currentPage, pages } = useContext(AppListContext);

    useEffect(() => {
        const fnc = function () {
            if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
                // you're at the bottom of the page
                if (!requesting) next();
            }
        };
        window.addEventListener('scroll', fnc);
        return function () {
            window.removeEventListener('scroll', fnc);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (pages === currentPage) return null;
    return (
        <div className="d-flex justify-content-center">
            <Button
                disabled={requesting}
                className={`glow position-relative ${className}`}
                type="button"
                onClick={next}
                variant="primary">
                {requesting ? (
                    <span>
                        <Spinner
                            as="span"
                            animation="grow"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                        />
                        <span>{waitLabel}</span>
                    </span>
                ) : null}
                {!requesting ? children || label : null}
            </Button>
        </div>
    );
};
