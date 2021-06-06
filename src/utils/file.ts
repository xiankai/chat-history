type SourceFormat = string;

export const processFile = (file: File, format: SourceFormat) => {
    // read line by line using format
    // format should provide 4 fields at the least: timestamp, message, source, source_metadata
    // using this info, store in raw form first

};

const parseFile = (file: File, format: SourceFormat) => {

};

const addToIndex = (message: string) => {
    const tokens = tokenizeLine(message);

}

const tokenizeLine = (message: string) => {
    // return
};