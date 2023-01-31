import { EntityManager } from "typeorm"
import {
  AbstractEventBusModuleService,
  IEventBusService,
  Subscriber,
  SubscriberContext,
} from "../interfaces"
import { StagedJob } from "../models"
import { ConfigModule } from "../types/global"
import { sleep } from "../utils/sleep"
import StagedJobService from "./staged-job"

type InjectedDependencies = {
  manager: EntityManager
  stagedJobService: StagedJobService
  eventBusModuleService: AbstractEventBusModuleService
}

export default class EventBusService implements IEventBusService {
  protected readonly config_: ConfigModule
  protected readonly stagedJobService_: StagedJobService
  protected readonly eventBusModuleService_: AbstractEventBusModuleService

  protected shouldEnqueuerRun: boolean
  protected enqueue_: Promise<void>

  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined

  constructor(
    { manager, stagedJobService, eventBusModuleService }: InjectedDependencies,
    config,
    isSingleton = true
  ) {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)

    this.config_ = config
    this.manager_ = manager
    this.eventBusModuleService_ = eventBusModuleService
    this.stagedJobService_ = stagedJobService

    if (process.env.NODE_ENV !== "test" && isSingleton) {
      this.startEnqueuer()
    }
  }

  withTransaction(transactionManager?: EntityManager): this {
    if (!transactionManager) {
      return this
    }

    const cloned = new (this.constructor as any)(
      {
        manager: transactionManager,
        stagedJobService: this.stagedJobService_,
        eventBusModuleService: this.eventBusModuleService_,
      },
      this.config_,
      false
    )

    cloned.manager_ = transactionManager
    cloned.transactionManager_ = transactionManager

    return cloned
  }

  /**
   * Adds a function to a list of event subscribers.
   * @param event - the event that the subscriber will listen for.
   * @param subscriber - the function to be called when a certain event
   * happens. Subscribers must return a Promise.
   * @param context - subscriber context
   * @return this
   */
  public subscribe(
    event: string | symbol,
    subscriber: Subscriber,
    context?: SubscriberContext
  ): this {
    if (typeof subscriber !== "function") {
      throw new Error("Subscriber must be a function")
    }

    this.eventBusModuleService_.subscribe(event, subscriber, context)
    return this
  }

  /**
   * Removes function from the list of event subscribers.
   * @param event - the event of the subcriber.
   * @param subscriber - the function to be removed
   * @param context - subscriber context
   * @return this
   */
  unsubscribe(
    event: string | symbol,
    subscriber: Subscriber,
    context: SubscriberContext
  ): this {
    this.eventBusModuleService_.unsubscribe(event, subscriber, context)
    return this
  }

  /**
   * Calls all subscribers when an event occurs.
   * @param {string} eventName - the name of the event to be process.
   * @param data - the data to send to the subscriber.
   * @param options - options to add the job with
   * @return the job from our queue
   */
  async emit<T>(
    eventName: string,
    data: T,
    options?: Record<string, unknown>
  ): Promise<StagedJob | void> {
    const manager = this.transactionManager_ ?? this.manager_
    /**
     * We always store events in the database.
     *
     * If we are in a long-running transaction, the ACID properties of a
     * transaction ensure, that events are kept invisible to the enqueuer
     * until the trasaction has commited.
     *
     * This patterns also gives us at-least-once delivery of events, as events
     * are only removed from the database, if they are successfully delivered.
     *
     * In case of a failing transaction, jobs stored in the database are removed
     * as part of the rollback.
     */

    if (this.transactionManager_) {
      const jobToCreate = {
        event_name: eventName,
        data: data as unknown as Record<string, unknown>,
        options,
      } as Partial<StagedJob>

      return await this.stagedJobService_
        .withTransaction(manager)
        .create(jobToCreate)
    }

    await this.eventBusModuleService_.emit(eventName, data, options)
  }

  startEnqueuer(): void {
    this.shouldEnqueuerRun = true
    this.enqueue_ = this.enqueuer_()
  }

  async stopEnqueuer(): Promise<void> {
    this.shouldEnqueuerRun = false
    await this.enqueue_
  }

  async enqueuer_(): Promise<void> {
    const listConfig = {
      relations: [],
      skip: 0,
      take: 1000,
    }

    while (this.shouldEnqueuerRun) {
      const jobs = await this.stagedJobService_.list(listConfig)

      await Promise.all(
        jobs.map(async (job) => {
          return await this.eventBusModuleService_
            .emit(job.event_name, job.data, job.options)
            .then(async () => await this.stagedJobService_.remove(job))
        })
      )

      await sleep(3000)
    }
  }
}
