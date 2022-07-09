import { Controller , Post, Body, UseGuards, Patch,Param, Query, Get } from '@nestjs/common';
import { CreateReportDto } from './dto/createReportDto';
import { AuthGuard } from '../guards/auth.guard';
import { ReportsService } from './reports.service';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { ReportDto } from './dto/report.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ApprovedReportDto } from './dto/approvedReportDto';
import { AdminGuard } from '../guards/admin.guard';
import { GetEstimateDto } from './dto/getEstimate.dto';


@Controller('reports')
export class ReportsController {
    constructor(private reportsService:ReportsService){}

    @Post()
    @UseGuards(AuthGuard)
    @Serialize(ReportDto)
    createReport(@Body() body: CreateReportDto, @CurrentUser() user:User){

        return this.reportsService.create(body, user)
    }


    @Patch('/:id')
    @UseGuards(AdminGuard)
    approvedReport(@Param() id:string, @Body() body:ApprovedReportDto){


        return this.reportsService.updateApproval(id, body.approved)
    }

    @Get()
    getEstimate(@Query() query:GetEstimateDto){
        return this.reportsService.createEstimate(query);
        
    }


}



