export enum TokenStatusEnum {
    UNKNOWN = 'UNKNOWN',
    VALID = 'VALID',
    EXPIRED = 'EXPIRED',
}

export class TokenStatus {
    readonly #status: TokenStatusEnum;
    #isHttpOnly: boolean;

    constructor(token: string | boolean, tokenExpiresAt: number | false, httpOnly: boolean = false) {
        this.#status = this.#calculate(token, tokenExpiresAt);
        this.#isHttpOnly = httpOnly
    }

    unknown(): boolean {
        return TokenStatusEnum.UNKNOWN === this.#status;
    }

    valid(): boolean {
        return TokenStatusEnum.VALID === this.#status;
    }

    expired(): boolean {
        return TokenStatusEnum.EXPIRED === this.#status;
    }

    #calculate(token: string | boolean, tokenExpiresAt: number | false): TokenStatusEnum {
        const now = Date.now();

        try {
            if ((this.#isHttpOnly && !tokenExpiresAt) || (!this.#isHttpOnly && !token || !tokenExpiresAt)) {
                return TokenStatusEnum.UNKNOWN;
            }
        } catch (error) {
            return TokenStatusEnum.UNKNOWN;
        }

        // Give us some slack to help the token from expiring between validation and usage
        const timeSlackMillis = 60000; // 60 seconds
        tokenExpiresAt -= timeSlackMillis;

        // Token is still valid
        if (now < tokenExpiresAt) {
            return TokenStatusEnum.VALID;
        }

        return TokenStatusEnum.EXPIRED;
    }
}
