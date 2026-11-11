import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SalaryStructureDto {
  id: number;
  userId: number;
  fullName: string;
  username: string;
  designation: string;
  employmentType: string;
  basicSalary: number;
  dailyRate: number;
  hourlyOvertimeRate: number;
  epfEtfEligible: boolean;
  annualCasualLeaveQuota: number;
  annualMedicalLeaveQuota: number;
  bankName: string;
  bankBranch: string;
  accountNumber: string;
  updatedAt: string;
}

export interface SalaryStructureRequestDto {
  employmentType: string;
  basicSalary: number;
  dailyRate: number;
  hourlyOvertimeRate: number;
  epfEtfEligible: boolean;
  annualCasualLeaveQuota: number;
  annualMedicalLeaveQuota: number;
  bankName: string;
  bankBranch: string;
  accountNumber: string;
}

@Injectable({
  providedIn: 'root'
})
export class SalaryService {

  private readonly structureUrl = 'http://localhost:8080/api/v1/salary-structures';

  constructor(private http: HttpClient) { }


  getAllSalaryStructures(): Observable<SalaryStructureDto[]> {
    return this.http.get<SalaryStructureDto[]>(this.structureUrl);
  }

  saveOrUpdateSalaryStructure(userId: number, data: SalaryStructureRequestDto): Observable<SalaryStructureDto> {
    return this.http.put<SalaryStructureDto>(`${this.structureUrl}/user/${userId}`, data);
  }


  getMySalaryStructure(): Observable<SalaryStructureDto | null> {
    return this.http.get<SalaryStructureDto | null>(`${this.structureUrl}/my`);
  }
}