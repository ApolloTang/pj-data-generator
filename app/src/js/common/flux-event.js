const symbols = [
    'WHERE__WHAT__OPERATION__DESCRPTION'
].reduce((acc, eventName) => ({
    ...acc,
    [eventName]: acc[eventName] ? duplicateEventNameError(eventName) : Symbol.for(eventName)
}), {});

function duplicateEventNameError (eventName) {
    throw new Error(`Event ${eventName} already exists`);
}


export default symbols;

