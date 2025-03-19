import { model, Types } from "mongoose";

type Search = {
    search?: string;
    searchFields?: string[];
};

type Pagination = {
    page?: number;
    pageSize?: number;
};

export function generateFilter(args: Record<string, any>): Record<string, any> {
    const filter: Record<string, any> = {};
    for (const key in args) {
        if (args[key] !== undefined && args[key] !== null) {
            filter[key] = args[key];
        }
    }
    return filter;
}

export function generateSearch(args: Search): Record<string, any> {
    const { search, searchFields } = args;

    if (!search || !searchFields || searchFields.length === 0) {
        return {};
    }

    return {
        $or: searchFields.map((field) => ({
            [field]: { $regex: search, $options: "i" },
        })),
    };
}

export function generatePagination(args: Pagination): { skip: number; limit: number } {
    const { page = 1, pageSize = 12 } = args;
    const validatedPage = Math.max(1, page);
    const validatedPageSize = Math.max(1, pageSize);
    return { skip: (validatedPage - 1) * validatedPageSize, limit: validatedPageSize };
}

export function generateSort(sort?: string): Record<string, 1 | -1> {
    if (!sort) return {};
    const isDescending = sort.startsWith("-");
    const field = isDescending ? sort.slice(1) : sort;
    return { [field]: isDescending ? -1 : 1 };
}

export async function runFindQuery(
    modelName: string,
    args: {
        filter?: Record<string, any>;
        search?: Search;
        pagination?: Pagination;
        sort?: string;
    },
    extraFilters?: Record<string, any>
) {
    const filter = generateFilter(args.filter || {});
    const search = generateSearch(args.search || {});
    const { skip, limit } = generatePagination(args.pagination || {});
    const sortOptions = generateSort(args.sort);
    
    const query = { ...filter, ...search, ...(extraFilters || {}) };
    
    const results = await model(modelName).find(query).sort(sortOptions).skip(skip).limit(limit).lean();
    return results;
}

export async function runCountQuery(
    modelName: string,
    args: {
        filter?: any;
        search?: { search?: string; searchFields?: string[] };
    },
    extraFilters?: Record<string, any>
): Promise<number> {
    const filter = generateFilter(args.filter || {});
    const search = generateSearch(args.search || {});
    const query = { ...filter, ...search, ...(extraFilters || {}) };
    return await model(modelName).countDocuments(query);
}

export const runGetId = async (modelName: string, id: string) => {
    if (!id) return null;
    return await model(modelName).findById(id).lean();
};
