import { PaginationResult } from "../interfaces/pagination-result.interface"

export class PaginatedResponseDto<Entity> {
    limit: number
    page: number
    totalPages: number
    result: Entity[]
    previous: string | null
    next: string | null
    
    constructor(data: PaginationResult<Entity>, baseUrl: string, page: number, limit: number) {
        
        this.limit = limit
        this.result = data[0]
        this.page = page
        this.totalPages = Math.ceil(data[1]/limit)
        this.previous = page > 1 ? `${baseUrl}?page=${page - 1}` : null
        this.next = page < this.totalPages ? `${baseUrl}?page=${page + 1}` : null
    }
}