import { z } from 'zod'
import { AppError } from '../error/error.js'

export function validateBody(dto, body) {

    const result = z.safeParse(dto, body)
    if (!result.success) {
        const errors = result.error.issues.map(issue => `${issue.path[0]}: ${issue.message}`)

        throw new AppError(errors.join(', '), 400)
    }
    return result.data
}
