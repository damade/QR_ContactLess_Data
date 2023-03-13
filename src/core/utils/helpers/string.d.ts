interface String {
    trimToSentenceCase(): string;
    getValueOrUndefined(): any;
    isEmptyOrNull(): boolean;
    isNotEmptyOrNull(): boolean;
    getValueOrDefaultString(): string;
}