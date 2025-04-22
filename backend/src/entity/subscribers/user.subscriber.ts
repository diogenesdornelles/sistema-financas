import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from "typeorm";
import { User } from "../entities";

// Se precisar de acesso ao DB, use subscriber: https://typeorm.io/listeners-and-subscribers#what-is-a-subscriber
@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  /**
   * Indicates that this subscriber only listen to User events.
   */
  listenTo() {
    return User;
  }

  /**
   * Called before post insertion.
   */
  beforeInsert(event: InsertEvent<User>) {
    console.log(`BEFORE USER INSERTED: `, event.entity);
  }

  afterInsert(event: InsertEvent<User>): Promise<any> | void {
    console.log(`AFTER USER INSERTED: `, event.entity);
  }
}
