import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { MembershipsModule } from "./memberships/memberships.module";
import { SalonsModule } from "./salons/salons.module";
import { ChairsModule } from "./chairs/chairs.module";
import { QueueModule } from "./queue/queue.module";
import { SubscriptionsModule } from "./subscriptions/subscriptions.module";
import { AdminModule } from "./admin/admin.module";
import { RealtimeModule } from "./realtime/realtime.module";
import { IntegrationsModule } from "./integrations/integrations.module";

@Module({
  imports: [
    AuthModule,
    MembershipsModule,
    SalonsModule,
    ChairsModule,
    QueueModule,
    SubscriptionsModule,
    AdminModule,
    RealtimeModule,
    IntegrationsModule,
  ],
})
export class AppModule {}
