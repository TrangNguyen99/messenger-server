"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const http_1 = __importDefault(require("http"));
const mongoose_1 = __importDefault(require("mongoose"));
const morgan_1 = __importDefault(require("morgan"));
const socket_io_1 = require("socket.io");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const env_1 = require("./constant/env");
const error_1 = require("./constant/error");
const httpStatusCode_1 = require("./constant/httpStatusCode");
const route_1 = require("./route");
const service_account_json_1 = __importDefault(require("./service-account.json"));
const swagger_json_1 = __importDefault(require("./swagger.json"));
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(`${env_1.env.MONGODB_URI}`);
        const app = (0, express_1.default)();
        const server = http_1.default.createServer(app);
        const io = new socket_io_1.Server(server);
        io.on('connection', socket => {
            socket.join(socket.handshake.auth.userId);
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            socket.on('disconnect', () => { });
        });
        firebase_admin_1.default.initializeApp({
            credential: firebase_admin_1.default.credential.cert({
                privateKey: service_account_json_1.default.private_key,
                clientEmail: service_account_json_1.default.client_email,
                projectId: service_account_json_1.default.project_id,
            }),
        });
        app.use((0, cors_1.default)());
        app.use(express_1.default.json());
        app.use(express_1.default.static('public'));
        app.use((0, morgan_1.default)('dev'));
        app.use((req, res, next) => {
            res.locals.io = io;
            next();
        });
        // app.get('/', (req, res) => {
        //   res.json({
        //     type: 'success',
        //     message: 'Server is running',
        //     data: null,
        //   })
        // })
        app.use('/', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
        app.use('/api', route_1.api);
        app.use('*', (req, res, next) => {
            const error = {
                status: httpStatusCode_1.HTTP_STATUS_CODE.NOT_FOUND,
                message: error_1.ERROR_MESSAGE.API_ENDPOINT_NOT_FOUND,
            };
            next(error);
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        app.use((err, req, res, next) => {
            const status = err.status || httpStatusCode_1.HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR;
            const message = err.message || error_1.ERROR_MESSAGE.SERVER_ERROR;
            const data = err.data || null;
            res.status(status).json({
                type: 'error',
                message,
                data,
            });
        });
        server.listen(parseInt(`${env_1.env.PORT}`), () => console.log(`Server is listening on port ${env_1.env.PORT}`));
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
});
main();
