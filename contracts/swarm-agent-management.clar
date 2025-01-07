;; Swarm Agent Management Contract

(define-data-var agent-count uint u0)

(define-map agents
  uint
  {
    owner: principal,
    configuration: (buff 256),
    performance: uint,
    last-update: uint
  }
)

(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_NOT_AUTHORIZED (err u403))
(define-constant ERR_INVALID_AGENT (err u404))

(define-public (create-agent (configuration (buff 256)))
  (let
    (
      (agent-id (+ (var-get agent-count) u1))
    )
    (map-set agents
      agent-id
      {
        owner: tx-sender,
        configuration: configuration,
        performance: u0,
        last-update: block-height
      }
    )
    (var-set agent-count agent-id)
    (ok agent-id)
  )
)

(define-public (update-agent (agent-id uint) (new-configuration (buff 256)) (performance uint))
  (let
    (
      (agent (unwrap! (map-get? agents agent-id) ERR_INVALID_AGENT))
    )
    (asserts! (is-eq tx-sender (get owner agent)) ERR_NOT_AUTHORIZED)
    (ok (map-set agents
      agent-id
      (merge agent
        {
          configuration: new-configuration,
          performance: performance,
          last-update: block-height
        }
      )
    ))
  )
)

(define-read-only (get-agent (agent-id uint))
  (map-get? agents agent-id)
)

(define-read-only (get-agent-count)
  (var-get agent-count)
)

