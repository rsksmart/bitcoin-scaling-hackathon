import { Controller, Inject } from "@tsed/di";
import { Post, Returns, Tags } from "@tsed/schema";
import { Exception } from "@tsed/exceptions";
import { Authenticate } from "@tsed/passport";
import { MulterOptions, MultipartFile, PlatformMulterFile, Req } from "@tsed/common";
import { UploaderService } from "../../../app-services/uploader/uploader.service";

@Controller("/uploader")
@Tags('Uploader')
export class UploaderController {

    @Inject(UploaderService)
    protected service: UploaderService;

    @Post("/image")
    @Authenticate("jwt-passport")
    @MulterOptions({ limits: { fileSize: 10000000 } })
    @Returns(200, String)
    async uploadFile(@MultipartFile("image") image: PlatformMulterFile): Promise<string> {
        try {
            return await this.service.uploadImage(image);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }
}