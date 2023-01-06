import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Issues } from '@prisma/client';
import { ENUMS } from 'src/core/model/enums.entity';
import { getErrorMessage } from 'src/core/utils/helpers/error.helper';
import { getValueOrUndefined } from 'src/core/utils/helpers/string.helper';
import { SupportUpdateDto } from './dto/support.update.dto';
import { SupportPrismaService } from './service/support.prisma.service';

@Injectable()
export class SupportService {
    constructor(private readonly issuesPrisma: SupportPrismaService) { }

    async updateSupport(issue: SupportUpdateDto): Promise<Issues> {
        try {
            const supportInfo = await this.issuesPrisma.supportInfo({id: Number(issue.id)})
            if (!supportInfo) {
                throw new HttpException("No existing feedback information matches the id.", HttpStatus.BAD_REQUEST);
            }
            return await this.issuesPrisma.updateSupportInfo(
                {
                    where: { id: supportInfo.id },
                    data: {
                        issueResolutionStatus: issue.resolutionStatus,
                        remark: getValueOrUndefined(issue.remark),
                    },
                }
            );
        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getSupportInfosByUserId(id: string): Promise<Issues[] | null> {
        try {
            return await this.issuesPrisma.supportInfosByUserId({ userId: Number(id) })

        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getSupportInfos(): Promise<Issues[] | null> {
        try {
            return await this.issuesPrisma.supportInfos()

        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getSupportInfo(id: string): Promise<Issues | null> {
        try {
            return await this.issuesPrisma.supportInfo({id: Number(id)})

        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getIssueResolutionList(): Promise<ENUMS[]> {
        try {
            const enumsValue: ENUMS[]  = 
            [{
                name: "Resolved",
                value: "Resolved"
            },{
                name: "Resolving",
                value: "Resolving"
            },{
                name: "NotResolved",
                value: "Not Resolved"
            }]
            
            return enumsValue;
        }
        catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        };
    }

}
