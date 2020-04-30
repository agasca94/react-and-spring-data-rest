const React = require('react');

const utils = require('./utils');

const createResourceFromKeys = attributes => 
    Object.fromEntries(
        attributes.map(attr => [attr, ''])
    );

module.exports = function CreateDialog({ attributes, onCreate }) {
    const [resource, setResource] = React.useState({});

    React.useEffect(() => {
        setResource(createResourceFromKeys(attributes));
    }, [attributes, setResource]);

    const handleSubmit = e => {
        e.preventDefault();
        onCreate(resource);
        setResource(createResourceFromKeys(attributes));
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
        <div>
            <a href='#createEmployee'>Create</a>
            <div id='createEmployee' className='modalDialog'>
                <div>
                    <a href='#' title='Close' className='close'>X</a>
                    <h2>Create new employee</h2>
                    <form>
                        {inputs}
                        <button onClick={handleSubmit}>Create</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
