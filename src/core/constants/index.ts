export const DEVELOPMENT = 'development';
export const TEST = 'test';
export const PRODUCTION = 'production';
export const APIKEY_CRON_JOB = 'apikey';
export enum ROLE {
    LIVE_USER,
    TEST_USER,
    SYS_ADMIN,
    FINANCE_ADMIN,
    IT_ADMIN,
    CC_ADMIN,
    BT_ADMIN,
}

export enum Tenure{
    MONTH1 = 'ONE MONTH',
    MONTH3 = 'THREE MONTHS',
    MONTH6 = 'SIX MONTHS',
    MONTH9 = 'NINE MONTHS',
    YEAR1 = 'ONE YEAR',
    NONE = 'NONE',
    CUSTOM = 'CUSTOM'
}

export enum Gender {
    Male,
    Female,
}

export enum Title {
    Mr,
    Miss,
    Mrs,
    Prof
}
export enum MARITAL_STATUS{
    Single,
    Married,
    Divorce
}

export enum EMPLOYMENT_STATUS {
    Selfemployed,
    Employed,
    Unemployed
}

export enum IDENTIFICATION_TYPE {
    NIN = 'NIN',
    DRIVERSLICENSE = 'Drivers License',
    VOTERSCARD = 'Voters Card',
    INTERNATIONALPASSPORT = 'International Passport',
    OTHERS = "Others"
}

export enum REFERRAL_SURVEY{
    Friend,  
    Twitter,
    WhatsApp,
    Instagram,
    Facebook,
    Others,
    Family,
    None,
    Google,
    Linkedln
}

export enum STATE{
    Abia, Adamawa, Abuja, AkwaIbom, Anambra, Bauchi, Bayelsa, Benue, Borno, CrossRiver,
    Delta, Ebonyi, Edo, Ekiti, Enugu, Gombe, Imo, Jigawa, Kaduna, Kano, Katsina, Kebbi, Kogi,
    Kwara, Lagos, Nasarawa, Niger, Ogun, Ondo, Osun, Oyo, Plateau, Rivers, Sokoto, Taraba, Yobe,
    Zamfara
}