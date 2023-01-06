export type ReferralInfo = {
    referralCode: String,
    referralLink: String,
}

export type EachReferralBonusInfo = {
    isVestable: Boolean,
    refereeFullName: String
}

export type ReferralBonusInfo = {
    referralId?: number[]
    referralBonusInfo?: EachReferralBonusInfo[],
    earnableBonusAmount?: number
}

export type EarnedReferralBonusInfo = {
    referralBonusInfo?: EachReferralBonusInfo[],
    earnedBonusAmount?: number
}