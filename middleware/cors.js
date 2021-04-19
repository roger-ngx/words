import Cors from 'cors';
import initMiddleware from "./initMiddleware";

export default cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)