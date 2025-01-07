;; Problem Definition Contract

(define-data-var problem-count uint u0)

(define-map problems
  uint
  {
    creator: principal,
    description: (string-utf8 1000),
    parameters: (list 20 (string-utf8 100)),
    evaluation-criteria: (string-utf8 1000),
    status: (string-ascii 20),
    best-solution: (optional uint)
  }
)

(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_NOT_AUTHORIZED (err u403))
(define-constant ERR_INVALID_PROBLEM (err u404))

(define-public (create-problem (description (string-utf8 1000)) (parameters (list 20 (string-utf8 100))) (evaluation-criteria (string-utf8 1000)))
  (let
    (
      (problem-id (+ (var-get problem-count) u1))
    )
    (map-set problems
      problem-id
      {
        creator: tx-sender,
        description: description,
        parameters: parameters,
        evaluation-criteria: evaluation-criteria,
        status: "open",
        best-solution: none
      }
    )
    (var-set problem-count problem-id)
    (ok problem-id)
  )
)

(define-public (update-problem-status (problem-id uint) (new-status (string-ascii 20)))
  (let
    (
      (problem (unwrap! (map-get? problems problem-id) ERR_INVALID_PROBLEM))
    )
    (asserts! (is-eq tx-sender (get creator problem)) ERR_NOT_AUTHORIZED)
    (ok (map-set problems
      problem-id
      (merge problem { status: new-status })
    ))
  )
)

(define-public (set-best-solution (problem-id uint) (solution-id uint))
  (let
    (
      (problem (unwrap! (map-get? problems problem-id) ERR_INVALID_PROBLEM))
    )
    (asserts! (is-eq tx-sender (get creator problem)) ERR_NOT_AUTHORIZED)
    (ok (map-set problems
      problem-id
      (merge problem { best-solution: (some solution-id) })
    ))
  )
)

(define-read-only (get-problem (problem-id uint))
  (map-get? problems problem-id)
)

(define-read-only (get-problem-count)
  (var-get problem-count)
)

