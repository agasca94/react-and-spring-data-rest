const React = require('react');
const Employee = require('./Employee');

module.exports = function EmployeeList(props) {

    const handleInput = e => {
        e.preventDefault();
        props.onPageSizeChanged(e.target.value);
    }

    const handleNavFirst = e => {
        e.preventDefault();
        props.onNavigate(props.links.first.href);
    }

    const handleNavPrev = e => {
        e.preventDefault();
        props.onNavigate(props.links.prev.href);
    }

    const handleNavNext = e => {
        e.preventDefault();
        props.onNavigate(props.links.next.href);
    }

    const handleNavLast = e => {
        e.preventDefault();
        props.onNavigate(props.links.last.href);
    }

    const employees = props.employees.map(e => 
        <Employee 
            key={e._links.self.href} 
            employee={e} 
            onDelete={props.onDelete} 
            onUpdate={props.onUpdate}
        />
    );

    const navLinks = [];

    if ("first" in props.links) {
        navLinks.push(
            <button key='first' onClick={handleNavFirst}>&lt;&lt;</button>
        );
    }
    if ("prev" in props.links) {
		navLinks.push(<button key="prev" onClick={handleNavPrev}>&lt;</button>);
	}
	if ("next" in props.links) {
		navLinks.push(<button key="next" onClick={handleNavNext}>&gt;</button>);
	}
	if ("last" in props.links) {
		navLinks.push(<button key="last" onClick={handleNavLast}>&gt;&gt;</button>);
	}

    return (
        <div>
            <input defaultValue={props.pageSize} onInput={handleInput} />
            <table>
                <tbody>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Description</th>
                    </tr>
                    {employees}
                </tbody>
            </table>
            <div>
                {navLinks}
            </div>
        </div>
    );
}
