import { createLogger } from "./index"

const log = createLogger({ logFrom: "1" })

log.info("test3")
log.info("test2")
log.info("test1")