'use server'
// Expose Auth.js handlers for the OAuth flow
import { handlers } from '../../../../../auth'

export const { GET, POST } = handlers

