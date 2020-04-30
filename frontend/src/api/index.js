const client = require('./client');
const follow = require('./follow');
const utils = require('../utils');

const root = '/api';

const onNavigate = navUri => client({method: 'GET', path: navUri});

const loadFromServer = pageSize => 
    loadEmployeesRoot(pageSize)
        .then(employeeCollection => 
            client({
                method: 'GET',
                path: employeeCollection.entity._links.profile.href,
                headers: { 'Accept': 'application/schema+json' }
            }).then(schema => {
                utils.filterSchemaProperties(schema);
                return {
                    schema,
                    employeeCollection
                }
            })
        );

const loadEmployeesRoot = (pageSize, page=0) => 
    follow(client, root, [
        { 
            rel: 'employees', 
            params: { size: pageSize, page } 
        }
    ]);

const loadEmployee = employee => 
    client({ method: 'GET', path: employee._links.self.href});

const onCreate = newEmployee => 
    follow(client, root, ['employees'])
        .then(employeeCollection => 
            client({
                method: 'POST',
                path: employeeCollection.entity._links.self.href,
                entity: newEmployee,
                headers: {'Content-Type': 'application/json'}
            }));

const onDelete = employee => 
    client({
        method: 'DELETE',
        path: employee._links.self.href
    });

const onUpdate = (original, updatedEmployee) =>
    client({
        method: 'PATCH',
        path: original.entity._links.self.href,
        entity: updatedEmployee,
        headers: {
            'Content-Type': 'application/json',
            'If-Match': original.headers.Etag
        }
    });

module.exports = {
    loadFromServer,
    loadEmployeesRoot,
    loadEmployee,
    onCreate,
    onDelete,
    onUpdate,
    onNavigate
}
