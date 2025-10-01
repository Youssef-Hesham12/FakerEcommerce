import {
    AddToCartResponse,
    GetUserCartResponse,
} from "@/interfaces";
import {
    BrandsResponse,
    CategoriesResponse,
    ProductsResponse,
    SingleBrandResponse,
    SingleCategoryResponse,
    SingleProductResponse,
} from "@/types";

export interface RemoveItemResponse {
    status: string;
    message: string;
    data?: unknown;
}

export interface UpdateCartResponse {
    status: string;
    message: string;
    numOfCartItems?: number;
    data?: unknown;
}

export interface ClearCartResponse {
    status: string;
    message: string;
}

class ApiServices {
    #baseURL: string;

    // constructor() {
    //     this.#baseURL =
    //         // process.env.NEXT_PUBLIC_API_URL || "https://ecommerce.routemisr.com";
    //         this.#baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://ecommerce.routemisr.com";


    // }
    constructor() {
        this.#baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://ecommerce.routemisr.com";
    }

    // dynamic headers
    #getHeader(token?: string) {
        return {
            "Content-Type": "application/json",
            token: token || "",
        };
    }

    // --------- Auth ---------
    async login(email: string, password: string) {
        return await fetch(this.#baseURL + "/api/v1/auth/signin", {
            method: "POST",
            body: JSON.stringify({ email, password }),
            headers: { "Content-Type": "application/json" },
        }).then((res) => res.json());
    }

    async register(
        name: string,
        email: string,
        password: string,
        rePassword: string,
        phone: number
    ) {
        return await fetch(this.#baseURL + "/api/v1/auth/signup", {
            method: "POST",
            body: JSON.stringify({ name, email, password, rePassword, phone }),
            headers: { "Content-Type": "application/json" },
        }).then((res) => res.json());
    }

    async verifyToken(token: string) {
        return await fetch(this.#baseURL + "/api/v1/auth/verifyToken", {
            headers: this.#getHeader(token),
        }).then((res) => res.json());
    }

    async forgetPassword(email: string) {
        return await fetch(this.#baseURL + "/api/v1/auth/forgotPasswords", {
            method: "POST",
            body: JSON.stringify({ email }),
            headers: { "Content-Type": "application/json" },
        }).then((res) => res.json());
    }

    // --------- Products ---------
    async getAllProducts(): Promise<ProductsResponse> {
        return await fetch(this.#baseURL + "/api/v1/products", {
            next: { revalidate: 60 },
            cache: "no-cache",
        }).then((res) => res.json());
    }

    async getSingleProduct(id: string | string[]): Promise<SingleProductResponse> {
        return await fetch(this.#baseURL + `/api/v1/products/${id}`).then((res) =>
            res.json()
        );
    }

    // --------- Cart ---------
    async addProductToCart(
        id: string,
        token: string
    ): Promise<AddToCartResponse> {
        return await fetch(this.#baseURL + "/api/v1/cart", {
            method: "POST",
            body: JSON.stringify({ productId: id }),
            headers: this.#getHeader(token),
        }).then((res) => res.json());
    }

    async getUserCart(token: string): Promise<GetUserCartResponse> {
        return await fetch(this.#baseURL + "/api/v1/cart", {
            headers: this.#getHeader(token),
        }).then((res) => res.json());
    }

    async removeSpecificItem(
        id: string | string[],
        token: string
    ): Promise<RemoveItemResponse> {
        return await fetch(this.#baseURL + `/api/v1/cart/${id}`, {
            method: "DELETE",
            headers: this.#getHeader(token),
        }).then((res) => res.json());
    }

    async updateCartCount(
        id: string,
        count: number,
        token: string
    ): Promise<UpdateCartResponse> {
        return await fetch(this.#baseURL + `/api/v1/cart/${id}`, {
            method: "PUT",
            body: JSON.stringify({ count }),
            headers: this.#getHeader(token),
        }).then((res) => res.json());
    }

    async clearCart(token: string): Promise<ClearCartResponse> {
        return await fetch(this.#baseURL + `/api/v1/cart`, {
            method: "DELETE",
            headers: this.#getHeader(token),
        }).then((res) => res.json());
    }

    async checkout(
        cartId: string,
        token: string,
        city: string,
        phone: string,
        details: string
    ) {
        return await fetch(
            this.#baseURL +
            "/api/v1/orders/checkout-session/" +
            cartId +
            "?url=http://localhost:3000",
            {
                method: "POST",
                body: JSON.stringify({
                    shippingAddress: { details, phone, city },
                }),
                headers: this.#getHeader(token),
            }
        ).then((res) => res.json());
    }

    // --------- Brands & Categories ---------
    async getAllBrands(): Promise<BrandsResponse> {
        return await fetch(this.#baseURL + "/api/v1/brands").then((res) =>
            res.json()
        );
    }

    async getSpecificBrand(
        brandId: string | string[]
    ): Promise<SingleBrandResponse> {
        return await fetch(this.#baseURL + "/api/v1/brands/" + brandId).then(
            (res) => res.json()
        );
    }

    async getAllCategories(): Promise<CategoriesResponse> {
        return await fetch(this.#baseURL + "/api/v1/categories").then((res) =>
            res.json()
        );
    }

    async getSpecificCategory(
        catId: string | string[]
    ): Promise<SingleCategoryResponse> {
        return await fetch(this.#baseURL + "/api/v1/categories/" + catId).then(
            (res) => res.json()
        );
    }

    // --------- Wishlist ---------
    async addToWishList(productId: string, token: string) {
        return await fetch(this.#baseURL + "/api/v1/wishlist", {
            method: "POST",
            headers: this.#getHeader(token),
            body: JSON.stringify({ productId }),
        }).then((res) => res.json());
    }

    async getAllWishList(token: string) {
        return await fetch(this.#baseURL + "/api/v1/wishlist", {
            headers: this.#getHeader(token),
        }).then((res) => res.json());
    }

    async removeItemFormWishList(token: string, productId: string) {
        return await fetch(this.#baseURL + "/api/v1/wishlist/" + productId, {
            method: "DELETE",
            headers: this.#getHeader(token),
        }).then((res) => res.json());
    }

    // --------- Address ---------
    async addUserAddress(
        name: string,
        details: string,
        phone: string,
        city: string,
        token: string
    ) {
        return await fetch(this.#baseURL + "/api/v1/addresses", {
            method: "POST",
            body: JSON.stringify({ name, details, phone, city }),
            headers: this.#getHeader(token),
        }).then((res) => res.json());
    }

    // --------- Orders ---------
    async getUserOrder(id: string) {
        return await fetch(this.#baseURL + "/api/v1/orders/user/" + id, {
            headers: { "Content-Type": "application/json" },
        }).then((res) => res.json());
    }
}

export const apiServices = new ApiServices();
