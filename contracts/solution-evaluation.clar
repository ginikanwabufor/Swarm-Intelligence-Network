;; Solution Evaluation Contract

(define-data-var solution-count uint u0)

(define-map solutions
  uint
  {
    problem-id: uint,
    solver: principal,
    solution-data: (buff 1024),
    score: uint,
    timestamp: uint
  }
)

(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_NOT_AUTHORIZED (err u403))
(define-constant ERR_INVALID_SOLUTION (err u404))

(define-public (submit-solution (problem-id uint) (solution-data (buff 1024)))
  (let
    (
      (solution-id (+ (var-get solution-count) u1))
    )
    (map-set solutions
      solution-id
      {
        problem-id: problem-id,
        solver: tx-sender,
        solution-data: solution-data,
        score: u0,
        timestamp: block-height
      }
    )
    (var-set solution-count solution-id)
    (ok solution-id)
  )
)

(define-public (evaluate-solution (solution-id uint) (score uint))
  (let
    (
      (solution (unwrap! (map-get? solutions solution-id) ERR_INVALID_SOLUTION))
      (problem (unwrap! (contract-call? .problem-definition get-problem (get problem-id solution)) ERR_INVALID_SOLUTION))
    )
    (asserts! (is-eq tx-sender (get creator problem)) ERR_NOT_AUTHORIZED)
    (ok (map-set solutions
      solution-id
      (merge solution { score: score })
    ))
  )
)

(define-read-only (get-solution (solution-id uint))
  (map-get? solutions solution-id)
)

(define-read-only (get-solution-count)
  (var-get solution-count)
)

