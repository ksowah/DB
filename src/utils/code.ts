import lodash from "lodash";
import { model } from "mongoose";



const codeTemplates = {

    User: lodash.template("001"),
    Project: lodash.template("001"),
}

type CodeTemplates = typeof codeTemplates
type CodeModel = keyof CodeTemplates


export const incrementCode = (code: string): string => {
    const tempCodes = lodash.times(code.length, (i) =>
    code.toUpperCase().charCodeAt(i),
    );
    for (let i = tempCodes.length - 1; i >= 0; i--) {
        const tempCode = tempCodes[i];
        if (tempCode < 48 || (tempCode > 57 && tempCode < 65) || tempCode > 90) {
            continue;
        } else if (tempCode + 1 === 58) {
            tempCodes[i] = 48;
        } else if (tempCode + 1 === 91) {
            tempCodes[i] = 65;
        } else {
            tempCodes[i] += 1;
            break;
        }
    }
    // eslint-disable-next-line id-blacklist
    return String.fromCharCode(...tempCodes);
};

export const generateCode = async (
    codeModel: CodeModel,
    codeFilter: object = {},
    codeData: object = {},
    codeField = "code",
    options: Record<string, any> = {},
): Promise<string> =>
    new Promise(async (resolve, reject) => {
        await model(codeModel)
            .findOne({ ...codeFilter })
            .sort({ [codeField]: -1 })
            .lean()
            .session(options?.session)
            .then((_doc) => {
                const code: string = _doc
                    ? incrementCode((_doc as any)[codeField])
                    : codeTemplates[codeModel](codeData);
                resolve(code);
            })
            .catch(reject);
    });