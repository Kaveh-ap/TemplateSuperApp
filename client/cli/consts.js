const fs = require("fs");
const path = require("path");
const ip = require("ip");
const { branchName, branchParent } = require("./utils");
const ipAddress = ip.address();

const DEFAULT_PORT = 8081;
const D_PORT = 9001;
const M_PORT = 9002;
const HOST_PORT = 9000;
const PRODUCT_PORT = 9000;

const LOCAL_URL = (port) => `http://${ipAddress}:${port}/[name][ext]`;

const calculateStartScript = async (proj, baseApi) => {
    let clientDirPath = "node_modules/@mobile/client";

    const exist = fs.existsSync(path.join(process.cwd(), clientDirPath));

    if (!exist) clientDirPath = "../../node_modules/@mobile/client";

    const bName = await branchName(process.cwd());
    const bParent = await branchParent(process.cwd());

    const variant =
        bName.toLowerCase() === "release" || bParent.toLowerCase() === "release"
            ? "qa"
            : bName.toLowerCase() === "master" ||
              bParent.toLowerCase() === "master"
            ? "prod"
            : "dev";

    switch (proj) {
        case "mobile":
            return `
                cross-env \ 
                URL_M=${LOCAL_URL(M_PORT)} \
                URL_D=${LOCAL_URL(D_PORT)} \
                BASE_API=${baseApi} \
                concurrently --raw --kill-others --handle-input --passthrough-arguments --names client,d,m 'cd client && react-native webpack-start --port ${DEFAULT_PORT} --host=0.0.0.0' \
                'cd apps/d && react-native webpack-start --port ${D_PORT} --host=0.0.0.0' \
                'cd apps/m && react-native webpack-start --port ${M_PORT} --host=0.0.0.0' 
                `;

        case "@mobile/d":
            return `
                cross-env \ 
                URL_M=${LOCAL_URL(M_PORT)} \
                URL_D=${LOCAL_URL(D_PORT)} \
                BASE_API=${baseApi} \
                concurrently --raw --kill-others --handle-input --passthrough-arguments --names client,d 'cd ${clientDirPath} && react-native webpack-start --port ${DEFAULT_PORT}  --host=0.0.0.0' \
                'react-native webpack-start --port ${D_PORT} --host=0.0.0.0'  
                `;

        case "@mobile/m":
            return `
                cross-env \ 
                URL_M=${LOCAL_URL(M_PORT)} \
                URL_D=${LOCAL_URL(D_PORT)} \
                BASE_API=${baseApi} \
                concurrently --raw --kill-others --handle-input --passthrough-arguments --names client,m 'cd ${clientDirPath} && react-native webpack-start --port ${DEFAULT_PORT}  --host=0.0.0.0' \
                'react-native webpack-start --port ${M_PORT} --host=0.0.0.0'  
                `;

        default:
            return "";
    }
};

module.exports = {
    DEFAULT_PORT,
    D_PORT,
    M_PORT,
    HOST_PORT,
    PRODUCT_PORT,
    calculateStartScript,
};
