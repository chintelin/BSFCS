'use strict';

const DEBUG_MODE = true;

function PromisePayloadToObject(buf, inform = " ") {
    let obj = "";
    if (DEBUG_MODE) {
        try {
            const payload = JSON.parse(JSON.stringify(buf.payload));
            const str_payload = String.fromCharCode.apply(null, payload.data);
            obj = JSON.parse(str_payload);
        }
        catch (error) {
            console.error(`${inform}: Failed to parse JSON from Promise Payload: ${error}`);
        }
    }
    else {
        const payload = JSON.parse(JSON.stringify(buf.payload));
        const str_payload = String.fromCharCode.apply(null, payload.data);
        obj = JSON.parse(str_payload);
    }
    return obj;
}
function BufferToObject(buf, inform = " ") {
    let obj = "";
    if (DEBUG_MODE) {
        try {
            obj = JSON.parse(Buffer.from(buf).toString());
        }
        catch (error) {
            console.error(`${inform}: Failed to parse JSON from Buffer: ${error}`);
        }
    }
    else {
        obj = JSON.parse(Buffer.from(buf).toString());
    }
    return obj;
}
module.exports = {
    PromisePayloadToObject,
    BufferToObject
};