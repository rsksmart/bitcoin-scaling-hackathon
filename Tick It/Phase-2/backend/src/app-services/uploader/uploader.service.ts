import { Service } from '@tsed/di';
import { PlatformMulterFile } from '@tsed/common';
import { randomUUID } from "crypto";
import * as fs from "fs";
import path from "path";
import { envs } from '../../config/envs';

@Service()
export class UploaderService {

    public async uploadImage(image: PlatformMulterFile): Promise<string> {
        let readFile = fs.readFileSync(image.path);
        let randUUID = randomUUID();
        let filePath = path.resolve(__dirname, `../../../public/content/${randUUID}` + path.extname(image.originalname));

        let returnPath = envs.PUBLIC_FOLDER + `/content/${randUUID}` + path.extname(image.originalname)
        fs.writeFileSync(filePath, Buffer.from(readFile));
        return returnPath;
    }

}