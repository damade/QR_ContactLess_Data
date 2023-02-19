
export const generateReferralCode = (firstLength, secondlength) => {
    let result = "", seeds

    for (let i = 0; i < firstLength; i++) {
        //Generate seeds array, that will be the bag from where randomly select generated char
        seeds = [
            Math.floor(Math.random() * 25) + 65
        ]

        //Chose randomly from seeds, convert to char and append to result
        result += String.fromCharCode(seeds[Math.floor(Math.random())])
    }

    for (let j = 0; j < secondlength; j++) {
        //Generate seeds array, that will be the bag from where randomly select generated char
        seeds = [
            Math.floor(Math.random() * 10) + 48
        ]

        //Chose randomly from seeds, convert to char and append to result
        result += String.fromCharCode(seeds[Math.floor(Math.random())])
    }

    return result
}

export const generateUniqueCode = (length) => {
    let result = "", seeds

    for (let i = 0; i < length - 1; i++) {
        //Generate seeds array, that will be the bag from where randomly select generated char
        seeds = [
            Math.floor(Math.random() * 10) + 48,
            Math.floor(Math.random() * 25) + 65,
            Math.floor(Math.random() * 25) + 97
        ]

        //Chose randomly from seeds, convert to char and append to result
        result += String.fromCharCode(seeds[Math.floor(Math.random() * 3)])
    }

    return result
}

export const generateUniqueBvn = () => {
    let result = "", seeds

    for (let i = 0; i < 11; i++) {
        //Generate seeds array, that will be the bag from where randomly select generated char
        seeds = [
            Math.floor(Math.random() * 10) + 48,
        ]

        //Chose randomly from seeds, convert to char and append to result
        result += String.fromCharCode(seeds[Math.floor(Math.random())])
    }

    return result
}

export const generateRandomString = (length) => {
    let result = "", seeds

    for (let i = 0; i < length - 1; i++) {
        //Generate seeds array, that will be the bag from where randomly select generated char
        seeds = [
            Math.floor(Math.random() * 10) + 48,
            Math.floor(Math.random() * 25) + 65,
            Math.floor(Math.random() * 25) + 97
        ]

        //Chose randomly from seeds, convert to char and append to result
        result += String.fromCharCode(seeds[Math.floor(Math.random() * 3)])
    }

    return result
}

export const getValueOrUndefined = (data, shouldOverride = false) =>{
    if(data){
        return data  ? data : undefined;
    }else if(shouldOverride){
        return null
    }else{
        return undefined
    }
    
}

export const getCloudinaryPublicId = (imageURL) => imageURL.split("/").pop().split(".")[0];

String.prototype.trimToSentenceCase = function () {
    const str = this.trim();
    const newStr: string = str.split(' ')
        .map(w => w[0].toUpperCase() + w.substring(1).toLowerCase())
        .join(' ');
    return newStr;
}

String.prototype.getValueOrUndefined = function (){
    if(this){
        return this ? this : undefined;
    }else{
        return undefined
    }
}

String.prototype.isEmptyOrNull = function (){
    return this === "" || this === " " || this == "" || this == " " || !this 
}

String.prototype.isNotEmptyOrNull = function (){
    return this !== "" && this !== " " && this != "" && this != " " && this 
}