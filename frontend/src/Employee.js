const React = require('react');

module.exports = function Employee({ employee, onDelete, onUpdate }) {
    const handleDelete = () => {
        onDelete(employee);
    }
    const handleUpdate = () => {
        onUpdate(employee);
    }
    return (
        <tr>
            <td>{employee.firstName}</td>
            <td>{employee.lastName}</td>
            <td>{employee.description}</td>
            <td>{employee.manager.name}</td>
            <td>
                <a href="#updateEmployee" onClick={handleUpdate}>Update</a>
            </td>
            <td>
                <button onClick={handleDelete}>Delete</button>
            </td>
        </tr>
    );
}
