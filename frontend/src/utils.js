module.exports = {
    handleObjectChange: setter => e => {
        const { name, value } = e.target;
        setter(prev => ({
            ...prev,
            [name]: value
        }));
    },

    filterSchemaProperties: schema => {
        Object.keys(schema.entity.properties).forEach(property => {
            if (schema.entity.properties[property].format === 'uri' || 
                schema.entity.properties[property].hasOwnProperty('$ref')) {
                
                delete schema.entity.properties[property];
            }
        });
    }
}
