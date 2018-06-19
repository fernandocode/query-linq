import { TestClazz, TestClazzRef } from "./models";

export class TestUtils {
    public static getList(count: number): TestClazz[] {
        const result: TestClazz[] = [];
        for (let i = 0; i < count; i++) {
            result.push({
                id: i,
                date: new Date(2000 + i, 0, 1),
                random: this.getRandomInt(1, 100),
                description: `Test ${i}`,
                disabled: i % 2 === 1,
                referenceTest: new TestClazzRef()
            });
        }
        return result;
    }

    public static print(value: any, title: string = ""): any {
        // tslint:disable-next-line:no-console
        console.log(value, title);
        return value;
    }

    private static getRandomInt(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
