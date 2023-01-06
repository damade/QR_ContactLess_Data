export const isExpired = (date) =>{
    const now = new Date().getTime();
    const timeSent = Date.parse(date);

    //console.log(`Time Spent is ${timeSent - now} seconds`);
    
    if((timeSent - now) > 0){
        return false
    }
        return true;
    
}


export const monthDiff = (d1: Date, d2: Date): number => {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
}

export const addMonths = (date: Date, months: number): Date => {
    var d = date.getDate();
    date.setMonth(date.getMonth() + +months);
    if (date.getDate() != d) {
      date.setDate(0);
    }
    return date;
}