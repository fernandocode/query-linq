import { TestUtils } from "./test.utils";
import { expect } from "chai";
import { Query } from "../linq/query";
import { Order } from "../linq/types";

describe("Test", () => {
    const sizeListTest = 30;
    const queryTest = new Query(TestUtils.getList(sizeListTest));
    it("query", () => {
        expect(queryTest.toList().length).to.equal(sizeListTest);
    });
    it("count", () => {
        expect(queryTest.count()).to.equal(sizeListTest);
    });
    it("count where", () => {
        expect(queryTest.count(x => x.id < 10)).to.equal(10);
    });
    it("limit", () => {
        expect(queryTest.limit(2).count()).to.equal(2);
    });
    it("limit offset", () => {
        expect(queryTest.limit(1, 5).firstOrDefault().id).to.equal(5);
    });
    it("group by", () => {
        expect(
            queryTest.groupBy(x => x.disabled)
                .select(x => new Query(x.group).select(x => x.id).toList())
                .toList().toString()
        ).to.equal([
            [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28], // pares
            [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29] // impares
        ].toString());
    });
    it("group by min", () => {
        expect(
            queryTest.groupBy(x => x.disabled)
                .select(x => new Query(x.group).min(x => x.id))
                .toList().toString()
        ).to.equal([
            0, 1
        ].toString());
    });
    it("group by max", () => {
        expect(
            queryTest.groupBy(x => x.disabled)
                .select(x => new Query(x.group).max(x => x.id))
                .toList().toString()
        ).to.equal([
            sizeListTest - 2, sizeListTest - 1
        ].toString());
    });
    it("min", () => {
        expect(
            queryTest.min(x => x.id)
        ).to.equal(0);
    });
    it("max", () => {
        expect(
            queryTest.max(x => x.id)
        ).to.equal(sizeListTest - 1);
    });
    it("where", () => {
        expect(
            queryTest.where(x => x.id > 20).count()
        ).to.equal(sizeListTest - 21);
    });
    it("where equals", () => {
        expect(
            queryTest.where(x => x.id === 20).firstOrDefault().id
        ).to.equal(20);
    });
    it("order", () => {
        expect(
            queryTest
                .where(x => x.id % 2 === 1 /* impar */)
                .order(x => x.description, Order.ASC)
                .select(x => x.description)
                .toList().toString()
        ).to.equal([
            "Test 1",
            "Test 11",
            "Test 13",
            "Test 15",
            "Test 17",
            "Test 19",
            "Test 21",
            "Test 23",
            "Test 25",
            "Test 27",
            "Test 29",
            "Test 3",
            "Test 5",
            "Test 7",
            "Test 9",
        ].toString());
    });
    it("asc", () => {
        expect(
            queryTest
                .where(x => x.id % 2 === 1 /* impar */)
                .asc(x => x.id)
                .select(x => x.description)
                .toList().toString()
        ).to.equal([
            "Test 1",
            "Test 3",
            "Test 5",
            "Test 7",
            "Test 9",
            "Test 11",
            "Test 13",
            "Test 15",
            "Test 17",
            "Test 19",
            "Test 21",
            "Test 23",
            "Test 25",
            "Test 27",
            "Test 29",
        ].toString());
    });
    it("desc", () => {
        expect(
            queryTest
                .where(x => x.id % 2 === 1 /* impar */)
                .desc(x => x.description)
                .select(x => x.description)
                .toList().toString()
        ).to.equal([
            "Test 1",
            "Test 11",
            "Test 13",
            "Test 15",
            "Test 17",
            "Test 19",
            "Test 21",
            "Test 23",
            "Test 25",
            "Test 27",
            "Test 29",
            "Test 3",
            "Test 5",
            "Test 7",
            "Test 9",
        ].reverse().toString());
    });
    it("select", () => {
        expect(
            queryTest
                .select(x => {
                    return { a: x.description };
                })
                .where(x => x.a.endsWith("2"))
                .select(x => x.a)
                .toList().toString()
        ).to.equal([
            "Test 2",
            "Test 12",
            "Test 22",
        ].toString());
    });
});
