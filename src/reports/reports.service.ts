import { Injectable,NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dto/createReportDto';
import { Report } from './report.entity';
import { User } from '../users/user.entity'
import { GetEstimateDto } from './dto/getEstimate.dto';

@Injectable()
export class ReportsService {
    constructor(@InjectRepository(Report) private repo: Repository<Report>){}



    create(reportDto: CreateReportDto, user:User){

        const report = this.repo.create(reportDto);
        report.user= user;

        return this.repo.save(report)

    }

    async updateApproval(id:string, approved:boolean){



        const report = await this.repo.findOne(id); 
        if (!report){
            throw new NotFoundException('report not found');
        }

        report.approved = approved

        return this.repo.save(report)
    }



    createEstimate(estimate:GetEstimateDto){
        return this.repo.createQueryBuilder()
            .select('AVG(price)','price' )
            .where('make=:make', {make:estimate.make})
            .andWhere('model=:model',{model: estimate.model})
            .andWhere('lng - :lng BETWEEN - 5 AND 5', {lng: estimate.lng})
            .andWhere('lat - :lat BETWEEN - 5 AND 5', {lat: estimate.lat})
            .andWhere('year - :year BETWEEN - 3 AND 3', {year: estimate.year})
            .andWhere('approved is true')
            .orderBy('ABS(mileage - :mileage)','DESC').setParameters( {longitude: estimate.lng})
            .limit(3)
            .getRawMany() ;

    }
}
