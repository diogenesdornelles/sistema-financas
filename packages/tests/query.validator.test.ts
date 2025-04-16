import { queryTxSchema } from '../validators/zod-schemas/query/query-tx.validator'
import { TransactionSearchType } from '../dtos/utils/enums';

describe("queryTxSchema Tests", () => {
    it("should pass validation with an empty object", () => {
        expect(queryTxSchema.safeParse({}).success).toBe(true);
    });

    it("should pass validation with valid optional fields", () => {
        const validData = {
            id: "some-uuid",
            value: "100.50",
            status: true,
            obs: "Alguma observação",
            description: "Descrição da transação",
            cf: "cf-uuid",
            cp: "cp-uuid",
            cr: "cr-uuid",
            category: "category-uuid",
            type: TransactionSearchType.ENTRY,
            tdate: "2025-04-16",
            createdAt: "2025-04-15T10:00:00.000Z",
            updatedAt: "2025-04-16T09:00:00.000Z",
        };
        expect(queryTxSchema.safeParse(validData).success).toBe(true);
    });

    it("should pass validation with a subset of valid optional fields", () => {
        const partialData = {
            description: "Descrição parcial",
            type: TransactionSearchType.OUTFLOW,
            tdate: "2025-04-10",
        };
        expect(queryTxSchema.safeParse(partialData).success).toBe(true);
    });

    describe("status field", () => {
        it("should coerce string 'true' to boolean true", () => {
            const result = queryTxSchema.safeParse({ status: "true" });
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.status).toBe(true);
            }
        });

        it("should false to boolean false", () => {
            const result = queryTxSchema.safeParse({ status: false });
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.status).toBe(false);
            }
        });

        it("should coerce string '' to boolean false", () => {
            const result = queryTxSchema.safeParse({ status: "" });
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.status).toBe(false);
            }
        });

        it("should coerce number 1 to boolean true", () => {
            const result = queryTxSchema.safeParse({ status: 1 });
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.status).toBe(true);
            }
        });

        it("should coerce number 0 to boolean false", () => {
            const result = queryTxSchema.safeParse({ status: 0 });
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.status).toBe(false);
            }
        });

        it("should pass validation with boolean true", () => {
            expect(queryTxSchema.safeParse({ status: true }).success).toBe(true);
        });

        it("should pass validation with boolean false", () => {
            expect(queryTxSchema.safeParse({ status: false }).success).toBe(true);
        });
    });

    describe("type field", () => {
        it("should pass validation with a valid TransactionSearchType", () => {
            expect(queryTxSchema.safeParse({ type: TransactionSearchType.BOTH }).success).toBe(true);
            expect(queryTxSchema.safeParse({ type: "entry" }).success).toBe(true);
            expect(queryTxSchema.safeParse({ type: "outflow" }).success).toBe(true);
            expect(queryTxSchema.safeParse({ type: "entryoutflow" }).success).toBe(true);
        });

        it("should fail validation with an invalid TransactionSearchType", () => {
            expect(queryTxSchema.safeParse({ type: "invalid-type" }).success).toBe(false);
        });
    });

    describe("date fields (tdate, createdAt, updatedAt)", () => {
        it("should pass validation with a valid date string for tdate", () => {
            expect(queryTxSchema.safeParse({ tdate: "2025-04-17" }).success).toBe(true);
        });

        it("should pass validation with a valid date string for createdAt", () => {
            expect(queryTxSchema.safeParse({ createdAt: "2025-04-18T11:00:00Z" }).success).toBe(true);
        });

        it("should pass validation with a valid date string for updatedAt", () => {
            expect(queryTxSchema.safeParse({ updatedAt: "2025-04-19 12:30:00" }).success).toBe(true);
        });

        it("should pass validation with an empty string for tdate (should be undefined)", () => {
            const result = queryTxSchema.safeParse({ tdate: "" });
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.tdate).toBeUndefined();
            }
        });

        it("should pass validation with an empty string for createdAt (should be undefined)", () => {
            const result = queryTxSchema.safeParse({ createdAt: "" });
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.createdAt).toBeUndefined();
            }
        });

        it("should pass validation with an empty string for updatedAt (should be undefined)", () => {
            const result = queryTxSchema.safeParse({ updatedAt: "" });
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.updatedAt).toBeUndefined();
            }
        });

        it("should fail validation with an invalid date string for tdate", () => {
            expect(queryTxSchema.safeParse({ tdate: "not-a-date" }).success).toBe(false);
        });

        it("should fail validation with an invalid date string for createdAt", () => {
            expect(queryTxSchema.safeParse({ createdAt: "wrong-date-format" }).success).toBe(false);
        });

        it("should fail validation with an invalid date string for updatedAt", () => {
            expect(queryTxSchema.safeParse({ updatedAt: "oops-not-a-date" }).success).toBe(false);
        });

        it("should return the correct error message for invalid tdate", () => {
            const result = queryTxSchema.safeParse({ tdate: "invalid" });
            if (!result.success) {
                expect(result.error.issues[0].message).toBe("Data inválida");
            }
        });

        it("should return the correct error message for invalid createdAt", () => {
            const result = queryTxSchema.safeParse({ createdAt: "bad-date" });
            if (!result.success) {
                expect(result.error.issues[0].message).toBe("Data inválida");
            }
        });

        it("should return the correct error message for invalid updatedAt", () => {
            const result = queryTxSchema.safeParse({ updatedAt: "not-valid" });
            if (!result.success) {
                expect(result.error.issues[0].message).toBe("Data inválida");
            }
        });
    });

    it("should pass validation when only description is provided (as it's not optional due to .partial())", () => {
        expect(queryTxSchema.safeParse({ description: "Only description" }).success).toBe(true);
    });
});