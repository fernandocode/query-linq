export class TestClazz {
    public id: number = 0;
    public description: string = "";
    public referenceTest: TestClazzRef = new TestClazzRef();
    public disabled: boolean = false;
    public date: Date = new Date();
    public random: number = 0;
}

// tslint:disable-next-line:max-classes-per-file
export class TestClazzRef {
    public id: number = 0;
    public description: string = "";
}
