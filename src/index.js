import './env';
import server from './server';

server.listen(process.env.PORT || 3000);
