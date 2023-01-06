import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Request } from '@nestjs/common';
import { AppLogger } from 'src/core/logger/logger';
import { ApiData } from 'src/core/model/api.data';
import { CardService } from './card.service';
import { AddCardRequestDto } from './dto/card.requests.dto';

@Controller('customer/card')
export class CardController {
    constructor(
        private readonly cardService: CardService,
        private readonly appLogger: AppLogger
        ) { }

    @Post('add')
    @HttpCode(HttpStatus.CREATED)
    async addCardsDetails(@Request() req, @Body() requestDto: AddCardRequestDto) {
        const id = req.user.id;

        const addedCard = await this.cardService.addCardDetails(id, requestDto);
        this.appLogger.log(addedCard)
        // return the loan eligibility issues
        const data: ApiData = {
            success: true, message: "Card Details Added Successfully.",
            payload: addedCard
        };
        return data
    }

    @Put(':last4')
    @HttpCode(HttpStatus.OK)
    async makeCardDefault(@Request() req, @Param('last4') last4: string) {
        const id = Number(req.user.id);
        const updatedCardDetail = await this.cardService.makeDefaultCard(id, last4);
        // return the updated bank details
        const data: ApiData = {
            success: true, message: "Card Has Been Made Default Successfully",
            payload: updatedCardDetail
        };
        return data
    }

    @Delete(':cardId')
    @HttpCode(HttpStatus.OK)
    async deleteCard(@Request() req, @Param('cardId') cardId: string) {
        const userId = req.user.id;
        const deletedCardDetail = await this.cardService.deleteCardDetail(cardId,userId);
        // return the updated bank details
        const data: ApiData = {
            success: true, message: "Card Has Been Made Deleted Successfully",
            payload: deletedCardDetail
        };
        return data
    }

    @Get('cards')
    @HttpCode(HttpStatus.OK)
    async getUserCards(@Request() req,) {

        const allCards = await this.cardService.getCardDetails(req.user.id);
        this.appLogger.log(allCards)
        // return the list of banks
        const data: ApiData = {
            success: true, message: "Card Details Fetched Successfully",
            payload: allCards
        };
        return data
    }

    @Get(':last4')
    @HttpCode(HttpStatus.OK)
    async getCardDetail(@Request() req, @Param('last4') last4: string) {
        const cardDetailInfo = await this.cardService.getCardDetail(req.user.id, last4);
        this.appLogger.log(cardDetailInfo)
        // return the user bank details
        const data: ApiData = {
            success: true, message: "Card Detail Fetched Successfully",
            payload: cardDetailInfo
        };
        return data
    }
}
