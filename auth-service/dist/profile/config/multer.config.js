"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerConfig = void 0;
const multer_1 = require("multer");
const path_1 = require("path");
const common_1 = require("@nestjs/common");
exports.multerConfig = {
    storage: (0, multer_1.diskStorage)({
        destination: './uploads/profiles',
        filename: (req, file, callback) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = (0, path_1.extname)(file.originalname);
            callback(null, `profile-${uniqueSuffix}${ext}`);
        },
    }),
    fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
            return callback(new common_1.BadRequestException('Only image files are allowed!'), false);
        }
        callback(null, true);
    },
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
};
//# sourceMappingURL=multer.config.js.map