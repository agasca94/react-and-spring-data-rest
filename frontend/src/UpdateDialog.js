const React = require('react');
const api = require('./api');
const utils = require('./utils');

module.exports = function({ employee, attributes, onUpdate }) {
    const [resource, setResource] = React.useState({});
    const [original, setOriginal] = React.useState({});
    
    React.useEffect(() => {
        if (!employee._links) return;

        api.loadEmployee(employee)
            .then(res => {
                setOriginal(res);
                // setResource(res.entity);
            })
    }, [employee]);

    React.useEffect(() => {
        if (!attributes) return

        const normalize = () =>
            Object.fromEntries(
                attributes.map(attr => [attr, original.entity?.[attr] || ''])
            );

        setResource(normalize());
    }, [original, attributes]);

    const handleSubmit = e => {
        e.preventDefault();
        onUpdate(original, resource);
        window.location = '#';
    }

    const handleInput = utils.handleObjectChange(setResource);
    const inputs = Object.keys(resource).map(attr => 
        <p key={attr}>
            <input
                type='text'
                placeholder={attr}
                className='field'
                name={attr}
                value={resource[attr]}
                onChange={handleInput}
            />
        </p>
    );

    return (
        <div id='updateEmployee' className="modalDialog">
            <div>
                <a href="#" title="Close" className="close">X</a>

                <h2>Update an employee</h2>

                <form>
                    {inputs}
                    <button onClick={handleSubmit}>Update</button>
                </form>
            </div>
        </div>
    );
}
