import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { PrimeNGConfig } from 'primeng/api';
import { Observable } from 'rxjs';
import { Team } from './team';
import { TeamManagementService } from './team-management.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  teamForm = {} as FormGroup;
  isValidFormSubmitted: boolean | null = null;
  allSkills$: Observable<any[]>;

  constructor(
    private formBuilder: FormBuilder,
    private teamManagementService: TeamManagementService,
    private primengConfig: PrimeNGConfig
  ) {
    this.primengConfig.ripple = true;
    this.allSkills$ = this.teamManagementService.getSkills();
  }

  // ====================
  // lifecycle
  // ====================

  ngOnInit(): void {

    this.teamForm = this.formBuilder.group({
      teamName: ['', Validators.required],
      employees: this.formBuilder.array(
        [this._createEmpFormGroup()],
        [Validators.required, Validators.maxLength(5)])
    });
  }

  // ====================
  // form interactions
  // ====================

  addEmployee(): void {
    const employeeFormGroup = this._createEmpFormGroup();
    this.employees.push(employeeFormGroup);
  }

  deleteEmployee(idx: number): void {
    this.employees.removeAt(idx);
  }

  resetTeamForm() {
    this.teamForm.reset();
  }

  // ====================
  // form submission
  // ====================

  onFormSubmit(): void {
    this.isValidFormSubmitted = false;

    if (this.teamForm.invalid) return;

    this.isValidFormSubmitted = true;

    const team: Team = this.teamForm.value;

    this.teamManagementService.saveTeam(team);

    this.resetTeamForm();
  }

  // ================
  // helpers
  // ================

  private _createEmpFormGroup(): FormGroup {
    return this.formBuilder.group({
      empName: ['', [Validators.required]],
      age: ['', [Validators.required, Validators.min(21)]],
      skill: ['', [Validators.required]],
    })
  }

  get teamName() {
    return this.teamForm.get('teamName');
  }

  get employees(): FormArray {
    return this.teamForm.get('employees') as FormArray;
  }

}
