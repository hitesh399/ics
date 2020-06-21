import React, { useState } from 'react';
import { AppList, AppListContext } from '../../shared/appList/AppList';
import { AppPagination } from '../../shared/appList/AppPagination';
import { Table, Button } from 'react-bootstrap';
import { AppListSelectAll, AppListSelect } from '../../shared/appList/AppListSelectItem';
import { AppListSerialNo } from '../../shared/appList/AppListSerialNo';
import { AppModal } from '../../shared/modal/app-modal-utils';
import { AppBreadcrumb } from '../../shared/components/AppBreadcrumb';
import { AppInput, AppSubmitBtn } from '../../shared/formikBootstrap/Fields';
import { AppListSortableTh } from '../../shared/appList/AppListSortableTh';
import { request } from '../../utils/axios-utils';
import { dateTimeFormat, isValidUrl } from '../../utils/app-utils';
import { get } from 'lodash';

export const AdminPostPage = () => {
    const [requesting, requestStatus] = useState(false);
    const deleteSelect = ({ selected, changePage, clearSelected }) => {
        AppModal.confirmBox(
            <p>This is only for demo. Are you sure to delete? Selected ID {selected.join(', ')}</p>,
            ({ busy, close }) => {
                busy();
                setTimeout(() => {
                    close();
                    clearSelected();
                    changePage(1);
                }, 1000);
            },
        );
    };
    const singleDelete = ({ id, title }, { changePage }) => {
        AppModal.confirmBox(
            <p>
                Are you sure to delete post <strong>{title}</strong>
            </p>,
            ({ busy, close }) => {
                busy();
                request
                    .delete(`post/delete/${id}/user`)
                    .then(() => {
                        close();
                        changePage(1);
                        AppModal.messageBox('Deleted Successfully.', 'Success!');
                    })
                    .catch(() => {
                        close();
                        AppModal.messageBox('Error to delete the post.', 'Error!');
                    });
            },
        );
    };

    const crawls = async ({ refresh }) => {
        requestStatus(true);
        const response = await request('post/crawl');
        AppModal.messageBox(response.data.data.message);
        refresh();
        requestStatus(false);
    };
    const markAsReadUnRead = async ({ id }, { refresh }) => {
        // request.post/read/:id
        await request.put(`post/read/${id}`);
        refresh();
    };
    return (
        <>
            <AppBreadcrumb
                title="Dashboard"
                menu={[
                    { to: '/admin/post', title: <i className="bx bx-home-alt"></i> },
                    { title: 'Post & News' },
                ]}
            />
            <div className="content-body">
                <section>
                    <div className="row">
                        <div className="col-md-12">
                            <AppList
                                name="postList"
                                keepAlive={false}
                                multiSorting={false}
                                action="post/"
                                dataKey="data.data"
                                perPageSize={20}
                                totalKey="data.total"
                                initialValues={{ sort: { updated_at: 'desc' } }}
                                autoFilter={false}
                                fetchOnLoad={true}>
                                <AppListContext.Consumer>
                                    {(appList) => {
                                        return (
                                            <div className="card">
                                                <div className="card-header">
                                                    Post & News List{' '}
                                                    <strong>
                                                        <i> ({appList.total})</i>
                                                    </strong>
                                                </div>
                                                <div className="card-body">
                                                    <div className="row">
                                                        <div className="col">
                                                            <AppInput
                                                                name="search"
                                                                placeholder="search"
                                                                shouldDisableOnSubmitting={false}
                                                            />
                                                        </div>
                                                        <div className="col">
                                                            <AppSubmitBtn
                                                                label="Search"
                                                                waitLabel="Searching..."
                                                            />
                                                        </div>
                                                        <div className="col">
                                                            <Button
                                                                disabled={requesting}
                                                                onClick={() => crawls(appList)}>
                                                                {requesting
                                                                    ? 'Working...'
                                                                    : 'Crawls and Save into Database'}
                                                            </Button>
                                                            <p>
                                                                or can also use the command{' '}
                                                                <code> adonis crawl </code>
                                                            </p>
                                                        </div>
                                                        {appList.selected.length ? (
                                                            <div className="col">
                                                                <Button
                                                                    onClick={() =>
                                                                        deleteSelect(appList)
                                                                    }
                                                                    variant="danger"
                                                                    className="d-flex align-items-center">
                                                                    <i className="fas fa-trash-alt"></i>
                                                                    &nbsp; Delete(
                                                                    {appList.selected.length})
                                                                </Button>
                                                            </div>
                                                        ) : null}
                                                    </div>

                                                    <Table
                                                        striped
                                                        responsive
                                                        bordered
                                                        hover
                                                        size="sm">
                                                        <thead>
                                                            <tr>
                                                                <th width="40px">
                                                                    <AppListSelectAll />
                                                                </th>
                                                                <th>#</th>
                                                                <AppListSortableTh name="title">
                                                                    Title
                                                                </AppListSortableTh>
                                                                {/* <th>URL</th> */}
                                                                <th>Comments</th>
                                                                <th>Upvotes</th>
                                                                <AppListSortableTh name="created_at">
                                                                    Created At
                                                                </AppListSortableTh>
                                                                <AppListSortableTh name="updated_at">
                                                                    Updated At
                                                                </AppListSortableTh>
                                                                <th>-</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {appList.data.map((item, index) => {
                                                                const isRead = get(
                                                                    item,
                                                                    'users.0.pivot.is_read',
                                                                    'No',
                                                                );
                                                                return (
                                                                    <tr key={`row${item.id}`}>
                                                                        <td width="40px">
                                                                            <AppListSelect
                                                                                id={item.id}
                                                                            />
                                                                        </td>
                                                                        <td width="40px">
                                                                            <AppListSerialNo
                                                                                index={index}
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <a
                                                                                href={
                                                                                    isValidUrl(
                                                                                        item.post_url,
                                                                                    )
                                                                                        ? item.post_url
                                                                                        : `https://news.ycombinator.com/${item.post_url}`
                                                                                }
                                                                                target="_blank"
                                                                                rel="noopener noreferrer">
                                                                                {item.title}
                                                                            </a>
                                                                        </td>
                                                                        <td>
                                                                            {item.no_of_comments}
                                                                        </td>
                                                                        <td>{item.up_votes}</td>
                                                                        <td>
                                                                            {dateTimeFormat(
                                                                                item.created_at,
                                                                            )}
                                                                        </td>
                                                                        <td>
                                                                            {dateTimeFormat(
                                                                                item.updated_at,
                                                                            )}
                                                                        </td>
                                                                        <td>
                                                                            <Button
                                                                                onClick={() =>
                                                                                    singleDelete(
                                                                                        item,
                                                                                        appList,
                                                                                    )
                                                                                }>
                                                                                Delete
                                                                            </Button>
                                                                            <Button
                                                                                onClick={() =>
                                                                                    markAsReadUnRead(
                                                                                        item,
                                                                                        appList,
                                                                                    )
                                                                                }>
                                                                                {isRead === 'Yes'
                                                                                    ? 'Mark As Unread'
                                                                                    : 'Mark As Read'}
                                                                            </Button>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </Table>
                                                </div>
                                            </div>
                                        );
                                    }}
                                </AppListContext.Consumer>
                                <AppPagination />
                            </AppList>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};
