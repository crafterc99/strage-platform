const BASE_URL = import.meta.env.VITE_API_URL || ''

interface RequestOptions extends RequestInit {
  params?: Record<string, string>
}

class ApiClient {
  private getToken: (() => Promise<string | null>) | null = null

  setTokenGetter(fn: () => Promise<string | null>) {
    this.getToken = fn
  }

  private async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { params, ...init } = options
    let url = `${BASE_URL}${path}`

    if (params) {
      const searchParams = new URLSearchParams(params)
      url += `?${searchParams.toString()}`
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(init.headers as Record<string, string>),
    }

    if (this.getToken) {
      const token = await this.getToken()
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    }

    const res = await fetch(url, { ...init, headers })

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Request failed' }))
      throw new Error(error.error || `HTTP ${res.status}`)
    }

    return res.json()
  }

  get<T>(path: string, options?: RequestOptions) {
    return this.request<T>(path, { ...options, method: 'GET' })
  }

  post<T>(path: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>(path, { ...options, method: 'POST', body: JSON.stringify(body) })
  }

  patch<T>(path: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>(path, { ...options, method: 'PATCH', body: JSON.stringify(body) })
  }

  delete<T>(path: string, options?: RequestOptions) {
    return this.request<T>(path, { ...options, method: 'DELETE' })
  }
}

export const api = new ApiClient()
