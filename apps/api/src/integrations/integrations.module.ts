import { Module, Global } from "@nestjs/common";
import { RazorpayService } from "./razorpay.service";
import { R2StorageService } from "./r2-storage.service";

@Global()
@Module({
  providers: [RazorpayService, R2StorageService],
  exports: [RazorpayService, R2StorageService],
})
export class IntegrationsModule {}

