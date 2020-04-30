const React = require('react');
const ReactDOM = require('react-dom');

const api = require('./api');
const wsClient = require('./websocket-listener');
const EmployeeList = require('./EmployeeList');
const CreateDialog = require('./CreateDialog');
const UpdateDialog = require('./UpdateDialog');

window.onbeforeunload = function(e) {
    wsClient.disconnect();
};

function App() {
    const [employees, setEmployees] = React.useState([]);
    const [attributes, setAttributes] = React.useState([]);
    const [pageSize, setPageSize] = React.useState(2);
    const [page, setPage] = React.useState(0);
    const [links, setLinks] = React.useState([]);
    const [selectedEmployee, setSelectedEmployee] = React.useState({});

    const latestState = React.useRef({ pageSize, page });
    React.useEffect(() => {
        latestState.current = { pageSize, page }
    });

    React.useEffect(() => {
        api.loadFromServer(pageSize)
            .done(({ schema, employeeCollection }) => {
                setEmployees(employeeCollection.entity._embedded.employees);
                setLinks(employeeCollection.entity._links);
                setPage(employeeCollection.entity.page.number);
                setAttributes(Object.keys(schema.entity.properties));
            });
    }, [pageSize]);

    React.useEffect(() => {
        
        const refreshAndGoToLastPage = () => {
            api.loadEmployeesRoot(latestState.current.pageSize)
                .done(res => {
                    if (typeof res.entity._links.last !== 'undefined') {
                        onNavigate(res.entity._links.last.href);
                    } else {
                        onNavigate(res.entity._links.self.href);
                    }
                });
        }

        const refreshCurrentPage = () => {
            api.loadEmployeesRoot(latestState.current.pageSize, latestState.current.page)
                .done(employeeCollection => {
                    setEmployees(employeeCollection.entity._embedded.employees);
                    setLinks(employeeCollection.entity._links);
                    setPage(employeeCollection.entity.page.number);
                });
        }
        
        wsClient.connect([
            {route: '/topic/newEmployee', callback: refreshAndGoToLastPage},
            {route: '/topic/updateEmployee', callback: refreshCurrentPage},
            {route: '/topic/deleteEmployee', callback: refreshCurrentPage}
        ]);

        return () => {
            wsClient.disconnect();
        }
    }, []);

    const onNavigate = navUri => {
        api.onNavigate(navUri)
            .done(employeeCollection => {
                setEmployees(employeeCollection.entity._embedded.employees);
                setLinks(employeeCollection.entity._links);
                setPage(employeeCollection.entity.page.number)
            })
    }

    const onCreate = newEmployee => {
        api.onCreate(newEmployee, pageSize)
    }

    const onDelete = employee => {
        api.onDelete(employee)
            .then(() => {}, res => {
                if (res.status.code === 403) {
                    alert(
                        `ACCESS DENIED: You are not authorized to delete ${employee._links.self.href}`
                    )
                }
            })
    }

    const onUpdate = (original, updatedEmployee) => {
        api.onUpdate(original, updatedEmployee)
            .done(() => {}, res => {
                if (res.status.code === 403) {
                    alert(
                        `ACCESS DENIED: You are not authorized to update ${original.entity._links.self.href}`
                    );
                }
                if (res.status.code === 412) {
                    alert(
                        `DENIED: Unable to update ${original.entity._links.self.href}. Your copy is stale`
                    );
                }
            });
    }

    return (
        <div>
            <CreateDialog
                attributes={attributes}
                onCreate={onCreate}
            />
            <UpdateDialog
                attributes={attributes}
                employee={selectedEmployee}
                onUpdate={onUpdate}
            />
            <EmployeeList 
                employees={employees}
                onDelete={onDelete}
                onUpdate={setSelectedEmployee}
                links={links}
                pageSize={pageSize}
                onNavigate={onNavigate}
                onPageSizeChanged={setPageSize}
            />
        </div>
    )
}

ReactDOM.render(
    <App />,
    document.getElementById('react')
);
