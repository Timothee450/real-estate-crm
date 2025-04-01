import { NextRequest } from 'next/server'

export type RouteContext = {
  params: {
    id: string
  }
}

export type RouteHandler = (
  request: NextRequest,
  context: RouteContext
) => Promise<Response> 