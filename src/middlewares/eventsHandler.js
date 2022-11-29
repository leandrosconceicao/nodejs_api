import events from 'events';

const emissor = new events.EventEmitter()

const em = (req, res, next) => {
    emissor.on('msg', () => {
        console.log(req);
    })
    next();
}


export default em;